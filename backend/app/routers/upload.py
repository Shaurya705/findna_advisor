from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
import os
import shutil
from pathlib import Path
import tempfile
import logging

from ..db import get_db
from ..schemas import UploadResponse, Invoice, InvoiceCreate, User
from ..models import Invoice as InvoiceModel, User as UserModel, InvoiceStatus
from ..security import get_current_user
from ..tasks import process_invoice_ocr
from ..services.ocr_service import AdvancedOCRService

logger = logging.getLogger(__name__)

router = APIRouter()

# Create upload directory if it doesn't exist
UPLOAD_DIR = Path("uploads/invoices")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/upload", response_model=UploadResponse)
async def upload_invoice(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload and process invoice file with OCR"""
    
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Validate file type
    allowed_extensions = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.bmp'}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"File type {file_ext} not supported. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Validate file size (max 10MB)
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size: 10MB")
    
    try:
        # Generate unique filename
        file_id = str(uuid.uuid4())
        filename = f"{file_id}{file_ext}"
        file_path = UPLOAD_DIR / filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        
        # Create invoice record in database
        invoice = InvoiceModel(
            user_id=current_user.id,
            total_amount=0.0,  # Will be updated by OCR
            status=InvoiceStatus.UPLOADED,
            file_path=str(file_path)
        )
        
        db.add(invoice)
        db.commit()
        db.refresh(invoice)
        
    # Queue OCR processing if Celery available; otherwise run inline
        job_id = f"ocr_{invoice.id}_{file_id}"
        try:
            # Enqueue Celery task immediately if broker is configured
            process_invoice_ocr.delay(invoice.id, str(file_path))
            celery_started = True
        except Exception as e:
            logger.warning(f"Celery not available, running OCR inline: {e}")
            celery_started = False

        # Quick preview for immediate response
        preview_text = None
        try:
            ocr_service = AdvancedOCRService()
            ocr_results = ocr_service.extract_text_multi_engine(str(file_path))
            preview_text = ocr_results['best_text'][:200] + "..." if len(ocr_results['best_text']) > 200 else ocr_results['best_text']
            confidence = ocr_results['best_confidence']
            # Persist quick preview confidence/text even if background task will handle full processing
            invoice.ocr_text = ocr_results.get('best_text', '')
            invoice.ocr_confidence = ocr_results.get('best_confidence', 0.0)
            db.commit()
            # If Celery isn't available, do full processing inline
            if not celery_started:
                result = await ocr_service.process_invoice_advanced(str(file_path))
                invoice.status = InvoiceStatus.PROCESSED if result.get('processing_status') == 'success' else InvoiceStatus.FAILED
                # Store full OCR result in extra_data
                invoice.extra_data = {
                    'ocr_results': result,
                    'confidence': result.get('overall_confidence'),
                    'processing_engine': result.get('ocr_results', {}).get('engine_used'),
                    'extraction_summary': result.get('invoice_data', {}).get('extraction_summary'),
                }
                # Also mirror critical fields
                invoice.ocr_text = result.get('ocr_results', {}).get('text') or invoice.ocr_text
                invoice.ocr_confidence = result.get('overall_confidence') or invoice.ocr_confidence
                db.commit()
        except Exception as e:
            logger.warning(f"Preview generation failed: {e}")
            confidence = 0.0
        
        return UploadResponse(
            job_id=job_id,
            message="Invoice uploaded successfully. Processing in background.",
            preview_text=preview_text,
            confidence=confidence
        )
        
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        # Clean up file if it was created
        if 'file_path' in locals() and file_path.exists():
            file_path.unlink()
        
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/upload/bulk", response_model=dict)
async def upload_bulk_invoices(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload multiple invoice files for batch processing"""
    
    if len(files) > 20:
        raise HTTPException(status_code=400, detail="Maximum 20 files allowed per batch")
    
    results = []
    failed_files = []
    
    for file in files:
        try:
            if not file.filename:
                failed_files.append({"filename": "unknown", "error": "No filename"})
                continue
            
            # Validate file type
            allowed_extensions = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.bmp'}
            file_ext = Path(file.filename).suffix.lower()
            
            if file_ext not in allowed_extensions:
                failed_files.append({
                    "filename": file.filename, 
                    "error": f"Unsupported file type: {file_ext}"
                })
                continue
            
            # Read and validate file size
            content = await file.read()
            if len(content) > 10 * 1024 * 1024:
                failed_files.append({
                    "filename": file.filename, 
                    "error": "File too large (max 10MB)"
                })
                continue
            
            # Generate unique filename and save
            file_id = str(uuid.uuid4())
            filename = f"{file_id}{file_ext}"
            file_path = UPLOAD_DIR / filename
            
            with open(file_path, "wb") as buffer:
                buffer.write(content)
            
            # Create invoice record
            invoice = InvoiceModel(
                user_id=current_user.id,
                total_amount=0.0,
                status=InvoiceStatus.UPLOADED,
                file_path=str(file_path)
            )
            
            db.add(invoice)
            db.flush()  # Get ID without committing
            
            # Queue processing
            job_id = f"ocr_{invoice.id}_{file_id}"
            background_tasks.add_task(
                process_invoice_ocr.delay,
                invoice.id,
                str(file_path)
            )
            
            results.append({
                "filename": file.filename,
                "invoice_id": invoice.id,
                "job_id": job_id,
                "status": "queued"
            })
            
        except Exception as e:
            logger.error(f"Failed to process file {file.filename}: {e}")
            failed_files.append({
                "filename": file.filename,
                "error": str(e)
            })
    
    # Commit all successful uploads
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return {
        "message": f"Batch upload completed. {len(results)} files queued, {len(failed_files)} failed.",
        "successful_uploads": results,
        "failed_uploads": failed_files,
        "total_files": len(files),
        "successful_count": len(results),
        "failed_count": len(failed_files)
    }

@router.get("/upload/status/{job_id}")
async def get_upload_status(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get the status of an upload/OCR job"""
    
    try:
        # Extract invoice ID from job_id
        if job_id.startswith("ocr_"):
            parts = job_id.split("_")
            if len(parts) >= 2:
                invoice_id = int(parts[1])
                
                # Get invoice from database
                invoice = db.query(InvoiceModel).filter(
                    InvoiceModel.id == invoice_id,
                    InvoiceModel.user_id == current_user.id
                ).first()
                
                if not invoice:
                    raise HTTPException(status_code=404, detail="Invoice not found")
                
                meta = getattr(invoice, 'extra_data', {}) or {}
                ocr_results = meta.get('ocr_results') if isinstance(meta, dict) else None
                # Compute confidence fallbacks
                conf = None
                if isinstance(meta, dict):
                    conf = meta.get('confidence')
                if conf is None:
                    conf = getattr(invoice, 'ocr_confidence', None)
                return {
                    "job_id": job_id,
                    "invoice_id": invoice.id,
                    "status": invoice.status.value if hasattr(invoice.status, 'value') else str(invoice.status or ''),
                    "confidence": conf,
                    "extracted_data": meta.get('extraction_summary') or meta,
                    "ocr_results": ocr_results,
                    "invoice_data": (ocr_results or {}).get('invoice_data') if isinstance(ocr_results, dict) else None,
                    "overall_confidence": (ocr_results or {}).get('overall_confidence') if isinstance(ocr_results, dict) else (meta.get('confidence') if isinstance(meta, dict) else conf),
                    "processed_at": invoice.processed_at.isoformat() if invoice.processed_at else None
                }
        
        # If job_id format doesn't match, return not found
        raise HTTPException(status_code=404, detail="Job not found")
        
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid job ID format")
    except Exception as e:
        logger.error(f"Error getting upload status: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving status")

@router.get("/invoices", response_model=List[Invoice])
async def get_user_invoices(
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's invoices with optional filtering"""
    
    query = db.query(InvoiceModel).filter(InvoiceModel.user_id == current_user.id)
    
    if status:
        query = query.filter(InvoiceModel.status == status)
    
    invoices = query.offset(skip).limit(limit).all()
    
    return invoices

@router.get("/invoices/{invoice_id}", response_model=Invoice)
async def get_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific invoice details"""
    
    invoice = db.query(InvoiceModel).filter(
        InvoiceModel.id == invoice_id,
        InvoiceModel.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    return invoice

@router.delete("/invoices/{invoice_id}")
async def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an invoice and its associated file"""
    
    invoice = db.query(InvoiceModel).filter(
        InvoiceModel.id == invoice_id,
        InvoiceModel.user_id == current_user.id
    ).first()
    
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Delete associated file
    if invoice.file_path and Path(invoice.file_path).exists():
        try:
            Path(invoice.file_path).unlink()
        except Exception as e:
            logger.warning(f"Failed to delete file {invoice.file_path}: {e}")
    
    # Delete from database
    db.delete(invoice)
    db.commit()
    
    return {"message": "Invoice deleted successfully"}
