"""
Pydantic схемы для валидации данных
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from backend.models import UserRole, OrderStatus, BatchStatus, QualityStatus


# User schemas
class UserBase(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str


# Recipe schemas
class RecipeBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    cement_kg: float
    sand_kg: float
    gravel_kg: float
    water_kg: float
    additive1_kg: float = 0
    additive2_kg: float = 0
    mixing_time_sec: int = 120
    discharge_time_sec: int = 60
    is_gost: bool = False

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    cement_kg: Optional[float] = None
    sand_kg: Optional[float] = None
    gravel_kg: Optional[float] = None
    water_kg: Optional[float] = None
    additive1_kg: Optional[float] = None
    additive2_kg: Optional[float] = None
    mixing_time_sec: Optional[int] = None
    discharge_time_sec: Optional[int] = None
    is_active: Optional[bool] = None

class RecipeResponse(RecipeBase):
    id: int
    version: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Order schemas
class OrderBase(BaseModel):
    concrete_grade: str
    volume_m3: float
    planned_time: Optional[datetime] = None
    customer_name: Optional[str] = None
    delivery_address: Optional[str] = None
    vehicle_number: Optional[str] = None

class OrderCreate(OrderBase):
    recipe_id: int

class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    planned_time: Optional[datetime] = None
    vehicle_number: Optional[str] = None

class OrderResponse(OrderBase):
    id: int
    order_number: str
    status: OrderStatus
    recipe_id: int
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# Batch schemas
class BatchBase(BaseModel):
    volume_m3: float

class BatchCreate(BatchBase):
    order_id: int
    recipe_id: int

class BatchResponse(BatchBase):
    id: int
    batch_number: str
    order_id: int
    recipe_id: int
    status: BatchStatus
    actual_cement_kg: Optional[float] = None
    actual_sand_kg: Optional[float] = None
    actual_gravel_kg: Optional[float] = None
    actual_water_kg: Optional[float] = None
    deviation_cement_pct: Optional[float] = None
    deviation_sand_pct: Optional[float] = None
    deviation_gravel_pct: Optional[float] = None
    deviation_water_pct: Optional[float] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


# DosingLog schemas
class DosingLogResponse(BaseModel):
    id: int
    batch_id: int
    component_type: str
    planned_kg: float
    actual_kg: float
    deviation_pct: Optional[float] = None
    timestamp: datetime
    
    class Config:
        from_attributes = True


# QualityCheck schemas
class QualityCheckBase(BaseModel):
    mobility_cm: Optional[float] = None
    strength_mpa: Optional[float] = None
    moisture_pct: Optional[float] = None
    deviations: Optional[str] = None

class QualityCheckCreate(QualityCheckBase):
    batch_id: int

class QualityCheckUpdate(BaseModel):
    mobility_cm: Optional[float] = None
    strength_mpa: Optional[float] = None
    moisture_pct: Optional[float] = None
    deviations: Optional[str] = None
    status: Optional[QualityStatus] = None

class QualityCheckResponse(QualityCheckBase):
    id: int
    batch_id: int
    status: QualityStatus
    checked_at: datetime
    
    class Config:
        from_attributes = True


# Warehouse schemas
class WarehouseMaterialBase(BaseModel):
    material_type: str
    material_name: str
    storage_location: Optional[str] = None
    current_stock_kg: float = 0
    min_stock_kg: float = 0
    max_stock_kg: Optional[float] = None
    moisture_pct: float = 0

class WarehouseMaterialCreate(WarehouseMaterialBase):
    pass

class WarehouseMaterialUpdate(BaseModel):
    current_stock_kg: Optional[float] = None
    min_stock_kg: Optional[float] = None
    moisture_pct: Optional[float] = None

class WarehouseMaterialResponse(WarehouseMaterialBase):
    id: int
    last_updated: datetime
    
    class Config:
        from_attributes = True


# Equipment schemas
class EquipmentStatusResponse(BaseModel):
    id: int
    equipment_name: str
    equipment_type: str
    is_operational: bool
    status: str
    last_update: datetime
    error_message: Optional[str] = None
    
    class Config:
        from_attributes = True


# Monitoring schemas
class MonitoringDashboard(BaseModel):
    active_batches: int
    pending_orders: int
    equipment_status: List[EquipmentStatusResponse]
    recent_batches: List[BatchResponse]
    low_stock_materials: List[WarehouseMaterialResponse]

