from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List, Any, Dict
from datetime import datetime
from enum import Enum

# Enums
class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    ADVISOR = "advisor"

class InvoiceStatus(str, Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    PROCESSED = "processed"
    VERIFIED = "verified"
    PAID = "paid"
    FAILED = "failed"

class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"

# Base Classes
class BaseSchema(BaseModel):
    class Config:
        from_attributes = True

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user_info: Dict[str, Any]

class TokenData(BaseModel):
    email: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    business_name: Optional[str] = None
    gstin: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    business_name: Optional[str] = None
    gstin: Optional[str] = None
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    business_name: Optional[str] = None
    gstin: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Vendor Schemas
class VendorBase(BaseModel):
    name: str
    gstin: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class VendorCreate(VendorBase):
    pass

class Vendor(VendorBase):
    id: int
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Invoice Line Item Schemas
class InvoiceLineItemBase(BaseModel):
    description: str
    quantity: float = 1.0
    unit_price: float
    tax_rate: float = 0.0
    hsn_code: Optional[str] = None

class InvoiceLineItemCreate(InvoiceLineItemBase):
    pass

class InvoiceLineItem(InvoiceLineItemBase):
    id: int
    total_price: float
    tax_amount: float

    class Config:
        from_attributes = True

# Invoice Schemas
class InvoiceBase(BaseModel):
    invoice_number: Optional[str] = None
    invoice_date: Optional[datetime] = None
    due_date: Optional[datetime] = None
    total_amount: float
    tax_amount: float = 0.0
    currency: str = "INR"

class InvoiceCreate(InvoiceBase):
    vendor_id: Optional[int] = None
    line_items: Optional[List[InvoiceLineItemCreate]] = []

class InvoiceUpdate(BaseModel):
    status: Optional[InvoiceStatus] = None
    vendor_id: Optional[int] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[datetime] = None
    due_date: Optional[datetime] = None

class Invoice(InvoiceBase):
    id: int
    user_id: int
    vendor_id: Optional[int] = None
    net_amount: Optional[float] = None
    status: InvoiceStatus
    ocr_confidence: Optional[float] = None
    file_path: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    gst_details: Optional[Dict[str, Any]] = None
    anomaly_score: Optional[float] = None
    is_anomaly: bool
    created_at: datetime
    processed_at: Optional[datetime] = None
    vendor: Optional[Vendor] = None
    line_items: List[InvoiceLineItem] = []

    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    amount: float
    type: TransactionType
    category: str
    subcategory: Optional[str] = None
    description: Optional[str] = None
    reference_number: Optional[str] = None
    bank_account: Optional[str] = None
    payment_method: Optional[str] = None
    merchant_name: Optional[str] = None
    location: Optional[str] = None
    date: datetime

class TransactionCreate(TransactionBase):
    tags: Optional[List[str]] = []

class Transaction(TransactionBase):
    id: int
    user_id: int
    tags: Optional[List[str]] = []
    anomaly_score: Optional[float] = None
    is_anomaly: bool
    sentiment_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Expense Schemas
class ExpenseBase(BaseModel):
    amount: float
    category: str
    subcategory: Optional[str] = None
    description: Optional[str] = None
    is_business_expense: bool = False
    is_tax_deductible: bool = False
    vendor_name: Optional[str] = None
    project_id: Optional[str] = None
    date: datetime

class ExpenseCreate(ExpenseBase):
    tags: Optional[List[str]] = []

class Expense(ExpenseBase):
    id: int
    user_id: int
    receipt_path: Optional[str] = None
    tags: Optional[List[str]] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Payment Schemas
class PaymentBase(BaseModel):
    amount: float
    payment_method: str
    payment_date: datetime
    reference_number: Optional[str] = None
    notes: Optional[str] = None

class PaymentCreate(PaymentBase):
    invoice_id: Optional[int] = None

class Payment(PaymentBase):
    id: int
    user_id: int
    invoice_id: Optional[int] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Upload Schemas
class UploadResponse(BaseModel):
    job_id: str
    message: str
    preview_text: Optional[str] = None
    confidence: Optional[float] = None

class OCRResult(BaseModel):
    text: str
    confidence: float
    invoice_data: Optional[Dict[str, Any]] = None
    gst_details: Optional[Dict[str, Any]] = None

# Analysis Schemas
class AnalyzeRequest(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    categories: Optional[List[str]] = []
    include_forecasts: bool = False

class AnomalyResult(BaseModel):
    id: int
    type: str  # transaction, invoice, expense
    score: float
    reason: str
    data: Dict[str, Any]
    timestamp: datetime

class AnalyzeResult(BaseModel):
    anomalies: List[AnomalyResult] = []
    summary: Dict[str, Any] = {}
    insights: List[str] = []
    recommendations: List[str] = []

# Forecast Schemas
class ForecastRequest(BaseModel):
    type: str = "revenue"  # revenue, expense, cashflow
    horizon: int = 12  # months
    confidence_level: float = 0.95
    include_seasonality: bool = True

class ForecastPoint(BaseModel):
    date: str
    value: float
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None

class ForecastResult(BaseModel):
    type: str
    horizon: int
    model_used: str
    accuracy_metrics: Dict[str, float]
    series: List[ForecastPoint]
    insights: List[str]
    confidence_intervals: Dict[str, Any]

# Chat/Advice Schemas
class AdviceRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    context: Optional[Dict[str, Any]] = None

class AdviceResponse(BaseModel):
    reply: str
    conversation_id: int
    suggestions: List[str] = []
    relevant_data: Optional[Dict[str, Any]] = None

class ChatMessage(BaseModel):
    id: int
    role: str
    content: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class ChatConversation(BaseModel):
    id: int
    title: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessage] = []

    class Config:
        from_attributes = True

# Dashboard Schemas
class DashboardStats(BaseModel):
    total_invoices: int
    pending_payments: float
    monthly_revenue: float
    monthly_expenses: float
    cash_flow: float
    recent_transactions: List[Transaction]
    upcoming_payments: List[Payment]
    anomaly_alerts: List[AnomalyResult]

# Compliance Schemas
class ComplianceReportRequest(BaseModel):
    report_type: str  # gstr1, gstr3b, tally_export
    period_start: datetime
    period_end: datetime
    format: str = "json"  # json, xlsx, csv

class ComplianceReport(BaseModel):
    id: int
    report_type: str
    period_start: datetime
    period_end: datetime
    file_path: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Pagination
class PaginationParams(BaseModel):
    page: int = Field(1, ge=1)
    size: int = Field(20, ge=1, le=100)

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int
