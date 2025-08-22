from fastapi import APIRouter
from ..tasks import forecast_series
from ..schemas import ForecastRequest, ForecastResult, ForecastPoint

router = APIRouter()

@router.post("/forecast", response_model=ForecastResult)
async def forecast(req: ForecastRequest):
    baseline = [10000, 12000, 11000, 13000]
    yhat = forecast_series.delay(baseline, req.horizon)
    # For demo, just return baseline mean as flat forecast
    avg = sum(baseline)/len(baseline)
    series = [ForecastPoint(date=f"+{i}m", value=avg) for i in range(1, req.horizon+1)]
    return ForecastResult(series=series)
