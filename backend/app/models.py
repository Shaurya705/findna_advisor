from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, JSON, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base
import enum

class UserRole(enum.Enum):
    USER = "user"
    ADMIN = "admin"
    ADVISOR = "advisor"

class InvoiceStatus(enum.Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    PROCESSED = "processed"
    VERIFIED = "verified"
    PAID = "paid"
    FAILED = "failed"

class TransactionType(enum.Enum):
    INCOME = "income"
    EXPENSE = "expense"
    TRANSFER = "transfer"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    gstin = Column(String)  # User's GST number
    business_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    invoices = relationship("Invoice", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    expenses = relationship("Expense", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")

class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    gstin = Column(String, unique=True)
    email = Column(String)
    phone = Column(String)
    address = Column(Text)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    invoices = relationship("Invoice", back_populates="vendor")

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    invoice_number = Column(String)
    invoice_date = Column(DateTime)
    due_date = Column(DateTime)
    total_amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    net_amount = Column(Float)
    currency = Column(String, default="INR")
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.UPLOADED)
    ocr_text = Column(Text)
    ocr_confidence = Column(Float)
    file_path = Column(String)
    extra_data = Column(JSON)  # Changed from metadata to extra_data
    gst_details = Column(JSON)  # GST breakdown
    anomaly_score = Column(Float)  # AI anomaly detection score
    is_anomaly = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="invoices")
    vendor = relationship("Vendor", back_populates="invoices")
    payments = relationship("Payment", back_populates="invoice")
    line_items = relationship("InvoiceLineItem", back_populates="invoice")

    # Backward-compat property: map `metadata` to `extra_data`
    @property
    def invoice_metadata(self):
        return self.extra_data

    @invoice_metadata.setter
    def invoice_metadata(self, value):
        self.extra_data = value

class InvoiceLineItem(Base):
    __tablename__ = "invoice_line_items"
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False)
    description = Column(String, nullable=False)
    quantity = Column(Float, default=1.0)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    tax_rate = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    hsn_code = Column(String)  # HSN/SAC code for GST
    
    # Relationships
    invoice = relationship("Invoice", back_populates="line_items")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(Enum(TransactionType), nullable=False)
    category = Column(String)
    subcategory = Column(String)
    description = Column(String)
    reference_number = Column(String)
    bank_account = Column(String)
    payment_method = Column(String)
    merchant_name = Column(String)
    location = Column(String)
    tags = Column(JSON)  # Array of tags
    anomaly_score = Column(Float)
    is_anomaly = Column(Boolean, default=False)
    sentiment_score = Column(Float)  # FinBERT sentiment analysis
    date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="transactions")

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    subcategory = Column(String)
    description = Column(String)
    receipt_path = Column(String)
    is_business_expense = Column(Boolean, default=False)
    is_tax_deductible = Column(Boolean, default=False)
    vendor_name = Column(String)
    project_id = Column(String)
    tags = Column(JSON)
    date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="expenses")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    invoice_id = Column(Integer, ForeignKey("invoices.id"))
    amount = Column(Float, nullable=False)
    payment_method = Column(String, nullable=False)
    payment_date = Column(DateTime, nullable=False)
    reference_number = Column(String)
    notes = Column(Text)
    status = Column(String, default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="payments")
    invoice = relationship("Invoice", back_populates="payments")

class Forecast(Base):
    __tablename__ = "forecasts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    forecast_type = Column(String, nullable=False)  # revenue, expense, cashflow
    period = Column(String, nullable=False)  # monthly, quarterly, yearly
    forecast_data = Column(JSON, nullable=False)  # Time series forecast data
    confidence_intervals = Column(JSON)
    model_used = Column(String)  # prophet, xgboost, etc.
    accuracy_metrics = Column(JSON)
    parameters = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)  # invoice, transaction, etc.
    resource_id = Column(Integer)
    old_values = Column(JSON)
    new_values = Column(JSON)
    ip_address = Column(String)
    user_agent = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="audit_logs")

class ChatConversation(Base):
    __tablename__ = "chat_conversations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    messages = relationship("ChatMessage", back_populates="conversation")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("chat_conversations.id"), nullable=False)
    role = Column(String, nullable=False)  # user, assistant, system
    content = Column(Text, nullable=False)
    extra_data = Column(JSON)  # Token usage, model info, etc. (Changed from metadata)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversation = relationship("ChatConversation", back_populates="messages")

class ComplianceReport(Base):
    __tablename__ = "compliance_reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_type = Column(String, nullable=False)  # gstr1, gstr3b, tally_export
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    data = Column(JSON, nullable=False)
    file_path = Column(String)
    status = Column(String, default="generated")
    created_at = Column(DateTime, default=datetime.utcnow)
    date = Column(DateTime, default=datetime.utcnow)
