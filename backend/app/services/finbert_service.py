import logging
from typing import Optional, Dict, List, Tuple
import re

try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    import torch
except Exception:  # transformers/torch may not be installed in some envs
    AutoTokenizer = None
    AutoModelForSequenceClassification = None
    torch = None

logger = logging.getLogger(__name__)


class FinBertService:
    """Wrapper around a FinBERT sentiment model for financial text with enhanced analysis."""

    def __init__(self, model_name: str = "ProsusAI/finbert"):
        self.model_name = model_name
        self._tokenizer = None
        self._model = None
        self._ready = False
        # Financial term categories for analysis
        self.financial_categories = {
            'positive_terms': {'growth', 'profit', 'increase', 'gain', 'improved', 'opportunity', 'success', 
                               'return', 'dividend', 'revenue', 'earnings', 'upside', 'benefit', 'advantage'},
            'negative_terms': {'decline', 'loss', 'decrease', 'debt', 'risk', 'liability', 'expense', 'cost', 
                               'downside', 'fall', 'fail', 'recession', 'default', 'bankruptcy'},
            'neutral_terms': {'market', 'investment', 'tax', 'portfolio', 'asset', 'equity', 'stock', 
                              'fund', 'index', 'account', 'budget', 'plan', 'strategy'}
        }

    def _ensure_loaded(self) -> bool:
        if self._ready:
            return True
        try:
            if AutoTokenizer is None or AutoModelForSequenceClassification is None:
                logger.warning("Transformers/torch not available; FinBERT disabled")
                return False
            self._tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self._model = AutoModelForSequenceClassification.from_pretrained(self.model_name)
            self._model.eval()
            self._ready = True
            logger.info("FinBERT model loaded: %s", self.model_name)
            return True
        except Exception as e:
            logger.error("Failed to load FinBERT model: %s", e)
            self._ready = False
            return False

    def available(self) -> bool:
        return self._ensure_loaded()

    @torch.inference_mode() if torch else (lambda f: f)
    def analyze(self, text: str) -> Optional[Dict[str, float]]:
        """Return enhanced sentiment analysis for financial text.

        Output: {
            label: str,              # Main sentiment (positive/neutral/negative)
            score: float,            # Confidence score for the label
            logits: List[float],     # Raw model outputs
            key_terms: Dict,         # Identified financial terms by category
            recommendations: List     # Basic recommendations based on sentiment
        }
        """
        if not text or not self._ensure_loaded():
            return None
        try:
            # Standard FinBERT sentiment analysis
            inputs = self._tokenizer(text, return_tensors="pt", truncation=True, max_length=256)
            outputs = self._model(**inputs)
            logits = outputs.logits[0]
            probs = torch.softmax(logits, dim=-1).tolist()
            label_id = int(torch.argmax(logits).item())
            # Common FinBERT label order: [negative, neutral, positive]
            labels = ["negative", "neutral", "positive"]
            label = labels[label_id] if label_id < len(labels) else str(label_id)
            score = probs[label_id]
            
            # Enhanced analysis with term identification
            key_terms = self._identify_financial_terms(text)
            
            # Generate basic recommendations based on sentiment
            recommendations = self._generate_financial_recommendations(label, key_terms)
            
            # Enhanced sentiment output
            return {
                "label": label, 
                "score": float(score), 
                "logits": probs,
                "key_terms": key_terms,
                "recommendations": recommendations
            }
        except Exception as e:
            logger.error("FinBERT analysis failed: %s", e)
            return None
    
    def _identify_financial_terms(self, text: str) -> Dict[str, List[str]]:
        """Identify financial terms in text by category."""
        text_lower = text.lower()
        
        # Extract words using regex for better term identification
        words = re.findall(r'\b\w+\b', text_lower)
        
        # Categorize words
        found_terms = {
            'positive': [],
            'negative': [],
            'neutral': []
        }
        
        for word in words:
            if word in self.financial_categories['positive_terms']:
                found_terms['positive'].append(word)
            elif word in self.financial_categories['negative_terms']:
                found_terms['negative'].append(word)
            elif word in self.financial_categories['neutral_terms']:
                found_terms['neutral'].append(word)
        
        # De-duplicate terms
        for category in found_terms:
            found_terms[category] = list(set(found_terms[category]))
        
        return found_terms
    
    def _generate_financial_recommendations(self, sentiment: str, 
                                           terms: Dict[str, List[str]]) -> List[str]:
        """Generate basic financial recommendations based on sentiment analysis."""
        recommendations = []
        
        # General recommendations based on sentiment
        if sentiment == "positive":
            recommendations.append("Consider reviewing investment opportunities to capitalize on positive trends")
            recommendations.append("Maintain prudent financial practices despite positive outlook")
        elif sentiment == "negative":
            recommendations.append("Consider risk mitigation strategies for identified concerns")
            recommendations.append("Review budget and expense categories for potential optimizations")
        else:  # neutral
            recommendations.append("Continue balanced financial planning with objective analysis")
        
        # Term-specific recommendations
        if terms['negative'] and len(terms['negative']) > len(terms['positive']):
            recommendations.append("Address specific concerns about: " + ", ".join(terms['negative']))
        
        if 'debt' in terms['negative'] or 'expense' in terms['negative'] or 'cost' in terms['negative']:
            recommendations.append("Review expense categories and debt obligations for optimization")
        
        if 'growth' in terms['positive'] or 'opportunity' in terms['positive']:
            recommendations.append("Evaluate growth opportunities while maintaining risk management")
        
        # Limit to 3 recommendations
        return recommendations[:3]
