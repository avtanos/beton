"""
Роутер для управления рецептурами
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import auth
from backend.models import User, Recipe
from backend.schemas import RecipeCreate, RecipeResponse, RecipeUpdate

router = APIRouter()

@router.post("/", response_model=RecipeResponse)
async def create_recipe(
    recipe_data: RecipeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["technologist", "admin"]))
):
    """Создание новой рецептуры (только технолог)"""
    # Проверка уникальности кода
    existing = db.query(Recipe).filter(Recipe.code == recipe_data.code).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Рецептура с таким кодом уже существует"
        )
    
    db_recipe = Recipe(
        **recipe_data.dict(),
        created_by=current_user.id
    )
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@router.get("/", response_model=List[RecipeResponse])
async def get_recipes(
    is_active: Optional[bool] = Query(None),
    is_gost: Optional[bool] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение списка рецептур"""
    query = db.query(Recipe)
    if is_active is not None:
        query = query.filter(Recipe.is_active == is_active)
    if is_gost is not None:
        query = query.filter(Recipe.is_gost == is_gost)
    recipes = query.order_by(Recipe.name).offset(skip).limit(limit).all()
    return recipes

@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user)
):
    """Получение рецептуры по ID"""
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Рецептура не найдена")
    return recipe

@router.patch("/{recipe_id}", response_model=RecipeResponse)
async def update_recipe(
    recipe_id: int,
    recipe_update: RecipeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["technologist", "admin"]))
):
    """Обновление рецептуры (только технолог)"""
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Рецептура не найдена")
    
    update_data = recipe_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(recipe, field, value)
    
    recipe.version += 1
    db.commit()
    db.refresh(recipe)
    return recipe

@router.delete("/{recipe_id}")
async def delete_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.require_role(["admin"]))
):
    """Удаление рецептуры (только администратор)"""
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Рецептура не найдена")
    db.delete(recipe)
    db.commit()
    return {"message": "Рецептура удалена"}

