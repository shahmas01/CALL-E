import os
from google import genai

client = genai.Client()

def generate_call_task(patient_name: str, diagnoses: list, medications: list, issues: list, recent_states: list) -> str:
    """
    Generates a highly contextualized dynamic instruction string for CALL-E using Gemini.
    """
    sys_prompt = (
        "You are an expert clinical supervisor orchestrating an AI phone caller (CALL-E). "
        "You will receive a patient's context (diagnoses, medications, and previous call history if any). "
        "Your job is to output a clear, concise instruction string for CALL-E telling it exactly how to steer "
        "the conversation with the patient today.\n\n"
        "RULES:\n"
        "1. Do NOT include pleasantries, greetings, or conversational filler in your output.\n"
        "2. If this is their FIRST call (no past history), instruct CALL-E to do a general post-discharge health check, "
        "ask about their specific diagnoses, and check if they are safely taking their prescribed medications.\n"
        "3. If they HAVE past history, analyze their recent states and open issues. Formulate a targeted instruction "
        "checking on the exact open issues (e.g., 'Check if their reported arm bleeding has stopped') and follow up on their adherence problems.\n"
        "4. Your output must be a single paragraph string of direct instructions mapping tasks for the AI caller safely."
    )
    
    input_text = f"Patient Name: {patient_name}\n"
    
    if diagnoses:
        diags = [d.get('icd_description', '') for d in diagnoses]
        input_text += f"Diagnoses: {', '.join(diags)}\n"
        
    if medications:
        meds = [m.get('drug_name', '') for m in medications]
        input_text += f"Prescribed Medications: {', '.join(meds)}\n"
        
    if recent_states and len(recent_states) > 0:
        input_text += "Recent Call History (Oldest to Newest):\n"
        # Reverse so Gemini sees trajectory natively properly mapped 
        for state in reversed(recent_states):
            input_text += f"- Status: {state.get('recovery_status')}, Summary: {state.get('summary')}\n"
    else:
        input_text += "Recent Call History: None (This is the FIRST call post-discharge).\n"

    if issues:
        open_issues = [i.get('description', '') for i in issues]
        input_text += f"Unresolved Open Issues: {', '.join(open_issues)}\n"
        
    prompt_str = f"{sys_prompt}\n\n[PATIENT CONTEXT]\n{input_text}"
    
    try:
        interaction = client.interactions.create(
            model="gemini-2.5-flash",
            input=prompt_str
        )
        return interaction.output_text.strip()
    except Exception as e:
        # Fallback failsafe string ensuring strict reliability
        return f"Call {patient_name} and perform a general post-discharge health check checking medication implementations smoothly."
