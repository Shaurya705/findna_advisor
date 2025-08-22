from pydantic import BaseModel, Field
from typing import Optional, List, Any

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: str
    password: str

class UploadResponse(BaseModel):
    job_id: str
    preview_text: Optional[str] = None

class AnalyzeResult(BaseModel):
    anomalies: List[dict] = Field(default_factory=list)
    summary: dict = Field(default_factory=dict)

class ForecastRequest(BaseModel):
    horizon: int = 12

class ForecastPoint(BaseModel):
    date: str
    value: float

class ForecastResult(BaseModel):
    series: List[ForecastPoint]

class AdviceRequest(BaseModel):
    message: str

class AdviceResponse(BaseModel):
    reply: str
