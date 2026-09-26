from pathlib import Path
from fastapi import UploadFile
from app.core.config import settings

ALLOWED = {
    'image': {'image/jpeg', 'image/png', 'image/webp'},
    'qr': {'image/jpeg', 'image/png', 'image/webp'},
    'audio': {'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/ogg', 'audio/webm', 'video/webm'},
}

async def read_validated_upload(file: UploadFile, input_type: str) -> tuple[bytes, str]:
    if input_type not in ALLOWED or file.content_type not in ALLOWED[input_type]:
        raise ValueError('This file type is not supported.')
    data = await file.read(settings.max_upload_bytes + 1)
    if len(data) > settings.max_upload_bytes:
        raise ValueError(f'Please upload a file smaller than {settings.max_upload_mb} MB.')
    if not data:
        raise ValueError('The uploaded file is empty.')
    return data, file.content_type or 'application/octet-stream'

def qr_context(data: bytes) -> str:
    # QR decoding is intentionally optional: no financial app or URL is opened.
    try:
        import cv2  # type: ignore
        import numpy as np  # type: ignore
        detector = cv2.QRCodeDetector()
        image = cv2.imdecode(np.frombuffer(data, dtype=np.uint8), cv2.IMREAD_COLOR)
        value, _, _ = detector.detectAndDecode(image)
        return value.strip() if value else ''
    except Exception:
        return ''
