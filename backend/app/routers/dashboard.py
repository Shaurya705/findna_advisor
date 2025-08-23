from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging

from ..db import get_db
from ..schemas import User
from ..models import (
    User as UserModel, Invoice as InvoiceModel, Transaction as TransactionModel,
    Expense as ExpenseModel, Payment as PaymentModel, Alert as AlertModel
)
from ..security import get_current_user
from ..services.anomaly_detection import AnomalyDetectionService
from ..services.forecast import ForecastService

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/dashboard/overview")
async def get_dashboard_overview(
    period: str = Query("30d", description="Time period: 7d, 30d, 90d, 1y"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get comprehensive dashboard overview with key financial metrics"""
    
    try:
        # Calculate date range
        end_date = datetime.utcnow()
        if period == "7d":
            start_date = end_date - timedelta(days=7)
        elif period == "30d":
            start_date = end_date - timedelta(days=30)
        elif period == "90d":
            start_date = end_date - timedelta(days=90)
        elif period == "1y":
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=30)
        
        # Get financial summary
        financial_summary = await _get_financial_summary(db, current_user.id, start_date, end_date)
        
        # Get transaction metrics
        transaction_metrics = await _get_transaction_metrics(db, current_user.id, start_date, end_date)
        
        # Get invoice metrics
        invoice_metrics = await _get_invoice_metrics(db, current_user.id, start_date, end_date)
        
        # Get expense metrics
        expense_metrics = await _get_expense_metrics(db, current_user.id, start_date, end_date)
        
        # Get recent activities
        recent_activities = await _get_recent_activities(db, current_user.id, limit=10)
        
        # Get alerts
        alerts = await _get_active_alerts(db, current_user.id)
        
        # Get cash flow trend
        cash_flow_trend = await _get_cash_flow_trend(db, current_user.id, start_date, end_date)
        
        return {
            "period": period,
            "date_range": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "financial_summary": financial_summary,
            "metrics": {
                "transactions": transaction_metrics,
                "invoices": invoice_metrics,
                "expenses": expense_metrics
            },
            "recent_activities": recent_activities,
            "alerts": alerts,
            "cash_flow_trend": cash_flow_trend,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Dashboard overview failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get dashboard overview: {str(e)}")

@router.get("/dashboard/financial-health")
async def get_financial_health_score(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculate and return user's financial health score"""
    
    try:
        # Get data for last 90 days
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=90)
        
        # Calculate various financial health indicators
        health_metrics = {}
        
        # 1. Cash Flow Ratio (Income vs Expenses)
        income = db.query(func.sum(TransactionModel.amount)).filter(
            TransactionModel.user_id == current_user.id,
            TransactionModel.type == "income",
            TransactionModel.date >= start_date
        ).scalar() or 0
        
        expenses = db.query(func.sum(TransactionModel.amount)).filter(
            TransactionModel.user_id == current_user.id,
            TransactionModel.type == "expense",
            TransactionModel.date >= start_date
        ).scalar() or 0
        
        cash_flow_ratio = (income - expenses) / income if income > 0 else 0
        health_metrics["cash_flow_ratio"] = cash_flow_ratio
        
        # 2. Invoice Collection Efficiency
        total_invoices = db.query(func.count(InvoiceModel.id)).filter(
            InvoiceModel.user_id == current_user.id,
            InvoiceModel.created_at >= start_date
        ).scalar() or 0
        
        paid_invoices = db.query(func.count(InvoiceModel.id)).filter(
            InvoiceModel.user_id == current_user.id,
            InvoiceModel.status == "paid",
            InvoiceModel.created_at >= start_date
        ).scalar() or 0
        
        collection_rate = paid_invoices / total_invoices if total_invoices > 0 else 1
        health_metrics["collection_efficiency"] = collection_rate
        
        # 3. Expense Management (consistency)
        monthly_expenses = db.query(
            func.date_trunc('month', ExpenseModel.date).label('month'),
            func.sum(ExpenseModel.amount).label('total')
        ).filter(
            ExpenseModel.user_id == current_user.id,
            ExpenseModel.date >= start_date
        ).group_by(func.date_trunc('month', ExpenseModel.date)).all()
        
        if len(monthly_expenses) > 1:
            expense_amounts = [float(exp.total) for exp in monthly_expenses]
            avg_expense = sum(expense_amounts) / len(expense_amounts)
            expense_variance = sum((x - avg_expense) ** 2 for x in expense_amounts) / len(expense_amounts)
            expense_stability = 1 - min(expense_variance / (avg_expense ** 2), 1) if avg_expense > 0 else 1
        else:
            expense_stability = 1
        
        health_metrics["expense_stability"] = expense_stability
        
        # 4. Payment Timeliness
        overdue_payments = db.query(func.count(PaymentModel.id)).filter(
            PaymentModel.user_id == current_user.id,
            PaymentModel.due_date < end_date,
            PaymentModel.status != "completed"
        ).scalar() or 0
        
        total_payments = db.query(func.count(PaymentModel.id)).filter(
            PaymentModel.user_id == current_user.id,
            PaymentModel.due_date >= start_date
        ).scalar() or 1
        
        payment_timeliness = 1 - (overdue_payments / total_payments)
        health_metrics["payment_timeliness"] = payment_timeliness
        
        # Calculate overall score (weighted average)
        weights = {
            "cash_flow_ratio": 0.3,
            "collection_efficiency": 0.25,
            "expense_stability": 0.25,
            "payment_timeliness": 0.2
        }
        
        overall_score = sum(
            health_metrics[metric] * weight
            for metric, weight in weights.items()
        )
        
        # Convert to 0-100 scale
        overall_score = max(0, min(100, overall_score * 100))
        
        # Determine health level
        if overall_score >= 80:
            health_level = "excellent"
        elif overall_score >= 60:
            health_level = "good"
        elif overall_score >= 40:
            health_level = "fair"
        else:
            health_level = "needs_attention"
        
        # Generate recommendations
        recommendations = _generate_health_recommendations(health_metrics)
        
        return {
            "overall_score": round(overall_score, 1),
            "health_level": health_level,
            "metrics": {
                "cash_flow_ratio": round(health_metrics["cash_flow_ratio"] * 100, 1),
                "collection_efficiency": round(health_metrics["collection_efficiency"] * 100, 1),
                "expense_stability": round(health_metrics["expense_stability"] * 100, 1),
                "payment_timeliness": round(health_metrics["payment_timeliness"] * 100, 1)
            },
            "recommendations": recommendations,
            "calculated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Financial health calculation failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to calculate financial health: {str(e)}")

@router.get("/dashboard/anomalies")
async def get_recent_anomalies(
    days: int = Query(30, ge=1, le=90),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get recent financial anomalies detected by AI"""
    
    try:
        # Get recent transactions for anomaly detection
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id,
            TransactionModel.date >= start_date
        ).all()
        
        if not transactions:
            return {"anomalies": [], "summary": {"total": 0, "high_risk": 0, "medium_risk": 0, "low_risk": 0}}
        
        # Use anomaly detection service
        anomaly_service = AnomalyDetectionService()
        
        # Prepare transaction data
        transaction_data = [
            {
                "id": txn.id,
                "amount": float(txn.amount),
                "type": txn.type,
                "category": txn.category,
                "date": txn.date,
                "merchant_name": txn.merchant_name,
                "description": txn.description
            }
            for txn in transactions
        ]
        
        # Detect anomalies
        anomalies = anomaly_service.detect_anomalies(transaction_data)
        
        # Categorize by risk level
        summary = {"total": len(anomalies), "high_risk": 0, "medium_risk": 0, "low_risk": 0}
        
        for anomaly in anomalies:
            risk_level = anomaly.get("risk_level", "low")
            summary[f"{risk_level}_risk"] += 1
        
        return {
            "anomalies": anomalies,
            "summary": summary,
            "period_days": days,
            "detected_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Anomaly detection failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to detect anomalies: {str(e)}")

@router.get("/dashboard/forecast")
async def get_financial_forecast(
    forecast_days: int = Query(30, ge=7, le=90),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered financial forecast"""
    
    try:
        # Get historical data for forecasting
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=180)  # 6 months of history
        
        transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id,
            TransactionModel.date >= start_date
        ).order_by(TransactionModel.date).all()
        
        if len(transactions) < 30:
            return {
                "forecast": [],
                "summary": {"insufficient_data": True},
                "message": "Insufficient historical data for accurate forecasting"
            }
        
        # Use forecast service
        forecast_service = ForecastService()
        
        # Prepare historical data
        historical_data = [
            {
                "date": txn.date,
                "amount": float(txn.amount),
                "type": txn.type,
                "category": txn.category
            }
            for txn in transactions
        ]
        
        # Generate forecast
        forecast_result = forecast_service.generate_forecast(
            historical_data=historical_data,
            forecast_days=forecast_days
        )
        
        return {
            "forecast": forecast_result["forecast"],
            "summary": forecast_result["summary"],
            "confidence_interval": forecast_result.get("confidence_interval", {}),
            "forecast_period_days": forecast_days,
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Financial forecast failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate forecast: {str(e)}")

@router.get("/dashboard/insights")
async def get_ai_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get AI-generated financial insights and recommendations"""
    
    try:
        # Get comprehensive data for insights
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=90)
        
        # Gather data from all financial entities
        insights = {
            "spending_patterns": await _analyze_spending_patterns(db, current_user.id, start_date, end_date),
            "income_trends": await _analyze_income_trends(db, current_user.id, start_date, end_date),
            "efficiency_metrics": await _analyze_efficiency_metrics(db, current_user.id, start_date, end_date),
            "optimization_opportunities": await _identify_optimization_opportunities(db, current_user.id, start_date, end_date)
        }
        
        # Generate AI recommendations
        ai_recommendations = _generate_ai_recommendations(insights)
        
        return {
            "insights": insights,
            "ai_recommendations": ai_recommendations,
            "analysis_period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "generated_at": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"AI insights failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")

# Helper functions

async def _get_financial_summary(db: Session, user_id: int, start_date: datetime, end_date: datetime):
    """Calculate financial summary metrics"""
    
    # Income
    income = db.query(func.sum(TransactionModel.amount)).filter(
        TransactionModel.user_id == user_id,
        TransactionModel.type == "income",
        TransactionModel.date >= start_date,
        TransactionModel.date <= end_date
    ).scalar() or 0
    
    # Expenses
    expenses = db.query(func.sum(TransactionModel.amount)).filter(
        TransactionModel.user_id == user_id,
        TransactionModel.type == "expense",
        TransactionModel.date >= start_date,
        TransactionModel.date <= end_date
    ).scalar() or 0
    
    # Net cash flow
    net_cash_flow = income - expenses
    
    # Total invoices
    total_invoices = db.query(func.sum(InvoiceModel.total_amount)).filter(
        InvoiceModel.user_id == user_id,
        InvoiceModel.created_at >= start_date,
        InvoiceModel.created_at <= end_date
    ).scalar() or 0
    
    # Outstanding invoices
    outstanding_invoices = db.query(func.sum(InvoiceModel.total_amount)).filter(
        InvoiceModel.user_id == user_id,
        InvoiceModel.status.in_(["pending", "sent"]),
        InvoiceModel.created_at >= start_date,
        InvoiceModel.created_at <= end_date
    ).scalar() or 0
    
    return {
        "total_income": float(income),
        "total_expenses": float(expenses),
        "net_cash_flow": float(net_cash_flow),
        "total_invoices": float(total_invoices),
        "outstanding_invoices": float(outstanding_invoices),
        "collection_rate": ((total_invoices - outstanding_invoices) / total_invoices * 100) if total_invoices > 0 else 0
    }

async def _get_transaction_metrics(db: Session, user_id: int, start_date: datetime, end_date: datetime):
    """Get transaction-related metrics"""
    
    total_transactions = db.query(func.count(TransactionModel.id)).filter(
        TransactionModel.user_id == user_id,
        TransactionModel.date >= start_date,
        TransactionModel.date <= end_date
    ).scalar() or 0
    
    avg_transaction = db.query(func.avg(TransactionModel.amount)).filter(
        TransactionModel.user_id == user_id,
        TransactionModel.date >= start_date,
        TransactionModel.date <= end_date
    ).scalar() or 0
    
    return {
        "total_count": total_transactions,
        "average_amount": float(avg_transaction)
    }

async def _get_invoice_metrics(db: Session, user_id: int, start_date: datetime, end_date: datetime):
    """Get invoice-related metrics"""
    
    total_count = db.query(func.count(InvoiceModel.id)).filter(
        InvoiceModel.user_id == user_id,
        InvoiceModel.created_at >= start_date,
        InvoiceModel.created_at <= end_date
    ).scalar() or 0
    
    paid_count = db.query(func.count(InvoiceModel.id)).filter(
        InvoiceModel.user_id == user_id,
        InvoiceModel.status == "paid",
        InvoiceModel.created_at >= start_date,
        InvoiceModel.created_at <= end_date
    ).scalar() or 0
    
    return {
        "total_count": total_count,
        "paid_count": paid_count,
        "payment_rate": (paid_count / total_count * 100) if total_count > 0 else 0
    }

async def _get_expense_metrics(db: Session, user_id: int, start_date: datetime, end_date: datetime):
    """Get expense-related metrics"""
    
    total_amount = db.query(func.sum(ExpenseModel.amount)).filter(
        ExpenseModel.user_id == user_id,
        ExpenseModel.date >= start_date,
        ExpenseModel.date <= end_date
    ).scalar() or 0
    
    total_count = db.query(func.count(ExpenseModel.id)).filter(
        ExpenseModel.user_id == user_id,
        ExpenseModel.date >= start_date,
        ExpenseModel.date <= end_date
    ).scalar() or 0
    
    return {
        "total_amount": float(total_amount),
        "total_count": total_count,
        "average_amount": float(total_amount / total_count) if total_count > 0 else 0
    }

async def _get_recent_activities(db: Session, user_id: int, limit: int = 10):
    """Get recent financial activities"""
    
    activities = []
    
    # Recent transactions
    recent_txns = db.query(TransactionModel).filter(
        TransactionModel.user_id == user_id
    ).order_by(TransactionModel.created_at.desc()).limit(limit // 2).all()
    
    for txn in recent_txns:
        activities.append({
            "type": "transaction",
            "description": f"{txn.type.title()}: {txn.description or 'Transaction'}",
            "amount": float(txn.amount),
            "date": txn.date.isoformat(),
            "id": txn.id
        })
    
    # Recent invoices
    recent_invoices = db.query(InvoiceModel).filter(
        InvoiceModel.user_id == user_id
    ).order_by(InvoiceModel.created_at.desc()).limit(limit // 2).all()
    
    for invoice in recent_invoices:
        activities.append({
            "type": "invoice",
            "description": f"Invoice {invoice.invoice_number}",
            "amount": float(invoice.total_amount),
            "date": invoice.created_at.isoformat(),
            "status": invoice.status,
            "id": invoice.id
        })
    
    # Sort by date and limit
    activities.sort(key=lambda x: x["date"], reverse=True)
    return activities[:limit]

async def _get_active_alerts(db: Session, user_id: int):
    """Get active alerts for the user"""
    
    alerts = db.query(AlertModel).filter(
        AlertModel.user_id == user_id,
        AlertModel.is_active == True
    ).order_by(AlertModel.created_at.desc()).limit(5).all()
    
    return [
        {
            "id": alert.id,
            "type": alert.alert_type,
            "message": alert.message,
            "severity": alert.severity,
            "created_at": alert.created_at.isoformat()
        }
        for alert in alerts
    ]

async def _get_cash_flow_trend(db: Session, user_id: int, start_date: datetime, end_date: datetime):
    """Get cash flow trend data"""
    
    # Group by week for the trend
    weekly_data = db.query(
        func.date_trunc('week', TransactionModel.date).label('week'),
        func.sum(
            func.case(
                (TransactionModel.type == 'income', TransactionModel.amount),
                else_=0
            )
        ).label('income'),
        func.sum(
            func.case(
                (TransactionModel.type == 'expense', TransactionModel.amount),
                else_=0
            )
        ).label('expenses')
    ).filter(
        TransactionModel.user_id == user_id,
        TransactionModel.date >= start_date,
        TransactionModel.date <= end_date
    ).group_by(
        func.date_trunc('week', TransactionModel.date)
    ).order_by('week').all()
    
    return [
        {
            "week": week.week.isoformat(),
            "income": float(week.income),
            "expenses": float(week.expenses),
            "net_flow": float(week.income - week.expenses)
        }
        for week in weekly_data
    ]

def _generate_health_recommendations(metrics: Dict[str, float]) -> List[str]:
    """Generate recommendations based on health metrics"""
    
    recommendations = []
    
    if metrics["cash_flow_ratio"] < 0.2:
        recommendations.append("Consider reducing expenses or increasing income to improve cash flow")
    
    if metrics["collection_efficiency"] < 0.8:
        recommendations.append("Implement better invoice follow-up processes to improve collection rates")
    
    if metrics["expense_stability"] < 0.7:
        recommendations.append("Work on stabilizing monthly expenses through better budgeting")
    
    if metrics["payment_timeliness"] < 0.9:
        recommendations.append("Set up automated payment reminders to avoid late payments")
    
    if not recommendations:
        recommendations.append("Your financial health looks good! Keep maintaining these practices")
    
    return recommendations

async def _analyze_spending_patterns(db: Session, user_id: int, start_date: datetime, end_date: datetime):
    """Analyze user's spending patterns"""
    
    # Category-wise spending
    spending_by_category = db.query(
        TransactionModel.category,
        func.sum(TransactionModel.amount).label('total'),
        func.count(TransactionModel.id).label('count')
    ).filter(
        TransactionModel.user_id == user_id,
        TransactionModel.type == 'expense',
        TransactionModel.date >= start_date,
        TransactionModel.date <= end_date
    ).group_by(TransactionModel.category).all()
    
    return {
        "top_categories": [
            {
                "category": row.category or "uncategorized",
                "amount": float(row.total),
                "transaction_count": row.count
            }
            for row in spending_by_category
        ]
    }

async def _analyze_income_trends(db: Session, user_id: int, start_date: datetime, end_date: datetime):
    """Analyze income trends"""
    
    monthly_income = db.query(
        func.date_trunc('month', TransactionModel.date).label('month'),
        func.sum(TransactionModel.amount).label('total')
    ).filter(
        TransactionModel.user_id == user_id,
        TransactionModel.type == 'income',
        TransactionModel.date >= start_date,
        TransactionModel.date <= end_date
    ).group_by(func.date_trunc('month', TransactionModel.date)).order_by('month').all()
    
    return {
        "monthly_trend": [
            {
                "month": row.month.strftime('%Y-%m'),
                "amount": float(row.total)
            }
            for row in monthly_income
        ]
    }

async def _analyze_efficiency_metrics(db: Session, user_id: int, start_date: datetime, end_date: datetime):
    """Analyze operational efficiency metrics"""
    
    # Invoice processing time (example metric)
    avg_processing_time = db.query(
        func.avg(func.extract('day', InvoiceModel.updated_at - InvoiceModel.created_at))
    ).filter(
        InvoiceModel.user_id == user_id,
        InvoiceModel.status == 'paid',
        InvoiceModel.created_at >= start_date
    ).scalar() or 0
    
    return {
        "avg_invoice_processing_days": float(avg_processing_time)
    }

async def _identify_optimization_opportunities(db: Session, user_id: int, start_date: datetime, end_date: datetime):
    """Identify opportunities for financial optimization"""
    
    opportunities = []
    
    # Find recurring high-value expenses
    high_value_categories = db.query(
        TransactionModel.category,
        func.sum(TransactionModel.amount).label('total')
    ).filter(
        TransactionModel.user_id == user_id,
        TransactionModel.type == 'expense',
        TransactionModel.date >= start_date
    ).group_by(TransactionModel.category).having(
        func.sum(TransactionModel.amount) > 1000
    ).all()
    
    for category in high_value_categories:
        opportunities.append({
            "type": "expense_optimization",
            "category": category.category,
            "description": f"Review {category.category} expenses (${category.total:.2f}) for potential savings",
            "potential_impact": "medium"
        })
    
    return opportunities

def _generate_ai_recommendations(insights: Dict[str, Any]) -> List[str]:
    """Generate AI-powered recommendations based on insights"""
    
    recommendations = []
    
    # Analyze spending patterns
    if insights.get("spending_patterns", {}).get("top_categories"):
        top_category = insights["spending_patterns"]["top_categories"][0]
        recommendations.append(
            f"Your highest spending category is {top_category['category']}. "
            f"Consider setting a budget limit for this category."
        )
    
    # Analyze income trends
    income_trend = insights.get("income_trends", {}).get("monthly_trend", [])
    if len(income_trend) >= 2:
        recent_income = income_trend[-1]["amount"]
        previous_income = income_trend[-2]["amount"]
        if recent_income < previous_income * 0.9:
            recommendations.append("Your income has decreased recently. Consider diversifying income sources.")
    
    # Optimization opportunities
    opportunities = insights.get("optimization_opportunities", [])
    if opportunities:
        recommendations.append("We've identified potential cost-saving opportunities in your expenses.")
    
    return recommendations
