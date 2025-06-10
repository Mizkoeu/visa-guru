from fastapi import APIRouter, HTTPException
from app.models.consultation import ConsultationRequest, ConsultationResult
from app.services.ai_service import AIService
import uuid

router = APIRouter()
ai_service = AIService()

@router.post("/consultation/analyze", response_model=dict)
async def analyze_consultation(request: ConsultationRequest):
    """
    Analyze user's visa consultation request and generate personalized guidance
    """
    try:
        consultation_id = str(uuid.uuid4())
        
        # Generate AI-powered consultation result
        result = await ai_service.generate_consultation(request, consultation_id)
        
        return {
            "success": True,
            "consultation_id": consultation_id,
            "result": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/consultation/{consultation_id}")
async def get_consultation(consultation_id: str):
    """
    Retrieve consultation results by ID
    """
    # For MVP, this would normally fetch from database
    # For now, return placeholder
    return {
        "consultation_id": consultation_id,
        "status": "completed",
        "message": "Consultation results would be stored and retrieved here"
    }

@router.post("/consultation/preview")
async def preview_consultation(request: ConsultationRequest):
    """
    Generate a preview of consultation without payment
    """
    try:
        # Generate basic preview (limited version)
        preview = await ai_service.generate_preview(request)
        
        return {
            "success": True,
            "preview": preview,
            "message": "This is a preview. Full consultation available after payment."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preview generation failed: {str(e)}")