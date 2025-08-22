from fastapi import APIRouter
from ..schemas import AdviceRequest, AdviceResponse

router = APIRouter()

@router.post("/advice", response_model=AdviceResponse)
async def advice(req: AdviceRequest):
    # Stub: Echo with simple rule
    msg = req.message.strip()
    if "tax" in msg.lower():
        reply = "Consider 80C deductions and tax-efficient funds."
    else:
        reply = f"You said: {msg}. We'll refine with FinBERT later."
    return AdviceResponse(reply=reply)
