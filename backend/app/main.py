from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.router import api_router
from app.core.config import settings
from app.services.history_service import init_db

app=FastAPI(title='ScamShield Bharat API', version='1.0.0', description='AI-assisted scam safety analysis for Indian families.')
app.add_middleware(CORSMiddleware, allow_origins=[settings.frontend_origin], allow_credentials=True, allow_methods=['GET','POST','DELETE'], allow_headers=['*'])

@app.on_event('startup')
def startup(): init_db()

@app.exception_handler(Exception)
async def safe_errors(_: Request, __: Exception): return JSONResponse(status_code=500, content={'success':False,'error_code':'INTERNAL_ERROR','message':'Something went wrong. Please try again.'})

app.include_router(api_router)
