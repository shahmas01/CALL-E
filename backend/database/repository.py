import uuid
from datetime import datetime
from backend.database.connection import supabase

def get_patient_by_id(patient_id: str):
    response = supabase.table('patients').select("*").eq('patient_id', patient_id).execute()
    return response.data[0] if response.data else None

def create_pending_call(patient_id: str):
    call_id = str(uuid.uuid4())
    data = {
        "call_id": call_id,
        "patient_id": patient_id,
        "call_date": datetime.now().isoformat(),
        "call_status": "pending"
    }
    supabase.table('call_events').insert([data]).execute()
    return call_id

def update_call_with_calle_id(db_call_id: str, calle_call_id: str):
    supabase.table('call_events').update({"calle_call_id": calle_call_id}).eq('call_id', db_call_id).execute()

def update_call_status(db_call_id: str, status: str):
    data = {"call_status": status}
    supabase.table('call_events').update(data).eq('call_id', db_call_id).execute()
    
def get_call_event(db_call_id: str):
    resp = supabase.table('call_events').select("*").eq('call_id', db_call_id).execute()
    return resp.data[0] if resp.data else None

def save_patient_state(patient_id: str, call_id: str, result: dict):
    data = {
        "id": str(uuid.uuid4()),
        "patient_id": patient_id,
        "call_id": call_id,
        "recovery_status": result.get("recovery_status"),
        "has_new_symptoms": result.get("has_new_symptoms") == "yes",
        "medication_adherence": result.get("medication_adherence"),
        "summary": result.get("summary"),
        "structured_result": result,
        "created_at": datetime.now().isoformat()
    }
    supabase.table('patient_states').insert([data]).execute()

def create_or_update_issue(patient_id: str, call_id: str, description: str):
    # Check for an existing open issue for this patient to prevent blind duplication
    resp = supabase.table('issues').select('*').eq('patient_id', patient_id).eq('status', 'open').execute()
    if resp.data:
        # Update existing issue
        issue_id = resp.data[0]['id']
        supabase.table('issues').update({"last_updated_at": datetime.now().isoformat()}).eq('id', issue_id).execute()
        return issue_id
    else:
        # Create genuinely new issue tracking longitudinal problem
        data = {
            "id": str(uuid.uuid4()),
            "patient_id": patient_id,
            "call_id": call_id,
            "issue_type": "reported_symptoms",
            "description": description,
            "severity": "medium",
            "status": "open",
            "last_updated_at": datetime.now().isoformat()
        }
        supabase.table('issues').insert([data]).execute()
        return data["id"]

def get_patient_medications(patient_id: str):
    resp = supabase.table('medications_prescribed').select('*').eq('patient_id', patient_id).execute()
    return resp.data

def get_patient_diagnoses(patient_id: str):
    resp = supabase.table('diagnoses').select('*').eq('patient_id', patient_id).execute()
    return resp.data

def get_patient_open_issues(patient_id: str):
    resp = supabase.table('issues').select('*').eq('patient_id', patient_id).eq('status', 'open').execute()
    return resp.data

def get_recent_patient_states(patient_id: str, limit: int = 3):
    resp = supabase.table('patient_states').select('*').eq('patient_id', patient_id).order('created_at', desc=True).limit(limit).execute()
    return resp.data if resp.data else []

def insert_adherence_tracking(patient_id: str, call_id: str, med_name: str, status: str):
    data = {
        "adherence_id": str(uuid.uuid4()),
        "patient_id": patient_id,
        "call_id": call_id,
        "medication_name": med_name,
        "adherence_status": status,
        "created_at": datetime.now().isoformat()
    }
    supabase.table('adherence_tracking').insert([data]).execute()

def update_issue_status(issue_id: str, status: str):
    supabase.table('issues').update({"status": status, "last_updated_at": datetime.now().isoformat()}).eq('id', issue_id).execute()
