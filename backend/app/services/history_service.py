import json
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from app.core.config import settings
from app.schemas.analysis import AnalysisRecord, ScamAnalysis

def db_path() -> str:
    raw = settings.database_url.replace('sqlite:///', '')
    return str(Path(raw).resolve())

def init_db():
    with sqlite3.connect(db_path()) as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS analyses (id TEXT PRIMARY KEY, created_at TEXT, input_type TEXT, risk_level TEXT, category TEXT, confidence TEXT, summary TEXT, claimed_identity TEXT, requested_action TEXT, parent_explanation TEXT, escalation_required INTEGER, analysis_json TEXT)''')

def save_analysis(analysis: ScamAnalysis, input_type: str, demo_fallback: bool = False) -> AnalysisRecord:
    record = AnalysisRecord(id=str(uuid.uuid4()), created_at=datetime.now(timezone.utc).isoformat(), input_type=input_type, demo_fallback=demo_fallback, **analysis.model_dump())
    with sqlite3.connect(db_path()) as conn:
        conn.execute('INSERT INTO analyses VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', (record.id, record.created_at, input_type, record.risk_level, record.category, record.confidence, record.summary, record.claimed_identity, record.requested_action, record.parent_explanation, int(record.escalation_required), json.dumps(record.model_dump())))
    return record

def list_history() -> list[AnalysisRecord]:
    with sqlite3.connect(db_path()) as conn:
        rows = conn.execute('SELECT analysis_json FROM analyses ORDER BY created_at DESC LIMIT 100').fetchall()
    return [AnalysisRecord.model_validate(json.loads(row[0])) for row in rows]

def clear_history():
    with sqlite3.connect(db_path()) as conn: conn.execute('DELETE FROM analyses')
