from app.services.ai_advisor import AIAdvisorService
from app.services.finbert_service import FinBertService
import asyncio

async def test_combined_advisor():
    """Test the integration of NLTK + Gemini + FinBERT"""
    
    # Test prompts with different sentiments
    prompts = [
        "Will rate cuts boost equity markets in the near term?",
        "I'm worried about declining revenue this quarter.",
        "Our margins improved and the new product is doing well."
    ]
    
    # Initialize the services
    advisor = AIAdvisorService()
    finbert = FinBertService()
    
    print("Testing Combined AI Advisor (NLTK + Gemini + FinBERT)\n")
    print("=" * 80)
    
    for prompt in prompts:
        print(f"\nUser Query: {prompt}")
        print("-" * 80)
        
        # 1. First test FinBERT directly
        if finbert.available():
            sentiment = finbert.analyze(prompt)
            if sentiment:
                print(f"FinBERT Sentiment: {sentiment['label']} (Score: {sentiment['score']:.2f})")
                if 'key_terms' in sentiment:
                    print("Key Financial Terms:")
                    for category, terms in sentiment['key_terms'].items():
                        if terms:
                            print(f"  {category.capitalize()}: {', '.join(terms)}")
                if 'recommendations' in sentiment:
                    print("FinBERT Recommendations:")
                    for rec in sentiment['recommendations']:
                        print(f"  - {rec}")
            else:
                print("FinBERT analysis not available")
        else:
            print("FinBERT not available")
        
        print("-" * 80)
        
        # 2. Test combined advisor
        advice = await advisor.get_financial_advice(prompt)
        print(f"Combined AI Response:")
        print(f"{advice['reply']}\n")
        print(f"Confidence: {advice['confidence']}")
        
        if advice.get('suggestions'):
            print("\nSuggestions:")
            for suggestion in advice['suggestions']:
                print(f"  - {suggestion}")
        
        if advice.get('relevant_data'):
            print("\nRelevant Data:", advice['relevant_data'])
        
        print("=" * 80)

if __name__ == "__main__":
    asyncio.run(test_combined_advisor())
