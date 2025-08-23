import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import logging

try:
    from prophet import Prophet
    PROPHET_AVAILABLE = True
except ImportError:
    PROPHET_AVAILABLE = False

try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
import warnings
warnings.filterwarnings('ignore')

logger = logging.getLogger(__name__)

class ForecastingService:
    """AI-powered forecasting service for revenue, expenses, and cash flow"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        
    def prepare_time_series_data(self, transactions: List[Dict[str, Any]], 
                                forecast_type: str = "revenue") -> pd.DataFrame:
        """Prepare time series data for forecasting"""
        try:
            df = pd.DataFrame(transactions)
            if df.empty:
                return pd.DataFrame()
            
            # Convert date column
            df['ds'] = pd.to_datetime(df['date'])
            
            # Filter based on forecast type
            if forecast_type == "revenue":
                df = df[df['type'] == 'income']
            elif forecast_type == "expense":
                df = df[df['type'] == 'expense']
            # For cashflow, use all transactions
            
            # Aggregate by date
            if forecast_type == "cashflow":
                # Calculate net flow (income - expenses)
                income_df = df[df['type'] == 'income'].groupby('ds')['amount'].sum().reset_index()
                expense_df = df[df['type'] == 'expense'].groupby('ds')['amount'].sum().reset_index()
                
                # Merge and calculate net flow
                merged = pd.merge(income_df, expense_df, on='ds', how='outer', suffixes=('_income', '_expense'))
                merged = merged.fillna(0)
                merged['y'] = merged['amount_income'] - merged['amount_expense']
                time_series = merged[['ds', 'y']]
            else:
                time_series = df.groupby('ds')['amount'].sum().reset_index()
                time_series.columns = ['ds', 'y']
            
            # Fill missing dates
            if not time_series.empty:
                date_range = pd.date_range(
                    start=time_series['ds'].min(),
                    end=time_series['ds'].max(),
                    freq='D'
                )
                full_range = pd.DataFrame({'ds': date_range})
                time_series = pd.merge(full_range, time_series, on='ds', how='left')
                time_series['y'] = time_series['y'].fillna(0)
            
            return time_series
            
        except Exception as e:
            logger.error(f"Error preparing time series data: {e}")
            return pd.DataFrame()
    
    def forecast_with_prophet(self, data: pd.DataFrame, 
                             horizon: int = 12, 
                             confidence_level: float = 0.95) -> Dict[str, Any]:
        """Generate forecast using Prophet (if available)"""
        if not PROPHET_AVAILABLE:
            raise ImportError("Prophet not available. Install with: pip install prophet")
        
        try:
            if data.empty or len(data) < 10:
                raise ValueError("Insufficient data for forecasting")
            
            # Initialize and configure Prophet
            model = Prophet(
                daily_seasonality=True,
                weekly_seasonality=True,
                yearly_seasonality=True,
                changepoint_prior_scale=0.05,
                seasonality_prior_scale=10,
                interval_width=confidence_level
            )
            
            # Fit model
            model.fit(data)
            
            # Create future dataframe
            future = model.make_future_dataframe(periods=horizon * 30, freq='D')  # Daily for horizon months
            
            # Generate forecast
            forecast = model.predict(future)
            
            # Extract results
            forecast_data = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(horizon * 30)
            
            # Aggregate to monthly
            forecast_data['month'] = forecast_data['ds'].dt.to_period('M')
            monthly_forecast = forecast_data.groupby('month').agg({
                'yhat': 'mean',
                'yhat_lower': 'mean',
                'yhat_upper': 'mean'
            }).reset_index()
            
            # Calculate accuracy metrics on historical data
            historical_forecast = forecast[forecast['ds'].isin(data['ds'])]
            mae = mean_absolute_error(data['y'], historical_forecast['yhat'])
            rmse = np.sqrt(mean_squared_error(data['y'], historical_forecast['yhat']))
            
            return {
                'model_type': 'prophet',
                'forecast': monthly_forecast.to_dict('records'),
                'accuracy_metrics': {
                    'mae': float(mae),
                    'rmse': float(rmse),
                    'mape': float(self._calculate_mape(data['y'], historical_forecast['yhat']))
                },
                'components': model.predict(data)[['ds', 'trend', 'weekly', 'yearly']].to_dict('records')
            }
            
        except Exception as e:
            logger.error(f"Error with Prophet forecasting: {e}")
            raise
    
    def forecast_with_xgboost(self, data: pd.DataFrame, 
                             horizon: int = 12) -> Dict[str, Any]:
        """Generate forecast using XGBoost (if available)"""
        if not XGBOOST_AVAILABLE:
            raise ImportError("XGBoost not available. Install with: pip install xgboost")
        
        try:
            if data.empty or len(data) < 30:
                raise ValueError("Insufficient data for XGBoost forecasting")
            
            # Prepare features
            features_df = self._create_features(data)
            
            # Split data
            train_size = int(len(features_df) * 0.8)
            train_data = features_df[:train_size]
            test_data = features_df[train_size:]
            
            # Prepare training data
            feature_cols = [col for col in features_df.columns if col not in ['ds', 'y']]
            X_train = train_data[feature_cols]
            y_train = train_data['y']
            X_test = test_data[feature_cols]
            y_test = test_data['y']
            
            # Train XGBoost model
            model = xgb.XGBRegressor(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42
            )
            model.fit(X_train, y_train)
            
            # Generate forecast
            forecast_features = self._create_future_features(data, horizon)
            forecast_values = model.predict(forecast_features[feature_cols])
            
            # Create forecast dataframe
            last_date = data['ds'].max()
            future_dates = pd.date_range(
                start=last_date + timedelta(days=1),
                periods=horizon * 30,
                freq='D'
            )
            
            forecast_df = pd.DataFrame({
                'ds': future_dates,
                'yhat': forecast_values[:len(future_dates)]
            })
            
            # Aggregate to monthly
            forecast_df['month'] = forecast_df['ds'].dt.to_period('M')
            monthly_forecast = forecast_df.groupby('month')['yhat'].mean().reset_index()
            
            # Calculate accuracy metrics
            test_predictions = model.predict(X_test)
            mae = mean_absolute_error(y_test, test_predictions)
            rmse = np.sqrt(mean_squared_error(y_test, test_predictions))
            
            return {
                'model_type': 'xgboost',
                'forecast': monthly_forecast.to_dict('records'),
                'accuracy_metrics': {
                    'mae': float(mae),
                    'rmse': float(rmse),
                    'mape': float(self._calculate_mape(y_test, test_predictions))
                },
                'feature_importance': dict(zip(feature_cols, model.feature_importances_))
            }
            
        except Exception as e:
            logger.error(f"Error with XGBoost forecasting: {e}")
            raise
    
    def forecast_with_linear_regression(self, data: pd.DataFrame, 
                                       horizon: int = 12) -> Dict[str, Any]:
        """Simple linear regression forecast as fallback"""
        try:
            if data.empty or len(data) < 5:
                raise ValueError("Insufficient data for forecasting")
            
            # Prepare simple features
            data = data.copy()
            data['trend'] = range(len(data))
            data['day_of_year'] = data['ds'].dt.dayofyear
            data['month'] = data['ds'].dt.month
            
            # Simple linear model
            feature_cols = ['trend', 'day_of_year', 'month']
            X = data[feature_cols]
            y = data['y']
            
            model = LinearRegression()
            model.fit(X, y)
            
            # Generate future features
            last_trend = data['trend'].max()
            future_trends = range(last_trend + 1, last_trend + horizon * 30 + 1)
            last_date = data['ds'].max()
            future_dates = pd.date_range(
                start=last_date + timedelta(days=1),
                periods=horizon * 30,
                freq='D'
            )
            
            future_features = pd.DataFrame({
                'trend': future_trends,
                'day_of_year': future_dates.dayofyear,
                'month': future_dates.month
            })
            
            # Predict
            future_predictions = model.predict(future_features)
            
            # Create forecast dataframe
            forecast_df = pd.DataFrame({
                'ds': future_dates,
                'yhat': future_predictions
            })
            
            # Aggregate to monthly
            forecast_df['month'] = forecast_df['ds'].dt.to_period('M')
            monthly_forecast = forecast_df.groupby('month')['yhat'].mean().reset_index()
            
            # Calculate accuracy (on training data)
            predictions = model.predict(X)
            mae = mean_absolute_error(y, predictions)
            rmse = np.sqrt(mean_squared_error(y, predictions))
            
            return {
                'model_type': 'linear_regression',
                'forecast': monthly_forecast.to_dict('records'),
                'accuracy_metrics': {
                    'mae': float(mae),
                    'rmse': float(rmse),
                    'mape': float(self._calculate_mape(y, predictions))
                }
            }
            
        except Exception as e:
            logger.error(f"Error with linear regression forecasting: {e}")
            raise
    
    def generate_forecast(self, transactions: List[Dict[str, Any]], 
                         forecast_type: str = "revenue",
                         horizon: int = 12,
                         model_preference: str = "auto") -> Dict[str, Any]:
        """Generate forecast using best available model"""
        try:
            # Prepare data
            data = self.prepare_time_series_data(transactions, forecast_type)
            
            if data.empty:
                return {
                    'error': 'Insufficient data for forecasting',
                    'forecast': [],
                    'insights': ['No historical data available for forecasting']
                }
            
            # Choose model based on preference and availability
            if model_preference == "prophet" and PROPHET_AVAILABLE:
                result = self.forecast_with_prophet(data, horizon)
            elif model_preference == "xgboost" and XGBOOST_AVAILABLE:
                result = self.forecast_with_xgboost(data, horizon)
            elif model_preference == "auto":
                # Try Prophet first, then XGBoost, then Linear Regression
                if PROPHET_AVAILABLE and len(data) >= 10:
                    result = self.forecast_with_prophet(data, horizon)
                elif XGBOOST_AVAILABLE and len(data) >= 30:
                    result = self.forecast_with_xgboost(data, horizon)
                else:
                    result = self.forecast_with_linear_regression(data, horizon)
            else:
                result = self.forecast_with_linear_regression(data, horizon)
            
            # Add insights
            insights = self._generate_insights(result, forecast_type)
            result['insights'] = insights
            
            # Format forecast for API response
            formatted_forecast = []
            for point in result['forecast']:
                if 'month' in point:
                    formatted_forecast.append({
                        'date': str(point['month']),
                        'value': float(point.get('yhat', point.get('y', 0))),
                        'lower_bound': float(point.get('yhat_lower', point.get('yhat', point.get('y', 0)) * 0.9)),
                        'upper_bound': float(point.get('yhat_upper', point.get('yhat', point.get('y', 0)) * 1.1))
                    })
            
            result['forecast'] = formatted_forecast
            return result
            
        except Exception as e:
            logger.error(f"Error generating forecast: {e}")
            return {
                'error': str(e),
                'forecast': [],
                'insights': ['Unable to generate forecast due to technical issues']
            }
    
    def _create_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """Create features for machine learning models"""
        df = data.copy()
        
        # Time-based features
        df['trend'] = range(len(df))
        df['day_of_week'] = df['ds'].dt.dayofweek
        df['day_of_month'] = df['ds'].dt.day
        df['day_of_year'] = df['ds'].dt.dayofyear
        df['week_of_year'] = df['ds'].dt.isocalendar().week
        df['month'] = df['ds'].dt.month
        df['quarter'] = df['ds'].dt.quarter
        df['year'] = df['ds'].dt.year
        
        # Lag features
        for lag in [1, 7, 30]:
            df[f'lag_{lag}'] = df['y'].shift(lag)
        
        # Rolling statistics
        for window in [7, 14, 30]:
            df[f'rolling_mean_{window}'] = df['y'].rolling(window=window).mean()
            df[f'rolling_std_{window}'] = df['y'].rolling(window=window).std()
        
        # Drop rows with NaN values
        df = df.dropna()
        
        return df
    
    def _create_future_features(self, historical_data: pd.DataFrame, horizon: int) -> pd.DataFrame:
        """Create features for future periods"""
        last_date = historical_data['ds'].max()
        future_dates = pd.date_range(
            start=last_date + timedelta(days=1),
            periods=horizon * 30,
            freq='D'
        )
        
        future_df = pd.DataFrame({'ds': future_dates})
        
        # Time-based features
        last_trend = len(historical_data)
        future_df['trend'] = range(last_trend, last_trend + len(future_df))
        future_df['day_of_week'] = future_df['ds'].dt.dayofweek
        future_df['day_of_month'] = future_df['ds'].dt.day
        future_df['day_of_year'] = future_df['ds'].dt.dayofyear
        future_df['week_of_year'] = future_df['ds'].dt.isocalendar().week
        future_df['month'] = future_df['ds'].dt.month
        future_df['quarter'] = future_df['ds'].dt.quarter
        future_df['year'] = future_df['ds'].dt.year
        
        # For lag and rolling features, use last known values or interpolate
        last_values = historical_data['y'].tail(30).values
        for lag in [1, 7, 30]:
            if lag <= len(last_values):
                future_df[f'lag_{lag}'] = last_values[-lag]
            else:
                future_df[f'lag_{lag}'] = last_values[-1]
        
        # Rolling statistics - use last computed values
        for window in [7, 14, 30]:
            if len(last_values) >= window:
                future_df[f'rolling_mean_{window}'] = np.mean(last_values[-window:])
                future_df[f'rolling_std_{window}'] = np.std(last_values[-window:])
            else:
                future_df[f'rolling_mean_{window}'] = np.mean(last_values)
                future_df[f'rolling_std_{window}'] = np.std(last_values) if len(last_values) > 1 else 0
        
        return future_df
    
    def _calculate_mape(self, actual, predicted):
        """Calculate Mean Absolute Percentage Error"""
        try:
            actual = np.array(actual)
            predicted = np.array(predicted)
            
            # Avoid division by zero
            mask = actual != 0
            if not mask.any():
                return 100.0
            
            return np.mean(np.abs((actual[mask] - predicted[mask]) / actual[mask])) * 100
        except:
            return 100.0
    
    def _generate_insights(self, forecast_result: Dict[str, Any], forecast_type: str) -> List[str]:
        """Generate insights from forecast results"""
        insights = []
        
        try:
            forecast_data = forecast_result.get('forecast', [])
            accuracy = forecast_result.get('accuracy_metrics', {})
            
            if not forecast_data:
                return ["No forecast data available"]
            
            # Trend analysis
            values = [point.get('yhat', point.get('y', 0)) for point in forecast_data]
            if len(values) >= 2:
                trend = "increasing" if values[-1] > values[0] else "decreasing"
                change_pct = ((values[-1] - values[0]) / values[0]) * 100 if values[0] != 0 else 0
                insights.append(f"{forecast_type.title()} shows {trend} trend with {abs(change_pct):.1f}% change over forecast period")
            
            # Accuracy insights
            if accuracy.get('mape'):
                mape = accuracy['mape']
                if mape < 10:
                    insights.append("Forecast shows high accuracy (MAPE < 10%)")
                elif mape < 20:
                    insights.append("Forecast shows moderate accuracy (MAPE < 20%)")
                else:
                    insights.append("Forecast has lower accuracy due to data variability")
            
            # Seasonal insights
            if 'components' in forecast_result:
                insights.append("Seasonal patterns detected in historical data")
            
            # Value insights
            avg_value = np.mean(values)
            if forecast_type == "revenue":
                insights.append(f"Average monthly revenue forecasted: ₹{avg_value:,.0f}")
            elif forecast_type == "expense":
                insights.append(f"Average monthly expenses forecasted: ₹{avg_value:,.0f}")
            else:
                cash_flow_trend = "positive" if avg_value > 0 else "negative"
                insights.append(f"Cash flow trend: {cash_flow_trend} (₹{avg_value:,.0f} average)")
            
        except Exception as e:
            logger.error(f"Error generating insights: {e}")
            insights.append("Unable to generate detailed insights")
        
        return insights
