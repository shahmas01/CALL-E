import os
import json
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel

from backend.calle.client import calle_client
from backend.db import supabase

router = APIRouter(prefix="/api/v1/calle", tags=["CALL-E"])

WEBHOOK_URL = os.getenv("WEBHOOK_URL", "https://example.com/api/v1/calle/webhook")


class TriggerCallResponse(BaseModel):
    message: str
    call_id: str


class TriggerCallRequest(BaseModel):
    patient_id: str


@router.get("/patients/{patient_id}")
def get_patient(patient_id: str):
    """Fetch patient from database"""
    response = supabase.table('patients').select("*").eq("patient_id", patient_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Patient not found")
    return response.data[0]


@router.post("/call", response_model=TriggerCallResponse)
def trigger_call(request: TriggerCallRequest):
    """Initiate call for a real patient from database"""
    
    if not calle_client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="CALLE_API_KEY is not configured"
        )
    
    # Fetch real patient from database
    patient_response = supabase.table('patients').select("*").eq("patient_id", request.patient_id).execute()
    if not patient_response.data:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    patient = patient_response.data[0]
    patient_phone = patient.get("phone_number")
    patient_name = patient.get("name")
    patient_id = patient.get("patient_id")
    
    if not patient_phone:
        raise HTTPException(status_code=400, detail="Patient missing phone number")
    
    # Deterministic idempotency key (tied to patient + date)
    today = datetime.now().strftime("%Y-%m-%d")
    idempotency_key = f"{patient_id}:followup:{today}"
    
    # Real patient data in task prompt
    task_prompt = (
        f"Call {patient_phone} and politely ask them how they are feeling after being discharged. "
        "Ask if they have any new or worsening symptoms. Also determine if they are taking their prescribed medication. "
        f"Address the patient as {patient_name}."
    )
    
    result_schema = {
        "type": "object",
        "required": ["recovery_status", "has_new_symptoms", "medication_adherence"],
        "properties": {
            "recovery_status": {
                "type": "string",
                "enum": ["improving", "stable", "worsening", "unknown"],
                "description": "How the patient's recovery is progressing."
            },
            "has_new_symptoms": {
                "type": "string",
                "enum": ["yes", "no", "unknown"],
            },
            "medication_adherence": {
                "type": "string",
                "enum": ["taking_all", "missing_some", "not_taking", "unknown"],
            }
        },
        "additionalProperties": False,
    }

    try:
        call = calle_client.calls.create(
            task=task_prompt,
            result_schema=result_schema,
            metadata={"patient_id": patient_id},
            webhook_url=WEBHOOK_URL,
            idempotency_key=idempotency_key,
        )
        return TriggerCallResponse(message="Call initiated", call_id=call["id"])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error communicating with CALL-E: {str(e)}"
        )


@router.post("/webhook")
async def calle_webhook(request: Request):
    """Receive CALL-E webhook and save to database"""
    raw_body = await request.body()
    try:
        event = json.loads(raw_body)
    except Exception:
        raise HTTPException(status_code=400, detail="invalid_json")
        
    event_id = request.headers.get("CALL-E-Event-Id")
    
    if not event_id or event_id != event.get("id"):
        return {"error": "invalid_event_id"}
    
    event_type = event.get("type", "")
    data = event.get("data", {})
    
    print(f"\n=== WEBHOOK RECEIVED: {event_type} - EVENT_ID: {event_id} ===")
    
    if event_type == "call.completed":
        structured_result = data.get("structured_result")
        metadata = data.get("metadata", {})
        patient_id = metadata.get("patient_id")
        call_id = data.get("call_id")
        
        print(f"✅ Call completed for Patient {patient_id}")
        print(json.dumps(structured_result, indent=2))
        
        try:
            state_data = {
                "patient_id": patient_id,
                "call_id": call_id,
                "recovery_status": structured_result.get("recovery_status"),
                "has_new_symptoms": structured_result.get("has_new_symptoms") == "yes",
                "medication_adherence": structured_result.get("medication_adherence"),
                "summary": f"Call completed. Recovery: {structured_result.get('recovery_status')}",
                "structured_result": structured_result
            }
            
            supabase.table('patient_states').insert([state_data]).execute()
            print(f"✅ Saved to patient_states")
        except Exception as e:
            print(f"❌ Error saving: {str(e)}")
    
    elif event_type == "call.failed":
        print(f"❌ Call failed")
        
    elif event_type == "call.result_validation_failed":
        print(f"⚠️ Result validation failed")
        
    return {"ok": True}