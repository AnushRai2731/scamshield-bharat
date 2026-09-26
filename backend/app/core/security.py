import re
from urllib.parse import urlparse

def clean_text(value: str, max_chars: int) -> str:
    value = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', value or '').strip()
    return value[:max_chars]

def validate_url(value: str) -> str:
    parsed = urlparse(value.strip())
    if parsed.scheme not in {'http', 'https'} or not parsed.netloc:
        raise ValueError('Please provide a valid http or https URL.')
    if len(value) > 2048:
        raise ValueError('That URL is too long to check.')
    return value.strip()
