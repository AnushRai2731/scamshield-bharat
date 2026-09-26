from typing import Literal
from pydantic import BaseModel, Field, field_validator
from app.core.config import settings

RiskLevel = Literal['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'INCONCLUSIVE']
Confidence = Literal['LOW', 'MEDIUM', 'HIGH']

class ScamSignal(BaseModel):
    type: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=600)

class ScamAnalysis(BaseModel):
    risk_level: RiskLevel
    category: str = Field(min_length=1, max_length=120)
    confidence: Confidence
    summary: str = Field(min_length=1, max_length=1200)
    claimed_identity: str | None = None
    requested_action: str | None = None
    signals: list[ScamSignal] = Field(default_factory=list, max_length=12)
    do_not: list[str] = Field(default_factory=list, max_length=12)
    do: list[str] = Field(default_factory=list, max_length=12)
    parent_explanation: str = Field(min_length=1, max_length=800)
    escalation_required: bool = False
    escalation_guidance: str | None = None
    disclaimer: str = 'AI-assisted guidance. Verify important financial communication independently.'

class AnalysisRecord(ScamAnalysis):
    id: str
    created_at: str
    input_type: Literal['text', 'image', 'audio', 'url', 'qr']
    demo_fallback: bool = False

class TextRequest(BaseModel):
    text: str = Field(min_length=8, max_length=settings.max_text_chars)
    language: str = Field(default='English', max_length=40)
    @field_validator('text')
    @classmethod
    def trim_text(cls, value: str) -> str:
        value = value.strip()
        if len(value) < 8: raise ValueError('Please provide more message context.')
        return value

class UrlRequest(BaseModel):
    url: str = Field(min_length=8, max_length=2048)
    context: str = Field(default='', max_length=settings.max_text_chars)
    language: str = Field(default='English', max_length=40)

class LanguageRequest(BaseModel):
    language: str = Field(default='English', max_length=40)
