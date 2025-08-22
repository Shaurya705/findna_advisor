Backend (FastAPI + PostgreSQL + Celery)

Endpoints
- POST /api/upload: Upload invoice (file), returns job id, OCR preview later via task.
- POST /api/analyze: Analyze transactions, returns anomalies and summaries.
- POST /api/forecast: Forecast revenue, returns series.
- POST /api/advice: Chat-based advisory, echoes for now.
- POST /auth/token: JWT login (demo user), returns access token.
- GET /health: Health check.

Setup
1. Create .env from .env.example and fill values.
2. Create venv and install:
   pip install -r backend/requirements.txt
3. Run API:
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
4. Start worker (requires Redis):
   celery -A app.tasks.app worker --loglevel=info

Migrations
- Initialize Alembic and generate migrations once DB is reachable.

Notes
- OCR/GSTN calls are stubbed. Replace with real integrations.
- Prophet/XGBoost are optional; enable if needed.
