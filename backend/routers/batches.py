"""
Роутер для управления производственными партиями
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import auth
from backend.models import User, Batch, BatchStatus, Order, Recipe, DosingLog
from backend.schemas import BatchCreate, BatchResponse, DosingLogResponse
import uuid

router = APIRouter()

@router.post("/", response_model=BatchResponse)
async def create_batch(
    batch_data: BatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["operator", "admin"]))
):
    """Создание новой производственной партии"""
    # Проверка существования заказа и рецепта
    order = db.query(Order).filter(Order.id == batch_data.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    
    recipe = db.query(Recipe).filter(Recipe.id == batch_data.recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Рецептура не найдена")
    
    # Генерация номера партии
    batch_number = f"BATCH-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    db_batch = Batch(
        batch_number=batch_number,
        order_id=batch_data.order_id,
        recipe_id=batch_data.recipe_id,
        volume_m3=batch_data.volume_m3,
        status=BatchStatus.PLANNED
    )
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch

@router.get("/", response_model=List[BatchResponse])
async def get_batches(
    status: Optional[BatchStatus] = Query(None),
    order_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение списка партий"""
    query = db.query(Batch)
    if status:
        query = query.filter(Batch.status == status)
    if order_id:
        query = query.filter(Batch.order_id == order_id)
    batches = query.order_by(Batch.created_at.desc()).offset(skip).limit(limit).all()
    return batches

@router.get("/{batch_id}", response_model=BatchResponse)
async def get_batch(
    batch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение партии по ID"""
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Партия не найдена")
    return batch

@router.post("/{batch_id}/start", response_model=BatchResponse)
async def start_batch(
    batch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["operator", "admin"]))
):
    """Запуск производства партии"""
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Партия не найдена")
    
    if batch.status != BatchStatus.PLANNED:
        raise HTTPException(
            status_code=400,
            detail=f"Партия уже в статусе {batch.status}"
        )
    
    batch.status = BatchStatus.DOSING
    batch.started_at = datetime.now()
    db.commit()
    db.refresh(batch)
    return batch

@router.post("/{batch_id}/complete-dosing", response_model=BatchResponse)
async def complete_dosing(
    batch_id: int,
    actual_cement: float,
    actual_sand: float,
    actual_gravel: float,
    actual_water: float,
    actual_additive1: float = 0,
    actual_additive2: float = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["operator", "admin"]))
):
    """Завершение дозирования с фактическими значениями"""
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Партия не найдена")
    
    recipe = db.query(Recipe).filter(Recipe.id == batch.recipe_id).first()
    
    # Расчет плановых значений с учетом объема
    planned_cement = recipe.cement_kg * batch.volume_m3
    planned_sand = recipe.sand_kg * batch.volume_m3
    planned_gravel = recipe.gravel_kg * batch.volume_m3
    planned_water = recipe.water_kg * batch.volume_m3
    planned_additive1 = recipe.additive1_kg * batch.volume_m3
    planned_additive2 = recipe.additive2_kg * batch.volume_m3
    
    # Расчет отклонений
    def calc_deviation(actual, planned):
        if planned == 0:
            return 0
        return ((actual - planned) / planned) * 100
    
    batch.actual_cement_kg = actual_cement
    batch.actual_sand_kg = actual_sand
    batch.actual_gravel_kg = actual_gravel
    batch.actual_water_kg = actual_water
    batch.actual_additive1_kg = actual_additive1
    batch.actual_additive2_kg = actual_additive2
    
    batch.deviation_cement_pct = calc_deviation(actual_cement, planned_cement)
    batch.deviation_sand_pct = calc_deviation(actual_sand, planned_sand)
    batch.deviation_gravel_pct = calc_deviation(actual_gravel, planned_gravel)
    batch.deviation_water_pct = calc_deviation(actual_water, planned_water)
    
    # Создание логов дозирования
    components = [
        ("cement", actual_cement, planned_cement),
        ("sand", actual_sand, planned_sand),
        ("gravel", actual_gravel, planned_gravel),
        ("water", actual_water, planned_water),
        ("additive1", actual_additive1, planned_additive1),
        ("additive2", actual_additive2, planned_additive2),
    ]
    
    for comp_type, actual, planned in components:
        if planned > 0:
            log = DosingLog(
                batch_id=batch_id,
                component_type=comp_type,
                planned_kg=planned,
                actual_kg=actual,
                deviation_pct=calc_deviation(actual, planned)
            )
            db.add(log)
    
    batch.status = BatchStatus.MIXING
    db.commit()
    db.refresh(batch)
    return batch

@router.post("/{batch_id}/complete", response_model=BatchResponse)
async def complete_batch(
    batch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["operator", "admin"]))
):
    """Завершение производства партии"""
    batch = db.query(Batch).filter(Batch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Партия не найдена")
    
    batch.status = BatchStatus.COMPLETED
    batch.completed_at = datetime.now()
    db.commit()
    db.refresh(batch)
    return batch

@router.get("/{batch_id}/dosing-logs", response_model=List[DosingLogResponse])
async def get_dosing_logs(
    batch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение логов дозирования для партии"""
    logs = db.query(DosingLog).filter(DosingLog.batch_id == batch_id).all()
    return logs

