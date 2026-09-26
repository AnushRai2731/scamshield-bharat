from app.services.scam_analyzer import fallback_demo

def test_demo_cases_have_safe_fallbacks():
    result = fallback_demo('fastag', 'English')
    assert result.risk_level == 'HIGH'
    assert any(signal.title == 'Urgency or fear' for signal in result.signals)

def test_inconclusive_demo_does_not_force_risk():
    result = fallback_demo('inconclusive', 'English')
    assert result.risk_level == 'INCONCLUSIVE'
