from pydantic_settings import BaseSettings
from pydantic import AnyUrl, Field
from typing import List

class Settings(BaseSettings):
    app_name: str = Field(default="FinDNA API", alias="APP_NAME")
    api_prefix: str = Field(default="/api", alias="API_PREFIX")
    allowed_origins: List[str] = Field(default_factory=lambda: ["http://localhost:4028"], alias="ALLOWED_ORIGINS")

    jwt_secret: str = Field(default="change-me", alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    jwt_expire_minutes: int = Field(default=60, alias="JWT_EXPIRE_MINUTES")

    database_url: str = Field(default="sqlite:///./app.db", alias="DATABASE_URL")

    celery_broker_url: str = Field(default="redis://localhost:6379/0", alias="CELERY_BROKER_URL")
    celery_result_backend: str = Field(default="redis://localhost:6379/0", alias="CELERY_RESULT_BACKEND")

    gstn_api_key: str | None = Field(default=None, alias="GSTN_API_KEY")

    # LLM providers
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    gemini_api_key: str | None = Field(default=None, alias="GEMINI_API_KEY")
    llm_provider: str | None = Field(default="openai", alias="LLM_PROVIDER")  # "openai" | "gemini"
    gemini_model: str | None = Field(default="gemini-1.5-flash", alias="GEMINI_MODEL")
    enable_ai_advisor: bool = Field(default=False, alias="ENABLE_AI_ADVISOR")

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
