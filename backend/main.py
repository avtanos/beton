"""
Главный файл FastAPI приложения для автоматизации бетонного завода
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.database import engine, Base
from backend.routers import (
    auth, orders, recipes, batches, warehouse, 
    quality, monitoring, users
)

# Создание таблиц при запуске
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="АСУ ТП Бетонного завода",
    description="Автоматизированная система управления технологическим процессом",
    version="1.0.0",
    lifespan=lifespan
)

# CORS настройки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(auth.router, prefix="/api/auth", tags=["Аутентификация"])
app.include_router(users.router, prefix="/api/users", tags=["Пользователи"])
app.include_router(orders.router, prefix="/api/orders", tags=["Заказы"])
app.include_router(recipes.router, prefix="/api/recipes", tags=["Рецептуры"])
app.include_router(batches.router, prefix="/api/batches", tags=["Партии"])
app.include_router(warehouse.router, prefix="/api/warehouse", tags=["Склад"])
app.include_router(quality.router, prefix="/api/quality", tags=["Качество"])
app.include_router(monitoring.router, prefix="/api/monitoring", tags=["Мониторинг"])

@app.get("/")
async def root():
    return {"message": "АСУ ТП Бетонного завода API", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

