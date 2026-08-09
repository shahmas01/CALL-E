from fastapi import FastAPI
from backend.routes.calle import router as calle_router

app = FastAPI(title="CALL-E Post-Discharge Orchestrator")

app.include_router(calle_router)

@app.get("/")
def health_check():
    return {"status": "ok"}
