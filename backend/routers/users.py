"""
Роутер для управления пользователями
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import auth
from backend.models import User
from backend.schemas import UserResponse, UserUpdate
from pydantic import BaseModel

router = APIRouter()

class UserUpdate(BaseModel):
    email: str = None
    full_name: str = None
    role: str = None
    is_active: bool = None

@router.get("/", response_model=List[UserResponse])
async def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["admin", "production_head"]))
):
    """Получение списка пользователей"""
    users = db.query(User).all()
    return users

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение пользователя по ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user

