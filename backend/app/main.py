from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from .config import settings
from .startup import setup_logging, initialize_services, init_db
from .routers import auth, upload, analyze, forecast, advice, transactions, expenses, dashboard

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    try:
        # Initialize database and services on startup
        init_db()
        await initialize_services()
        logger.info("Application startup completed")
        yield
    except Exception as e:
        logger.error(f"Application startup failed: {e}")
        raise
    finally:
        logger.info("Application shutdown")

# Create FastAPI application
app = FastAPI(
    title="FinVoice API",
    description="AI-Powered Financial Management & Advisory Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins + ["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(upload.router, prefix="/api", tags=["File Upload & Processing"])
app.include_router(analyze.router, prefix="/api", tags=["Financial Analysis"])
app.include_router(forecast.router, prefix="/api", tags=["Forecasting"])
app.include_router(advice.router, prefix="/api", tags=["AI Advisory"])
app.include_router(transactions.router, prefix="/api", tags=["Transactions"])
app.include_router(expenses.router, prefix="/api", tags=["Expenses"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "FinVoice API - AI-Powered Financial Management Platform",
        "version": "1.0.0",
        "status": "active",
        "documentation": "/docs",
        "endpoints": {
            "authentication": "/api/auth",
            "file_upload": "/api/upload",
            "analysis": "/api/analyze",
            "forecasting": "/api/forecast",
            "ai_advisor": "/api/advice",
            "transactions": "/api/transactions",
            "expenses": "/api/expenses",
            "dashboard": "/api/dashboard"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "finvoice-api"}

@app.get("/api/features")
async def get_features():
    """Get available API features"""
    return {
        "features": {
            "ocr_processing": "Extract data from invoices and receipts",
            "anomaly_detection": "AI-powered fraud and anomaly detection",
            "cash_flow_forecasting": "ML-based financial forecasting",
            "ai_advisor": "Intelligent financial advice and insights",
            "transaction_management": "Comprehensive transaction tracking",
            "expense_management": "Advanced expense categorization and analysis",
            "financial_dashboard": "Real-time financial health monitoring",
            "automated_reconciliation": "Smart invoice and payment matching",
            "multi_currency_support": "Global currency handling",
            "bulk_operations": "Efficient bulk data import/export"
        },
        "ai_models": {
            "finbert": "Financial sentiment analysis",
            "prophet": "Time series forecasting",
            "xgboost": "Advanced prediction models",
            "isolation_forest": "Anomaly detection",
            "tesseract_ocr": "Document text extraction"
        }
    }

