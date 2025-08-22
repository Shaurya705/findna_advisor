from fastapi import APIRouter
from ..tasks import reconcile_transactions
from ..schemas import AnalyzeResult

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResult)
async def analyze_transactions(transactions: list[dict]):
    job = reconcile_transactions.delay(transactions)
    # Return placeholder quickly; client can poll worker backend if needed
    anomalies = [t for t in transactions if abs(t.get("amount", 0)) > 100000]
    summary = {"count": len(transactions), "suspect": len(anomalies)}
    return AnalyzeResult(anomalies=anomalies, summary=summary)
