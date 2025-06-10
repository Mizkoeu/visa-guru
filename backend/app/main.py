from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.api import consultation, payment, health

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Visa Guru API",
    description="AI-powered visa consultation service",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(consultation.router, prefix="/api", tags=["consultation"])
app.include_router(payment.router, prefix="/api", tags=["payment"])

@app.get("/")
async def root():
    return {"message": "Visa Guru API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)