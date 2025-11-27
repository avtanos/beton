"""
Роутер для мониторинга производства
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import auth
from backend.models import User, Batch, Order, EquipmentStatus, WarehouseMaterial, BatchStatus, OrderStatus
from backend.schemas import MonitoringDashboard, EquipmentStatusResponse, BatchResponse, WarehouseMaterialResponse

router = APIRouter()

@router.get("/dashboard", response_model=MonitoringDashboard)
async def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение данных для дашборда мониторинга"""
    # Активные партии
    active_batches = db.query(Batch).filter(
        Batch.status.in_([BatchStatus.DOSING, BatchStatus.MIXING, BatchStatus.DISCHARGING])
    ).count()
    
    # Ожидающие заказы
    pending_orders = db.query(Order).filter(Order.status == OrderStatus.PENDING).count()
    
    # Статус оборудования
    equipment = db.query(EquipmentStatus).all()
    equipment_status = [EquipmentStatusResponse.model_validate(eq) for eq in equipment]
    
    # Последние 100 партий
    recent_batches = db.query(Batch).order_by(
        Batch.created_at.desc()
    ).limit(100).all()
    recent_batches_response = [BatchResponse.model_validate(b) for b in recent_batches]
    
    # Материалы с низким остатком
    low_stock = db.query(WarehouseMaterial).filter(
        WarehouseMaterial.current_stock_kg <= WarehouseMaterial.min_stock_kg
    ).all()
    low_stock_response = [WarehouseMaterialResponse.model_validate(m) for m in low_stock]
    
    return MonitoringDashboard(
        active_batches=active_batches,
        pending_orders=pending_orders,
        equipment_status=equipment_status,
        recent_batches=recent_batches_response,
        low_stock_materials=low_stock_response
    )

@router.get("/equipment", response_model=List[EquipmentStatusResponse])
async def get_equipment_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение статуса всего оборудования"""
    equipment = db.query(EquipmentStatus).all()
    return [EquipmentStatusResponse.model_validate(eq) for eq in equipment]

