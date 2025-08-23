from app.services.finbert_service import FinBertService
from app.services.ai_advisor import AIAdvisorService
import asyncio

# Focus on the highlighted prompt from finbert_10q_test.py
test_prompt = "Will rate cuts boost equity markets in the near term?"

async def main():
    print("="*80)
    print("TESTING INTEGRATED ADVISOR (NLTK + GEMINI + FINBERT)")
    print("="*80)
    print(f"Query: \"{test_prompt}\"")
    print("-"*80)
    
    # Initialize services
    finbert = FinBertService()
    advisor = AIAdvisorService()
    
    # 1. Test FinBERT sentiment separately
    print("\nPART 1: FINBERT SENTIMENT ANALYSIS")
    print("-"*80)
    
    if not finbert.available():
        print("FinBERT not available. Ensure transformers/torch installed and internet connection on first run.")
    else:
        sentiment = finbert.analyze(test_prompt)
        if sentiment:
            print(f"Sentiment: {sentiment['label']} (Score: {sentiment['score']:.2f})")
            
            if 'key_terms' in sentiment:
                print("\nKey Financial Terms:")
                for category, terms in sentiment['key_terms'].items():
                    if terms:
                        print(f"- {category.capitalize()}: {', '.join(terms)}")
                        
            if 'recommendations' in sentiment:
                print("\nFinBERT Recommendations:")
                for rec in sentiment['recommendations']:
                    print(f"- {rec}")
        else:
            print("Sentiment analysis failed")
    
    # 2. Test combined advisor (NLTK+Gemini+FinBERT)
    print("\n\nPART 2: INTEGRATED AI ADVISOR (NLTK + GEMINI + FINBERT)")
    print("-"*80)
    
    try:
        # Get integrated advice
        result = await advisor.get_financial_advice(test_prompt)
        
        # Display AI response
        print(f"\nAI RESPONSE (Confidence: {result['confidence']:.2f}):")
        print(result["reply"])
        
        # Display suggestions
        if result.get("suggestions"):
            print("\nSuggestions:")
            for suggestion in result["suggestions"]:
                print(f"- {suggestion}")
        
        # Display sentiment data if available
        if result.get("relevant_data") and result["relevant_data"].get("sentiment"):
            sentiment = result["relevant_data"]["sentiment"]
            print("\nIntegrated Sentiment Analysis:")
            print(f"- Label: {sentiment.get('label', 'unknown')}")
            print(f"- Score: {sentiment.get('score', 0):.2f}")
    
    except Exception as e:
        print(f"Combined test failed: {e}")
    
    print("\n" + "="*80)
    print("TEST COMPLETE")
    print("="*80)

if __name__ == "__main__":
    asyncio.run(main())
