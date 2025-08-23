from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import logging

from ..db import get_db
from ..schemas import (
    ForecastRequest, ForecastResult, ForecastPoint, User
)
from ..models import (
    Transaction as TransactionModel,
    Forecast as ForecastModel,
    User as UserModel
)
from ..security import get_current_user
from ..tasks import generate_forecast
from ..services.forecast_service import ForecastingService

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/forecast", response_model=ForecastResult)
async def create_forecast(
    background_tasks: BackgroundTasks,
    request: ForecastRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate financial forecast for revenue, expenses, or cash flow"""
    
    try:
        # Validate forecast parameters
        if request.horizon < 1 or request.horizon > 24:
            raise HTTPException(
                status_code=400, 
                detail="Forecast horizon must be between 1 and 24 months"
            )
        
        if request.confidence_level < 0.5 or request.confidence_level > 0.99:
            raise HTTPException(
                status_code=400,
                detail="Confidence level must be between 0.5 and 0.99"
            )
        
        # Check if user has sufficient data
        transaction_count = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id
        ).count()
        
        if transaction_count < 10:
            # Generate simple forecast with available data
            recent_transactions = db.query(TransactionModel).filter(
                TransactionModel.user_id == current_user.id
            ).order_by(TransactionModel.date.desc()).limit(transaction_count).all()
            
            if request.type == "revenue":
                amounts = [t.amount for t in recent_transactions if t.type.value == 'income']
            elif request.type == "expense":
                amounts = [t.amount for t in recent_transactions if t.type.value == 'expense']
            else:  # cashflow
                income = sum(t.amount for t in recent_transactions if t.type.value == 'income')
                expense = sum(t.amount for t in recent_transactions if t.type.value == 'expense')
                amounts = [income - expense] if recent_transactions else [0]
            
            # Simple average-based forecast
            avg_amount = sum(amounts) / len(amounts) if amounts else 0
            
            series = []
            base_date = datetime.utcnow()
            for i in range(1, request.horizon + 1):
                forecast_date = (base_date + timedelta(days=30 * i)).strftime("%Y-%m")
                series.append(ForecastPoint(
                    date=forecast_date,
                    value=float(avg_amount),
                    lower_bound=float(avg_amount * 0.8),
                    upper_bound=float(avg_amount * 1.2)
                ))
            
            return ForecastResult(
                type=request.type,
                horizon=request.horizon,
                model_used="simple_average",
                accuracy_metrics={"mae": 0, "rmse": 0, "mape": 0},
                series=series,
                insights=[
                    f"Forecast based on limited data ({transaction_count} transactions)",
                    "Add more transaction history for better accuracy",
                    f"Simple average: ₹{avg_amount:,.0f} per month"
                ],
                confidence_intervals={}
            )
        
        # For sufficient data, use AI-powered forecasting
        forecast_service = ForecastingService()
        
        # Fetch transaction data
        transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id
        ).order_by(TransactionModel.date.asc()).all()
        
        # Convert to format expected by forecasting service
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
        
        # Generate forecast
        forecast_result = forecast_service.generate_forecast(
            transaction_data,
            request.type,
            request.horizon
        )
        
        # Store forecast in database for future reference
        forecast_record = ForecastModel(
            user_id=current_user.id,
            forecast_type=request.type,
            period="monthly",
            forecast_data=forecast_result.get('forecast', []),
            confidence_intervals=forecast_result.get('confidence_intervals', {}),
            model_used=forecast_result.get('model_type', 'linear_regression'),
            accuracy_metrics=forecast_result.get('accuracy_metrics', {}),
            parameters={
                'horizon': request.horizon,
                'confidence_level': request.confidence_level,
                'include_seasonality': request.include_seasonality
            }
        )
        
        db.add(forecast_record)
        db.commit()
        
        # Format response
        formatted_forecast = ForecastResult(
            type=request.type,
            horizon=request.horizon,
            model_used=forecast_result.get('model_type', 'linear_regression'),
            accuracy_metrics=forecast_result.get('accuracy_metrics', {}),
            series=forecast_result.get('forecast', []),
            insights=forecast_result.get('insights', []),
            confidence_intervals=forecast_result.get('confidence_intervals', {})
        )
        
        return formatted_forecast
        
    except Exception as e:
        logger.error(f"Forecast generation failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Forecast generation failed: {str(e)}")

@router.get("/forecast/history", response_model=List[dict])
async def get_forecast_history(
    forecast_type: Optional[str] = None,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's forecast history"""
    
    try:
        query = db.query(ForecastModel).filter(
            ForecastModel.user_id == current_user.id
        )
        
        if forecast_type:
            query = query.filter(ForecastModel.forecast_type == forecast_type)
        
        forecasts = query.order_by(
            ForecastModel.created_at.desc()
        ).limit(limit).all()
        
        return [
            {
                "id": f.id,
                "forecast_type": f.forecast_type,
                "model_used": f.model_used,
                "created_at": f.created_at.isoformat(),
                "accuracy_metrics": f.accuracy_metrics,
                "parameters": f.parameters,
                "forecast_data": f.forecast_data[:3]  # First 3 points only
            }
            for f in forecasts
        ]
        
    except Exception as e:
        logger.error(f"Get forecast history failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get forecast history: {str(e)}")

@router.get("/forecast/{forecast_id}", response_model=dict)
async def get_forecast_details(
    forecast_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get detailed forecast results"""
    
    try:
        forecast = db.query(ForecastModel).filter(
            ForecastModel.id == forecast_id,
            ForecastModel.user_id == current_user.id
        ).first()
        
        if not forecast:
            raise HTTPException(status_code=404, detail="Forecast not found")
        
        return {
            "id": forecast.id,
            "forecast_type": forecast.forecast_type,
            "period": forecast.period,
            "model_used": forecast.model_used,
            "created_at": forecast.created_at.isoformat(),
            "accuracy_metrics": forecast.accuracy_metrics,
            "parameters": forecast.parameters,
            "confidence_intervals": forecast.confidence_intervals,
            "forecast_data": forecast.forecast_data
        }
        
    except Exception as e:
        logger.error(f"Get forecast details failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get forecast details: {str(e)}")

@router.post("/forecast/background")
async def start_background_forecast(
    background_tasks: BackgroundTasks,
    forecast_type: str = "revenue",
    horizon: int = 12,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Start comprehensive forecast generation in background"""
    
    try:
        # Validate parameters
        if forecast_type not in ["revenue", "expense", "cashflow"]:
            raise HTTPException(
                status_code=400,
                detail="Forecast type must be one of: revenue, expense, cashflow"
            )
        
        # Check data availability
        transaction_count = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id
        ).count()
        
        if transaction_count < 5:
            raise HTTPException(
                status_code=400,
                detail="Insufficient data for forecasting. Need at least 5 transactions."
            )
        
        # Start background task
        background_tasks.add_task(
            generate_forecast.delay,
            current_user.id,
            forecast_type,
            horizon
        )
        
        return {
            "message": "Forecast generation started in background",
            "user_id": current_user.id,
            "forecast_type": forecast_type,
            "horizon": horizon,
            "transaction_count": transaction_count
        }
        
    except Exception as e:
        logger.error(f"Background forecast start failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to start forecast: {str(e)}")

@router.get("/forecast/compare/{type}")
async def compare_forecasts(
    type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Compare multiple forecast models for the same type"""
    
    try:
        # Get recent forecasts of the same type
        forecasts = db.query(ForecastModel).filter(
            ForecastModel.user_id == current_user.id,
            ForecastModel.forecast_type == type
        ).order_by(
            ForecastModel.created_at.desc()
        ).limit(5).all()
        
        if not forecasts:
            raise HTTPException(
                status_code=404,
                detail=f"No forecasts found for type: {type}"
            )
        
        comparison = []
        for forecast in forecasts:
            accuracy = forecast.accuracy_metrics or {}
            comparison.append({
                "id": forecast.id,
                "model_used": forecast.model_used,
                "created_at": forecast.created_at.isoformat(),
                "mae": accuracy.get("mae", 0),
                "rmse": accuracy.get("rmse", 0),
                "mape": accuracy.get("mape", 100),
                "forecast_points": len(forecast.forecast_data),
                "parameters": forecast.parameters
            })
        
        # Find best model based on MAPE (lower is better)
        best_forecast = min(comparison, key=lambda x: x["mape"])
        
        return {
            "forecast_type": type,
            "comparison": comparison,
            "best_model": best_forecast,
            "recommendation": f"Best performing model: {best_forecast['model_used']} (MAPE: {best_forecast['mape']:.1f}%)"
        }
        
    except Exception as e:
        logger.error(f"Forecast comparison failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to compare forecasts: {str(e)}")
