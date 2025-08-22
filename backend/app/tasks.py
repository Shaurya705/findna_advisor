from celery import Celery
from .config import settings

app = Celery(
    "findna_tasks",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
)

@app.task
def ocr_invoice(file_bytes: bytes) -> dict:
    # TODO: Hook Tesseract/Cloud OCR. Mock for now
    text = file_bytes[:200].decode(errors="ignore")
    return {"text": text, "confidence": 0.6}

@app.task
def reconcile_transactions(transactions: list[dict]) -> dict:
    # TODO: Real reconciliation logic
    return {"reconciled": len(transactions), "unmatched": 0}

@app.task
def forecast_series(values: list[float], horizon: int = 12) -> list[float]:
    # TODO: Plug Prophet/XGBoost; simple avg baseline
    if not values:
        return [0.0] * horizon
    avg = sum(values) / len(values)
    return [avg] * horizon
