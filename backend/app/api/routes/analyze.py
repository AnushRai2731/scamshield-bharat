from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from app.core.security import clean_text, validate_url
from app.core.config import settings
from app.schemas.analysis import TextRequest, UrlRequest
from app.services.file_service import read_validated_upload, qr_context
from app.services.gemini_service import AIUnavailable
from app.services.scam_analyzer import analyze_text, analyze_file

router=APIRouter(prefix='/analyze')

def unavailable(): raise HTTPException(status_code=503, detail={'success':False,'error_code':'AI_UNAVAILABLE','message':'AI analysis is temporarily unavailable.'})

@router.post('/text')
def analyze_message(payload: TextRequest):
    try: return analyze_text(clean_text(payload.text, settings.max_text_chars), payload.language)
    except AIUnavailable: unavailable()

@router.post('/url')
def analyze_url(payload: UrlRequest):
    try:
        url=validate_url(payload.url); parsed=url.split('/')[2] if '//' in url else url
        metadata=f'URL metadata (appearance only, not proof of maliciousness): host={parsed}. User context: {clean_text(payload.context, settings.max_text_chars)}'
        return analyze_text(url, payload.language, 'url', metadata)
    except ValueError as exc: raise HTTPException(status_code=422, detail=str(exc))
    except AIUnavailable: unavailable()

async def file_endpoint(file: UploadFile, language: str, input_type: str):
    try:
        data,mime=await read_validated_upload(file,input_type)
        if input_type=='qr':
            decoded=qr_context(data)
            if decoded: return analyze_text(decoded, language, 'qr', 'Decoded QR payload. It was not opened or executed.')
        return analyze_file(data,mime,language,input_type)
    except ValueError as exc: raise HTTPException(status_code=422, detail=str(exc))
    except AIUnavailable: unavailable()

@router.post('/image')
async def analyze_image(file: UploadFile=File(...), language: str=Form('English')): return await file_endpoint(file,language,'image')
@router.post('/audio')
async def analyze_audio(file: UploadFile=File(...), language: str=Form('English')): return await file_endpoint(file,language,'audio')
@router.post('/qr')
async def analyze_qr(file: UploadFile=File(...), language: str=Form('English')): return await file_endpoint(file,language,'qr')
