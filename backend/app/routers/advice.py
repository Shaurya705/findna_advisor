from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import logging

from ..db import get_db
from ..schemas import (
    AdviceRequest, AdviceResponse, User, ChatConversation, 
    ChatMessage as ChatMessageSchema
)
from ..models import (
    ChatConversation as ConversationModel,
    ChatMessage as MessageModel,
    Transaction as TransactionModel,
    Invoice as InvoiceModel,
    User as UserModel
)
from ..security import get_current_user
from ..services.ai_advisor import AIAdvisorService

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize AI advisor service
ai_advisor = AIAdvisorService()

@router.post("/advice", response_model=AdviceResponse)
async def get_financial_advice(
    request: AdviceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get AI-powered financial advice"""
    
    try:
        # Get or create conversation
        conversation = None
        if request.conversation_id:
            conversation = db.query(ConversationModel).filter(
                ConversationModel.id == request.conversation_id,
                ConversationModel.user_id == current_user.id
            ).first()
        
        if not conversation:
            # Create new conversation
            conversation = ConversationModel(
                user_id=current_user.id,
                title=request.message[:50] + "..." if len(request.message) > 50 else request.message,
                is_active=True
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
        
        # Get conversation history
        history_messages = db.query(MessageModel).filter(
            MessageModel.conversation_id == conversation.id
        ).order_by(MessageModel.timestamp.asc()).all()
        
        conversation_history = [
            {
                "role": msg.role,
                "content": msg.content
            }
            for msg in history_messages[-10:]  # Last 10 messages
        ]
        
        # Prepare user context
        user_context = await _prepare_user_context(current_user.id, db, request.context)
        
        # Get AI advice
        advice_result = await ai_advisor.get_financial_advice(
            request.message,
            user_context,
            conversation_history
        )
        
        # Save user message
        user_message = MessageModel(
            conversation_id=conversation.id,
            role="user",
            content=request.message,
            metadata=request.context
        )
        db.add(user_message)
        
        # Save AI response
        ai_message = MessageModel(
            conversation_id=conversation.id,
            role="assistant",
            content=advice_result["reply"],
            metadata={
                "confidence": advice_result.get("confidence", 0.5),
                "suggestions": advice_result.get("suggestions", []),
                "relevant_data": advice_result.get("relevant_data")
            }
        )
        db.add(ai_message)
        
        # Update conversation timestamp
        conversation.updated_at = datetime.utcnow()
        
        db.commit()
        
        return AdviceResponse(
            reply=advice_result["reply"],
            conversation_id=conversation.id,
            suggestions=advice_result.get("suggestions", []),
            relevant_data=advice_result.get("relevant_data")
        )
        
    except Exception as e:
        logger.error(f"Advice generation failed for user {current_user.id}: {e}")
        # Fallback to rule-based response
        fallback_reply = _generate_fallback_advice(request.message)
        
        return AdviceResponse(
            reply=fallback_reply,
            conversation_id=request.conversation_id or 0,
            suggestions=["Try rephrasing your question", "Check back later for AI features"],
            relevant_data=None
        )

@router.get("/conversations", response_model=List[ChatConversation])
async def get_conversations(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's chat conversations"""
    
    try:
        conversations = db.query(ConversationModel).filter(
            ConversationModel.user_id == current_user.id,
            ConversationModel.is_active == True
        ).order_by(
            ConversationModel.updated_at.desc()
        ).limit(limit).all()
        
        return conversations
        
    except Exception as e:
        logger.error(f"Get conversations failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get conversations")

@router.get("/conversations/{conversation_id}", response_model=ChatConversation)
async def get_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific conversation with messages"""
    
    try:
        conversation = db.query(ConversationModel).filter(
            ConversationModel.id == conversation_id,
            ConversationModel.user_id == current_user.id
        ).first()
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        return conversation
        
    except Exception as e:
        logger.error(f"Get conversation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to get conversation")

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a conversation and its messages"""
    
    try:
        conversation = db.query(ConversationModel).filter(
            ConversationModel.id == conversation_id,
            ConversationModel.user_id == current_user.id
        ).first()
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Delete all messages in the conversation
        db.query(MessageModel).filter(
            MessageModel.conversation_id == conversation_id
        ).delete()
        
        # Delete the conversation
        db.delete(conversation)
        db.commit()
        
        return {"message": "Conversation deleted successfully"}
        
    except Exception as e:
        logger.error(f"Delete conversation failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete conversation")

@router.post("/conversations/{conversation_id}/title")
async def update_conversation_title(
    conversation_id: int,
    title: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update conversation title"""
    
    try:
        conversation = db.query(ConversationModel).filter(
            ConversationModel.id == conversation_id,
            ConversationModel.user_id == current_user.id
        ).first()
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        conversation.title = title[:100]  # Limit title length
        conversation.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {"message": "Title updated successfully", "title": conversation.title}
        
    except Exception as e:
        logger.error(f"Update conversation title failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to update title")

@router.get("/suggestions")
async def get_advice_suggestions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get personalized advice suggestions based on user's financial data"""
    
    try:
        suggestions = []
        
        # Get recent transactions
        recent_transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == current_user.id
        ).order_by(TransactionModel.date.desc()).limit(50).all()
        
        if recent_transactions:
            # Cash flow analysis suggestion
            income = sum(t.amount for t in recent_transactions if t.type.value == 'income')
            expense = sum(t.amount for t in recent_transactions if t.type.value == 'expense')
            
            if expense > income:
                suggestions.append({
                    "title": "Cash Flow Optimization",
                    "question": "How can I improve my cash flow?",
                    "category": "cash_flow"
                })
            
            # Expense analysis
            from collections import defaultdict
            category_expenses = defaultdict(float)
            for t in recent_transactions:
                if t.type.value == 'expense':
                    category_expenses[t.category] += t.amount
            
            if category_expenses:
                top_category = max(category_expenses.items(), key=lambda x: x[1])
                suggestions.append({
                    "title": f"Optimize {top_category[0].title()} Expenses",
                    "question": f"How can I reduce my {top_category[0]} expenses?",
                    "category": "expense_optimization"
                })
        
        # Check for pending invoices
        pending_invoices = db.query(InvoiceModel).filter(
            InvoiceModel.user_id == current_user.id,
            InvoiceModel.status != "paid"
        ).count()
        
        if pending_invoices > 0:
            suggestions.append({
                "title": "Invoice Management",
                "question": "How can I speed up invoice collections?",
                "category": "invoice_management"
            })
        
        # General suggestions
        general_suggestions = [
            {
                "title": "Tax Planning",
                "question": "What are the best tax-saving strategies for my situation?",
                "category": "tax_planning"
            },
            {
                "title": "Investment Planning",
                "question": "How should I invest my surplus funds?",
                "category": "investment"
            },
            {
                "title": "Budget Planning",
                "question": "Help me create a monthly budget plan",
                "category": "budgeting"
            },
            {
                "title": "Financial Health Check",
                "question": "Analyze my overall financial health",
                "category": "analysis"
            }
        ]
        
        suggestions.extend(general_suggestions)
        
        return {
            "suggestions": suggestions[:8],  # Return top 8 suggestions
            "personalized_count": len([s for s in suggestions if s["category"] in ["cash_flow", "expense_optimization", "invoice_management"]])
        }
        
    except Exception as e:
        logger.error(f"Get suggestions failed for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get suggestions")

async def _prepare_user_context(user_id: int, db: Session, additional_context: dict = None) -> dict:
    """Prepare comprehensive user context for AI advisor"""
    
    context = {}
    
    try:
        # User info
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if user:
            context['user_info'] = {
                'business_name': user.business_name,
                'gstin': user.gstin,
                'email': user.email
            }
        
        # Financial summary (last 3 months)
        three_months_ago = datetime.utcnow() - timedelta(days=90)
        recent_transactions = db.query(TransactionModel).filter(
            TransactionModel.user_id == user_id,
            TransactionModel.date >= three_months_ago
        ).all()
        
        if recent_transactions:
            monthly_revenue = sum(t.amount for t in recent_transactions if t.type.value == 'income') / 3
            monthly_expenses = sum(t.amount for t in recent_transactions if t.type.value == 'expense') / 3
            cash_flow = monthly_revenue - monthly_expenses
            
            context['financial_summary'] = {
                'monthly_revenue': monthly_revenue,
                'monthly_expenses': monthly_expenses,
                'cash_flow': cash_flow
            }
        
        # Recent transactions (last 10)
        recent_txns = db.query(TransactionModel).filter(
            TransactionModel.user_id == user_id
        ).order_by(TransactionModel.date.desc()).limit(10).all()
        
        context['recent_transactions'] = [
            {
                'amount': t.amount,
                'description': t.description,
                'category': t.category,
                'date': t.date.isoformat() if t.date else None
            }
            for t in recent_txns
        ]
        
        # Pending invoices
        pending_invoices = db.query(InvoiceModel).filter(
            InvoiceModel.user_id == user_id,
            InvoiceModel.status != "paid"
        ).all()
        
        if pending_invoices:
            pending_amount = sum(i.total_amount for i in pending_invoices)
            context['financial_summary']['pending_payments'] = pending_amount
        
        # Add additional context if provided
        if additional_context:
            context.update(additional_context)
        
        return context
        
    except Exception as e:
        logger.error(f"Error preparing user context: {e}")
        return context

def _generate_fallback_advice(message: str) -> str:
    """Generate rule-based advice when AI is not available"""
    
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['tax', 'deduction', '80c']):
        return """For tax savings, consider these options:
        
1. **80C Investments** (up to ₹1.5 lakh): ELSS, PPF, NSC, Tax-saving FDs
2. **80D Deductions**: Health insurance premiums
3. **NPS (National Pension Scheme)**: Additional ₹50,000 deduction under 80CCD(1B)
4. **Home Loan**: Interest deduction under 24(b) and principal under 80C
5. **Business Expenses**: Ensure all legitimate business expenses are claimed

Consult a CA for personalized tax planning."""
    
    elif any(word in message_lower for word in ['investment', 'invest', 'mutual fund']):
        return """Investment strategy recommendations:
        
1. **Emergency Fund**: Build 6 months expenses in liquid funds first
2. **Systematic Investment**: Start SIPs in diversified equity mutual funds
3. **Asset Allocation**: 60% equity, 30% debt, 10% alternatives (adjust based on risk tolerance)
4. **Tax-Efficient**: Consider ELSS for tax savings + growth
5. **Long-term Focus**: Stay invested for 7+ years for optimal returns

Review and rebalance annually. Consider consulting a SEBI-registered advisor."""
    
    elif any(word in message_lower for word in ['cash flow', 'money', 'budget']):
        return """Cash flow and budgeting tips:
        
1. **Track Expenses**: Categorize and monitor all expenses
2. **50-30-20 Rule**: 50% needs, 30% wants, 20% savings
3. **Accelerate Collections**: Follow up on invoices, offer early payment discounts
4. **Optimize Payments**: Negotiate terms with vendors
5. **Emergency Buffer**: Maintain 3-6 months operating expenses

Use expense tracking tools and review monthly."""
    
    elif any(word in message_lower for word in ['gst', 'compliance', 'filing']):
        return """GST compliance best practices:
        
1. **Timely Filing**: GSTR-1 by 11th, GSTR-3B by 20th of following month
2. **Input Tax Credit**: Ensure all purchase invoices are GST-compliant
3. **Record Keeping**: Maintain detailed records for 6 years
4. **E-way Bills**: Generate for goods movement above ₹50,000
5. **Regular Reconciliation**: Match purchase register with GSTR-2A

Consider GST software for automation and accuracy."""
    
    else:
        return """I'm here to help with your financial questions! I can assist with:
        
• **Cash Flow Management**: Optimize income and expenses
• **Tax Planning**: Maximize deductions and savings
• **Investment Strategy**: Build wealth systematically
• **Business Finance**: Invoice management, GST compliance
• **Budget Planning**: Create and track financial plans
• **Risk Management**: Insurance and emergency planning

Please ask specific questions about any of these areas for detailed guidance."""
