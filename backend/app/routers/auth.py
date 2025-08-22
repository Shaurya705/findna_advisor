from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from ..db import get_db
from ..models import User
from ..security import verify_password, get_password_hash, create_access_token
from ..config import settings
from ..schemas import Token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# Seed demo user on first dependency call
seeded = False

def seed_user(db: Session):
    global seeded
    if seeded:
        return
    user = db.query(User).filter(User.email == "demo@findna.ai").first()
    if not user:
        user = User(email="demo@findna.ai", hashed_password=get_password_hash("demo123"), role="admin")
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
    access_token = create_access_token(subject=str(user.id), expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}
