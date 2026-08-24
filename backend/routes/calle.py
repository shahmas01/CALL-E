import os
import json
import uuid
from dotenv import load_dotenv

load_dotenv()

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel

from backend.services.calle_integration import calle_client
from backend.services.prompt_generator import generate_call_task
from backend.database.repository import (
    get_patient_by_id, 
    create_pending_call, 
    update_call_with_calle_id,
    update_call_status,
    save_patient_state,
    get_call_event,
    create_or_update_issue,
    get_patient_diagnoses,
    get_patient_medications,
    get_patient_open_issues,
    get_recent_patient_states,
    insert_adherence_tracking,
    update_issue_status
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
    
    # 1. Gather all Pre-Call Dynamic Context
    diagnoses = get_patient_diagnoses(patient_id)
    medications = get_patient_medications(patient_id)
    issues = get_patient_open_issues(patient_id)
    recent_states = get_recent_patient_states(patient_id)
    
    # 2. Use Gemini to dynamically build the string prompt, prepending the literal phone number deterministically!
    gemini_instructions = generate_call_task(name, diagnoses, medications, issues, recent_states)
    task_prompt = f"Call {phone}. {gemini_instructions}"
    
    # 3. Create mapping structures securely!
    db_call_id = create_pending_call(patient_id)
    idempotency_key = f"call_init_{db_call_id}"
    
    # 4. Construct Dynamic Option B Schema natively extracting complex structures!
    result_schema = {
        "type": "object",
        "required": ["recovery_status", "has_new_symptoms", "medication_adherence", "summary"],
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
    
    # Inject Custom Resolvers for existing Open Issues
    for issue in issues:
        issue_id = issue.get("id")
        key = f"issue_{issue_id}_status"
        result_schema["properties"][key] = {
            "type": "string",
            "enum": ["resolved", "worsening", "stable", "unknown"],
            "description": f"Evaluate if the patient's previously reported issue '{issue.get('description')}' is resolved, worse, or stable."
        }
        
    # Inject Custom Adherence per Medication
    for med in medications:
        drug_name = med.get("drug_name")
        safe_name = drug_name.replace(" ", "_").replace("-", "_").lower()
        key = f"adherence_med_{safe_name}"
        result_schema["properties"][key] = {
            "type": "string",
            "enum": ["taking_all", "missing_some", "not_taking", "unknown"],
            "description": f"Is the patient exactly taking their prescribed {drug_name}?"
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
        update_call_with_calle_id(db_call_id, call["id"])
        
        return TriggerCallResponse(
            message="Call elegantly dispatched dynamically!", 
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
    with open("webhook_logs.txt", "a") as f:
        import datetime
        f.write(f"[{datetime.datetime.now().isoformat()}] Received {event_type} - DB_CALL_ID: {data.get('metadata', {}).get('db_call_id')}\nPAYLOAD: {json.dumps(event)}\n\n")

    metadata = data.get("metadata", {})
    db_call_id = metadata.get("db_call_id")
    
    if not db_call_id:
        return {"ok": True}
        
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
            # 1. Save standard snapshot history
            save_patient_state(patient_id, db_call_id, structured_result)
            
            # 2. Iterate dynamically over the payload parsing specific Option B UUID hooks!
            for key, value in structured_result.items():
                if key.startswith("issue_") and key.endswith("_status"):
                    # key format: 'issue_UUID_status'
                    issue_id = key[len("issue_"):-len("_status")]
                    if value == "resolved":
                        update_issue_status(issue_id, "resolved")
                    else:
                        update_issue_status(issue_id, "open") # Touch it safely ensuring it persists actively 
                        
                elif key.startswith("adherence_med_"):
                    # key format: 'adherence_med_UUID'
                    med_id = key[len("adherence_med_"):]
                    # Log medicine independently keeping longitudinal boundaries flawless
                    insert_adherence_tracking(patient_id, db_call_id, med_id, value)
            
            # 3. Create fresh issues for brand new problems
            if structured_result.get("has_new_symptoms") == "yes":
                desc = structured_result.get("summary") or "Patient reported worsening state natively."
                create_or_update_issue(patient_id, db_call_id, desc)
                
            print(f"Captured structured evaluation inside Supabase efficiently!")
        
    elif event_type == "call.failed":
        update_call_status(db_call_id, "failed")
        
    elif event_type == "call.result_validation_failed":
        update_call_status(db_call_id, "failed_validation")
        
    return {"ok": True}
