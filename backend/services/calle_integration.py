import os
from dotenv import load_dotenv
from calle import CalleClient
from backend.config import env_path

load_dotenv(dotenv_path=env_path)

api_key = os.getenv("CALLE_API_KEY")
calle_client = CalleClient(api_key=api_key) if api_key else None
