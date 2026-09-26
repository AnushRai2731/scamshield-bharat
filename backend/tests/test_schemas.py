import pytest
from pydantic import ValidationError
from app.schemas.analysis import ScamAnalysis, TextRequest

def test_text_validation_rejects_short_input():
    with pytest.raises(ValidationError): TextRequest(text='hi')

def test_risk_schema_accepts_inconclusive():
    item = ScamAnalysis(risk_level='INCONCLUSIVE', category='unknown', confidence='LOW', summary='Not enough evidence.', parent_explanation='Please share more context.', do=[], do_not=[])
    assert item.risk_level == 'INCONCLUSIVE'

def test_risk_schema_rejects_unknown_level():
    with pytest.raises(ValidationError): ScamAnalysis(risk_level='CERTAIN', category='x', confidence='LOW', summary='x', parent_explanation='x', do=[], do_not=[])
