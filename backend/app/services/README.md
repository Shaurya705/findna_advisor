# Enhanced AI Financial Advisor

This implementation integrates three powerful technologies to create a more robust financial advisory system:

1. **NLTK (Natural Language Toolkit)** - For enhanced text preprocessing and understanding
2. **Google Gemini 1.5 Flash** - For advanced language model capabilities
3. **FinBERT** - For financial sentiment analysis and domain-specific understanding

## Architecture

The system's architecture combines these technologies in the following way:

1. User input is first processed using NLTK to improve text quality and extract key financial concepts
2. FinBERT analyzes the financial sentiment of the message (positive/neutral/negative)
3. The enhanced message and sentiment context are sent to Google Gemini 1.5 Flash
4. Gemini generates a response with awareness of the sentiment context
5. The response is further enhanced with FinBERT insights for a more comprehensive answer

## Key Features

### Enhanced NLP Preprocessing

- Sentence tokenization for context preservation
- Lemmatization for word normalization
- Stopword removal with preservation of financial terms
- Part-of-speech awareness

### FinBERT Integration

- Financial sentiment analysis (positive/neutral/negative)
- Financial term identification and categorization
- Sentiment-specific recommendations
- Confidence scoring for reliability assessment

### Gemini 1.5 Flash Implementation

- Structured prompt engineering for better context handling
- Role-based message formatting
- Financial domain-specific instructions
- Temperature and top-p settings optimized for financial advice

### Voice Interface Improvements

- Enhanced Text-to-Speech with voice selection and quality settings
- Improved Speech Recognition with better error handling and interim results
- Multi-language support (English and Hindi)
- Better transcription accuracy with multiple alternatives

## Setup

1. Add the provided Gemini API key to the `.env` file:
   ```
   GEMINI_API_KEY=AIzaSyBItZW4da1WdKbHY2Ztsi8iufi7z5lTwuM
   LLM_PROVIDER=gemini
   GEMINI_MODEL=gemini-1.5-flash
   ```

2. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. The system will automatically download required NLTK resources on first use

## Testing the Integration

Run the test script to see how the integrated NLTK+Gemini+FinBERT system works:

```bash
python -m app.tests.test_gemini_integration
```

This will:
1. Analyze a financial query with FinBERT
2. Generate a comprehensive response using all three technologies
3. Display the results, including sentiment analysis and suggestions

## Using the Enhanced Advisor

The AI advisor now provides more nuanced financial advice by combining:

- Linguistic understanding (NLTK)
- Financial sentiment (FinBERT)
- Advanced reasoning (Gemini)

This creates more comprehensive responses that include:
- Core financial advice
- Sentiment-aware recommendations
- Financial term analysis
- Voice interaction capabilities

## Technical Details

The main integration happens in `ai_advisor.py` where:
1. `_preprocess_text()` - Uses NLTK for enhanced text understanding
2. `_call_gemini_api()` - Structures prompts for Gemini with sentiment context
3. `_integrate_finbert_with_response()` - Enhances Gemini responses with FinBERT insights
4. `get_financial_advice()` - Orchestrates the entire process

The voice interfaces in `ai-advisor-chat-interface/index.jsx` have been improved for better speech recognition and text-to-speech capabilities.
