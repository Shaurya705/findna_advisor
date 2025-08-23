from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import logging

from ..db import get_db
from ..schemas import (
    Transaction, TransactionCreate, TransactionType, User,
    PaginationParams, PaginatedResponse
)
from ..models import Transaction as TransactionModel, User as UserModel
from ..security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/transactions", response_model=Transaction)
async def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new transaction"""
    
    try:
        db_transaction = TransactionModel(
            user_id=current_user.id,
            amount=transaction.amount,
            type=transaction.type,
            category=transaction.category,
            subcategory=transaction.subcategory,
            description=transaction.description,
            reference_number=transaction.reference_number,
            bank_account=transaction.bank_account,
            payment_method=transaction.payment_method,
            merchant_name=transaction.merchant_name,
            location=transaction.location,
            date=transaction.date,
            tags=transaction.tags or []
        )
        
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        
        return db_transaction
        
    except Exception as e:
        logger.error(f"Create transaction failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create transaction: {str(e)}")

@router.get("/transactions", response_model=List[Transaction])
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    type: Optional[TransactionType] = None,
    category: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's transactions with filtering options"""
    
    try:
        query = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id
        )
        
        # Apply filters
        if type:
            query = query.filter(TransactionModel.type == type)
        
        if category:
            query = query.filter(TransactionModel.category == category)
        
        if start_date:
            query = query.filter(TransactionModel.date >= start_date)
        
        if end_date:
            query = query.filter(TransactionModel.date <= end_date)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (TransactionModel.description.ilike(search_term)) |
                (TransactionModel.merchant_name.ilike(search_term)) |
                (TransactionModel.reference_number.ilike(search_term))
            )
        
        transactions = query.order_by(
            TransactionModel.date.desc()
        ).offset(skip).limit(limit).all()
        
        return transactions
        
    except Exception as e:
        logger.error(f"Get transactions failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get transactions: {str(e)}")

@router.get("/transactions/{transaction_id}", response_model=Transaction)
async def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific transaction details"""
    
    try:
        transaction = db.query(TransactionModel).filter(
            TransactionModel.id == transaction_id,
            TransactionModel.user_id == current_user.id
        ).first()
        
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        return transaction
        
    except Exception as e:
        logger.error(f"Get transaction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get transaction: {str(e)}")

@router.put("/transactions/{transaction_id}", response_model=Transaction)
async def update_transaction(
    transaction_id: int,
    transaction_update: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing transaction"""
    
    try:
        db_transaction = db.query(TransactionModel).filter(
            TransactionModel.id == transaction_id,
            TransactionModel.user_id == current_user.id
        ).first()
        
        if not db_transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        # Update fields
        update_data = transaction_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_transaction, field, value)
        
        db.commit()
        db.refresh(db_transaction)
        
        return db_transaction
        
    except Exception as e:
        logger.error(f"Update transaction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update transaction: {str(e)}")

@router.delete("/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a transaction"""
    
    try:
        transaction = db.query(TransactionModel).filter(
            TransactionModel.id == transaction_id,
            TransactionModel.user_id == current_user.id
        ).first()
        
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        db.delete(transaction)
        db.commit()
        
        return {"message": "Transaction deleted successfully"}
        
    except Exception as e:
        logger.error(f"Delete transaction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete transaction: {str(e)}")

@router.get("/transactions/categories/list")
async def get_transaction_categories(
    type: Optional[TransactionType] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of transaction categories used by the user"""
    
    try:
        query = db.query(TransactionModel.category).filter(
            TransactionModel.user_id == current_user.id,
            TransactionModel.category.isnot(None)
        ).distinct()
        
        if type:
            query = query.filter(TransactionModel.type == type)
        
        categories = [row[0] for row in query.all()]
        
        # Add common categories if user has few categories
        common_categories = {
            TransactionType.INCOME: ["salary", "freelance", "investment", "business", "other"],
            TransactionType.EXPENSE: ["food", "transport", "shopping", "bills", "entertainment", "healthcare", "other"],
            TransactionType.TRANSFER: ["savings", "investment", "loan", "other"]
        }
        
        if type and len(categories) < 5:
            for cat in common_categories.get(type, []):
                if cat not in categories:
                    categories.append(cat)
        
        return {"categories": sorted(categories)}
        
    except Exception as e:
        logger.error(f"Get categories failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get categories: {str(e)}")

@router.get("/transactions/summary/monthly")
async def get_monthly_summary(
    months: int = Query(12, ge=1, le=24),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get monthly transaction summary"""
    
    try:
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30 * months)
        
        # Fetch transactions
        transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id,
            TransactionModel.date >= start_date,
            TransactionModel.date <= end_date
        ).all()
        
        # Group by month
        from collections import defaultdict
        monthly_data = defaultdict(lambda: {"income": 0, "expense": 0, "transfer": 0, "count": 0})
        
        for txn in transactions:
            month_key = txn.date.strftime("%Y-%m")
            txn_type = txn.type.value if hasattr(txn.type, 'value') else str(txn.type)
            
            monthly_data[month_key][txn_type] += txn.amount
            monthly_data[month_key]["count"] += 1
        
        # Format response
        summary = []
        for month, data in sorted(monthly_data.items()):
            net_flow = data["income"] - data["expense"]
            summary.append({
                "month": month,
                "income": data["income"],
                "expense": data["expense"],
                "transfer": data["transfer"],
                "net_flow": net_flow,
                "transaction_count": data["count"]
            })
        
        return {
            "period": f"{start_date.strftime('%Y-%m')} to {end_date.strftime('%Y-%m')}",
            "summary": summary,
            "total_months": len(summary)
        }
        
    except Exception as e:
        logger.error(f"Get monthly summary failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get summary: {str(e)}")

@router.get("/transactions/summary/category")
async def get_category_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    type: Optional[TransactionType] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get transaction summary by category"""
    
    try:
        # Set default date range (last 3 months)
        if not end_date:
            end_date = datetime.utcnow()
        if not start_date:
            start_date = end_date - timedelta(days=90)
        
        # Build query
        query = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id,
            TransactionModel.date >= start_date,
            TransactionModel.date <= end_date
        )
        
        if type:
            query = query.filter(TransactionModel.type == type)
        
        transactions = query.all()
        
        # Group by category
        from collections import defaultdict
        category_data = defaultdict(lambda: {"amount": 0, "count": 0, "transactions": []})
        
        for txn in transactions:
            category = txn.category or "uncategorized"
            category_data[category]["amount"] += txn.amount
            category_data[category]["count"] += 1
            category_data[category]["transactions"].append({
                "id": txn.id,
                "amount": txn.amount,
                "description": txn.description,
                "date": txn.date.isoformat()
            })
        
        # Format response
        summary = []
        total_amount = sum(data["amount"] for data in category_data.values())
        
        for category, data in sorted(category_data.items(), key=lambda x: x[1]["amount"], reverse=True):
            percentage = (data["amount"] / total_amount * 100) if total_amount > 0 else 0
            summary.append({
                "category": category,
                "amount": data["amount"],
                "count": data["count"],
                "percentage": round(percentage, 2),
                "avg_amount": data["amount"] / data["count"] if data["count"] > 0 else 0,
                "recent_transactions": data["transactions"][-5:]  # Last 5 transactions
            })
        
        return {
            "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            "type_filter": type.value if type else "all",
            "total_amount": total_amount,
            "total_transactions": sum(data["count"] for data in category_data.values()),
            "categories": summary
        }
        
    except Exception as e:
        logger.error(f"Get category summary failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get category summary: {str(e)}")

@router.post("/transactions/bulk/import")
async def import_transactions(
    transactions_data: List[dict],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Import multiple transactions from external data"""
    
    if len(transactions_data) > 1000:
        raise HTTPException(status_code=400, detail="Maximum 1000 transactions allowed per import")
    
    try:
        imported_count = 0
        failed_count = 0
        errors = []
        
        for i, txn_data in enumerate(transactions_data):
            try:
                # Validate required fields
                if not all(key in txn_data for key in ['amount', 'type', 'date']):
                    errors.append(f"Row {i+1}: Missing required fields (amount, type, date)")
                    failed_count += 1
                    continue
                
                # Parse date
                if isinstance(txn_data['date'], str):
                    transaction_date = datetime.fromisoformat(txn_data['date'].replace('Z', '+00:00'))
                else:
                    transaction_date = txn_data['date']
                
                # Create transaction
                transaction = TransactionModel(
                    user_id=current_user.id,
                    amount=float(txn_data['amount']),
                    type=txn_data['type'],
                    category=txn_data.get('category', 'imported'),
                    subcategory=txn_data.get('subcategory'),
                    description=txn_data.get('description', ''),
                    reference_number=txn_data.get('reference_number'),
                    bank_account=txn_data.get('bank_account'),
                    payment_method=txn_data.get('payment_method'),
                    merchant_name=txn_data.get('merchant_name'),
                    location=txn_data.get('location'),
                    date=transaction_date,
                    tags=txn_data.get('tags', [])
                )
                
                db.add(transaction)
                imported_count += 1
                
            except Exception as e:
                errors.append(f"Row {i+1}: {str(e)}")
                failed_count += 1
        
        # Commit successful imports
        if imported_count > 0:
            db.commit()
        
        return {
            "message": f"Import completed. {imported_count} successful, {failed_count} failed.",
            "imported_count": imported_count,
            "failed_count": failed_count,
            "total_count": len(transactions_data),
            "errors": errors[:20]  # Return first 20 errors
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Bulk import failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")
