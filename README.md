# ScamShield Bharat

ScamShield Bharat is a production-style, AI-assisted safety copilot for Indian families. It helps a person pause before clicking, paying or sharing by analyzing suspicious messages, screenshots, URLs, QR images and voice notes, then explaining the risk and safer next steps.

## What it is

The app is deliberately focused: it is not a generic chatbot. It turns untrusted digital communication into a risk level, evidence-based signals, a simple action checklist and a parent-friendly explanation.

## Features

- Gemini-backed structured scam analysis through a Python FastAPI service.
- Text, screenshot, URL, audio and QR input modes.
- Risk levels: LOW, MEDIUM, HIGH, CRITICAL and INCONCLUSIVE.
- Parent Mode with English, Hindi, Telugu, Tamil, Marathi and Bengali selection.
- Fictional demo cases with clearly labeled fallback results when Gemini is unavailable.
- Minimal SQLite history, emergency guidance, scam education and privacy boundaries.
- File validation, upload limits, CORS, temporary processing and safe error responses.

## Architecture

```text
React + TypeScript + Vite + Tailwind
              │ REST / JSON / multipart
              ▼
FastAPI + Pydantic + SQLite
              │ google-genai
              ▼
Gemini structured analysis
```

The frontend never calls Gemini directly. Gemini logic lives in `backend/app/services/gemini_service.py`, while routes delegate to service modules.

## Local setup

### Backend

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate  # Windows
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

FastAPI docs: `http://localhost:8000/api/docs` and `http://localhost:8000/api/redoc`.

### Gemini API setup

Add a server-only key to `backend/.env`:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.8-flash
FRONTEND_ORIGIN=http://localhost:5173
```

The model is read from configuration and is never exposed to the browser. If Gemini is unavailable, normal analyses return an explicit `AI_UNAVAILABLE` response. Demo cases alone use clearly labeled fictional fallback output.

### Frontend

From the project root:

```bash
npm install
copy .env.example .env
npm run dev
```

The Vite app runs at `http://localhost:5173`. Set `VITE_API_BASE_URL` if the backend runs elsewhere.

## Tests

```bash
cd backend
pytest
```

## Demo flow

Open `/demo`, run FASTag Scam, inspect the HIGH result, open Parent Mode, then use `/emergency` for the 1930 guidance flow. Demo fallback is always labeled when no Gemini key is configured.

## Deployment

Build the frontend with `npm run build` and deploy the output to Vercel. The backend Dockerfile uses Python 3.13 and listens on `${PORT:-8000}`, which is suitable for Render or Cloud Run.

## Security and privacy

Never upload OTPs, PINs, passwords, CVVs or other credentials. The API key remains server-side. Uploads are held in memory for analysis and are not written to the database. SQLite history stores minimal result metadata and can be cleared from the History page. The app never transfers money, files reports, opens links, or guarantees authenticity.

## AI limitations

AI-assisted analysis is not a guarantee that a communication is legitimate or fraudulent. Verify important financial or account-related requests independently. If money may have been lost, contact the bank or payment provider through an official channel and call 1930 promptly.
