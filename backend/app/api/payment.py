from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import stripe
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Configure Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class PaymentRequest(BaseModel):
    consultation_id: str
    email: str

class PaymentResponse(BaseModel):
    checkout_url: str
    session_id: str

@router.post("/payment/create-checkout", response_model=PaymentResponse)
async def create_checkout_session(payment_request: PaymentRequest):
    """
    Create Stripe checkout session for visa consultation payment
    """
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': 'Visa Consultation - Personalized Guidance',
                            'description': 'AI-powered visa application guidance with personalized document checklist and cover letter',
                        },
                        'unit_amount': 4900,  # $49.00 in cents
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/success?session_id={{CHECKOUT_SESSION_ID}}&consultation_id={payment_request.consultation_id}",
            cancel_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/cancel",
            customer_email=payment_request.email,
            metadata={
                'consultation_id': payment_request.consultation_id,
            }
        )
        
        return PaymentResponse(
            checkout_url=checkout_session.url,
            session_id=checkout_session.id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment session creation failed: {str(e)}")

@router.post("/payment/verify")
async def verify_payment(session_id: str):
    """
    Verify payment completion and trigger consultation generation
    """
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        if session.payment_status == 'paid':
            consultation_id = session.metadata.get('consultation_id')
            
            # Here we would trigger the full consultation generation
            # For now, return success status
            return {
                "success": True,
                "payment_status": "completed",
                "consultation_id": consultation_id,
                "message": "Payment verified. Generating your personalized consultation..."
            }
        else:
            return {
                "success": False,
                "payment_status": session.payment_status,
                "message": "Payment not completed"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")

@router.post("/payment/webhook")
async def stripe_webhook(request):
    """
    Handle Stripe webhooks for payment events
    """
    # This would handle Stripe webhook events
    # For MVP, we'll use the verify endpoint instead
    return {"received": True}