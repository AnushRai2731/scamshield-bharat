from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.scam_analyzer import analyze_text

router=APIRouter()
CASES={'fastag':'Your FASTag account will be suspended today. Pay ₹20 immediately using the link below.','kyc':'Your KYC has expired. Click here immediately to prevent account suspension.','otp':'A caller says they are support and asks you to read out the OTP sent to your phone.','delivery':'Your parcel could not be delivered. Confirm your refund using this link.','normal':'Your order is arriving tomorrow. Track it in the official shopping app.','inconclusive':'Please call me when you are free.'}
class DemoRequest(BaseModel): language: str='English'
@router.post('/demo/{demo_id}')
def demo(demo_id: str, payload: DemoRequest):
    if demo_id not in CASES: raise HTTPException(status_code=404, detail='Demo case not found.')
    return analyze_text(CASES[demo_id], payload.language, 'audio' if demo_id=='otp' else 'text', demo_id=demo_id)
