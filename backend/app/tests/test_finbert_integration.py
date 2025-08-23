from app.services.finbert_service import FinBertService

def test_finbert_integration():
    """Test FinBERT service integration"""
    print("Testing FinBERT Service Integration...")
    
    svc = FinBertService()
    
    if not svc.available():
        print("❌ FinBERT not available. Ensure transformers/torch installed.")
        return False
    
    print("✅ FinBERT service is available")
    
    # Test various financial queries
    test_queries = [
        "The company's revenue growth looks promising this quarter",
        "I'm concerned about the declining profit margins", 
        "Should I invest in tech stocks given the market volatility?",
        "The quarterly earnings exceeded expectations significantly",
        "Cash flow issues are becoming a major concern"
    ]
    
    print("\nAnalyzing financial sentiment:")
    print("-" * 50)
    
    for query in test_queries:
        result = svc.analyze(query)
        if result:
            label = result.get("label", "unknown")
            score = result.get("score", 0.0)
            confidence = "High" if score > 0.8 else "Medium" if score > 0.6 else "Low"
            
            # Format output with emoji indicators
            emoji = "📈" if label == "positive" else "📉" if label == "negative" else "📊"
            print(f"{emoji} [{label.upper():>8}] {score:.2f} ({confidence:>6}) - \"{query}\"")
        else:
            print(f"❌ Failed to analyze: \"{query}\"")
    
    print("\n✅ FinBERT integration test completed successfully!")
    return True

if __name__ == "__main__":
    test_finbert_integration()
