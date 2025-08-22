from fastapi import APIRouter, UploadFile, File, HTTPException
from ..tasks import ocr_invoice
from ..schemas import UploadResponse
import uuid

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_invoice(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file")
    content = await file.read()
    job = ocr_invoice.delay(content)
    # Return quick preview from first bytes (not actual OCR)
    preview = content[:120].decode(errors="ignore")
    return UploadResponse(job_id=str(job.id), preview_text=preview)
