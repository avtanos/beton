"""
Роутер для управления складом сырья
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import auth
from backend.models import User, WarehouseMaterial
from backend.schemas import (
    WarehouseMaterialCreate, WarehouseMaterialResponse, WarehouseMaterialUpdate
)

router = APIRouter()

@router.post("/", response_model=WarehouseMaterialResponse)
async def create_material(
    material_data: WarehouseMaterialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["admin", "production_head"]))
):
    """Создание записи о материале на складе"""
    db_material = WarehouseMaterial(**material_data.dict())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

@router.get("/", response_model=List[WarehouseMaterialResponse])
async def get_materials(
    material_type: Optional[str] = Query(None),
    low_stock_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение списка материалов на складе"""
    query = db.query(WarehouseMaterial)
    if material_type:
        query = query.filter(WarehouseMaterial.material_type == material_type)
    if low_stock_only:
        query = query.filter(
            WarehouseMaterial.current_stock_kg <= WarehouseMaterial.min_stock_kg
        )
    materials = query.all()
    return materials

@router.get("/{material_id}", response_model=WarehouseMaterialResponse)
async def get_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение материала по ID"""
    material = db.query(WarehouseMaterial).filter(WarehouseMaterial.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Материал не найден")
    return material

@router.patch("/{material_id}", response_model=WarehouseMaterialResponse)
async def update_material(
    material_id: int,
    material_update: WarehouseMaterialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["operator", "admin", "production_head"]))
):
    """Обновление остатков материала"""
    material = db.query(WarehouseMaterial).filter(WarehouseMaterial.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Материал не найден")
    
    update_data = material_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(material, field, value)
    
    db.commit()
    db.refresh(material)
    return material

