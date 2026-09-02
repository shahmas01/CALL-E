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
PLACEHOLDER_PATIENT_PHONE = "+918075589464"
PLACEHOLDER_PATIENT_NAME = "Malavika" 
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
    idempotency_key = f"{PLACEHOLDER_PATIENT_ID}:day_1:followup:v22"
    
    # We omit 'recipients' passing phone via task text directly so CALL-E infers it
    task_prompt = (
    f"Call {PLACEHOLDER_PATIENT_PHONE} and politely ask "
    f"{PLACEHOLDER_PATIENT_NAME} how they are feeling after being discharged. "

    "Ask about their overall recovery and whether they are "
    "improving, stable, or getting worse. "

    "Ask whether they have any new symptoms or whether any "
    "existing symptoms have become worse. If they report symptoms, "
    "briefly ask what they are experiencing. "

    "Ask whether they were able to obtain all of their prescribed "
    "medications and whether they are taking them as instructed. "

    "Ask whether they have missed any doses, had difficulty with "
    "dose or timing, experienced medication side effects, or are "
    "confused about any medication. "

    "Ask whether they have any difficulty obtaining or refilling "
    "their medicines, including financial difficulties. "

    "Ask whether they have a caregiver or family member available "
    "to help them at home. "

    "Ask whether transportation is causing difficulty with "
    "follow-up appointments or accessing healthcare. "

    "Ask one question at a time and keep the conversation short "
    "and easy to understand. Allow the patient to explain their "
    "situation naturally. "

    "If the patient is uncertain about an answer, do not guess. "
    "Record the information as unknown. "

    "Do not diagnose the patient and do not recommend changing "
    "or stopping any medication. Medication concerns should be "
    "referred to an authorized clinician or pharmacist. "

    "If the patient reports a potentially serious or urgent "
    "problem, follow the appropriate emergency escalation "
    "protocol and mark the case for human clinical review. "

    "Thank the patient at the end of the conversation and end "
    "the call safely."
)
    
    result_schema = {
    "type": "object",

    "required": [
        "recovery_status",
        "has_new_symptoms",
        "medication_adherence",
        "medication_obtained",
        "missed_doses",
        "medication_side_effects",
        "medication_confusion",
        "medication_access_issue",
        "caregiver_available",
        "transportation_issue",
        "financial_barrier",
        "needs_human_review",
        "urgent_concern"
    ],

    "properties": {

        # Recovery
        "recovery_status": {
            "type": "string",
            "enum": [
                "improving",
                "stable",
                "worsening",
                "unknown"
            ],
            "description": "How the patient's recovery is progressing."
        },

        # Symptoms
        "has_new_symptoms": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "unknown"
            ],
            "description": "Whether the patient has new symptoms."
        },

        "symptom_details": {
            "type": "string",
            "description": "Brief description of any symptoms reported by the patient."
        },

        # Medication
        "medication_adherence": {
            "type": "string",
            "enum": [
                "taking_all",
                "missing_some",
                "not_taking",
                "unknown"
            ],
            "description": "Whether the patient is taking medication as instructed."
        },

        "medication_obtained": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "partial",
                "unknown"
            ],
            "description": "Whether the patient obtained their prescribed medicines."
        },

        "missed_doses": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "unknown"
            ],
            "description": "Whether the patient has missed any medication doses."
        },

        "medication_side_effects": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "unknown"
            ],
            "description": "Whether the patient reports medication side effects."
        },

        "side_effect_details": {
            "type": "string",
            "description": "Brief description of any medication side effects reported."
        },

        "medication_confusion": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "unknown"
            ],
            "description": "Whether the patient is confused about their medication."
        },

        "medication_access_issue": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "unknown"
            ],
            "description": "Whether the patient has difficulty obtaining or refilling medication."
        },

        # Social and support
        "caregiver_available": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "unknown"
            ],
            "description": "Whether a caregiver or family member is available to help."
        },

        "transportation_issue": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "unknown"
            ],
            "description": "Whether transportation is a barrier to healthcare or appointments."
        },

        "financial_barrier": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "unknown"
            ],
            "description": "Whether financial difficulties affect access to medication or care."
        },

        # Escalation
        "needs_human_review": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "unknown"
            ],
            "description": "Whether the patient's situation should be reviewed by a human clinician."
        },

        "urgent_concern": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "unknown"
            ],
            "description": "Whether the patient reported a potentially urgent concern."
        }
    },

    "additionalProperties": False
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
