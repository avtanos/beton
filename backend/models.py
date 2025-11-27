"""
Модели базы данных
"""
from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Boolean, 
    ForeignKey, Text, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
from backend.database import Base


class UserRole(str, enum.Enum):
    """Роли пользователей"""
    OPERATOR = "operator"  # Оператор АСУ ТП
    TECHNOLOGIST = "technologist"  # Технолог
    SHIFT_MASTER = "shift_master"  # Мастер смены
    LABORATORY = "laboratory"  # Лаборант
    PRODUCTION_HEAD = "production_head"  # Начальник производства
    LOGISTICS = "logistics"  # Логист/диспетчер
    ADMIN = "admin"  # Администратор системы


class OrderStatus(str, enum.Enum):
    """Статусы заказа"""
    PENDING = "pending"  # Ожидает
    IN_PROGRESS = "in_progress"  # В производстве
    COMPLETED = "completed"  # Выполнен
    CANCELLED = "cancelled"  # Отменен


class BatchStatus(str, enum.Enum):
    """Статусы партии"""
    PLANNED = "planned"  # Запланирована
    DOSING = "dosing"  # Дозирование
    MIXING = "mixing"  # Перемешивание
    DISCHARGING = "discharging"  # Выгрузка
    COMPLETED = "completed"  # Завершена
    ERROR = "error"  # Ошибка


class QualityStatus(str, enum.Enum):
    """Статусы качества"""
    PENDING = "pending"  # Ожидает проверки
    APPROVED = "approved"  # Одобрено
    REJECTED = "rejected"  # Отклонено


class User(Base):
    """Пользователь системы"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.OPERATOR)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    
    # Связи
    created_orders = relationship("Order", back_populates="created_by_user")
    quality_checks = relationship("QualityCheck", back_populates="lab_technician")


class Recipe(Base):
    """Рецептура бетона"""
    __tablename__ = "recipes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    code = Column(String, unique=True, index=True)  # Код рецепта (например, Б25)
    description = Column(Text)
    version = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    is_gost = Column(Boolean, default=False)  # Соответствие ГОСТ
    
    # Компоненты рецепта (кг на 1 м³)
    cement_kg = Column(Float, nullable=False)  # Цемент
    sand_kg = Column(Float, nullable=False)  # Песок
    gravel_kg = Column(Float, nullable=False)  # Щебень
    water_kg = Column(Float, nullable=False)  # Вода
    additive1_kg = Column(Float, default=0)  # Добавка 1 (пластификатор)
    additive2_kg = Column(Float, default=0)  # Добавка 2 (ускоритель)
    
    # Параметры производства
    mixing_time_sec = Column(Integer, default=120)  # Время перемешивания (сек)
    discharge_time_sec = Column(Integer, default=60)  # Время выгрузки (сек)
    
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Связи
    batches = relationship("Batch", back_populates="recipe")


class Order(Base):
    """Заказ на производство"""
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True, nullable=False)
    concrete_grade = Column(String, nullable=False)  # Марка бетона (Б25, М300 и т.д.)
    volume_m3 = Column(Float, nullable=False)  # Объем в м³
    planned_time = Column(DateTime)  # Планируемое время производства
    status = Column(SQLEnum(OrderStatus), default=OrderStatus.PENDING)
    
    # Связи
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    recipe = relationship("Recipe")
    
    created_by = Column(Integer, ForeignKey("users.id"))
    created_by_user = relationship("User", back_populates="created_orders")
    
    customer_name = Column(String)
    delivery_address = Column(String)
    vehicle_number = Column(String)  # Номер машины
    
    created_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime)
    
    # Связи
    batches = relationship("Batch", back_populates="order", cascade="all, delete-orphan")


class Batch(Base):
    """Производственная партия"""
    __tablename__ = "batches"
    
    id = Column(Integer, primary_key=True, index=True)
    batch_number = Column(String, unique=True, index=True, nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    
    volume_m3 = Column(Float, nullable=False)
    status = Column(SQLEnum(BatchStatus), default=BatchStatus.PLANNED)
    
    # Фактическое дозирование (кг)
    actual_cement_kg = Column(Float)
    actual_sand_kg = Column(Float)
    actual_gravel_kg = Column(Float)
    actual_water_kg = Column(Float)
    actual_additive1_kg = Column(Float)
    actual_additive2_kg = Column(Float)
    
    # Отклонения от рецепта (%)
    deviation_cement_pct = Column(Float)
    deviation_sand_pct = Column(Float)
    deviation_gravel_pct = Column(Float)
    deviation_water_pct = Column(Float)
    
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    
    # Связи
    order = relationship("Order", back_populates="batches")
    recipe = relationship("Recipe", back_populates="batches")
    quality_check = relationship("QualityCheck", back_populates="batch", uselist=False)
    dosing_logs = relationship("DosingLog", back_populates="batch")


class DosingLog(Base):
    """Лог дозирования компонентов"""
    __tablename__ = "dosing_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=False)
    component_type = Column(String, nullable=False)  # cement, sand, gravel, water, additive1, additive2
    planned_kg = Column(Float, nullable=False)
    actual_kg = Column(Float, nullable=False)
    deviation_pct = Column(Float)
    timestamp = Column(DateTime, default=func.now())
    
    # Связи
    batch = relationship("Batch", back_populates="dosing_logs")


class QualityCheck(Base):
    """Контроль качества"""
    __tablename__ = "quality_checks"
    
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), unique=True, nullable=False)
    
    # Лабораторные данные
    mobility_cm = Column(Float)  # Подвижность (см)
    strength_mpa = Column(Float)  # Прочность (МПа)
    moisture_pct = Column(Float)  # Влажность (%)
    
    # Отклонения
    deviations = Column(Text)  # Описание отклонений
    
    status = Column(SQLEnum(QualityStatus), default=QualityStatus.PENDING)
    checked_by = Column(Integer, ForeignKey("users.id"))
    checked_at = Column(DateTime, default=func.now())
    
    # Связи
    batch = relationship("Batch", back_populates="quality_check")
    lab_technician = relationship("User", back_populates="quality_checks")


class WarehouseMaterial(Base):
    """Склад сырья"""
    __tablename__ = "warehouse_materials"
    
    id = Column(Integer, primary_key=True, index=True)
    material_type = Column(String, nullable=False, index=True)  # cement, sand, gravel, water, additive1, additive2
    material_name = Column(String, nullable=False)
    storage_location = Column(String)  # Силос №1, Бункер №2 и т.д.
    
    current_stock_kg = Column(Float, default=0)  # Текущий остаток (кг)
    min_stock_kg = Column(Float, default=0)  # Минимальный остаток (кг)
    max_stock_kg = Column(Float)  # Максимальная вместимость (кг)
    
    # Для инертных материалов
    moisture_pct = Column(Float, default=0)  # Влажность (%)
    
    last_updated = Column(DateTime, default=func.now(), onupdate=func.now())


class EquipmentStatus(Base):
    """Статус оборудования"""
    __tablename__ = "equipment_status"
    
    id = Column(Integer, primary_key=True, index=True)
    equipment_name = Column(String, nullable=False, unique=True, index=True)
    equipment_type = Column(String)  # scale, mixer, conveyor, silo, etc.
    is_operational = Column(Boolean, default=True)
    status = Column(String)  # working, idle, error, maintenance
    last_update = Column(DateTime, default=func.now(), onupdate=func.now())
    error_message = Column(Text)

