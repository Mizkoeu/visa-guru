from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class ResidencyStatus(str, Enum):
    CITIZEN = "citizen"
    PERMANENT_RESIDENT = "permanent_resident"
    TEMPORARY_WORKER = "temporary_worker"
    STUDENT = "student"
    OTHER = "other"

class TravelPurpose(str, Enum):
    TOURISM = "tourism"
    BUSINESS = "business"
    WORK = "work"
    STUDY = "study"
    TRANSIT = "transit"
    FAMILY_VISIT = "family_visit"
    OTHER = "other"

class ConsultationRequest(BaseModel):
    # Basic info
    nationality: str = Field(..., description="Primary nationality/passport")
    dual_citizenship: Optional[str] = Field(None, description="Second nationality if applicable")
    
    # Residency status
    current_country: str = Field(..., description="Country where you currently live")
    residency_status: ResidencyStatus = Field(..., description="Your residency status")
    residency_details: Optional[str] = Field(None, description="Additional residency details")
    
    # Travel details
    destination_country: str = Field(..., description="Country you want to visit")
    travel_purpose: TravelPurpose = Field(..., description="Purpose of travel")
    travel_dates: str = Field(..., description="When you plan to travel")
    duration: str = Field(..., description="How long you plan to stay")
    
    # Additional context
    previous_rejections: bool = Field(False, description="Have you been denied a visa before?")
    additional_info: Optional[str] = Field(None, description="Any other relevant information")
    
    # Contact
    email: str = Field(..., description="Email for delivery")

class DocumentItem(BaseModel):
    name: str
    priority: str  # "high", "medium", "low"
    description: str
    notes: Optional[str] = None

class ConsultationResult(BaseModel):
    consultation_id: str
    risk_assessment: str
    confidence_score: int  # 1-100
    documents_required: List[DocumentItem]
    cover_letter: str
    strategic_notes: List[str]
    sources: List[str]
    estimated_processing_time: str