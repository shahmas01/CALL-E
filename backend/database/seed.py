from backend.database.connection import supabase
from datetime import datetime, timedelta

# Insert test patient mapping your requested custom dummy attributes comprehensively mapping table layouts
patient_data = {
    "mrn": "TEST067",
    "name": "Shone",
    "phone_number": "+917306585872",
    "age": 65,
    "gender": "M",
    "admission_date": (datetime.now() - timedelta(days=5)).isoformat(),
    "discharge_date": datetime.now().isoformat(),
    "hospital_risk_score": 0.72
}

try:
    patient_response = supabase.table('patients').insert([patient_data]).execute()
    patient_id = patient_response.data[0]['patient_id']
    print(f"✅ Created patient {patient_id} ({patient_data['name']} / {patient_data['phone_number']})")
    
    # Insert diagnosis
    diagnosis_data = {
        "patient_id": patient_id,
        "icd_code": "I10",
        "icd_description": "Essential hypertension",
        "primary_flag": True
    }
    supabase.table('diagnoses').insert([diagnosis_data]).execute()
    
    # Insert medication
    med_data = {
        "patient_id": patient_id,
        "drug_name": "Lisinopril",
        "dosage": "10mg",
        "frequency": "Once daily",
        "active_at_discharge": True
    }
    supabase.table('medications_prescribed').insert([med_data]).execute()
    
    print("\n✅ All test data seeded successfully! Testing sequences can safely begin utilizing this target.")
except Exception as e:
    print(f"❌ Error seeding data: {e}")
    print("Reminder: Have you executed the SQL code from `supabase_schema_migrations.sql` in the Supabase UI natively?")
