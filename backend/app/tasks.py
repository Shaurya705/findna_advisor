from celery import Celery
from typing import Dict, Any, List
import logging
from .config import settings

try:
    from .services.ocr_service import AdvancedOCRService
    from .services.anomaly_service import AnomalyDetectionService
    from .services.forecast_service import ForecastingService
    from .db import SessionLocal
    from .models import Invoice, Transaction, Expense, User, InvoiceStatus
    from sqlalchemy.orm import Session
    SERVICES_AVAILABLE = True
except ImportError:
    # Services not available yet, use fallback
    SERVICES_AVAILABLE = False

import json

logger = logging.getLogger(__name__)

app = Celery(
    "findna_tasks",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

@app.task(bind=True, name='app.tasks.process_invoice_ocr')
def process_invoice_ocr(self, invoice_id: int, file_path: str) -> Dict[str, Any]:
    """Process invoice OCR asynchronously with advanced OCR service"""
    if not SERVICES_AVAILABLE:
        return {
            'status': 'failed',
            'error': 'OCR services not available',
            'invoice_id': invoice_id
        }
    
    try:
        db = SessionLocal()
        ocr_service = AdvancedOCRService()
        
        # Update invoice status
        invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
        if not invoice:
            return {
                'status': 'failed',
                'error': 'Invoice not found',
                'invoice_id': invoice_id
            }

        invoice.status = InvoiceStatus.PROCESSING
        db.commit()
        
        # Process with advanced OCR
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            result = loop.run_until_complete(ocr_service.process_invoice_advanced(file_path))
        finally:
            loop.close()
        
        # Update invoice with extracted data
        if result['processing_status'] == 'success':
            invoice_data = result['invoice_data']
            
            # Update basic fields
            invoice.total_amount = invoice_data.get('total_amount', 0.0)
            invoice.invoice_number = invoice_data.get('invoice_number', '')
            # Parse date if provided as string
            inv_date = invoice_data.get('date', None)
            if inv_date:
                try:
                    from datetime import datetime
                    invoice.invoice_date = datetime.fromisoformat(inv_date)
                except Exception:
                    invoice.invoice_date = None
            invoice.status = InvoiceStatus.PROCESSED
            from datetime import datetime as _dt
            invoice.processed_at = _dt.utcnow()
            # Mirror OCR fields
            invoice.ocr_text = result.get('ocr_results', {}).get('text', '')
            invoice.ocr_confidence = result.get('overall_confidence', result.get('ocr_results', {}).get('confidence', 0.0))
            
            # Store complete OCR results in extra_data
            invoice.extra_data = {
                'ocr_results': result,
                'confidence': result['overall_confidence'],
                'processing_engine': result['ocr_results']['engine_used'],
                'extraction_summary': invoice_data.get('extraction_summary', {}),
                'validation_results': invoice_data.get('validation_results', {}),
                'processing_timestamp': result['timestamp']
            }
            
            # Store GST details if available
            if result.get('gst_details'):
                invoice.extra_data['gst_details'] = result['gst_details']
            
        else:
            invoice.status = InvoiceStatus.FAILED
            invoice.extra_data = {
                'error': result.get('error', 'OCR processing failed'),
                'processing_timestamp': result.get('timestamp', '')
            }
            from datetime import datetime as _dt
            invoice.processed_at = _dt.utcnow()
        
        db.commit()
        
        return {
            'status': 'success',
            'invoice_id': invoice_id,
            'ocr_result': result,
            'overall_confidence': result.get('overall_confidence', 0.0),
            'processing_engine': result.get('ocr_results', {}).get('engine_used', 'unknown')
        }
        
    except Exception as e:
        logger.error(f"OCR processing failed for invoice {invoice_id}: {e}")
        
        # Update invoice status to failed
        try:
            db = SessionLocal()
            invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
            if invoice:
                invoice.status = InvoiceStatus.FAILED
                invoice.extra_data = {'error': str(e)}
                db.commit()
        except Exception as db_error:
            logger.error(f"Failed to update invoice status: {db_error}")
        
        return {
            'status': 'failed',
            'error': str(e),
            'invoice_id': invoice_id
        }
    
    finally:
        if 'db' in locals():
            try:
                db.close()
            except Exception:
                pass

@app.task(bind=True, name='app.tasks.detect_anomalies')
def detect_anomalies(self, user_id: int) -> Dict[str, Any]:
    """Detect anomalies in user's financial data"""
    if not SERVICES_AVAILABLE:
        return {
            'status': 'failed',
            'error': 'Anomaly detection services not available',
            'user_id': user_id
        }
    
    try:
        db = SessionLocal()
        anomaly_service = AnomalyDetectionService()
        
        self.update_state(state='PROGRESS', meta={'step': 'fetching_data'})
        
        # Fetch user's transactions and invoices
        transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()
        invoices = db.query(Invoice).filter(Invoice.user_id == user_id).all()
        
        # Convert to dict format
        transaction_data = [
            {
                'id': t.id,
                'amount': t.amount,
                'type': t.type.value if hasattr(t.type, 'value') else str(t.type),
                'category': t.category,
                'description': t.description,
                'merchant_name': t.merchant_name,
                'payment_method': t.payment_method,
                'date': t.date.isoformat() if t.date else None,
                'tags': t.tags or []
            }
            for t in transactions
        ]
        
        invoice_data = [
            {
                'id': i.id,
                'total_amount': i.total_amount,
                'tax_amount': i.tax_amount,
                'invoice_date': i.invoice_date.isoformat() if i.invoice_date else None,
                'due_date': i.due_date.isoformat() if i.due_date else None,
                'vendor': {'name': i.vendor.name if i.vendor else '', 'is_verified': i.vendor.is_verified if i.vendor else False},
                'gst_details': i.gst_details,
                'line_items': []
            }
            for i in invoices
        ]
        
        self.update_state(state='PROGRESS', meta={'step': 'detecting_anomalies'})
        
        # Detect anomalies
        if transaction_data or invoice_data:
            try:
                anomaly_service.train_models(transaction_data, invoice_data)
                transaction_anomalies = anomaly_service.detect_transaction_anomalies(transaction_data)
                invoice_anomalies = anomaly_service.detect_invoice_anomalies(invoice_data)
                fraud_patterns = anomaly_service.detect_fraud_patterns(transaction_data)
            except Exception as model_error:
                logger.warning(f"Model training/prediction failed: {model_error}")
                transaction_anomalies = []
                invoice_anomalies = []
                fraud_patterns = []
            
            result = {
                'status': 'completed',
                'user_id': user_id,
                'transaction_anomalies': len(transaction_anomalies),
                'invoice_anomalies': len(invoice_anomalies),
                'fraud_patterns': len(fraud_patterns),
                'anomalies': transaction_anomalies + invoice_anomalies,
                'fraud_alerts': fraud_patterns
            }
        else:
            result = {
                'status': 'completed',
                'user_id': user_id,
                'message': 'Insufficient data for anomaly detection'
            }
        
        db.close()
        return result
        
    except Exception as e:
        logger.error(f"Anomaly detection failed for user {user_id}: {e}")
        self.update_state(
            state='FAILURE',
            meta={'error': str(e), 'user_id': user_id}
        )
        raise

@app.task(bind=True, name='app.tasks.generate_forecast')
def generate_forecast(self, user_id: int, forecast_type: str = "revenue", horizon: int = 12) -> Dict[str, Any]:
    """Generate financial forecast asynchronously"""
    if not SERVICES_AVAILABLE:
        return {
            'status': 'failed',
            'error': 'Forecasting services not available',
            'user_id': user_id
        }
    
    try:
        db = SessionLocal()
        forecast_service = ForecastingService()
        
        self.update_state(state='PROGRESS', meta={'step': 'fetching_data'})
        
        # Fetch user's transaction data
        transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()
        
        # Convert to dict format
        transaction_data = [
            {
                'amount': t.amount,
                'type': t.type.value if hasattr(t.type, 'value') else str(t.type),
                'category': t.category,
                'date': t.date.isoformat() if t.date else None,
                'description': t.description
            }
            for t in transactions
        ]
        
        self.update_state(state='PROGRESS', meta={'step': 'generating_forecast'})
        
        # Generate forecast
        forecast_result = forecast_service.generate_forecast(
            transaction_data, 
            forecast_type, 
            horizon
        )
        
        result = {
            'status': 'completed',
            'user_id': user_id,
            'forecast_type': forecast_type,
            'horizon': horizon,
            'model_used': forecast_result.get('model_type'),
            'forecast': forecast_result.get('forecast', []),
            'insights': forecast_result.get('insights', [])
        }
        
        db.close()
        return result
        
    except Exception as e:
        logger.error(f"Forecast generation failed for user {user_id}: {e}")
        self.update_state(
            state='FAILURE',
            meta={'error': str(e), 'user_id': user_id}
        )
        raise

# Legacy compatibility functions
@app.task
def ocr_invoice(file_bytes: bytes) -> dict:
    """Legacy OCR function - kept for compatibility"""
    text = file_bytes[:200].decode(errors="ignore")
    return {"text": text, "confidence": 0.6}

@app.task
def reconcile_transactions(transactions: list[dict]) -> dict:
    """Legacy reconciliation function - kept for compatibility"""
    return {"reconciled": len(transactions), "unmatched": 0}

@app.task
def forecast_series(values: list[float], horizon: int = 12) -> list[float]:
    """Legacy forecast function - kept for compatibility"""
    if not values:
        return [0.0] * horizon
    avg = sum(values) / len(values)
    return [avg] * horizon
