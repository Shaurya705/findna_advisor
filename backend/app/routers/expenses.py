from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import logging

from ..db import get_db
from ..schemas import (
    Expense, ExpenseCreate, User,
    PaginationParams, PaginatedResponse
)
from ..models import Expense as ExpenseModel, User as UserModel
from ..security import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/expenses", response_model=Expense)
async def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new expense record"""
    
    try:
        db_expense = ExpenseModel(
            user_id=current_user.id,
            amount=expense.amount,
            category=expense.category,
            subcategory=expense.subcategory,
            description=expense.description,
            date=expense.date,
            vendor_name=expense.vendor_name,
            payment_method=expense.payment_method,
            currency=expense.currency,
            exchange_rate=expense.exchange_rate,
            tax_amount=expense.tax_amount,
            tax_type=expense.tax_type,
            receipt_number=expense.receipt_number,
            is_reimbursable=expense.is_reimbursable,
            project_code=expense.project_code,
            notes=expense.notes,
            tags=expense.tags or [],
            location=expense.location
        )
        
        db.add(db_expense)
        db.commit()
        db.refresh(db_expense)
        
        return db_expense
        
    except Exception as e:
        logger.error(f"Create expense failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create expense: {str(e)}")

@router.get("/expenses", response_model=List[Expense])
async def get_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    search: Optional[str] = None,
    is_reimbursable: Optional[bool] = None,
    project_code: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's expenses with filtering options"""
    
    try:
        query = db.query(ExpenseModel).filter(
            ExpenseModel.user_id == current_user.id
        )
        
        # Apply filters
        if category:
            query = query.filter(ExpenseModel.category == category)
        
        if start_date:
            query = query.filter(ExpenseModel.date >= start_date)
        
        if end_date:
            query = query.filter(ExpenseModel.date <= end_date)
        
        if is_reimbursable is not None:
            query = query.filter(ExpenseModel.is_reimbursable == is_reimbursable)
        
        if project_code:
            query = query.filter(ExpenseModel.project_code == project_code)
        
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (ExpenseModel.description.ilike(search_term)) |
                (ExpenseModel.vendor_name.ilike(search_term)) |
                (ExpenseModel.receipt_number.ilike(search_term)) |
                (ExpenseModel.notes.ilike(search_term))
            )
        
        expenses = query.order_by(
            ExpenseModel.date.desc()
        ).offset(skip).limit(limit).all()
        
        return expenses
        
    except Exception as e:
        logger.error(f"Get expenses failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get expenses: {str(e)}")

@router.get("/expenses/{expense_id}", response_model=Expense)
async def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific expense details"""
    
    try:
        expense = db.query(ExpenseModel).filter(
            ExpenseModel.id == expense_id,
            ExpenseModel.user_id == current_user.id
        ).first()
        
        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        
        return expense
        
    except Exception as e:
        logger.error(f"Get expense failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get expense: {str(e)}")

@router.put("/expenses/{expense_id}", response_model=Expense)
async def update_expense(
    expense_id: int,
    expense_update: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing expense"""
    
    try:
        db_expense = db.query(ExpenseModel).filter(
            ExpenseModel.id == expense_id,
            ExpenseModel.user_id == current_user.id
        ).first()
        
        if not db_expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        
        # Update fields
        update_data = expense_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_expense, field, value)
        
        db.commit()
        db.refresh(db_expense)
        
        return db_expense
        
    except Exception as e:
        logger.error(f"Update expense failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update expense: {str(e)}")

@router.delete("/expenses/{expense_id}")
async def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an expense"""
    
    try:
        expense = db.query(ExpenseModel).filter(
            ExpenseModel.id == expense_id,
            ExpenseModel.user_id == current_user.id
        ).first()
        
        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        
        db.delete(expense)
        db.commit()
        
        return {"message": "Expense deleted successfully"}
        
    except Exception as e:
        logger.error(f"Delete expense failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete expense: {str(e)}")

@router.get("/expenses/categories/list")
async def get_expense_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of expense categories used by the user"""
    
    try:
        categories = db.query(ExpenseModel.category).filter(
            ExpenseModel.user_id == current_user.id,
            ExpenseModel.category.isnot(None)
        ).distinct().all()
        
        category_list = [row[0] for row in categories]
        
        # Add common expense categories if user has few categories
        common_categories = [
            "office_supplies", "travel", "meals", "transportation", "utilities",
            "software", "marketing", "professional_services", "equipment",
            "rent", "insurance", "training", "communication", "other"
        ]
        
        if len(category_list) < 10:
            for cat in common_categories:
                if cat not in category_list:
                    category_list.append(cat)
        
        return {"categories": sorted(category_list)}
        
    except Exception as e:
        logger.error(f"Get expense categories failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get categories: {str(e)}")

@router.get("/expenses/summary/monthly")
async def get_monthly_expense_summary(
    months: int = Query(12, ge=1, le=24),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get monthly expense summary"""
    
    try:
        # Calculate date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30 * months)
        
        # Fetch expenses
        expenses = db.query(ExpenseModel).filter(
            ExpenseModel.user_id == current_user.id,
            ExpenseModel.date >= start_date,
            ExpenseModel.date <= end_date
        ).all()
        
        # Group by month
        from collections import defaultdict
        monthly_data = defaultdict(lambda: {
            "total_amount": 0, "tax_amount": 0, "count": 0,
            "reimbursable": 0, "categories": defaultdict(float)
        })
        
        for expense in expenses:
            month_key = expense.date.strftime("%Y-%m")
            monthly_data[month_key]["total_amount"] += expense.amount
            monthly_data[month_key]["tax_amount"] += expense.tax_amount or 0
            monthly_data[month_key]["count"] += 1
            
            if expense.is_reimbursable:
                monthly_data[month_key]["reimbursable"] += expense.amount
            
            category = expense.category or "uncategorized"
            monthly_data[month_key]["categories"][category] += expense.amount
        
        # Format response
        summary = []
        for month, data in sorted(monthly_data.items()):
            # Get top categories for the month
            top_categories = sorted(
                data["categories"].items(),
                key=lambda x: x[1],
                reverse=True
            )[:5]
            
            summary.append({
                "month": month,
                "total_amount": data["total_amount"],
                "tax_amount": data["tax_amount"],
                "reimbursable_amount": data["reimbursable"],
                "expense_count": data["count"],
                "average_expense": data["total_amount"] / data["count"] if data["count"] > 0 else 0,
                "top_categories": [{"category": cat, "amount": amt} for cat, amt in top_categories]
            })
        
        return {
            "period": f"{start_date.strftime('%Y-%m')} to {end_date.strftime('%Y-%m')}",
            "summary": summary,
            "total_months": len(summary)
        }
        
    except Exception as e:
        logger.error(f"Get monthly expense summary failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get summary: {str(e)}")

@router.get("/expenses/summary/category")
async def get_category_expense_summary(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get expense summary by category"""
    
    try:
        # Set default date range (last 3 months)
        if not end_date:
            end_date = datetime.utcnow()
        if not start_date:
            start_date = end_date - timedelta(days=90)
        
        expenses = db.query(ExpenseModel).filter(
            ExpenseModel.user_id == current_user.id,
            ExpenseModel.date >= start_date,
            ExpenseModel.date <= end_date
        ).all()
        
        # Group by category
        from collections import defaultdict
        category_data = defaultdict(lambda: {
            "amount": 0, "tax_amount": 0, "count": 0,
            "reimbursable_amount": 0, "expenses": []
        })
        
        for expense in expenses:
            category = expense.category or "uncategorized"
            category_data[category]["amount"] += expense.amount
            category_data[category]["tax_amount"] += expense.tax_amount or 0
            category_data[category]["count"] += 1
            
            if expense.is_reimbursable:
                category_data[category]["reimbursable_amount"] += expense.amount
            
            category_data[category]["expenses"].append({
                "id": expense.id,
                "amount": expense.amount,
                "description": expense.description,
                "date": expense.date.isoformat(),
                "vendor_name": expense.vendor_name,
                "is_reimbursable": expense.is_reimbursable
            })
        
        # Format response
        summary = []
        total_amount = sum(data["amount"] for data in category_data.values())
        
        for category, data in sorted(category_data.items(), key=lambda x: x[1]["amount"], reverse=True):
            percentage = (data["amount"] / total_amount * 100) if total_amount > 0 else 0
            summary.append({
                "category": category,
                "amount": data["amount"],
                "tax_amount": data["tax_amount"],
                "count": data["count"],
                "percentage": round(percentage, 2),
                "avg_amount": data["amount"] / data["count"] if data["count"] > 0 else 0,
                "reimbursable_amount": data["reimbursable_amount"],
                "recent_expenses": data["expenses"][-5:]  # Last 5 expenses
            })
        
        return {
            "period": f"{start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            "total_amount": total_amount,
            "total_expenses": sum(data["count"] for data in category_data.values()),
            "total_tax": sum(data["tax_amount"] for data in category_data.values()),
            "total_reimbursable": sum(data["reimbursable_amount"] for data in category_data.values()),
            "categories": summary
        }
        
    except Exception as e:
        logger.error(f"Get expense category summary failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get category summary: {str(e)}")

@router.get("/expenses/projects/list")
async def get_project_codes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of project codes used by the user"""
    
    try:
        project_codes = db.query(ExpenseModel.project_code).filter(
            ExpenseModel.user_id == current_user.id,
            ExpenseModel.project_code.isnot(None)
        ).distinct().all()
        
        return {"project_codes": [row[0] for row in project_codes]}
        
    except Exception as e:
        logger.error(f"Get project codes failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get project codes: {str(e)}")

@router.get("/expenses/reimbursements/pending")
async def get_pending_reimbursements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get expenses that are marked as reimbursable but not yet reimbursed"""
    
    try:
        pending_expenses = db.query(ExpenseModel).filter(
            ExpenseModel.user_id == current_user.id,
            ExpenseModel.is_reimbursable == True,
            ExpenseModel.reimbursement_status != "reimbursed"  # Assuming this field exists
        ).order_by(ExpenseModel.date.desc()).all()
        
        total_pending = sum(expense.amount for expense in pending_expenses)
        
        # Group by project if available
        project_summary = {}
        for expense in pending_expenses:
            project = expense.project_code or "general"
            if project not in project_summary:
                project_summary[project] = {"amount": 0, "count": 0, "expenses": []}
            
            project_summary[project]["amount"] += expense.amount
            project_summary[project]["count"] += 1
            project_summary[project]["expenses"].append({
                "id": expense.id,
                "amount": expense.amount,
                "description": expense.description,
                "date": expense.date.isoformat(),
                "vendor_name": expense.vendor_name,
                "receipt_number": expense.receipt_number
            })
        
        return {
            "total_pending_amount": total_pending,
            "total_pending_count": len(pending_expenses),
            "by_project": project_summary,
            "recent_expenses": [
                {
                    "id": expense.id,
                    "amount": expense.amount,
                    "description": expense.description,
                    "date": expense.date.isoformat(),
                    "vendor_name": expense.vendor_name,
                    "project_code": expense.project_code
                }
                for expense in pending_expenses[:20]  # Latest 20
            ]
        }
        
    except Exception as e:
        logger.error(f"Get pending reimbursements failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get pending reimbursements: {str(e)}")

@router.post("/expenses/bulk/import")
async def import_expenses(
    expenses_data: List[dict],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Import multiple expenses from external data"""
    
    if len(expenses_data) > 500:
        raise HTTPException(status_code=400, detail="Maximum 500 expenses allowed per import")
    
    try:
        imported_count = 0
        failed_count = 0
        errors = []
        
        for i, exp_data in enumerate(expenses_data):
            try:
                # Validate required fields
                if not all(key in exp_data for key in ['amount', 'date']):
                    errors.append(f"Row {i+1}: Missing required fields (amount, date)")
                    failed_count += 1
                    continue
                
                # Parse date
                if isinstance(exp_data['date'], str):
                    expense_date = datetime.fromisoformat(exp_data['date'].replace('Z', '+00:00'))
                else:
                    expense_date = exp_data['date']
                
                # Create expense
                expense = ExpenseModel(
                    user_id=current_user.id,
                    amount=float(exp_data['amount']),
                    category=exp_data.get('category', 'imported'),
                    subcategory=exp_data.get('subcategory'),
                    description=exp_data.get('description', ''),
                    date=expense_date,
                    vendor_name=exp_data.get('vendor_name'),
                    payment_method=exp_data.get('payment_method'),
                    currency=exp_data.get('currency', 'USD'),
                    tax_amount=exp_data.get('tax_amount', 0),
                    tax_type=exp_data.get('tax_type'),
                    receipt_number=exp_data.get('receipt_number'),
                    is_reimbursable=exp_data.get('is_reimbursable', False),
                    project_code=exp_data.get('project_code'),
                    notes=exp_data.get('notes'),
                    tags=exp_data.get('tags', []),
                    location=exp_data.get('location')
                )
                
                db.add(expense)
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
            "total_count": len(expenses_data),
            "errors": errors[:20]  # Return first 20 errors
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Bulk expense import failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")
