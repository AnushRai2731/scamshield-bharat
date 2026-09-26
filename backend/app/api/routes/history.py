from fastapi import APIRouter
from app.services.history_service import list_history, clear_history
router = APIRouter()
@router.get('/history')
def get_history(): return list_history()
@router.delete('/history')
def delete_history(): clear_history(); return {'success': True}
