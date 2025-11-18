"""
Роутер для управления контролем качества
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import auth
from backend.models import User, QualityCheck, Batch, QualityStatus
from backend.schemas import (
    QualityCheckCreate, QualityCheckResponse, QualityCheckUpdate
)

router = APIRouter()

@router.post("/", response_model=QualityCheckResponse)
async def create_quality_check(
    quality_data: QualityCheckCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["laboratory", "admin"]))
):
    """Создание записи контроля качества (только лаборант)"""
    # Проверка существования партии
    batch = db.query(Batch).filter(Batch.id == quality_data.batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Партия не найдена")
    
    # Проверка, что запись еще не создана
    existing = db.query(QualityCheck).filter(QualityCheck.batch_id == quality_data.batch_id).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Запись контроля качества для этой партии уже существует"
        )
    
    db_quality = QualityCheck(
        **quality_data.dict(),
        checked_by=current_user.id
    )
    db.add(db_quality)
    db.commit()
    db.refresh(db_quality)
    return db_quality

@router.get("/", response_model=List[QualityCheckResponse])
async def get_quality_checks(
    status: Optional[QualityStatus] = Query(None),
    batch_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение списка проверок качества"""
    query = db.query(QualityCheck)
    if status:
        query = query.filter(QualityCheck.status == status)
    if batch_id:
        query = query.filter(QualityCheck.batch_id == batch_id)
    checks = query.order_by(QualityCheck.checked_at.desc()).offset(skip).limit(limit).all()
    return checks

@router.get("/{check_id}", response_model=QualityCheckResponse)
async def get_quality_check(
    check_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение проверки качества по ID"""
    check = db.query(QualityCheck).filter(QualityCheck.id == check_id).first()
    if not check:
        raise HTTPException(status_code=404, detail="Проверка качества не найдена")
    return check

@router.patch("/{check_id}", response_model=QualityCheckResponse)
async def update_quality_check(
    check_id: int,
    quality_update: QualityCheckUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["laboratory", "technologist", "admin"]))
):
    """Обновление проверки качества"""
    check = db.query(QualityCheck).filter(QualityCheck.id == check_id).first()
    if not check:
        raise HTTPException(status_code=404, detail="Проверка качества не найдена")
    
    update_data = quality_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(check, field, value)
    
    db.commit()
    db.refresh(check)
    return check

