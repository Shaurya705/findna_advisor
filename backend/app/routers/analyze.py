from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import logging

from ..db import get_db
from ..schemas import (
    AnalyzeResult, AnalyzeRequest, User, Transaction,
    DashboardStats, AnomalyResult
)
from ..models import (
    Transaction as TransactionModel, 
    Invoice as InvoiceModel,
    Expense as ExpenseModel,
    Payment as PaymentModel,
    User as UserModel
)
from ..security import get_current_user
from ..tasks import detect_anomalies
from ..services.anomaly_service import AnomalyDetectionService

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResult)
async def analyze_financial_data(
    background_tasks: BackgroundTasks,
    request: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Analyze user's financial data for anomalies and insights"""
    
    try:
        # Set default date range if not provided
        end_date = request.end_date or datetime.utcnow()
        start_date = request.start_date or (end_date - timedelta(days=90))
        
        # Fetch user's financial data
        transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id,
            TransactionModel.date >= start_date,
            TransactionModel.date <= end_date
        )
        
        if request.categories:
            transactions = transactions.filter(
                TransactionModel.category.in_(request.categories)
            )
        
        transactions = transactions.all()
        
        # Fetch invoices
        invoices = db.query(InvoiceModel).filter(
            InvoiceModel.user_id == current_user.id,
            InvoiceModel.created_at >= start_date,
            InvoiceModel.created_at <= end_date
        ).all()
        
        # Immediate analysis for quick response
        anomalies = []
        insights = []
        recommendations = []
        
        # Basic anomaly detection (rule-based for immediate response)
        for txn in transactions:
            if txn.amount > 100000:  # Large transactions
                anomalies.append(AnomalyResult(
                    id=txn.id,
                    type="transaction",
                    score=0.8,
                    reason="Unusually large transaction amount",
                    data={
                        "amount": txn.amount,
                        "description": txn.description,
                        "merchant": txn.merchant_name,
                        "date": txn.date.isoformat()
                    },
                    timestamp=datetime.utcnow()
                ))
        
        # Calculate summary statistics
        total_transactions = len(transactions)
        total_amount = sum(t.amount for t in transactions)
        income_amount = sum(t.amount for t in transactions if t.type.value == 'income')
        expense_amount = sum(t.amount for t in transactions if t.type.value == 'expense')
        
        # Generate insights
        if total_transactions > 0:
            avg_transaction = total_amount / total_transactions
            insights.append(f"Average transaction amount: ₹{avg_transaction:,.2f}")
            
            if income_amount > expense_amount:
                insights.append(f"Positive cash flow: ₹{income_amount - expense_amount:,.2f}")
                recommendations.append("Consider investing surplus funds")
            else:
                insights.append(f"Negative cash flow: ₹{expense_amount - income_amount:,.2f}")
                recommendations.append("Review and optimize expenses")
        
        # Category breakdown
        from collections import defaultdict
        category_totals = defaultdict(float)
        for txn in transactions:
            if txn.type.value == 'expense':
                category_totals[txn.category] += txn.amount
        
        if category_totals:
            top_category = max(category_totals.items(), key=lambda x: x[1])
            insights.append(f"Highest expense category: {top_category[0]} (₹{top_category[1]:,.2f})")
        
        # Pending invoices analysis
        pending_invoices = [i for i in invoices if i.status.value == 'uploaded' or i.status.value == 'processing']
        if pending_invoices:
            pending_amount = sum(i.total_amount for i in pending_invoices)
            insights.append(f"Pending invoice processing: {len(pending_invoices)} invoices worth ₹{pending_amount:,.2f}")
            recommendations.append("Follow up on pending invoice processing")
        
        summary = {
            "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            "total_transactions": total_transactions,
            "total_amount": total_amount,
            "income_amount": income_amount,
            "expense_amount": expense_amount,
            "net_amount": income_amount - expense_amount,
            "total_invoices": len(invoices),
            "pending_invoices": len(pending_invoices),
            "anomaly_count": len(anomalies),
            "category_breakdown": dict(category_totals)
        }
        
        # Start background AI-powered analysis
        if request.include_forecasts or len(transactions) > 10:
            background_tasks.add_task(
                detect_anomalies.delay,
                current_user.id
            )
        
        return AnalyzeResult(
            anomalies=anomalies,
            summary=summary,
            insights=insights,
            recommendations=recommendations
        )
        
    except Exception as e:
        logger.error(f"Analysis failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard statistics and recent activity"""
    
    try:
        # Date ranges
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Basic counts
        total_invoices = db.query(InvoiceModel).filter(
            InvoiceModel.user_id == current_user.id
        ).count()
        
        # Pending payments (unpaid invoices)
        pending_payments = db.query(InvoiceModel).filter(
            InvoiceModel.user_id == current_user.id,
            InvoiceModel.status != "paid"
        ).all()
        pending_amount = sum(inv.total_amount for inv in pending_payments)
        
        # Monthly revenue and expenses
        monthly_transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id,
            TransactionModel.date >= month_start
        ).all()
        
        monthly_revenue = sum(
            t.amount for t in monthly_transactions 
            if t.type.value == 'income'
        )
        monthly_expenses = sum(
            t.amount for t in monthly_transactions 
            if t.type.value == 'expense'
        )
        
        cash_flow = monthly_revenue - monthly_expenses
        
        # Recent transactions (last 10)
        recent_transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id
        ).order_by(TransactionModel.date.desc()).limit(10).all()
        
        # Upcoming payments (due soon)
        upcoming_due_date = now + timedelta(days=7)
        upcoming_payments = db.query(PaymentModel).filter(
            PaymentModel.user_id == current_user.id,
            PaymentModel.payment_date <= upcoming_due_date,
            PaymentModel.status != "completed"
        ).all()
        
        # Anomaly alerts (recent anomalies)
        anomaly_alerts = []
        for txn in recent_transactions:
            if txn.is_anomaly:
                anomaly_alerts.append(AnomalyResult(
                    id=txn.id,
                    type="transaction",
                    score=txn.anomaly_score or 0.5,
                    reason="Flagged by AI anomaly detection",
                    data={
                        "amount": txn.amount,
                        "description": txn.description,
                        "date": txn.date.isoformat()
                    },
                    timestamp=txn.created_at
                ))
        
        return DashboardStats(
            total_invoices=total_invoices,
            pending_payments=pending_amount,
            monthly_revenue=monthly_revenue,
            monthly_expenses=monthly_expenses,
            cash_flow=cash_flow,
            recent_transactions=recent_transactions,
            upcoming_payments=upcoming_payments,
            anomaly_alerts=anomaly_alerts
        )
        
    except Exception as e:
        logger.error(f"Dashboard stats failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to load dashboard: {str(e)}")

@router.get("/anomalies", response_model=List[AnomalyResult])
async def get_anomalies(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get detected anomalies for the user"""
    
    try:
        # Get transactions with anomalies
        anomalous_transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id,
            TransactionModel.is_anomaly == True
        ).order_by(TransactionModel.date.desc()).limit(limit).all()
        
        # Get invoices with anomalies
        anomalous_invoices = db.query(InvoiceModel).filter(
            InvoiceModel.user_id == current_user.id,
            InvoiceModel.is_anomaly == True
        ).order_by(InvoiceModel.created_at.desc()).limit(limit).all()
        
        anomalies = []
        
        # Add transaction anomalies
        for txn in anomalous_transactions:
            anomalies.append(AnomalyResult(
                id=txn.id,
                type="transaction",
                score=txn.anomaly_score or 0.5,
                reason="AI-detected anomaly in transaction pattern",
                data={
                    "amount": txn.amount,
                    "description": txn.description,
                    "category": txn.category,
                    "merchant": txn.merchant_name,
                    "date": txn.date.isoformat()
                },
                timestamp=txn.created_at
            ))
        
        # Add invoice anomalies
        for inv in anomalous_invoices:
            anomalies.append(AnomalyResult(
                id=inv.id,
                type="invoice",
                score=inv.anomaly_score or 0.5,
                reason="AI-detected anomaly in invoice data",
                data={
                    "amount": inv.total_amount,
                    "invoice_number": inv.invoice_number,
                    "vendor": inv.vendor.name if inv.vendor else "Unknown",
                    "date": inv.invoice_date.isoformat() if inv.invoice_date else None
                },
                timestamp=inv.created_at
            ))
        
        # Sort by timestamp (most recent first)
        anomalies.sort(key=lambda x: x.timestamp, reverse=True)
        
        return anomalies[:limit]
        
    except Exception as e:
        logger.error(f"Get anomalies failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get anomalies: {str(e)}")

@router.post("/analyze/start-background")
async def start_background_analysis(
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Start comprehensive background analysis"""
    
    try:
        # Check if user has enough data
        transaction_count = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id
        ).count()
        
        if transaction_count < 5:
            raise HTTPException(
                status_code=400, 
                detail="Insufficient data for analysis. Need at least 5 transactions."
            )
        
        # Start background analysis
        background_tasks.add_task(
            detect_anomalies.delay,
            current_user.id
        )
        
        return {
            "message": "Background analysis started",
            "user_id": current_user.id,
            "transaction_count": transaction_count
        }
        
    except Exception as e:
        logger.error(f"Background analysis start failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start analysis: {str(e)}")
