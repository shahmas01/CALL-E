from db import supabase

# Get all patients
patients = supabase.table('patients').select("*").execute()
print(f"✅ Patients: {len(patients.data)} found")
print(patients.data)

# Get calls for that patient
if patients.data:
    patient_id = patients.data[0]['patient_id']
    calls = supabase.table('call_events').select("*").eq("patient_id", patient_id).execute()
    print(f"\n✅ Calls for patient: {len(calls.data)}")
    print(calls.data)
    
    # Get transcript
    if calls.data:
        call_id = calls.data[0]['call_id']
        transcript = supabase.table('call_transcripts').select("*").eq("call_id", call_id).execute()
        print(f"\n✅ Transcript: {transcript.data}")