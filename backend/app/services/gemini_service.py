import json
import logging
import time
from typing import Any
from app.core.config import settings
from app.prompts.scam_analysis import SYSTEM_PROMPT, build_prompt
from app.schemas.analysis import ScamAnalysis

logger = logging.getLogger(__name__)


class AIUnavailable(Exception):
    pass


def provider_error_message(exc: Exception, analysis_kind: str) -> str:
    """Return a safe, actionable message without exposing provider details or secrets."""
    status = getattr(exc, 'code', None) or getattr(exc, 'status_code', None)
    logger.error('Gemini %s analysis failed: %s (status=%s)', analysis_kind, type(exc).__name__, status)
    if status in (401, 403):
        return 'Gemini rejected the API key or this project does not have Gemini API access.'
    if status == 429:
        return 'Gemini quota is temporarily exhausted. Please wait a moment and try again.'
    if status == 404:
        return 'The configured Gemini model is unavailable to this API key.'
    return 'Gemini analysis is temporarily unavailable.'


def generate_with_retry(request, analysis_kind: str):
    """Retry transient Gemini failures before returning a 503 to the browser."""
    last_error: Exception | None = None
    for attempt in range(3):
        try:
            return request()
        except Exception as exc:
            last_error = exc
            status = getattr(exc, 'code', None) or getattr(exc, 'status_code', None)
            if status not in (429, 500, 502, 503, 504) or attempt == 2:
                break
            delay = 1 + attempt
            logger.warning(
                'Gemini %s analysis received status=%s; retrying in %ss (%s/3)',
                analysis_kind, status, delay, attempt + 1,
            )
            time.sleep(delay)
    assert last_error is not None
    raise last_error

class GeminiService:
    def __init__(self):
        self.client = None
        if settings.gemini_api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=settings.gemini_api_key)
            except Exception as exc:
                logger.error('Gemini client initialization failed: %s', type(exc).__name__)
                self.client = None

    def _parse(self, response: Any) -> ScamAnalysis:
        parsed = getattr(response, 'parsed', None)
        if parsed is not None:
            return ScamAnalysis.model_validate(parsed)
        raw = getattr(response, 'text', '')
        if not raw: raise AIUnavailable('Gemini returned an empty response.')
        try:
            return ScamAnalysis.model_validate(json.loads(raw))
        except Exception as exc:
            raise AIUnavailable('Gemini returned malformed analysis data.') from exc

    def analyze_text(self, content: str, language: str, input_type: str = 'message', metadata: str = '') -> ScamAnalysis:
        if not self.client: raise AIUnavailable('Gemini is not configured.')
        try:
            from google.genai import types
            response = generate_with_retry(
                lambda: self.client.models.generate_content(
                    model=settings.gemini_model,
                    contents=build_prompt(content, language, input_type, metadata),
                    config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT, response_mime_type='application/json', response_schema=ScamAnalysis, temperature=0.1),
                ),
                'text',
            )
            return self._parse(response)
        except AIUnavailable: raise
        except Exception as exc:
            raise AIUnavailable(provider_error_message(exc, 'text')) from exc

    def analyze_file(self, data: bytes, mime_type: str, language: str, input_type: str, context: str = '') -> ScamAnalysis:
        if not self.client: raise AIUnavailable('Gemini is not configured.')
        try:
            from google.genai import types
            parts = [types.Part.from_bytes(data=data, mime_type=mime_type), build_prompt(context or 'No text transcript was provided. Inspect the attached file.', language, input_type)]
            response = generate_with_retry(
                lambda: self.client.models.generate_content(
                    model=settings.gemini_model, contents=parts,
                    config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT, response_mime_type='application/json', response_schema=ScamAnalysis, temperature=0.1),
                ),
                'file',
            )
            return self._parse(response)
        except AIUnavailable: raise
        except Exception as exc:
            raise AIUnavailable(provider_error_message(exc, 'file')) from exc

gemini_service = GeminiService()
