"""
Роутер для управления заказами
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import auth
from backend.models import User, Order, OrderStatus
from backend.schemas import OrderCreate, OrderResponse, OrderUpdate
import uuid

router = APIRouter()

@router.post("/", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Создание нового заказа"""
    # Генерация номера заказа
    order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    db_order = Order(
        order_number=order_number,
        concrete_grade=order_data.concrete_grade,
        volume_m3=order_data.volume_m3,
        planned_time=order_data.planned_time,
        recipe_id=order_data.recipe_id,
        customer_name=order_data.customer_name,
        delivery_address=order_data.delivery_address,
        vehicle_number=order_data.vehicle_number,
        created_by=current_user.id,
        status=OrderStatus.PENDING
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    status: Optional[OrderStatus] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение списка заказов"""
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение заказа по ID"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return order

@router.patch("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: int,
    order_update: OrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["operator", "logistics", "admin"]))
):
    """Обновление заказа"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    
    if order_update.status:
        order.status = order_update.status
        if order_update.status == OrderStatus.COMPLETED:
            order.completed_at = datetime.now()
    
    if order_update.planned_time:
        order.planned_time = order_update.planned_time
    
    if order_update.vehicle_number:
        order.vehicle_number = order_update.vehicle_number
    
    db.commit()
    db.refresh(order)
    return order

@router.delete("/{order_id}")
async def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["admin"]))
):
    """Удаление заказа"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    db.delete(order)
    db.commit()
    return {"message": "Заказ удален"}

