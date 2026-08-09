import os
from pathlib import Path
from dotenv import load_dotenv
from calle import CalleClient

# Explicitly load from backend/.env regardless of where uvicorn is run
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Initialize the official CALL-E SDK client
# Used for server-side trusted execution.
api_key = os.getenv("CALLE_API_KEY")
calle_client = CalleClient(api_key=api_key) if api_key else None
