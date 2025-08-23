try:
    import openai
except Exception:
    openai = None
from typing import Dict, List, Any, Optional
import json
import logging
from datetime import datetime, timedelta
import httpx
import asyncio
import importlib

logger = logging.getLogger(__name__)
try:
    from .finbert_service import FinBertService
except Exception:  # fallback if relative import changes
    FinBertService = None

from ..config import settings

class AIAdvisorService:
    """AI-powered financial advisor using LLM for conversational assistance"""

    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-3.5-turbo"):
        # Check if AI advisor is enabled
        self.enabled = settings.enable_ai_advisor
        
        # Resolve provider from settings; allow explicit override via api_key for OpenAI
        self.provider = (settings.llm_provider or "openai").lower()
        self.model = model
        self.client = None
        # Choose Gemini model (default from settings)
        self.gemini_model_name = (settings.gemini_model or "gemini-1.5-flash").strip()
        self.api_key = api_key or settings.openai_api_key

        if self.provider == "openai" and self.api_key and openai is not None:
            openai.api_key = self.api_key
            try:
                self.client = openai.OpenAI(api_key=self.api_key)
            except Exception as e:
                logger.warning("Failed to initialize OpenAI client: %s", e)
                self.client = None

        # System prompt for guidance
        self.system_prompt = (
            """
You are FinVoice, an AI-powered financial advisor assistant specializing in:

1. Invoice and transaction analysis
2. Cash flow forecasting and budgeting
3. Expense categorization and optimization
4. Tax planning and GST compliance
5. Financial anomaly detection and fraud prevention
6. Investment and retirement planning guidance
7. Business financial health assessment

Guidelines:
- Provide actionable, specific financial advice
- Reference relevant data when available
- Ask clarifying questions when needed
- Always consider Indian financial regulations and GST compliance
- Be conservative with investment advice
- Prioritize financial security and compliance
- Use simple, clear language
- Include relevant calculations when helpful

Format responses with:
- Clear recommendations
- Supporting reasoning
- Next steps or actions
- Relevant warnings or considerations
"""
        )

        # Optional FinBERT sentiment
        self.finbert = FinBertService() if FinBertService else None
    
    async def get_financial_advice(self, 
                                  user_message: str,
                                  user_context: Dict[str, Any] = None,
                                  conversation_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """Generate AI-powered financial advice with integrated FinBERT sentiment and enhanced NLP."""
        
        try:
            # Prepare context information
            context_info = self._prepare_context(user_context)
            
            # Enhanced NLP preprocessing for user text
            processed_message = self._preprocess_text(user_message)
            
            # Get FinBERT sentiment analysis early
            finbert_sentiment = None
            try:
                if self.finbert and self.finbert.available():
                    finbert_sentiment = self.finbert.analyze(user_message)
            except Exception as e:
                logger.warning("FinBERT sentiment failed: %s", e)
            
            # Build conversation messages
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add context if available
            if context_info:
                context_message = f"User's Financial Context:\n{context_info}\n\nPlease consider this information in your response."
                messages.append({"role": "system", "content": context_message})
            
            # Add FinBERT sentiment as system guidance if available
            if finbert_sentiment:
                sentiment_label = finbert_sentiment.get("label", "neutral")
                sentiment_score = finbert_sentiment.get("score", 0.5)
                sentiment_guidance = f"""
The user's message has a {sentiment_label} financial sentiment (confidence: {sentiment_score:.2f}).

Guidelines based on sentiment:
- {'Address concerns and provide reassurance' if sentiment_label == 'negative' else ''}
- {'Acknowledge positive outlook while remaining balanced' if sentiment_label == 'positive' else ''}
- {'Provide objective and factual information' if sentiment_label == 'neutral' else ''}

Tailor your response accordingly while providing accurate financial advice.
"""
                messages.append({"role": "system", "content": sentiment_guidance})
            
            # Add conversation history
            if conversation_history:
                messages.extend(conversation_history[-10:])  # Last 10 messages
            
            # Add current user message
            messages.append({"role": "user", "content": processed_message})
            
            # Generate response based on provider
            if self.provider == "openai" and self.client:
                response = await self._call_openai_api(messages)
            elif self.provider == "gemini" and settings.gemini_api_key:
                response = await self._call_gemini_api(messages)
            else:
                # Fallback to rule-based responses
                response = self._generate_fallback_response(user_message, user_context)
            
            # Post-process the AI response with finbert insights
            enhanced_response = self._integrate_finbert_with_response(response, finbert_sentiment)
            
            # Generate suggestions based on the response and sentiment
            suggestions = self._generate_suggestions(user_message, user_context, finbert_sentiment)
            
            # Get relevant data
            relevant_data = self._get_relevant_data(user_message, user_context) or {}
            
            # Add FinBERT sentiment to relevant data
            if finbert_sentiment:
                relevant_data["sentiment"] = finbert_sentiment
            
            return {
                "reply": enhanced_response,
                "suggestions": suggestions,
                "relevant_data": relevant_data or None,
                "confidence": 0.95 if (self.client or settings.gemini_api_key) else 0.6
            }
            
        except Exception as e:
            logger.error(f"Error generating financial advice: {e}")
            return {
                "reply": "I apologize, but I'm experiencing technical difficulties. Please try again or contact support.",
                "suggestions": ["Try rephrasing your question", "Check your internet connection"],
                "relevant_data": None,
                "confidence": 0.0
            }
    
    async def _call_openai_api(self, messages: List[Dict[str, str]]) -> str:
        """Call OpenAI Chat Completions API."""
        if openai is None or self.client is None:
            raise RuntimeError("OpenAI not configured")
        try:
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,
                messages=messages,
                max_tokens=1000,
                temperature=0.7,
                top_p=0.9,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise
    
    def _prepare_context(self, user_context: Optional[Dict[str, Any]]) -> str:
        """Prepare user context for the AI model"""
        if not user_context:
            return ""
        
        context_parts = []
        
        # User profile
        if user_context.get('user_info'):
            user_info = user_context['user_info']
            context_parts.append(f"User: {user_info.get('business_name', 'Individual')}")
            if user_info.get('gstin'):
                context_parts.append(f"GST Number: {user_info['gstin']}")
        
        # Financial summary
        if user_context.get('financial_summary'):
            summary = user_context['financial_summary']
            context_parts.append(f"Monthly Revenue: ₹{summary.get('monthly_revenue', 0):,.0f}")
            context_parts.append(f"Monthly Expenses: ₹{summary.get('monthly_expenses', 0):,.0f}")
            context_parts.append(f"Cash Flow: ₹{summary.get('cash_flow', 0):,.0f}")
            context_parts.append(f"Pending Payments: ₹{summary.get('pending_payments', 0):,.0f}")
        
        # Recent transactions
        if user_context.get('recent_transactions'):
            transactions = user_context['recent_transactions'][:5]  # Last 5 transactions
            context_parts.append(f"Recent Transactions: {len(transactions)} transactions")
            for txn in transactions:
                context_parts.append(f"  - {txn.get('description', 'N/A')}: ₹{txn.get('amount', 0):,.0f}")
        
        # Anomalies or alerts
        if user_context.get('anomalies'):
            anomalies = user_context['anomalies']
            if anomalies:
                context_parts.append(f"Recent Anomalies: {len(anomalies)} detected")
        
        # Goals or preferences
        if user_context.get('goals'):
            goals = user_context['goals']
            context_parts.append(f"Financial Goals: {', '.join(goals)}")
        
        return "\n".join(context_parts)

    def _preprocess_text(self, text: str) -> str:
        """Enhanced NLP preprocessing using NLTK for better understanding."""
        if not text:
            return ""
        try:
            # Dynamically import NLTK to avoid dependency issues
            nltk_mod = importlib.import_module("nltk")
            
            # Ensure required NLTK resources are downloaded
            nltk_resources = ['punkt', 'wordnet', 'stopwords', 'averaged_perceptron_tagger']
            for resource in nltk_resources:
                try:
                    getattr(nltk_mod, "data").find(f'corpora/{resource}' if resource != 'averaged_perceptron_tagger' else f'taggers/{resource}')
                except Exception:
                    getattr(nltk_mod, "download")(resource, quiet=True)
            
            # Import NLTK modules
            tokenize_mod = importlib.import_module("nltk.tokenize")
            corpus_mod = importlib.import_module("nltk.corpus")
            stem_mod = importlib.import_module("nltk.stem")
            
            # Get required NLTK components
            word_tokenize = getattr(tokenize_mod, "word_tokenize")
            sent_tokenize = getattr(tokenize_mod, "sent_tokenize")
            stops = set(getattr(corpus_mod, "stopwords").words('english'))
            lemmatizer = getattr(stem_mod, "WordNetLemmatizer")()
            
            # Text preprocessing pipeline
            # 1. Lowercase and basic cleaning
            text = text.lower().strip()
            
            # 2. Sentence tokenization for context preservation
            sentences = sent_tokenize(text)
            
            # 3. Process each sentence to maintain context
            processed_sentences = []
            for sentence in sentences:
                # Tokenize words
                tokens = word_tokenize(sentence)
                
                # Remove punctuation and non-alphabetic tokens, but keep important financial symbols
                tokens = [t for t in tokens if t.isalpha() or t in ['$', '₹', '%', '+', '-']]
                
                # Remove stopwords but preserve financial terms
                financial_terms = {'investment', 'tax', 'budget', 'expense', 'income', 'debt', 
                                'credit', 'loan', 'interest', 'gst', 'finance', 'cash', 'flow', 
                                'profit', 'revenue', 'payment', 'invoice', 'money', 'market'}
                filtered_tokens = []
                for token in tokens:
                    # Keep if not a stopword or is a financial term
                    if token not in stops or token in financial_terms:
                        filtered_tokens.append(token)
                
                # Lemmatization for normalization
                lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]
                
                # Reconstruct sentence if it has content
                if lemmatized_tokens:
                    processed_sentences.append(' '.join(lemmatized_tokens))
            
            # Reconstruct text while preserving basic structure
            processed_text = ' '.join(processed_sentences)
            
            # If processing removed too much, fall back to original text
            if len(processed_text) < len(text) * 0.5:  # If we lost more than 50% of content
                return text
                
            return processed_text
        except Exception as e:
            logger.warning(f"NLTK preprocessing failed: {e}")
            return text

    async def _call_gemini_api(self, messages: List[Dict[str, str]]) -> str:
        """Enhanced Gemini API integration with structured context handling."""
        try:
            genai = importlib.import_module("google.generativeai")
        except Exception as e:
            raise RuntimeError("Gemini SDK not installed") from e
        
        if not settings.gemini_api_key:
            raise RuntimeError("Gemini API key not configured")
        
        # Configure Gemini
        genai.configure(api_key=settings.gemini_api_key)
        
        try:
            # Create a more structured prompt with clear role delineation
            system_messages = []
            user_messages = []
            assistant_messages = []
            
            # Categorize messages by role
            for msg in messages:
                role = msg.get("role", "user")
                content = msg.get("content", "")
                
                if role == "system":
                    system_messages.append(content)
                elif role == "user":
                    user_messages.append(content)
                elif role == "assistant":
                    assistant_messages.append(content)
            
            # Construct a structured prompt for Gemini
            prompt_parts = []
            
            # Add system context
            if system_messages:
                prompt_parts.append("# Financial Advisory System Context:\n" + "\n".join(system_messages))
            
            # Create conversation history
            if user_messages or assistant_messages:
                # Interleave user and assistant messages to create dialogue format
                conv_history = []
                # Skip the last user message as we'll add it separately
                for i in range(min(len(user_messages)-1, len(assistant_messages))):
                    conv_history.append(f"USER: {user_messages[i]}")
                    conv_history.append(f"ASSISTANT: {assistant_messages[i]}")
                
                # Add any remaining assistant messages
                if len(assistant_messages) > len(user_messages)-1:
                    for i in range(len(user_messages)-1, len(assistant_messages)):
                        conv_history.append(f"ASSISTANT: {assistant_messages[i]}")
                
                if conv_history:
                    prompt_parts.append("# Conversation History:\n" + "\n".join(conv_history))
            
            # Add current user query
            if user_messages:
                prompt_parts.append(f"# Current User Query:\n{user_messages[-1]}")
            
            # Add response instructions
            prompt_parts.append("""
# Response Guidelines:
1. Provide financially sound and accurate advice
2. Consider Indian tax and GST regulations
3. Use clear, concise language
4. Include specific recommendations
5. Consider the sentiment and tone of the user's query
6. Provide actionable next steps
7. Format your response in a structured manner
""")
            
            # Join all parts with clear separation
            prompt = "\n\n".join(prompt_parts)
            
            # Create Gemini model with enhanced settings for 1.5 Flash
            model = genai.GenerativeModel(
                model_name=self.gemini_model_name,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "top_k": 40,
                    "max_output_tokens": 1024,
                }
            )
            
            # Generate response
            resp = await asyncio.to_thread(model.generate_content, prompt)
            
            # Extract text
            text = getattr(resp, "text", None)
            if text:
                return text.strip()
            
            # Fallback extraction for complex responses
            if hasattr(resp, "candidates") and resp.candidates:
                for c in resp.candidates:
                    if c.content and c.content.parts:
                        for p in c.content.parts:
                            if getattr(p, "text", None):
                                return p.text.strip()
            
            return "I couldn't generate a response right now. Please try again."
        except Exception as e:
            logger.error("Gemini API error: %s", e)
            raise
    
    def _generate_fallback_response(self, user_message: str, user_context: Dict[str, Any] = None) -> str:
        """Generate rule-based response when AI is not available"""
        message_lower = user_message.lower()
        
        # Cash flow questions
        if any(word in message_lower for word in ['cash flow', 'cashflow', 'liquidity']):
            return self._cash_flow_advice(user_context)
        
        # Expense questions
        elif any(word in message_lower for word in ['expense', 'spending', 'cost']):
            return self._expense_advice(user_context)
        
        # Invoice questions
        elif any(word in message_lower for word in ['invoice', 'billing', 'payment']):
            return self._invoice_advice(user_context)
        
        # Tax questions
        elif any(word in message_lower for word in ['tax', 'gst', 'deduction']):
            return self._tax_advice(user_context)
        
        # Investment questions
        elif any(word in message_lower for word in ['invest', 'portfolio', 'returns']):
            return self._investment_advice(user_context)
        
        # Budget questions
        elif any(word in message_lower for word in ['budget', 'plan', 'forecast']):
            return self._budget_advice(user_context)
        
        # Default response
        else:
            return """I understand you're looking for financial guidance. I can help you with:
            
            • Cash flow analysis and optimization
            • Expense tracking and categorization
            • Invoice management and payment tracking
            • Tax planning and GST compliance
            • Budget planning and forecasting
            • Investment and savings strategies
            
            Could you please be more specific about what financial aspect you'd like to discuss?"""
    
    def _cash_flow_advice(self, user_context: Dict[str, Any] = None) -> str:
        """Generate cash flow advice"""
        if not user_context or not user_context.get('financial_summary'):
            return """For better cash flow management:
            
            1. Track your daily cash position
            2. Accelerate receivables collection
            3. Optimize payment terms with vendors
            4. Maintain a cash reserve for emergencies
            5. Use forecasting to anticipate shortfalls
            
            Consider setting up automated payment reminders and offering early payment discounts to customers."""
        
        summary = user_context['financial_summary']
        cash_flow = summary.get('cash_flow', 0)
        
        if cash_flow > 0:
            return f"""Your current cash flow is positive (₹{cash_flow:,.0f}). Recommendations:
            
            1. Build an emergency fund (3-6 months expenses)
            2. Consider investing surplus funds
            3. Optimize tax-saving investments
            4. Review and negotiate better terms with vendors
            5. Plan for future growth investments
            
            This positive trend shows good financial health."""
        else:
            return f"""Your current cash flow is negative (₹{cash_flow:,.0f}). Immediate actions:
            
            1. Review and reduce non-essential expenses
            2. Accelerate collection of outstanding invoices
            3. Negotiate extended payment terms with suppliers
            4. Consider invoice factoring for immediate cash
            5. Review pricing strategy for better margins
            
            Focus on converting this to positive cash flow within 30-60 days."""
    
    def _expense_advice(self, user_context: Dict[str, Any] = None) -> str:
        """Generate expense management advice"""
        return """Effective expense management strategies:
        
        1. **Categorize expenses** - Separate business and personal expenses
        2. **Track regularly** - Use expense tracking tools and receipt management
        3. **Set budgets** - Create monthly/quarterly expense budgets by category
        4. **Review subscriptions** - Cancel unused services and negotiate better rates
        5. **Tax optimization** - Ensure all business expenses are properly documented
        
        **Quick wins:**
        • Automate recurring payment tracking
        • Use business credit cards for better tracking
        • Negotiate annual contracts for better rates
        • Review and optimize travel/entertainment expenses"""
    
    def _invoice_advice(self, user_context: Dict[str, Any] = None) -> str:
        """Generate invoice management advice"""
        return """Invoice management best practices:
        
        1. **Clear payment terms** - Set 15-30 day payment terms
        2. **Professional invoicing** - Use consistent, detailed invoice templates
        3. **Follow up promptly** - Send reminders before and after due dates
        4. **Offer incentives** - Consider early payment discounts (2-3%)
        5. **GST compliance** - Ensure all invoices meet GST requirements
        
        **Automation tips:**
        • Set up recurring invoices for regular clients
        • Use invoice factoring for immediate cash flow
        • Implement online payment options
        • Track payment patterns to identify reliable customers"""
    
    def _tax_advice(self, user_context: Dict[str, Any] = None) -> str:
        """Generate tax planning advice"""
        return """Tax planning and GST compliance:
        
        1. **GST Registration** - Ensure timely registration and compliance
        2. **Record keeping** - Maintain detailed records for all transactions
        3. **Input tax credit** - Maximize ITC claims on business expenses
        4. **Quarterly planning** - Review tax obligations quarterly
        5. **Professional help** - Consult CA for complex situations
        
        **Key deadlines:**
        • GSTR-1: 11th of following month
        • GSTR-3B: 20th of following month
        • Annual return: December 31st
        
        **Tax-saving opportunities:**
        • Business equipment purchases
        • Professional development expenses
        • Insurance premiums
        • Retirement savings (80C, NPS)"""
    
    def _investment_advice(self, user_context: Dict[str, Any] = None) -> str:
        """Generate investment advice"""
        return """Investment planning guidelines:
        
        1. **Emergency fund first** - 6 months of expenses in liquid funds
        2. **Diversification** - Spread investments across asset classes
        3. **Risk assessment** - Align investments with risk tolerance
        4. **Tax efficiency** - Use tax-saving instruments (ELSS, PPF, NPS)
        5. **Regular review** - Rebalance portfolio annually
        
        **Conservative approach:**
        • 60% debt instruments (FDs, bonds, debt funds)
        • 30% equity (mutual funds, diversified portfolio)
        • 10% alternative investments (REITs, gold)
        
        **Important:** This is general guidance. Consult a certified financial planner for personalized advice."""
    
    def _budget_advice(self, user_context: Dict[str, Any] = None) -> str:
        """Generate budgeting advice"""
        return """Budget planning framework:
        
        1. **50/30/20 rule** - 50% needs, 30% wants, 20% savings
        2. **Monthly tracking** - Compare actual vs. budgeted amounts
        3. **Seasonal adjustments** - Account for business seasonality
        4. **Growth planning** - Budget for business expansion
        5. **Contingency fund** - Reserve 10-15% for unexpected expenses
        
        **Business budgeting:**
        • Track revenue trends and seasonality
        • Plan for tax payments and compliance costs
        • Budget for equipment replacement and upgrades
        • Include marketing and business development costs
        
        Review and adjust budgets quarterly based on performance."""
    
    def _generate_suggestions(self, user_message: str, user_context: Dict[str, Any] = None, 
                           sentiment_data: Dict[str, Any] = None) -> List[str]:
        """Generate follow-up suggestions with sentiment awareness"""
        message_lower = user_message.lower()
        suggestions = []
        
        # Base suggestions based on message content
        if 'cash flow' in message_lower:
            suggestions = [
                "Show me my cash flow forecast",
                "How can I improve collections?",
                "What are my biggest cash drains?"
            ]
        elif 'expense' in message_lower:
            suggestions = [
                "Analyze my expense categories",
                "Find ways to reduce costs",
                "Track business vs personal expenses"
            ]
        elif 'tax' in message_lower:
            suggestions = [
                "Review my GST compliance",
                "Find tax-saving opportunities",
                "Calculate quarterly tax obligations"
            ]
        elif 'invest' in message_lower:
            suggestions = [
                "Create an investment plan",
                "Review my risk tolerance",
                "Compare investment options"
            ]
        else:
            suggestions = [
                "Analyze my financial health",
                "Create a budget plan",
                "Review upcoming payments",
                "Check for anomalies"
            ]
        
        # Add sentiment-based suggestions if available
        if sentiment_data:
            sentiment = sentiment_data.get("label", "neutral")
            if sentiment == "negative":
                suggestions.append("How can I improve my financial situation?")
            elif sentiment == "positive":
                suggestions.append("How can I capitalize on this opportunity?")
        
        # Add context-based suggestions
        if user_context:
            if user_context.get('anomalies'):
                suggestions.append("Explain the recent financial anomalies")
            if user_context.get('financial_summary', {}).get('cash_flow', 0) < 0:
                suggestions.append("How can I improve my cash flow?")
        
        # Return top 4 suggestions max
        return suggestions[:4]
    
    def _integrate_finbert_with_response(self, response: str, sentiment_data: Dict[str, Any] = None) -> str:
        """Enhance AI response with FinBERT sentiment insights."""
        if not sentiment_data:
            return response
            
        sentiment = sentiment_data.get("label", "neutral")
        score = sentiment_data.get("score", 0.0)
        
        # Only add sentiment insights if high confidence (>0.7)
        if score < 0.7:
            return response
            
        # Prepare sentiment-specific insights
        sentiment_insight = ""
        if sentiment == "positive":
            sentiment_insight = (
                "\n\n**Sentiment Analysis:** Your message shows a positive financial outlook. "
                "While this optimism is good, I still recommend maintaining prudent financial practices "
                "and considering potential risks alongside opportunities."
            )
        elif sentiment == "negative":
            sentiment_insight = (
                "\n\n**Sentiment Analysis:** I notice some concerns in your message. "
                "While it's important to address these concerns, remember that financial challenges "
                "are often temporary and can be overcome with proper planning and execution."
            )
        elif sentiment == "neutral" and score > 0.85:
            sentiment_insight = (
                "\n\n**Sentiment Analysis:** Your approach appears balanced and objective, "
                "which is ideal for making sound financial decisions."
            )
            
        # Add sentiment insight to response if meaningful
        if sentiment_insight:
            return response + sentiment_insight
            
        return response
    
    def _get_relevant_data(self, user_message: str, user_context: Dict[str, Any] = None) -> Optional[Dict[str, Any]]:
        """Get relevant data based on the user's question"""
        if not user_context:
            return None
        
        message_lower = user_message.lower()
        relevant_data = {}
        
        if 'cash flow' in message_lower and user_context.get('financial_summary'):
            relevant_data['cash_flow'] = user_context['financial_summary'].get('cash_flow')
            relevant_data['monthly_revenue'] = user_context['financial_summary'].get('monthly_revenue')
            relevant_data['monthly_expenses'] = user_context['financial_summary'].get('monthly_expenses')
        
        if 'expense' in message_lower and user_context.get('expense_breakdown'):
            relevant_data['expense_breakdown'] = user_context['expense_breakdown']
        
        if 'payment' in message_lower and user_context.get('upcoming_payments'):
            relevant_data['upcoming_payments'] = user_context['upcoming_payments']
        
        if 'anomal' in message_lower and user_context.get('anomalies'):
            relevant_data['anomalies'] = user_context['anomalies']
        
        return relevant_data if relevant_data else None
    
    def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """Simple sentiment analysis; prefers FinBERT if available."""
        if self.finbert and self.finbert.available():
            fb = self.finbert.analyze(text)
            if fb:
                return {
                    'sentiment': fb.get('label', 'neutral'),
                    'score': fb.get('score', 0.5),
                    'confidence': fb.get('score', 0.5)
                }
        
        positive_words = ['profit', 'growth', 'increase', 'good', 'positive', 'gain', 'up']
        negative_words = ['loss', 'decline', 'decrease', 'bad', 'negative', 'down', 'debt']
        
        text_lower = text.lower()
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            sentiment = 'positive'
            score = 0.6 + (positive_count - negative_count) * 0.1
        elif negative_count > positive_count:
            sentiment = 'negative'
            score = 0.4 - (negative_count - positive_count) * 0.1
        else:
            sentiment = 'neutral'
            score = 0.5
        
        return {
            'sentiment': sentiment,
            'score': max(0.0, min(1.0, score)),
            'confidence': 0.7
        }
