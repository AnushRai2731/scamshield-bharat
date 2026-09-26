from fastapi import APIRouter
from app.core.config import settings
router = APIRouter()
@router.get('/health')
def health(): return {'status':'ok','service':settings.service_name,'ai_configured':bool(settings.gemini_api_key),'model':settings.gemini_model}
