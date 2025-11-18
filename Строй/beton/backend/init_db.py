"""
Скрипт для инициализации базы данных с тестовыми данными
"""
from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend.models import (
    User, Recipe, Order, Batch, WarehouseMaterial, EquipmentStatus, UserRole
)
from backend import auth
from datetime import datetime, timedelta

def init_db():
    """Инициализация базы данных"""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        # Создание администратора
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                email="admin@beton.ru",
                full_name="Администратор",
                role=UserRole.ADMIN,
                hashed_password=auth.get_password_hash("admin123"),
                is_active=True
            )
            db.add(admin)
        
        # Создание оператора
        operator = db.query(User).filter(User.username == "operator").first()
        if not operator:
            operator = User(
                username="operator",
                email="operator@beton.ru",
                full_name="Оператор",
                role=UserRole.OPERATOR,
                hashed_password=auth.get_password_hash("operator123"),
                is_active=True
            )
            db.add(operator)
        
        # Создание технолога
        technologist = db.query(User).filter(User.username == "technologist").first()
        if not technologist:
            technologist = User(
                username="technologist",
                email="technologist@beton.ru",
                full_name="Технолог",
                role=UserRole.TECHNOLOGIST,
                hashed_password=auth.get_password_hash("tech123"),
                is_active=True
            )
            db.add(technologist)
        
        # Создание рецептур
        recipe_b25 = db.query(Recipe).filter(Recipe.code == "B25").first()
        if not recipe_b25:
            recipe_b25 = Recipe(
                name="Бетон Б25",
                code="B25",
                description="Бетон марки Б25 по ГОСТ",
                cement_kg=350,
                sand_kg=600,
                gravel_kg=1200,
                water_kg=180,
                additive1_kg=2.5,
                mixing_time_sec=120,
                discharge_time_sec=60,
                is_gost=True,
                created_by=technologist.id if technologist else admin.id
            )
            db.add(recipe_b25)
        
        recipe_m300 = db.query(Recipe).filter(Recipe.code == "M300").first()
        if not recipe_m300:
            recipe_m300 = Recipe(
                name="Бетон М300",
                code="M300",
                description="Бетон марки М300",
                cement_kg=400,
                sand_kg=650,
                gravel_kg=1150,
                water_kg=200,
                additive1_kg=3.0,
                mixing_time_sec=150,
                discharge_time_sec=60,
                is_gost=True,
                created_by=technologist.id if technologist else admin.id
            )
            db.add(recipe_m300)
        
        # Создание материалов на складе
        materials = [
            {
                "material_type": "cement",
                "material_name": "Цемент ПЦ 500",
                "storage_location": "Силос №1",
                "current_stock_kg": 50000,
                "min_stock_kg": 10000,
                "max_stock_kg": 100000,
            },
            {
                "material_type": "sand",
                "material_name": "Песок речной",
                "storage_location": "Бункер №1",
                "current_stock_kg": 150000,
                "min_stock_kg": 30000,
                "max_stock_kg": 200000,
                "moisture_pct": 5.2,
            },
            {
                "material_type": "gravel",
                "material_name": "Щебень гранитный 20-40",
                "storage_location": "Бункер №2",
                "current_stock_kg": 200000,
                "min_stock_kg": 50000,
                "max_stock_kg": 300000,
            },
            {
                "material_type": "water",
                "material_name": "Вода техническая",
                "storage_location": "Емкость №1",
                "current_stock_kg": 50000,
                "min_stock_kg": 10000,
                "max_stock_kg": 100000,
            },
            {
                "material_type": "additive1",
                "material_name": "Пластификатор С-3",
                "storage_location": "Емкость №2",
                "current_stock_kg": 5000,
                "min_stock_kg": 1000,
                "max_stock_kg": 10000,
            },
        ]
        
        for mat_data in materials:
            existing = db.query(WarehouseMaterial).filter(
                WarehouseMaterial.material_type == mat_data["material_type"]
            ).first()
            if not existing:
                material = WarehouseMaterial(**mat_data)
                db.add(material)
        
        # Создание оборудования
        equipment_list = [
            {"equipment_name": "Весы цемента", "equipment_type": "scale", "status": "working"},
            {"equipment_name": "Весы песка", "equipment_type": "scale", "status": "working"},
            {"equipment_name": "Весы щебня", "equipment_type": "scale", "status": "working"},
            {"equipment_name": "Смеситель №1", "equipment_type": "mixer", "status": "idle"},
            {"equipment_name": "Конвейер №1", "equipment_type": "conveyor", "status": "working"},
            {"equipment_name": "Силос цемента №1", "equipment_type": "silo", "status": "working"},
        ]
        
        for eq_data in equipment_list:
            existing = db.query(EquipmentStatus).filter(
                EquipmentStatus.equipment_name == eq_data["equipment_name"]
            ).first()
            if not existing:
                equipment = EquipmentStatus(
                    **eq_data,
                    is_operational=True
                )
                db.add(equipment)
        
        db.commit()
        print("База данных инициализирована успешно!")
        print("\nТестовые пользователи:")
        print("  admin / admin123 (Администратор)")
        print("  operator / operator123 (Оператор)")
        print("  technologist / tech123 (Технолог)")
        
    except Exception as e:
        db.rollback()
        print(f"Ошибка при инициализации: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_db()

