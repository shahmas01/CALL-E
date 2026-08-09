import os
import json
import uuid
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel

from backend.calle.client import calle_client

router = APIRouter(prefix="/api/v1/calle", tags=["CALL-E"])

# ==================================================
# PLACEHOLDER DATA
# ==================================================
# TODO: Replace PLACEHOLDER_PATIENT_PHONE with real data from patient database. Must be E.164 format.
PLACEHOLDER_PATIENT_PHONE = "+917306585872"
PLACEHOLDER_PATIENT_NAME = "Shone" 
PLACEHOLDER_PATIENT_ID = "PLACEHOLDER_PATIENT_ID"

WEBHOOK_URL = os.getenv("WEBHOOK_URL", "https://example.com/api/v1/calle/webhook")


class TriggerCallResponse(BaseModel):
    message: str
    call_id: str


@router.post("/call", response_model=TriggerCallResponse)
def trigger_call():
    """
    Minimal caller endpoint to initiate a CALL-E outbound call asynchronously.
    """
    if not calle_client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="CALLE_API_KEY is not configured"
        )
        
    # Generate idempotency key tied to predictable business logic, not a random UUID per retry.
    idempotency_key = f"{PLACEHOLDER_PATIENT_ID}:day_1:followup:v2"
    
    # We omit 'recipients' passing phone via task text directly so CALL-E infers it
    task_prompt = (
        f"Call {PLACEHOLDER_PATIENT_PHONE} and politely ask them how they are feeling after being discharged. "
        "Ask if they have any new or worsening symptoms. Also determine if they are taking their prescribed medication. "
        f"Address the patient as {PLACEHOLDER_PATIENT_NAME}."
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
        # Non-blocking SDK call
        call = calle_client.calls.create(
            task=task_prompt,
            result_schema=result_schema,
            metadata={"patient_id": PLACEHOLDER_PATIENT_ID},
            webhook_url=WEBHOOK_URL,
            idempotency_key=idempotency_key,
        )
        return TriggerCallResponse(message="Call initiated", call_id=call["id"])
    except Exception as e:
        # In production we'd catch typed SDK Errors, e.g. idempotency_conflict
        # Raising standard exception for HTTP failure propagation
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error communicating with CALL-E: {str(e)}"
        )


@router.post("/webhook")
async def calle_webhook(request: Request):
    """
    Safely receive the terminal webhook events from CALL-E containing extracted evaluation data.
    """
    raw_body = await request.body()
    try:
        event = json.loads(raw_body)
    except Exception:
        # standard fastapi exception
        raise HTTPException(status_code=400, detail="invalid_json")
        
    # Explicitly fetching from case-insensitive framework headers perfectly aligning docs
    event_id = request.headers.get("CALL-E-Event-Id")
    
    # Required validation per calle_api.md: matches body ID
    if not event_id or event_id != event.get("id"):
        return {"error": "invalid_event_id"}
        
    # TODO: Webhook deduplication
    # Check if event_id already exists in processing history DB
    # if event_store.has(event_id): return {"ok": True}
    
    event_type = event.get("type", "")
    data = event.get("data", {})
    
    print(f"\n=== WEBHOOK RECEIVED: {event_type} - EVENT_ID: {event_id} ===")
    
    if event_type == "call.completed":
        structured_result = data.get("structured_result")
        metadata = data.get("metadata", {})
        
        print(f"Post-Discharge result for Patient {metadata.get('patient_id')}:")
        print(json.dumps(structured_result, indent=2))
        
    elif event_type == "call.failed":
        print("CALL-E task failed. Dumping full failure context:")
        print(json.dumps(data, indent=2))
        
    elif event_type == "call.result_validation_failed":
        print("CALL-E completed but structured result Extraction/Validation strictly failed.")
        
    # Acknowledging delivery
    return {"ok": True}
