"""
Simple demo script for the integrated NLTK+Gemini+FinBERT advisor system.
"""
import asyncio
import os
import sys
from pathlib import Path

# Ensure .env is loaded before importing app modules
try:
    from dotenv import load_dotenv
    # Load .env from the backend directory
    env_path = Path(__file__).parent / ".env"
    load_dotenv(dotenv_path=env_path)
except ImportError:
    print("dotenv not installed, environment variables must be set manually")

# Import the AI advisor service
try:
    from app.services.ai_advisor import AIAdvisorService
except ImportError:
    print("Error: Cannot import AIAdvisorService. Make sure you're running this from the backend directory.")
    sys.exit(1)

# Sample financial queries to test
SAMPLE_QUERIES = [
    "Will rate cuts boost equity markets in the near term?",
    "I'm worried about declining revenue this quarter.",
    "Our margins improved and the new product is doing well.",
    "Should I increase my SIP if markets are volatile?",
    "How can I reduce my tax outgo this financial year?"
]

async def main():
    """Run the demo"""
    print("\n" + "="*80)
    print("INTEGRATED FINANCIAL ADVISOR DEMO (NLTK + GEMINI + FINBERT)")
    print("="*80)
    
    # Verify environment setup
    for env_var in ['GEMINI_API_KEY', 'LLM_PROVIDER', 'GEMINI_MODEL']:
        value = os.environ.get(env_var)
        print(f"{env_var}: {value if value else 'NOT SET'}")
    
    print("\nInitializing AI Advisor...")
    advisor = AIAdvisorService()
    
    # Process each query
    for i, query in enumerate(SAMPLE_QUERIES):
        print("\n" + "="*80)
        print(f"QUERY {i+1}: {query}")
        print("-"*80)
        
        try:
            # Get advice with the integrated system
            result = await advisor.get_financial_advice(query)
            
            # Display the AI response
            print(f"\nResponse (Confidence: {result['confidence']:.2f}):\n")
            print(result["reply"])
            
            # Display suggestions
            if result.get("suggestions"):
                print("\nSuggestions:")
                for suggestion in result["suggestions"]:
                    print(f"- {suggestion}")
            
            # Display any financial sentiment analysis
            if result.get("relevant_data") and result["relevant_data"].get("sentiment"):
                sentiment = result["relevant_data"]["sentiment"]
                print("\nSentiment Analysis:")
                print(f"- Label: {sentiment.get('label', 'unknown')}")
                print(f"- Score: {sentiment.get('score', 0):.2f}")
        
        except Exception as e:
            print(f"Error processing query: {e}")
    
    print("\n" + "="*80)
    print("DEMO COMPLETE")
    print("="*80)

if __name__ == "__main__":
    asyncio.run(main())
