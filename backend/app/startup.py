import logging
import sys
from pathlib import Path
from .db import Base, engine
from .models import *  # noqa: F401,F403

def setup_logging():
    """Setup application logging"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('finvoice.log')
        ]
    )

async def initialize_services():
    """Initialize external services and connections"""
    logger = logging.getLogger(__name__)
    try:
        # Initialize AI models
        from .services.ai_advisor import AIAdvisorService
        from .config import settings
        
        # Log AI settings
        if settings.enable_ai_advisor:
            ai_provider = settings.llm_provider or "openai"
            logger.info(f"Initializing AI Advisor with provider: {ai_provider}")
            
            # Pre-initialize the service
            advisor = AIAdvisorService()
            if advisor.client:
                logger.info(f"AI Advisor service initialized successfully with {ai_provider}")
            else:
                logger.warning(f"AI Advisor service initialized but client connection not established. Check API keys.")
        else:
            logger.info("AI Advisor service disabled in configuration")
            
        logger.info("Services initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        raise

def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
