import os
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
load_dotenv(ROOT / '.env')

class Settings:
    service_name = 'scamshield-bharat'
    gemini_api_key = os.getenv('GEMINI_API_KEY', '').strip()
    gemini_model = os.getenv('GEMINI_MODEL', 'gemini-3.8-flash')
    frontend_origin = os.getenv('FRONTEND_ORIGIN', 'http://localhost:5173')
    database_url = os.getenv('DATABASE_URL', 'sqlite:////tmp/scamshield.db')
    max_upload_mb = int(os.getenv('MAX_UPLOAD_MB', '10'))
    max_text_chars = int(os.getenv('MAX_TEXT_CHARS', '12000'))
    @property
    def max_upload_bytes(self) -> int: return self.max_upload_mb * 1024 * 1024

settings = Settings()
