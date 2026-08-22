from db import supabase
from datetime import datetime, timedelta

# Insert test patient
patient_data = {
    "mrn": "TEST001",
    "age": 65,
    "gender": "M",
    "admission_date": (datetime.now() - timedelta(days=5)).isoformat(),
    "discharge_date": datetime.now().isoformat(),
    "hospital_risk_score": 0.72
}

patient_response = supabase.table('patients').insert([patient_data]).execute()
patient_id = patient_response.data[0]['patient_id']
print(f"✅ Created patient {patient_id}")

# Insert diagnosis
diagnosis_data = {
    "patient_id": patient_id,
    "icd_code": "I10",
    "icd_description": "Essential hypertension",
    "primary_flag": True
}
supabase.table('diagnoses').insert([diagnosis_data]).execute()
print("✅ Created diagnosis")

# Insert medication
med_data = {
    "patient_id": patient_id,
    "drug_name": "Lisinopril",
    "dosage": "10mg",
    "frequency": "Once daily",
    "active_at_discharge": True
}
supabase.table('medications_prescribed').insert([med_data]).execute()
print("✅ Created medication")

# Insert call event
call_data = {
    "patient_id": patient_id,
    "call_number": 1,
    "call_date": datetime.now().isoformat(),
    "duration_seconds": 600,
    "call_status": "completed",
    "call_success": True
}
call_response = supabase.table('call_events').insert([call_data]).execute()
call_id = call_response.data[0]['call_id']
print(f"✅ Created call {call_id}")

# Insert transcript
transcript_data = {
    "call_id": call_id,
    "raw_text": "NURSE: How are you feeling today? PATIENT: Good, taking my medication regularly.",
    "stt_confidence": 0.95
}
supabase.table('call_transcripts').insert([transcript_data]).execute()
print("✅ Created transcript")

print("\n✅ All test data seeded successfully!")