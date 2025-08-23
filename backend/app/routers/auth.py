from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from ..db import get_db
from ..models import User
from ..security import verify_password, get_password_hash, create_access_token
from ..config import settings
from ..schemas import Token, User as UserSchema
from ..security import get_current_user

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# Seed demo user on first dependency call
seeded = False

def seed_user(db: Session):
    global seeded
    if seeded:
        return
    demo_users = [
        ("demo@findna.ai", "demo123", "admin"),
        ("demo@finvoice.ai", "demo123", "user"),
    ]
    for email, password, role in demo_users:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email, hashed_password=get_password_hash(password), role=role)
            db.add(user)
            db.commit()
    seeded = True

@router.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    seed_user(db)
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=settings.jwt_expire_minutes)
    # Use email as JWT subject so downstream can resolve user correctly
    access_token = create_access_token(subject=user.email, expires_delta=access_token_expires)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": int(access_token_expires.total_seconds()),
        "user_info": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
        },
    }

@router.get("/me", response_model=UserSchema)
def me(current_user: User = Depends(get_current_user)):
    """Return current authenticated user."""
    return current_user
