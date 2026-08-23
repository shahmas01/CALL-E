import os
import json
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel

from backend.services.calle_integration import calle_client
from backend.database.repository import (
    get_patient_by_id, 
    create_pending_call, 
    update_call_with_calle_id,
    update_call_status,
    save_patient_state,
    get_call_event,
    create_or_update_issue
)

router = APIRouter(prefix="/api/v1/calle", tags=["CALL-E"])

WEBHOOK_URL = os.getenv("WEBHOOK_URL", "https://example.com/api/v1/calle/webhook")

class TriggerCallResponse(BaseModel):
    message: str
    call_id: str
    calle_call_id: str

@router.post("/call/{patient_id}", response_model=TriggerCallResponse)
def trigger_call(patient_id: str):
    """
    Endpoint extracting live DB targets, executing async CALL-E dependencies safely. 
    """
    if not calle_client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="CALLE_API_KEY is not configured"
        )
        
    patient = get_patient_by_id(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found in database")
        
    phone = patient.get("phone_number")
    name = patient.get("name", "there")
    if not phone:
        raise HTTPException(status_code=400, detail="Patient lacks a valid phone number")
    
    # 1. Insert DB Row preventing race conditions externally
    db_call_id = create_pending_call(patient_id)
    
    # Safely leveraging native PK UUID ensuring accurate call mapping retries
    idempotency_key = f"call_init_{db_call_id}"
    
    task_prompt = (
        f"Call {phone} and politely ask them how they are feeling after being discharged. "
        "Ask if they have any new or worsening symptoms. Also determine if they are taking their prescribed medication. "
        f"Address the patient as {name}. Before finishing, summarize their current overall health status briefly."
    )
    
    result_schema = {
        "type": "object",
        "required": ["recovery_status", "has_new_symptoms", "medication_adherence"],
        "properties": {
            "recovery_status": {
                "type": "string",
                "enum": ["improving", "stable", "worsening", "unknown"]
            },
            "has_new_symptoms": {
                "type": "string",
                "enum": ["yes", "no", "unknown"]
            },
            "medication_adherence": {
                "type": "string",
                "enum": ["taking_all", "missing_some", "not_taking", "unknown"]
            },
            "summary": {
                "type": "string",
                "description": "A very brief summary of how the patient is currently doing."
            }
        },
        "additionalProperties": False,
    }

    try:
        # Pushing db_call_id implicitly guaranteeing webhooks strictly route backwards safely
        call = calle_client.calls.create(
            task=task_prompt,
            result_schema=result_schema,
            metadata={"db_call_id": db_call_id},
            webhook_url=WEBHOOK_URL,
            idempotency_key=idempotency_key,
        )
        # Finalize internal logging actively writing the external signature payload mapped!
        update_call_with_calle_id(db_call_id, call["id"])
        
        return TriggerCallResponse(
            message="Call aggressively dispatched!", 
            call_id=db_call_id,
            calle_call_id=call["id"]
        )
    except Exception as e:
        update_call_status(db_call_id, "failed_init")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error communicating with CALL-E: {str(e)}"
        )


@router.post("/webhook")
async def calle_webhook(request: Request):
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
    metadata = data.get("metadata", {})
    db_call_id = metadata.get("db_call_id")
    
    if not db_call_id:
        return {"ok": True}
        
    # Idempotency checks against source-of-truth status guarantees isolated captures efficiently
    call_record = get_call_event(db_call_id)
    if not call_record:
        return {"ok": True} 
    if call_record.get("call_status") in ["completed", "failed", "failed_validation"]:
        return {"ok": True}
    
    print(f"\n=== WEBHOOK DISCOVERED: {event_type} - DB_CALL_ID: {db_call_id} ===")
    patient_id = call_record.get("patient_id")
    
    if event_type == "call.completed":
        structured_result = data.get("structured_result")
        
        update_call_status(db_call_id, "completed")
        if structured_result:
            save_patient_state(patient_id, db_call_id, structured_result)
            
            # Map tracking escalation hooks based on outcomes securely!
            if structured_result.get("has_new_symptoms") == "yes" or structured_result.get("recovery_status") == "worsening":
                desc = structured_result.get("summary") or "Patient reported worsening state."
                create_or_update_issue(patient_id, db_call_id, desc)
            
        print(f"Captured structured evaluation inside Supabase efficiently!")
        
    elif event_type == "call.failed":
        update_call_status(db_call_id, "failed")
        
    elif event_type == "call.result_validation_failed":
        update_call_status(db_call_id, "failed_validation")
        
    return {"ok": True}
