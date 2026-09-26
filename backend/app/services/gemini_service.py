import json
from typing import Any
from app.core.config import settings
from app.prompts.scam_analysis import SYSTEM_PROMPT, build_prompt
from app.schemas.analysis import ScamAnalysis

class AIUnavailable(Exception): pass

class GeminiService:
    def __init__(self):
        self.client = None
        if settings.gemini_api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=settings.gemini_api_key)
            except Exception:
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
            response = self.client.models.generate_content(
                model=settings.gemini_model,
                contents=build_prompt(content, language, input_type, metadata),
                config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT, response_mime_type='application/json', response_schema=ScamAnalysis, temperature=0.1),
            )
            return self._parse(response)
        except AIUnavailable: raise
        except Exception as exc: raise AIUnavailable('Gemini analysis is temporarily unavailable.') from exc

    def analyze_file(self, data: bytes, mime_type: str, language: str, input_type: str, context: str = '') -> ScamAnalysis:
        if not self.client: raise AIUnavailable('Gemini is not configured.')
        try:
            from google.genai import types
            parts = [types.Part.from_bytes(data=data, mime_type=mime_type), build_prompt(context or 'No text transcript was provided. Inspect the attached file.', language, input_type)]
            response = self.client.models.generate_content(
                model=settings.gemini_model, contents=parts,
                config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT, response_mime_type='application/json', response_schema=ScamAnalysis, temperature=0.1),
            )
            return self._parse(response)
        except AIUnavailable: raise
        except Exception as exc: raise AIUnavailable('Gemini file analysis is temporarily unavailable.') from exc

gemini_service = GeminiService()
