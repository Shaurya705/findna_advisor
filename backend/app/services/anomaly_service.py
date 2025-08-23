import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import DBSCAN
from typing import Dict, List, Any, Tuple
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class AnomalyDetectionService:
    """AI-powered anomaly detection for financial transactions and invoices"""
    
    def __init__(self):
        self.transaction_model = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=100
        )
        self.invoice_model = IsolationForest(
            contamination=0.05,
            random_state=42,
            n_estimators=100
        )
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def prepare_transaction_features(self, transactions: List[Dict[str, Any]]) -> np.ndarray:
        """Prepare features for transaction anomaly detection"""
        features = []
        
        for txn in transactions:
            feature_vector = [
                txn.get('amount', 0),
                self._get_hour_of_day(txn.get('date')),
                self._get_day_of_week(txn.get('date')),
                self._encode_category(txn.get('category', '')),
                self._encode_payment_method(txn.get('payment_method', '')),
                len(txn.get('description', '')),
                1 if txn.get('type') == 'expense' else 0,
                self._get_merchant_frequency(txn.get('merchant_name', ''), transactions)
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def prepare_invoice_features(self, invoices: List[Dict[str, Any]]) -> np.ndarray:
        """Prepare features for invoice anomaly detection"""
        features = []
        
        for inv in invoices:
            feature_vector = [
                inv.get('total_amount', 0),
                inv.get('tax_amount', 0),
                self._get_days_between_dates(inv.get('invoice_date'), inv.get('due_date')),
                len(inv.get('line_items', [])),
                self._encode_vendor(inv.get('vendor', {})),
                self._get_invoice_complexity_score(inv),
                1 if inv.get('gst_details') else 0,
                self._get_vendor_frequency(inv.get('vendor', {}), invoices)
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def train_models(self, transactions: List[Dict[str, Any]], invoices: List[Dict[str, Any]]):
        """Train anomaly detection models"""
        try:
            # Train transaction model
            if transactions:
                txn_features = self.prepare_transaction_features(transactions)
                if len(txn_features) > 10:  # Minimum samples required
                    txn_features_scaled = self.scaler.fit_transform(txn_features)
                    self.transaction_model.fit(txn_features_scaled)
            
            # Train invoice model
            if invoices:
                inv_features = self.prepare_invoice_features(invoices)
                if len(inv_features) > 10:
                    inv_features_scaled = self.scaler.fit_transform(inv_features)
                    self.invoice_model.fit(inv_features_scaled)
            
            self.is_trained = True
            logger.info("Anomaly detection models trained successfully")
            
        except Exception as e:
            logger.error(f"Error training anomaly detection models: {e}")
            raise
    
    def detect_transaction_anomalies(self, transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Detect anomalies in transactions"""
        if not self.is_trained or not transactions:
            return []
        
        try:
            features = self.prepare_transaction_features(transactions)
            features_scaled = self.scaler.transform(features)
            
            # Get anomaly scores
            anomaly_scores = self.transaction_model.decision_function(features_scaled)
            anomaly_labels = self.transaction_model.predict(features_scaled)
            
            anomalies = []
            for i, (txn, score, label) in enumerate(zip(transactions, anomaly_scores, anomaly_labels)):
                if label == -1:  # Anomaly detected
                    anomaly_reason = self._explain_transaction_anomaly(txn, transactions)
                    anomalies.append({
                        'id': txn.get('id'),
                        'type': 'transaction',
                        'score': float(abs(score)),
                        'reason': anomaly_reason,
                        'data': txn,
                        'timestamp': datetime.utcnow()
                    })
            
            return anomalies
            
        except Exception as e:
            logger.error(f"Error detecting transaction anomalies: {e}")
            return []
    
    def detect_invoice_anomalies(self, invoices: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Detect anomalies in invoices"""
        if not self.is_trained or not invoices:
            return []
        
        try:
            features = self.prepare_invoice_features(invoices)
            features_scaled = self.scaler.transform(features)
            
            # Get anomaly scores
            anomaly_scores = self.invoice_model.decision_function(features_scaled)
            anomaly_labels = self.invoice_model.predict(features_scaled)
            
            anomalies = []
            for i, (inv, score, label) in enumerate(zip(invoices, anomaly_scores, anomaly_labels)):
                if label == -1:  # Anomaly detected
                    anomaly_reason = self._explain_invoice_anomaly(inv, invoices)
                    anomalies.append({
                        'id': inv.get('id'),
                        'type': 'invoice',
                        'score': float(abs(score)),
                        'reason': anomaly_reason,
                        'data': inv,
                        'timestamp': datetime.utcnow()
                    })
            
            return anomalies
            
        except Exception as e:
            logger.error(f"Error detecting invoice anomalies: {e}")
            return []
    
    def detect_fraud_patterns(self, transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Detect potential fraud patterns using rule-based approach"""
        fraud_alerts = []
        
        try:
            # Convert to DataFrame for easier analysis
            df = pd.DataFrame(transactions)
            if df.empty:
                return fraud_alerts
            
            # Rule 1: Multiple transactions at unusual hours
            unusual_hour_txns = df[df['date'].apply(self._get_hour_of_day).isin([0, 1, 2, 3, 4, 5])]
            if len(unusual_hour_txns) > 3:
                fraud_alerts.append({
                    'type': 'unusual_timing',
                    'severity': 'medium',
                    'description': f'Multiple transactions ({len(unusual_hour_txns)}) at unusual hours',
                    'transactions': unusual_hour_txns.to_dict('records')
                })
            
            # Rule 2: Rapid sequence of transactions
            df['timestamp'] = pd.to_datetime(df['date'])
            df_sorted = df.sort_values('timestamp')
            time_diffs = df_sorted['timestamp'].diff().dt.total_seconds()
            rapid_txns = df_sorted[time_diffs < 60]  # Within 1 minute
            
            if len(rapid_txns) > 2:
                fraud_alerts.append({
                    'type': 'rapid_transactions',
                    'severity': 'high',
                    'description': f'Rapid sequence of {len(rapid_txns)} transactions',
                    'transactions': rapid_txns.to_dict('records')
                })
            
            # Rule 3: Round number amounts (potential money laundering)
            round_amounts = df[df['amount'] % 1000 == 0]
            if len(round_amounts) > 5:
                fraud_alerts.append({
                    'type': 'round_amounts',
                    'severity': 'low',
                    'description': f'Multiple round amount transactions ({len(round_amounts)})',
                    'transactions': round_amounts.to_dict('records')
                })
            
            # Rule 4: Duplicate transactions
            duplicates = df[df.duplicated(subset=['amount', 'merchant_name'], keep=False)]
            if len(duplicates) > 0:
                fraud_alerts.append({
                    'type': 'duplicate_transactions',
                    'severity': 'medium',
                    'description': f'Found {len(duplicates)} potential duplicate transactions',
                    'transactions': duplicates.to_dict('records')
                })
            
            return fraud_alerts
            
        except Exception as e:
            logger.error(f"Error detecting fraud patterns: {e}")
            return []
    
    def _get_hour_of_day(self, date_str: str) -> int:
        """Extract hour of day from date string"""
        try:
            if isinstance(date_str, str):
                dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            elif isinstance(date_str, datetime):
                dt = date_str
            else:
                return 12  # Default to noon
            return dt.hour
        except:
            return 12
    
    def _get_day_of_week(self, date_str: str) -> int:
        """Extract day of week from date string"""
        try:
            if isinstance(date_str, str):
                dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
            elif isinstance(date_str, datetime):
                dt = date_str
            else:
                return 1  # Default to Monday
            return dt.weekday()
        except:
            return 1
    
    def _encode_category(self, category: str) -> int:
        """Encode transaction category as integer"""
        categories = {
            'food': 1, 'transport': 2, 'shopping': 3, 'bills': 4,
            'entertainment': 5, 'healthcare': 6, 'investment': 7,
            'transfer': 8, 'other': 9
        }
        return categories.get(category.lower(), 9)
    
    def _encode_payment_method(self, method: str) -> int:
        """Encode payment method as integer"""
        methods = {
            'card': 1, 'upi': 2, 'netbanking': 3, 'cash': 4,
            'wallet': 5, 'cheque': 6, 'other': 7
        }
        return methods.get(method.lower(), 7)
    
    def _get_merchant_frequency(self, merchant: str, transactions: List[Dict]) -> int:
        """Get frequency of transactions with this merchant"""
        if not merchant:
            return 0
        return sum(1 for txn in transactions if txn.get('merchant_name', '').lower() == merchant.lower())
    
    def _get_vendor_frequency(self, vendor: Dict, invoices: List[Dict]) -> int:
        """Get frequency of invoices from this vendor"""
        vendor_name = vendor.get('name', '') if isinstance(vendor, dict) else str(vendor)
        if not vendor_name:
            return 0
        return sum(1 for inv in invoices if str(inv.get('vendor', '')).lower() == vendor_name.lower())
    
    def _get_days_between_dates(self, start_date: str, end_date: str) -> int:
        """Calculate days between two dates"""
        try:
            if not start_date or not end_date:
                return 30  # Default
            
            start = datetime.fromisoformat(str(start_date).replace('Z', '+00:00'))
            end = datetime.fromisoformat(str(end_date).replace('Z', '+00:00'))
            return (end - start).days
        except:
            return 30
    
    def _encode_vendor(self, vendor: Dict) -> int:
        """Encode vendor information as integer"""
        if not vendor or not isinstance(vendor, dict):
            return 0
        
        score = 0
        if vendor.get('gstin'):
            score += 2
        if vendor.get('is_verified'):
            score += 3
        if vendor.get('email'):
            score += 1
        
        return score
    
    def _get_invoice_complexity_score(self, invoice: Dict) -> float:
        """Calculate complexity score for invoice"""
        score = 0
        
        # Number of line items
        line_items = invoice.get('line_items', [])
        score += len(line_items) * 0.5
        
        # Tax complexity
        if invoice.get('tax_amount', 0) > 0:
            score += 1
        
        # GST details
        if invoice.get('gst_details'):
            score += 2
        
        return score
    
    def _explain_transaction_anomaly(self, transaction: Dict, all_transactions: List[Dict]) -> str:
        """Generate explanation for transaction anomaly"""
        reasons = []
        amount = transaction.get('amount', 0)
        
        # Check amount vs average
        amounts = [t.get('amount', 0) for t in all_transactions]
        avg_amount = np.mean(amounts)
        std_amount = np.std(amounts)
        
        if amount > avg_amount + 2 * std_amount:
            reasons.append("Unusually high amount")
        elif amount < avg_amount - 2 * std_amount:
            reasons.append("Unusually low amount")
        
        # Check timing
        hour = self._get_hour_of_day(transaction.get('date'))
        if hour < 6 or hour > 23:
            reasons.append("Unusual transaction time")
        
        # Check frequency
        merchant = transaction.get('merchant_name', '')
        if merchant and self._get_merchant_frequency(merchant, all_transactions) == 1:
            reasons.append("First-time merchant")
        
        return "; ".join(reasons) if reasons else "Statistical outlier"
    
    def _explain_invoice_anomaly(self, invoice: Dict, all_invoices: List[Dict]) -> str:
        """Generate explanation for invoice anomaly"""
        reasons = []
        amount = invoice.get('total_amount', 0)
        
        # Check amount vs average
        amounts = [i.get('total_amount', 0) for i in all_invoices]
        avg_amount = np.mean(amounts)
        std_amount = np.std(amounts)
        
        if amount > avg_amount + 2 * std_amount:
            reasons.append("Unusually high amount")
        
        # Check vendor
        vendor = invoice.get('vendor', {})
        if isinstance(vendor, dict) and not vendor.get('is_verified'):
            reasons.append("Unverified vendor")
        
        # Check due date
        due_days = self._get_days_between_dates(
            invoice.get('invoice_date'), 
            invoice.get('due_date')
        )
        if due_days > 90:
            reasons.append("Unusually long payment terms")
        elif due_days < 0:
            reasons.append("Past due date before invoice date")
        
        return "; ".join(reasons) if reasons else "Statistical outlier"
