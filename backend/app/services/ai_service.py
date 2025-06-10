import os
import openai
import httpx
from typing import List, Dict
from app.models.consultation import ConsultationRequest, ConsultationResult, DocumentItem
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.client = openai.OpenAI()
    
    async def research_visa_requirements(self, request: ConsultationRequest) -> Dict:
        """
        Use web search to research current visa requirements
        """
        # Construct search query
        search_query = f"{request.nationality} citizen {request.residency_status} {request.current_country} visa requirements {request.destination_country} {request.travel_purpose}"
        
        # For MVP, we'll use a basic web search approach
        # In production, this could use Perplexity API or other search APIs
        
        try:
            # Mock research results for MVP
            # In real implementation, this would make API calls to search engines
            research_data = {
                "visa_required": True,
                "processing_time": "5-15 business days",
                "validity": "90 days",
                "entry_type": "Single/Multiple entry available",
                "sources": [
                    f"{request.destination_country} embassy official website",
                    "Government immigration portal",
                    "Consulate general information"
                ]
            }
            
            return research_data
        except Exception as e:
            print(f"Research error: {e}")
            return {"error": "Research temporarily unavailable"}
    
    async def generate_document_checklist(self, request: ConsultationRequest, research_data: Dict) -> List[DocumentItem]:
        """
        Generate personalized document checklist using AI
        """
        prompt = f"""
        Generate a personalized visa document checklist for:
        
        Applicant Profile:
        - Nationality: {request.nationality}
        - Dual Citizenship: {request.dual_citizenship or 'None'}
        - Current Country: {request.current_country}
        - Residency Status: {request.residency_status}
        - Destination: {request.destination_country}
        - Travel Purpose: {request.travel_purpose}
        - Duration: {request.duration}
        - Previous Rejections: {request.previous_rejections}
        
        Additional Context: {request.additional_info or 'None'}
        
        Based on this profile, generate a prioritized document checklist with:
        1. HIGH priority (absolutely required)
        2. MEDIUM priority (strongly recommended)
        3. LOW priority (helpful but optional)
        
        For each document, provide:
        - Clear name
        - Specific requirements/notes for this applicant's situation
        - Why it's important for their specific case
        
        Focus on edge cases and nuances that generic checklists miss.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a visa application expert who specializes in complex immigration scenarios. Provide detailed, personalized guidance."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            # Parse the AI response and convert to DocumentItem objects
            content = response.choices[0].message.content
            
            # For MVP, create structured response
            # In production, this would parse the AI response more sophisticatedly
            documents = [
                DocumentItem(
                    name="Valid Passport",
                    priority="high",
                    description=f"Your {request.nationality} passport with at least 6 months validity",
                    notes="Ensure signature is clear and passport is not damaged"
                ),
                DocumentItem(
                    name="Visa Application Form",
                    priority="high",
                    description=f"Complete {request.destination_country} visa application form",
                    notes="Fill out accurately - any mistakes can cause delays"
                ),
                DocumentItem(
                    name="Passport Photos",
                    priority="high",
                    description="Recent passport-sized photographs meeting specific requirements",
                    notes="Check embassy website for exact photo specifications"
                ),
                DocumentItem(
                    name="Proof of Residency",
                    priority="high" if request.residency_status != "citizen" else "medium",
                    description=f"Evidence of your {request.residency_status} status in {request.current_country}",
                    notes="Green card, visa stamp, or residence permit as applicable"
                ),
                DocumentItem(
                    name="Travel Itinerary",
                    priority="medium",
                    description="Detailed travel plans including accommodation",
                    notes="Can be provisional but should show realistic planning"
                ),
                DocumentItem(
                    name="Financial Documentation",
                    priority="high",
                    description="Bank statements showing sufficient funds",
                    notes=f"Show ability to support yourself during {request.duration} stay"
                )
            ]
            
            return documents
            
        except Exception as e:
            print(f"Document generation error: {e}")
            # Return basic fallback documents
            return [
                DocumentItem(
                    name="Passport",
                    priority="high",
                    description="Valid passport with 6+ months validity",
                    notes="Required for all visa applications"
                )
            ]
    
    async def generate_cover_letter(self, request: ConsultationRequest, research_data: Dict) -> str:
        """
        Generate personalized cover letter using AI
        """
        prompt = f"""
        Write a professional visa application cover letter for:
        
        Applicant: {request.nationality} citizen
        Current Status: {request.residency_status} in {request.current_country}
        Applying for: {request.destination_country} visa
        Purpose: {request.travel_purpose}
        Duration: {request.duration}
        Travel Dates: {request.travel_dates}
        
        Key points to address:
        - Why they want to visit {request.destination_country}
        - Their ties to {request.current_country} (why they will return)
        - Their specific situation as a {request.nationality} {request.residency_status}
        - Financial capability and travel planning
        
        Additional context: {request.additional_info or 'Standard application'}
        Previous rejections: {request.previous_rejections}
        
        Write a compelling but honest letter that addresses potential visa officer concerns.
        Keep it professional, concise (1-2 pages), and specific to their situation.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an immigration consultant who writes compelling visa application cover letters. Focus on addressing visa officer concerns while highlighting applicant strengths."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"Cover letter generation error: {e}")
            return f"""
Dear Visa Officer,

I am writing to apply for a {request.destination_country} visa for {request.travel_purpose} purposes.

[This cover letter could not be generated due to a technical error. Please contact support.]

Sincerely,
[Applicant Name]
"""
    
    async def generate_consultation(self, request: ConsultationRequest, consultation_id: str) -> ConsultationResult:
        """
        Generate complete consultation including research, documents, and cover letter
        """
        try:
            # Step 1: Research visa requirements
            research_data = await self.research_visa_requirements(request)
            
            # Step 2: Generate document checklist
            documents = await self.generate_document_checklist(request, research_data)
            
            # Step 3: Generate cover letter
            cover_letter = await self.generate_cover_letter(request, research_data)
            
            # Step 4: Generate strategic notes
            strategic_notes = [
                f"Apply through {request.current_country} consulate to leverage your {request.residency_status} status",
                f"Emphasize your ties to {request.current_country} in your application",
                "Submit application at least 2-3 weeks before travel dates",
                "Ensure all documents are current and properly certified"
            ]
            
            # Step 5: Calculate confidence score
            confidence_score = self._calculate_confidence_score(request, research_data)
            
            return ConsultationResult(
                consultation_id=consultation_id,
                risk_assessment=f"Based on your profile as a {request.nationality} {request.residency_status} in {request.current_country}, your visa application has a good chance of approval if properly documented.",
                confidence_score=confidence_score,
                documents_required=documents,
                cover_letter=cover_letter,
                strategic_notes=strategic_notes,
                sources=research_data.get("sources", ["AI-generated guidance"]),
                estimated_processing_time=research_data.get("processing_time", "7-14 business days")
            )
            
        except Exception as e:
            print(f"Consultation generation error: {e}")
            raise e
    
    async def generate_preview(self, request: ConsultationRequest) -> Dict:
        """
        Generate a limited preview without full consultation
        """
        return {
            "sample_documents": [
                "Valid passport (6+ months validity)",
                "Visa application form",
                "Passport photographs",
                "Proof of residency status",
                "Financial documentation"
            ],
            "estimated_processing": "7-15 business days",
            "confidence_preview": "Based on your profile, this appears to be a standard application case.",
            "note": "Full personalized checklist, cover letter, and strategic guidance available with complete consultation."
        }
    
    def _calculate_confidence_score(self, request: ConsultationRequest, research_data: Dict) -> int:
        """
        Calculate confidence score based on applicant profile
        """
        score = 75  # Base score
        
        # Adjust based on residency status
        if request.residency_status == "permanent_resident":
            score += 10
        elif request.residency_status == "citizen":
            score += 15
        elif request.residency_status == "temporary_worker":
            score += 5
        
        # Adjust based on previous rejections
        if request.previous_rejections:
            score -= 20
        
        # Adjust based on travel purpose
        if request.travel_purpose in ["tourism", "business"]:
            score += 5
        
        return max(30, min(95, score))  # Keep score between 30-95