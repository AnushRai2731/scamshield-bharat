from app.schemas.analysis import ScamAnalysis, ScamSignal
from app.services.gemini_service import gemini_service, AIUnavailable
from app.services.history_service import save_analysis

DEMO_TEXT = {
    'fastag': ('HIGH', 'phishing / payment fraud', 'The message uses a suspension deadline and a small payment request to pressure you toward an external link.', 'The sender appears to be trying to make you pay a small amount through a link that may not be an official FASTag channel.', 'FASTag service', 'Pay ₹20 using the link below.'),
    'kyc': ('HIGH', 'phishing / impersonation', 'The message combines an account-suspension threat with an urgent request to update KYC through a link.', 'The sender appears to want your personal or banking details through a fake KYC flow.', 'A bank or KYC team', 'Click a link and update your details.'),
    'otp': ('CRITICAL', 'account takeover', 'A caller asking for a one-time passcode is a strong sign of an active account-takeover attempt.', 'The caller appears to be trying to obtain an OTP that can authorize access or a transaction.', 'Customer support', 'Read out the OTP sent to your phone.'),
    'delivery': ('HIGH', 'delivery / refund fraud', 'The message creates a delivery problem and redirects you into a refund or payment flow outside the official app.', 'The sender appears to be trying to capture payment or card details through a fake refund process.', 'A delivery company', 'Open a link to confirm a refund.'),
    'normal': ('LOW', 'routine notification', 'No obvious scam indicators were detected from the content provided.', 'No clear action involving money, credentials, or an unknown link is requested.', 'A delivery service', 'Check a routine order update.'),
    'inconclusive': ('INCONCLUSIVE', 'insufficient context', 'There is not enough evidence in this short message to confidently assess the sender or intent.', 'The requested action is unclear from the content provided.', None, None),
}

def fallback_demo(demo_id: str, language: str) -> ScamAnalysis:
    risk, category, summary, requested, identity, action = DEMO_TEXT.get(demo_id, DEMO_TEXT['inconclusive'])
    if risk == 'LOW': signals=[]; do_not=['Do not share credentials or payment details unless you independently verify the request.']; do=['Open the official app or website yourself if you need to check the update.']
    elif risk == 'INCONCLUSIVE': signals=[]; do_not=['Do not act on a message you cannot verify.']; do=['Ask for more context or check with the sender through a known channel.']
    else:
        signals=[ScamSignal(type='urgency', title='Urgency or fear', description='The message pushes you to act quickly or threatens a negative consequence.'), ScamSignal(type='impersonation', title='Impersonation', description='The sender claims to represent a trusted service, but the claim is not independently verified.'), ScamSignal(type='payment', title='Financial request', description='The content asks for money, payment authorization, or information that could enable a payment.'), ScamSignal(type='external_link', title='External action', description='The requested action is routed through a link or channel that should be verified independently.')]
        if risk == 'CRITICAL': signals[2] = ScamSignal(type='credential_theft', title='OTP request', description='The content asks for a one-time passcode. Never share an OTP with anyone.')
        do_not=['Do not click the suspicious link or share an OTP, PIN, password or CVV.', 'Do not scan an unknown payment QR or send money to continue the process.']; do=['Open the official app or website manually and check for the alert.', 'Contact the organization through an official channel you find yourself.'];
        if risk == 'CRITICAL': do.insert(0, 'End the call and do not read out any code sent to your phone.')
    parent={'English':'This message looks suspicious. Please pause, do not click or share any code, and check through the official app or number.','Hindi':'यह संदेश संदिग्ध लग रहा है। कृपया रुकें, कोई लिंक न खोलें और OTP या निजी जानकारी साझा न करें। आधिकारिक ऐप से जांच करें।','Telugu':'ఈ మెసేజ్ అనుమానంగా ఉంది. దయచేసి ఆగండి, లింక్‌పై క్లిక్ చేయకండి, OTP లేదా వ్యక్తిగత సమాచారం ఇవ్వకండి. అధికారిక యాప్‌లో చెక్ చేయండి।'}.get(language, 'This message looks suspicious. Please pause, do not click or share any code, and check through the official app or number.')
    return ScamAnalysis(risk_level=risk, category=category, confidence='HIGH' if risk in {'HIGH','CRITICAL','LOW'} else 'LOW', summary=summary, claimed_identity=identity, requested_action=action, signals=signals, do_not=do_not, do=do, parent_explanation=parent, escalation_required=risk=='CRITICAL', escalation_guidance='Contact your bank or payment provider immediately through its official channel and call 1930 if money or access may be at risk.' if risk=='CRITICAL' else None)

def analyze_text(content: str, language: str, input_type: str = 'text', metadata: str = '', demo_id: str | None = None):
    if demo_id:
        try: analysis=gemini_service.analyze_text(content, language, input_type, metadata); fallback=False
        except AIUnavailable: analysis=fallback_demo(demo_id, language); fallback=True
    else:
        analysis=gemini_service.analyze_text(content, language, input_type, metadata); fallback=False
    return save_analysis(analysis, input_type, fallback)

def analyze_file(data: bytes, mime_type: str, language: str, input_type: str):
    return save_analysis(gemini_service.analyze_file(data, mime_type, language, input_type), input_type)
