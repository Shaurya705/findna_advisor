#!/usr/bin/env python3
"""
AI Advisor Chatbot Test Script
Tests the AI advisor functionality and ensures the service is properly activated
"""

import sys
import os
import logging
import json
import asyncio
import traceback
from datetime import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Add the backend directory to path so we can import app modules
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(script_dir))
sys.path.insert(0, backend_dir)

try:
    # Import app modules
    from app.services.ai_advisor import AIAdvisorService
    from app.config import settings
    from app.db import Base, engine, get_db, SessionLocal
    from app.models import ChatConversation, ChatMessage, User
except ImportError as e:
    logger.error(f"Failed to import app modules: {e}")
    logger.error(traceback.format_exc())
    sys.exit(1)

def check_environment_variables():
    """Check if all required environment variables are set"""
    logger.info("Checking environment variables...")
    
    # Basic environment variables
    env_vars = {
        "Database URL": settings.database_url,
        "JWT Secret": settings.jwt_secret,
        "API Prefix": settings.api_prefix,
        "LLM Provider": settings.llm_provider
    }
    
    # Provider-specific API keys
    if settings.llm_provider == "openai":
        env_vars["OpenAI API Key"] = settings.openai_api_key
    elif settings.llm_provider == "gemini":
        env_vars["Gemini API Key"] = settings.gemini_api_key
        env_vars["Gemini Model"] = settings.gemini_model
    
    # Print environment variables status
    for name, value in env_vars.items():
        masked_value = None
        if value:
            if "key" in name.lower() or "secret" in name.lower():
                masked_value = value[:4] + "*" * (len(value) - 8) + value[-4:]
            else:
                masked_value = value
        logger.info(f"  {name}: {'✅ Set' if value else '❌ Not set'} {f'({masked_value})' if masked_value else ''}")
    
    # Check if AI Advisor is enabled
    logger.info(f"  AI Advisor Enabled: {'✅ Yes' if settings.enable_ai_advisor else '❌ No'}")
    
    # Return True if all required variables are set
    if settings.llm_provider == "openai" and not settings.openai_api_key:
        logger.warning("OpenAI API Key is not set but provider is 'openai'")
        return False
    elif settings.llm_provider == "gemini" and not settings.gemini_api_key:
        logger.warning("Gemini API Key is not set but provider is 'gemini'")
        return False
    
    return True

def check_database():
    """Check if the database is properly set up"""
    logger.info("Checking database...")
    
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        logger.info("  Database schema: ✅ Created/Verified")
        
        # Check if we have tables
        db = SessionLocal()
        try:
            # Check if users table exists and has data
            user_count = db.query(User).count()
            logger.info(f"  Users table: ✅ Found ({user_count} users)")
            
            # Check conversations table
            conv_count = db.query(ChatConversation).count()
            logger.info(f"  Conversations table: ✅ Found ({conv_count} conversations)")
            
            # Check messages table
            msg_count = db.query(ChatMessage).count()
            logger.info(f"  Messages table: ✅ Found ({msg_count} messages)")
            
            return True
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Database check failed: {e}")
        logger.error(traceback.format_exc())
        return False

async def test_ai_advisor():
    """Test the AI Advisor service"""
    logger.info("Testing AI Advisor service...")
    
    advisor = AIAdvisorService()
    
    # Check if AI Advisor is enabled
    if not advisor.enabled:
        logger.warning("AI Advisor is disabled in configuration")
        return False
    
    # Check if client is initialized
    if not advisor.client:
        logger.warning("AI Advisor client is not initialized")
        return False
    
    # Test basic response
    try:
        test_prompts = [
            "What is a good investment strategy for beginners?",
            "How can I optimize my taxes?",
            "What is the difference between a Roth IRA and a traditional IRA?"
        ]
        
        for prompt in test_prompts:
            logger.info(f"Testing prompt: '{prompt}'")
            response = await advisor.get_financial_advice(
                message=prompt,
                user_context={
                    "name": "Test User",
                    "age": 30,
                    "income": 100000,
                    "risk_profile": "moderate"
                },
                conversation_history=[]
            )
            
            if response and response.get("reply"):
                logger.info(f"  ✅ Got response ({len(response['reply'])} characters)")
                # Print first 100 chars of response
                preview = response['reply'][:100] + "..." if len(response['reply']) > 100 else response['reply']
                logger.info(f"  Response preview: {preview}")
            else:
                logger.error("  ❌ No valid response received")
                return False
        
        return True
    except Exception as e:
        logger.error(f"AI Advisor test failed: {e}")
        logger.error(traceback.format_exc())
        return False

def activate_chatbot():
    """Activate the chatbot by ensuring all necessary components are working"""
    logger.info("Activating chatbot...")
    
    # Check if .env file exists in the same directory
    env_file = os.path.join(script_dir, ".env")
    if not os.path.exists(env_file):
        logger.warning(f".env file not found at {env_file}")
    else:
        logger.info(f"Found .env file at {env_file}")
    
    # Ensure AI Advisor is enabled in settings
    if not settings.enable_ai_advisor:
        logger.warning("AI Advisor is not enabled in settings. Enabling it now...")
        settings.enable_ai_advisor = True
    
    # Set API keys if not set
    if settings.llm_provider == "openai" and not settings.openai_api_key:
        logger.warning("OpenAI API Key is not set. Setting a demo key...")
        settings.openai_api_key = "sk-findna-demo-key-20250823"
    
    if settings.llm_provider == "gemini" and not settings.gemini_api_key:
        logger.warning("Gemini API Key is not set. Setting a demo key...")
        settings.gemini_api_key = "AIzaSyBItZW4da1WdKbHY2Ztsi8iufi7z5lTwuM"
    
    # Return activation status
    return settings.enable_ai_advisor and (
        (settings.llm_provider == "openai" and settings.openai_api_key) or
        (settings.llm_provider == "gemini" and settings.gemini_api_key)
    )

async def main():
    """Run the chatbot test"""
    print("\n" + "=" * 80)
    print(" FinDNA Advisor - AI Chatbot Activation Test ")
    print("=" * 80 + "\n")
    
    print(f"Test started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Working directory: {os.getcwd()}")
    print(f"Python version: {sys.version}")
    print()
    
    try:
        # Check environment variables
        env_check = check_environment_variables()
        
        # Check database
        db_check = check_database()
        
        # Try to activate chatbot if needed
        if not env_check:
            print("\nAttempting to activate chatbot...")
            activation_success = activate_chatbot()
            print(f"Activation {'successful' if activation_success else 'failed'}")
        
        # Test AI Advisor
        ai_test = await test_ai_advisor()
        
        # Print summary
        print("\n" + "=" * 50)
        print(" Test Summary ")
        print("=" * 50)
        print(f"Environment variables: {'✅ PASS' if env_check else '❌ FAIL'}")
        print(f"Database check: {'✅ PASS' if db_check else '❌ FAIL'}")
        print(f"AI Advisor test: {'✅ PASS' if ai_test else '❌ FAIL'}")
        
        # Print overall status
        overall = env_check and db_check and ai_test
        print("\n" + "=" * 50)
        print(f" Overall Status: {'✅ PASS' if overall else '❌ FAIL'} ")
        print("=" * 50)
        
        if overall:
            print("\n🎉 The AI Chatbot is activated and working properly!")
            print("\nTo use the chatbot:")
            print("1. Start the backend server (if not already running)")
            print("2. Start the frontend application")
            print("3. Navigate to /ai-advisor-chat-interface")
            print("4. Start chatting with the AI Advisor")
        else:
            print("\n⚠️ The AI Chatbot activation failed.")
            print("Please check the error messages above and fix the issues.")
        
        return 0 if overall else 1
        
    except Exception as e:
        logger.error(f"Test failed with error: {e}")
        logger.error(traceback.format_exc())
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
