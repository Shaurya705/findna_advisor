from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings

from .routers import upload, analyze, forecast, advice, auth
from .startup import init_db

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(upload.router, prefix=settings.api_prefix, tags=["upload"])
app.include_router(analyze.router, prefix=settings.api_prefix, tags=["analyze"])
app.include_router(forecast.router, prefix=settings.api_prefix, tags=["forecast"])
app.include_router(advice.router, prefix=settings.api_prefix, tags=["advice"])

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.on_event("startup")
def on_startup():
    # For demo, create tables automatically. Use Alembic in production.
    init_db()

