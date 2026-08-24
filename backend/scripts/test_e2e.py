import time
import httpx
from backend.database.connection import supabase

API_BASE_URL = "http://127.0.0.1:8000/api/v1"

def print_step(msg):
    print(f"\n\033[96m[E2E TEST]\033[0m {msg}")

def run_test():
    print_step("Available patients: Shone, Malavika, Jassim, Shahmas")
    name_input = input("Enter patient name to call (leave blank for latest): ").strip()
    
    if name_input:
        resp = supabase.table('patients').select('patient_id, name, phone_number').ilike('name', f"%{name_input}%").execute()
    else:
        resp = supabase.table('patients').select('patient_id, name, phone_number').order('created_at', desc=True).limit(1).execute()
    
    if not resp.data:
        print("\033[91m❌ No matching patients found in database. Run 'python -m backend.database.seed' first!\033[0m")
        return
        
    patient = resp.data[0]
    patient_id = patient['patient_id']
    print_step(f"Using Patient ID: {patient_id} ({patient['name']} | {patient['phone_number']})")
    
    print_step(f"Initiating CALL-E API request against our endpoint: POST /api/v1/calle/call/{patient_id}")
    try:
        response = httpx.post(f"{API_BASE_URL}/calle/call/{patient_id}", timeout=30.0)
        response.raise_for_status()
    except Exception as e:
        print(f"\033[91m❌ API Request Failed: {e}. Is 'uvicorn backend.main:app' running?\033[0m")
        return
        
    data = response.json()
    db_call_id = data['call_id']
    calle_call_id = data['calle_call_id']
    
    print_step(f"✅ FastAPI returned gracefully without blocking!")
    print(f"    -> DB Call Event PK: {db_call_id}")
    print(f"    -> CALL-E External ID: {calle_call_id}")
    print(f"    -> Generated Dynamic Task Prompt (Backend Logs via FastAPI)")
    
    print_step("Supabase Polling: Waiting for Webhook to update the DB asynchronously...")
    
    start_time = time.time()
    call_resolved = False
    status = "pending"
    
    while time.time() - start_time < 300: # 5 minutes max
        call_resp = supabase.table('call_events').select('call_status').eq('call_id', db_call_id).execute()
        if not call_resp.data:
            print_step("Error tracking down the call event in DB.")
            break
            
        status = call_resp.data[0]['call_status']
        print(f"   [DB Poll] Current Supabase Status: \033[93m{status}\033[0m")
        
        if status in ['completed', 'failed', 'failed_validation']:
            call_resolved = True
            break
            
        time.sleep(3)
        
    if not call_resolved:
        print("\033[91m❌ Timed out waiting for webhook to return... check your ngrok connection!\033[0m")
        return
        
    print_step(f"✅ Webhook securely delivered! Mapping resulting constraints.")
    
    if status == 'completed':
        print(f"\n\033[92m================ == DATABASE MUTATION LOG == ================\033[0m")
        import json
        
        # 1. Track Call Events
        events = supabase.table('call_events').select('*').eq('call_id', db_call_id).execute()
        if events.data:
            print(f"\n[TABLE: call_events] - Updated Terminal Status & External Links:")
            print(json.dumps(events.data[0], indent=2))
        
        # 2. Track Patient States
        states = supabase.table('patient_states').select('*').eq('call_id', db_call_id).execute()
        if states.data:
            record = states.data[0]
            record.pop('structured_result', None) # Hide redundant JSON cleanly!
            print(f"\n[TABLE: patient_states] - Snapshot Historical Payload Inserted:")
            print(json.dumps(record, indent=2))
            
        # 3. Track Adherence Tracks Globally
        adhs = supabase.table('adherence_tracking').select('*').eq('call_id', db_call_id).execute()
        if adhs.data:
            print(f"\n[TABLE: adherence_tracking] - Dynamic Post-Call Options Triggered:")
            for adh in adhs.data:
                print(json.dumps(adh, indent=2))
            
        # 4. Track Escalated Issues Globally
        issues = supabase.table('issues').select('*').eq('patient_id', patient_id).execute()
        if issues.data:
            print(f"\n[TABLE: issues] - Evaluated & Tracked Longitudinal Problems:")
            for issue in issues.data:
                print(json.dumps(issue, indent=2))
        else:
            print(f"\n[TABLE: issues] - No unresolved tracking issues found for patient.")
            
        print(f"\n\033[92m==============================================================================\033[0m")
    else:
        print("\033[91m❌ Call terminated with negative state sequence! Check webhook logs.\033[0m")

if __name__ == "__main__":
    run_test()
