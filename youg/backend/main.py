from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid
import json
import os
from pathlib import Path

app = FastAPI(title="TeamS Task Tracker API")

# CORS настройки - разрешаем все запросы с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],  # Убрали PUT - не используется
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Кэширование preflight запросов на 1 час
)

# ============= МОДЕЛИ ДАННЫХ =============

# Пользователи
class User(BaseModel):
    id: str
    email: str
    username: str
    full_name: str
    role: str = "member"  # admin, manager, member
    company_id: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool = True
    created_at: str

class UserCreate(BaseModel):
    email: str
    username: str
    full_name: str
    role: str = "member"
    company_id: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    company_id: Optional[str] = None
    is_active: Optional[bool] = None

# Компании
class Company(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""
    owner_id: str
    members_count: int = 0
    created_at: str

class CompanyCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    owner_id: str

class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

# Проекты
class Project(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""
    company_id: str
    owner_id: str
    status: str = "active"  # active, archived, completed
    color: str = "#3498db"
    created_at: str
    updated_at: str

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    company_id: str
    owner_id: str
    color: Optional[str] = "#3498db"

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    color: Optional[str] = None

# Роли и права доступа
class Role(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""
    permissions: List[str] = []
    company_id: Optional[str] = None
    created_at: str

class RoleCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    permissions: List[str] = []
    company_id: Optional[str] = None

# Членство в проекте
class ProjectMember(BaseModel):
    id: str
    project_id: str
    user_id: str
    role: str = "member"  # owner, admin, member, viewer
    joined_at: str

class ProjectMemberCreate(BaseModel):
    project_id: str
    user_id: str
    role: str = "member"

# Обновленные модели досок и задач
class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    status: str = "todo"
    priority: str = "medium"
    board_id: str
    assignee_id: Optional[str] = None
    assignee: Optional[str] = None  # Для обратной совместимости
    created_by: Optional[str] = None
    created_at: str
    updated_at: str
    position: int = 0
    tags: List[str] = []
    due_date: Optional[str] = None

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    status: str = "todo"
    priority: str = "medium"
    board_id: str
    assignee_id: Optional[str] = None
    created_by: Optional[str] = None
    tags: Optional[List[str]] = []
    due_date: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assignee_id: Optional[str] = None
    position: Optional[int] = None
    tags: Optional[List[str]] = None
    due_date: Optional[str] = None

class Board(BaseModel):
    id: str
    name: str
    description: Optional[str] = ""
    project_id: Optional[str] = None
    created_by: Optional[str] = None
    created_at: str
    columns: List[str] = ["todo", "in_progress", "review", "done"]

class BoardCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    project_id: Optional[str] = None
    created_by: Optional[str] = None
    columns: Optional[List[str]] = ["todo", "in_progress", "review", "done"]

# Хранилище данных
users_db = {}
companies_db = {}
projects_db = {}
roles_db = {}
project_members_db = {}
boards_db = {}
tasks_db = {}

# Путь к файлу данных
DATA_DIR = Path("data")
DATA_FILE = DATA_DIR / "database.json"

# Создаём директорию для данных, если её нет
DATA_DIR.mkdir(exist_ok=True)

# ============= ФУНКЦИИ СОХРАНЕНИЯ И ЗАГРУЗКИ =============

def save_data():
    """Сохраняет все данные в JSON файл"""
    try:
        data = {
            "users": {k: v.dict() for k, v in users_db.items()},
            "companies": {k: v.dict() for k, v in companies_db.items()},
            "projects": {k: v.dict() for k, v in projects_db.items()},
            "roles": {k: v.dict() for k, v in roles_db.items()},
            "project_members": {k: v.dict() for k, v in project_members_db.items()},
            "boards": {k: v.dict() for k, v in boards_db.items()},
            "tasks": {k: v.dict() for k, v in tasks_db.items()},
        }
        
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Данные сохранены: {DATA_FILE}")
    except Exception as e:
        print(f"❌ Ошибка при сохранении данных: {e}")

def load_data():
    """Загружает данные из JSON файла"""
    global users_db, companies_db, projects_db, roles_db, project_members_db, boards_db, tasks_db
    
    if not DATA_FILE.exists():
        print("ℹ️ Файл данных не найден, будут созданы демо данные")
        return False
    
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Загружаем данные в соответствующие хранилища
        users_db = {k: User(**v) for k, v in data.get("users", {}).items()}
        companies_db = {k: Company(**v) for k, v in data.get("companies", {}).items()}
        projects_db = {k: Project(**v) for k, v in data.get("projects", {}).items()}
        roles_db = {k: Role(**v) for k, v in data.get("roles", {}).items()}
        project_members_db = {k: ProjectMember(**v) for k, v in data.get("project_members", {}).items()}
        boards_db = {k: Board(**v) for k, v in data.get("boards", {}).items()}
        tasks_db = {k: Task(**v) for k, v in data.get("tasks", {}).items()}
        
        print(f"✅ Данные загружены из {DATA_FILE}")
        print(f"   👥 Пользователей: {len(users_db)}")
        print(f"   🏢 Компаний: {len(companies_db)}")
        print(f"   📁 Проектов: {len(projects_db)}")
        print(f"   🛡️ Ролей: {len(roles_db)}")
        print(f"   📋 Досок: {len(boards_db)}")
        print(f"   ✅ Задач: {len(tasks_db)}")
        return True
    except Exception as e:
        print(f"❌ Ошибка при загрузке данных: {e}")
        return False

@app.get("/")
def read_root():
    return {"message": "TeamS Task Tracker API", "version": "2.0.0"}

# ============= USERS ENDPOINTS =============

@app.get("/api/users", response_model=List[User])
def get_users(company_id: Optional[str] = None):
    if company_id:
        return [user for user in users_db.values() if user.company_id == company_id]
    return list(users_db.values())

@app.post("/api/users", response_model=User)
def create_user(user: UserCreate):
    user_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    new_user = User(
        id=user_id,
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        role=user.role,
        company_id=user.company_id,
        created_at=now
    )
    users_db[user_id] = new_user
    
    # Обновляем счетчик членов компании
    if user.company_id and user.company_id in companies_db:
        companies_db[user.company_id].members_count += 1
    
    save_data()
    return new_user

@app.get("/api/users/{user_id}", response_model=User)
def get_user(user_id: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

@app.patch("/api/users/{user_id}", response_model=User)
def update_user(user_id: str, user_update: UserUpdate):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    update_data = user_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(user, field, value)
    
    users_db[user_id] = user
    save_data()
    return user

@app.delete("/api/users/{user_id}")
def delete_user(user_id: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users_db[user_id]
    
    # Обновляем счетчик членов компании
    if user.company_id and user.company_id in companies_db:
        companies_db[user.company_id].members_count -= 1
    
    del users_db[user_id]
    save_data()
    return {"message": "User deleted successfully"}

# ============= COMPANIES ENDPOINTS =============

@app.get("/api/companies", response_model=List[Company])
def get_companies():
    return list(companies_db.values())

@app.post("/api/companies", response_model=Company)
def create_company(company: CompanyCreate):
    company_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    new_company = Company(
        id=company_id,
        name=company.name,
        description=company.description,
        owner_id=company.owner_id,
        members_count=1,
        created_at=now
    )
    companies_db[company_id] = new_company
    save_data()
    return new_company

@app.get("/api/companies/{company_id}", response_model=Company)
def get_company(company_id: str):
    if company_id not in companies_db:
        raise HTTPException(status_code=404, detail="Company not found")
    return companies_db[company_id]

@app.patch("/api/companies/{company_id}", response_model=Company)
def update_company(company_id: str, company_update: CompanyUpdate):
    if company_id not in companies_db:
        raise HTTPException(status_code=404, detail="Company not found")
    
    company = companies_db[company_id]
    update_data = company_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(company, field, value)
    
    companies_db[company_id] = company
    save_data()
    return company

@app.delete("/api/companies/{company_id}")
def delete_company(company_id: str):
    if company_id not in companies_db:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Удаляем все проекты компании
    projects_to_delete = [pid for pid, p in projects_db.items() if p.company_id == company_id]
    for pid in projects_to_delete:
        del projects_db[pid]
    
    del companies_db[company_id]
    save_data()
    return {"message": "Company deleted successfully"}

# ============= PROJECTS ENDPOINTS =============

@app.get("/api/projects", response_model=List[Project])
def get_projects(company_id: Optional[str] = None):
    if company_id:
        return [p for p in projects_db.values() if p.company_id == company_id]
    return list(projects_db.values())

@app.post("/api/projects", response_model=Project)
def create_project(project: ProjectCreate):
    if project.company_id not in companies_db:
        raise HTTPException(status_code=404, detail="Company not found")
    
    project_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    new_project = Project(
        id=project_id,
        name=project.name,
        description=project.description,
        company_id=project.company_id,
        owner_id=project.owner_id,
        color=project.color,
        created_at=now,
        updated_at=now
    )
    projects_db[project_id] = new_project
    save_data()
    return new_project

@app.get("/api/projects/{project_id}", response_model=Project)
def get_project(project_id: str):
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    return projects_db[project_id]

@app.patch("/api/projects/{project_id}", response_model=Project)
def update_project(project_id: str, project_update: ProjectUpdate):
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project = projects_db[project_id]
    update_data = project_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(project, field, value)
    
    project.updated_at = datetime.now().isoformat()
    projects_db[project_id] = project
    save_data()
    return project

@app.delete("/api/projects/{project_id}")
def delete_project(project_id: str):
    if project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Удаляем все доски проекта
    boards_to_delete = [bid for bid, b in boards_db.items() if b.project_id == project_id]
    for bid in boards_to_delete:
        # Удаляем задачи доски
        tasks_to_delete = [tid for tid, t in tasks_db.items() if t.board_id == bid]
        for tid in tasks_to_delete:
            del tasks_db[tid]
        del boards_db[bid]
    
    del projects_db[project_id]
    save_data()
    return {"message": "Project deleted successfully"}

# ============= PROJECT MEMBERS ENDPOINTS =============

@app.get("/api/projects/{project_id}/members", response_model=List[ProjectMember])
def get_project_members(project_id: str):
    return [m for m in project_members_db.values() if m.project_id == project_id]

@app.post("/api/project-members", response_model=ProjectMember)
def add_project_member(member: ProjectMemberCreate):
    if member.project_id not in projects_db:
        raise HTTPException(status_code=404, detail="Project not found")
    if member.user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    member_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    new_member = ProjectMember(
        id=member_id,
        project_id=member.project_id,
        user_id=member.user_id,
        role=member.role,
        joined_at=now
    )
    project_members_db[member_id] = new_member
    save_data()
    return new_member

@app.delete("/api/project-members/{member_id}")
def remove_project_member(member_id: str):
    if member_id not in project_members_db:
        raise HTTPException(status_code=404, detail="Member not found")
    
    del project_members_db[member_id]
    save_data()
    return {"message": "Member removed successfully"}

# ============= ROLES ENDPOINTS =============

@app.get("/api/roles", response_model=List[Role])
def get_roles(company_id: Optional[str] = None):
    if company_id:
        return [r for r in roles_db.values() if r.company_id == company_id]
    return list(roles_db.values())

@app.post("/api/roles", response_model=Role)
def create_role(role: RoleCreate):
    role_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    new_role = Role(
        id=role_id,
        name=role.name,
        description=role.description,
        permissions=role.permissions,
        company_id=role.company_id,
        created_at=now
    )
    roles_db[role_id] = new_role
    save_data()
    return new_role

@app.delete("/api/roles/{role_id}")
def delete_role(role_id: str):
    if role_id not in roles_db:
        raise HTTPException(status_code=404, detail="Role not found")
    
    del roles_db[role_id]
    save_data()
    return {"message": "Role deleted successfully"}

# Endpoints для досок
@app.get("/api/boards", response_model=List[Board])
def get_boards():
    return list(boards_db.values())

@app.post("/api/boards", response_model=Board)
def create_board(board: BoardCreate):
    board_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    new_board = Board(
        id=board_id,
        name=board.name,
        description=board.description,
        project_id=board.project_id,
        created_by=board.created_by,
        created_at=now,
        columns=board.columns
    )
    boards_db[board_id] = new_board
    save_data()
    return new_board

@app.get("/api/boards/{board_id}", response_model=Board)
def get_board(board_id: str):
    if board_id not in boards_db:
        raise HTTPException(status_code=404, detail="Board not found")
    return boards_db[board_id]

@app.delete("/api/boards/{board_id}")
def delete_board(board_id: str):
    if board_id not in boards_db:
        raise HTTPException(status_code=404, detail="Board not found")
    
    # Удаляем все задачи связанные с доской
    tasks_to_delete = [task_id for task_id, task in tasks_db.items() if task.board_id == board_id]
    for task_id in tasks_to_delete:
        del tasks_db[task_id]
    
    del boards_db[board_id]
    save_data()
    return {"message": "Board deleted successfully"}

# Endpoints для задач
@app.get("/api/boards/{board_id}/tasks", response_model=List[Task])
def get_tasks(board_id: str):
    if board_id not in boards_db:
        raise HTTPException(status_code=404, detail="Board not found")
    
    board_tasks = [task for task in tasks_db.values() if task.board_id == board_id]
    return sorted(board_tasks, key=lambda x: x.position)

@app.post("/api/tasks", response_model=Task)
def create_task(task: TaskCreate):
    if task.board_id not in boards_db:
        raise HTTPException(status_code=404, detail="Board not found")
    
    task_id = str(uuid.uuid4())
    now = datetime.now().isoformat()
    
    # Определяем позицию для новой задачи
    board_tasks = [t for t in tasks_db.values() if t.board_id == task.board_id and t.status == task.status]
    position = len(board_tasks)
    
    # Получаем имя исполнителя если указан ID
    assignee_name = None
    if task.assignee_id and task.assignee_id in users_db:
        assignee_name = users_db[task.assignee_id].full_name
    
    new_task = Task(
        id=task_id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        board_id=task.board_id,
        assignee_id=task.assignee_id,
        assignee=assignee_name,
        created_by=task.created_by,
        created_at=now,
        updated_at=now,
        position=position,
        tags=task.tags or [],
        due_date=task.due_date
    )
    tasks_db[task_id] = new_task
    save_data()
    return new_task

@app.get("/api/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks_db[task_id]

@app.patch("/api/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task_update: TaskUpdate):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks_db[task_id]
    update_data = task_update.dict(exclude_unset=True)
    
    # Обновляем имя исполнителя если изменился ID
    if 'assignee_id' in update_data and update_data['assignee_id']:
        if update_data['assignee_id'] in users_db:
            task.assignee = users_db[update_data['assignee_id']].full_name
    
    for field, value in update_data.items():
        setattr(task, field, value)
    
    task.updated_at = datetime.now().isoformat()
    tasks_db[task_id] = task
    save_data()
    return task

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    
    del tasks_db[task_id]
    save_data()
    return {"message": "Task deleted successfully"}

# Инициализация с демо данными
def init_demo_data():
    now = datetime.now().isoformat()
    
    # ===== КОМПАНИИ =====
    companies_data = [
        {
            "name": "TechCorp Solutions",
            "description": "Разработка корпоративного ПО и веб-приложений",
            "members_count": 12
        },
        {
            "name": "Digital Agency Pro",
            "description": "Креативное digital-агентство полного цикла",
            "members_count": 8
        },
        {
            "name": "StartUp Innovations",
            "description": "Инновационный стартап в области AI и ML",
            "members_count": 5
        }
    ]
    
    company_ids = []
    for company_data in companies_data:
        company_id = str(uuid.uuid4())
        company = Company(
            id=company_id,
            name=company_data["name"],
            description=company_data["description"],
            owner_id="",  # Обновим позже
            members_count=company_data["members_count"],
            created_at=now
        )
        companies_db[company_id] = company
        company_ids.append(company_id)
    
    # ===== ПОЛЬЗОВАТЕЛИ =====
    demo_users_data = [
        # TechCorp Solutions
        {"email": "alex.ivanov@techcorp.com", "username": "aivanov", "full_name": "Александр Иванов", "role": "admin", "company": 0},
        {"email": "maria.petrova@techcorp.com", "username": "mpetrova", "full_name": "Мария Петрова", "role": "manager", "company": 0},
        {"email": "dmitry.smirnov@techcorp.com", "username": "dsmirnov", "full_name": "Дмитрий Смирнов", "role": "member", "company": 0},
        {"email": "elena.kozlova@techcorp.com", "username": "ekozlova", "full_name": "Елена Козлова", "role": "member", "company": 0},
        {"email": "sergey.volkov@techcorp.com", "username": "svolkov", "full_name": "Сергей Волков", "role": "member", "company": 0},
        
        # Digital Agency Pro
        {"email": "anna.sokolova@digital.com", "username": "asokolova", "full_name": "Анна Соколова", "role": "admin", "company": 1},
        {"email": "igor.morozov@digital.com", "username": "imorozov", "full_name": "Игорь Морозов", "role": "manager", "company": 1},
        {"email": "olga.novikova@digital.com", "username": "onovikova", "full_name": "Ольга Новикова", "role": "member", "company": 1},
        {"email": "pavel.lebedev@digital.com", "username": "plebedev", "full_name": "Павел Лебедев", "role": "member", "company": 1},
        
        # StartUp Innovations
        {"email": "victor.popov@startup.com", "username": "vpopov", "full_name": "Виктор Попов", "role": "admin", "company": 2},
        {"email": "tatiana.vasileva@startup.com", "username": "tvasileva", "full_name": "Татьяна Васильева", "role": "manager", "company": 2},
        {"email": "andrey.fedorov@startup.com", "username": "afedorov", "full_name": "Андрей Фёдоров", "role": "member", "company": 2},
        
        # Фрилансеры без компании
        {"email": "freelancer@example.com", "username": "freelancer", "full_name": "Максим Фрилансер", "role": "member", "company": None},
    ]
    
    user_ids = []
    company_owners = {}
    
    for user_data in demo_users_data:
        user_id = str(uuid.uuid4())
        company_id = company_ids[user_data["company"]] if user_data["company"] is not None else None
        
        user = User(
            id=user_id,
            email=user_data["email"],
            username=user_data["username"],
            full_name=user_data["full_name"],
            role=user_data["role"],
            company_id=company_id,
            created_at=now
        )
        users_db[user_id] = user
        user_ids.append(user_id)
        
        # Запоминаем первого админа каждой компании как владельца
        if user_data["company"] is not None and user_data["role"] == "admin":
            if user_data["company"] not in company_owners:
                company_owners[user_data["company"]] = user_id
    
    # Обновляем владельцев компаний
    for idx, company_id in enumerate(company_ids):
        if idx in company_owners:
            companies_db[company_id].owner_id = company_owners[idx]
    
    # ===== РОЛИ =====
    roles_data = [
        {"name": "CEO", "description": "Генеральный директор", "permissions": ["admin", "manage_users", "manage_projects"], "company": 0},
        {"name": "Project Manager", "description": "Менеджер проектов", "permissions": ["read", "write", "manage_tasks", "manage_projects"], "company": 0},
        {"name": "Senior Developer", "description": "Старший разработчик", "permissions": ["read", "write", "manage_tasks"], "company": 0},
        {"name": "Developer", "description": "Разработчик", "permissions": ["read", "write"], "company": 0},
        {"name": "QA Engineer", "description": "Тестировщик", "permissions": ["read", "write"], "company": 0},
        
        {"name": "Creative Director", "description": "Креативный директор", "permissions": ["admin", "manage_users", "manage_projects"], "company": 1},
        {"name": "Designer", "description": "Дизайнер", "permissions": ["read", "write"], "company": 1},
        {"name": "Content Manager", "description": "Контент-менеджер", "permissions": ["read", "write"], "company": 1},
        
        {"name": "Founder", "description": "Основатель", "permissions": ["admin", "manage_users", "manage_projects"], "company": 2},
        {"name": "Tech Lead", "description": "Технический лидер", "permissions": ["read", "write", "manage_tasks"], "company": 2},
        
        # Глобальные роли
        {"name": "Администратор", "description": "Полный доступ к системе", "permissions": ["admin"], "company": None},
        {"name": "Наблюдатель", "description": "Только просмотр", "permissions": ["read"], "company": None},
    ]
    
    for role_data in roles_data:
        role_id = str(uuid.uuid4())
        company_id = company_ids[role_data["company"]] if role_data["company"] is not None else None
        
        role = Role(
            id=role_id,
            name=role_data["name"],
            description=role_data["description"],
            permissions=role_data["permissions"],
            company_id=company_id,
            created_at=now
        )
        roles_db[role_id] = role
    
    # ===== ПРОЕКТЫ =====
    projects_data = [
        # TechCorp Solutions
        {"name": "CRM System", "description": "Разработка корпоративной CRM системы", "company": 0, "owner": 0, "color": "#3498db", "status": "active", "members": [0, 1, 2, 3]},
        {"name": "Mobile App", "description": "Мобильное приложение для iOS и Android", "company": 0, "owner": 1, "color": "#9b59b6", "status": "active", "members": [1, 2, 4]},
        {"name": "Internal Tools", "description": "Внутренние инструменты компании", "company": 0, "owner": 2, "color": "#1abc9c", "status": "archived", "members": [2, 3]},
        
        # Digital Agency Pro
        {"name": "Client Website", "description": "Корпоративный сайт для клиента", "company": 1, "owner": 5, "color": "#e74c3c", "status": "active", "members": [5, 6, 7, 8]},
        {"name": "Social Media Campaign", "description": "Кампания в социальных сетях", "company": 1, "owner": 6, "color": "#f39c12", "status": "active", "members": [6, 7, 8]},
        
        # StartUp Innovations
        {"name": "AI Platform", "description": "Платформа машинного обучения", "company": 2, "owner": 9, "color": "#2ecc71", "status": "active", "members": [9, 10, 11]},
        {"name": "MVP Development", "description": "Разработка минимального продукта", "company": 2, "owner": 10, "color": "#34495e", "status": "completed", "members": [9, 10, 11]},
    ]
    
    project_ids = []
    for project_data in projects_data:
        project_id = str(uuid.uuid4())
        project = Project(
            id=project_id,
            name=project_data["name"],
            description=project_data["description"],
            company_id=company_ids[project_data["company"]],
            owner_id=user_ids[project_data["owner"]],
            color=project_data["color"],
            status=project_data["status"],
            created_at=now,
            updated_at=now
        )
        projects_db[project_id] = project
        project_ids.append(project_id)
        
        # Добавляем членов в проект
        for member_idx in project_data["members"]:
            member_id = str(uuid.uuid4())
            is_owner = member_idx == project_data["owner"]
            member = ProjectMember(
                id=member_id,
                project_id=project_id,
                user_id=user_ids[member_idx],
                role="owner" if is_owner else "member",
                joined_at=now
            )
            project_members_db[member_id] = member
    
    # ===== ДОСКИ =====
    boards_data = [
        {"name": "Sprint 1 - Backend", "description": "Разработка бэкенда CRM", "project": 0, "creator": 0},
        {"name": "Sprint 2 - Frontend", "description": "Разработка фронтенда CRM", "project": 0, "creator": 0},
        {"name": "iOS Development", "description": "Разработка iOS версии", "project": 1, "creator": 1},
        {"name": "Android Development", "description": "Разработка Android версии", "project": 1, "creator": 1},
        {"name": "Design Tasks", "description": "Дизайн сайта клиента", "project": 3, "creator": 5},
        {"name": "Content Creation", "description": "Создание контента", "project": 4, "creator": 6},
        {"name": "ML Models", "description": "Разработка ML моделей", "project": 5, "creator": 9},
        {"name": "Testing & QA", "description": "Тестирование платформы", "project": 5, "creator": 10},
    ]
    
    board_ids = []
    for board_data in boards_data:
        board_id = str(uuid.uuid4())
        board = Board(
            id=board_id,
            name=board_data["name"],
            description=board_data["description"],
            project_id=project_ids[board_data["project"]],
            created_by=user_ids[board_data["creator"]],
            created_at=now,
            columns=["todo", "in_progress", "review", "done"]
        )
        boards_db[board_id] = board
        board_ids.append(board_id)
    
    # ===== ЗАДАЧИ =====
    tasks_data = [
        # CRM Backend (Board 0)
        {"title": "Настроить PostgreSQL", "desc": "Установить и настроить базу данных", "board": 0, "status": "done", "priority": "high", "assignee": 2, "tags": ["backend", "database"]},
        {"title": "Создать API для авторизации", "desc": "JWT токены, refresh tokens", "board": 0, "status": "done", "priority": "high", "assignee": 2, "tags": ["backend", "auth"]},
        {"title": "Реализовать CRUD для клиентов", "desc": "API endpoints для работы с клиентами", "board": 0, "status": "in_progress", "priority": "high", "assignee": 3, "tags": ["backend", "api"]},
        {"title": "Добавить поиск и фильтры", "desc": "Поиск по клиентам с фильтрами", "board": 0, "status": "in_progress", "priority": "medium", "assignee": 2, "tags": ["backend", "feature"]},
        {"title": "Написать тесты", "desc": "Unit и integration тесты", "board": 0, "status": "todo", "priority": "medium", "assignee": 3, "tags": ["backend", "testing"]},
        {"title": "Оптимизация запросов", "desc": "Улучшить производительность БД", "board": 0, "status": "todo", "priority": "low", "assignee": 2, "tags": ["backend", "optimization"]},
        
        # CRM Frontend (Board 1)
        {"title": "Создать дизайн-систему", "desc": "Компоненты UI kit", "board": 1, "status": "done", "priority": "high", "assignee": 1, "tags": ["frontend", "design"]},
        {"title": "Реализовать аутентификацию", "desc": "Страницы логина и регистрации", "board": 1, "status": "review", "priority": "high", "assignee": 3, "tags": ["frontend", "auth"]},
        {"title": "Dashboard с графиками", "desc": "Дашборд с аналитикой", "board": 1, "status": "in_progress", "priority": "high", "assignee": 3, "tags": ["frontend", "charts"]},
        {"title": "Таблица клиентов", "desc": "Список клиентов с пагинацией", "board": 1, "status": "in_progress", "priority": "medium", "assignee": 1, "tags": ["frontend", "table"]},
        {"title": "Форма создания клиента", "desc": "Модальное окно с формой", "board": 1, "status": "todo", "priority": "medium", "assignee": 3, "tags": ["frontend", "form"]},
        
        # iOS Development (Board 2)
        {"title": "Настроить проект Xcode", "desc": "Инициализация iOS проекта", "board": 2, "status": "done", "priority": "high", "assignee": 2, "tags": ["ios", "setup"]},
        {"title": "Экран авторизации", "desc": "UI для логина", "board": 2, "status": "in_progress", "priority": "high", "assignee": 4, "tags": ["ios", "ui"]},
        {"title": "Главный экран", "desc": "Список задач", "board": 2, "status": "todo", "priority": "high", "assignee": 4, "tags": ["ios", "ui"]},
        {"title": "Интеграция с API", "desc": "Подключение к бэкенду", "board": 2, "status": "todo", "priority": "medium", "assignee": 2, "tags": ["ios", "api"]},
        
        # Android Development (Board 3)
        {"title": "Настроить Android Studio", "desc": "Инициализация проекта", "board": 3, "status": "done", "priority": "high", "assignee": 2, "tags": ["android", "setup"]},
        {"title": "Дизайн Material Design", "desc": "Адаптация дизайна", "board": 3, "status": "review", "priority": "high", "assignee": 4, "tags": ["android", "design"]},
        {"title": "Activity для логина", "desc": "Экран авторизации", "board": 3, "status": "in_progress", "priority": "high", "assignee": 4, "tags": ["android", "ui"]},
        {"title": "Список задач RecyclerView", "desc": "Главный экран", "board": 3, "status": "todo", "priority": "medium", "assignee": 4, "tags": ["android", "ui"]},
        
        # Design Tasks (Board 4)
        {"title": "Исследование конкурентов", "desc": "Анализ сайтов конкурентов", "board": 4, "status": "done", "priority": "high", "assignee": 7, "tags": ["design", "research"]},
        {"title": "Прототип главной страницы", "desc": "Wireframes в Figma", "board": 4, "status": "done", "priority": "high", "assignee": 7, "tags": ["design", "wireframes"]},
        {"title": "Дизайн главной страницы", "desc": "Финальный дизайн", "board": 4, "status": "review", "priority": "high", "assignee": 7, "tags": ["design", "ui"]},
        {"title": "Дизайн страницы услуг", "desc": "Разработка макета", "board": 4, "status": "in_progress", "priority": "medium", "assignee": 8, "tags": ["design", "ui"]},
        {"title": "Адаптивная версия", "desc": "Мобильная версия сайта", "board": 4, "status": "todo", "priority": "medium", "assignee": 7, "tags": ["design", "mobile"]},
        
        # Content Creation (Board 5)
        {"title": "Стратегия контента", "desc": "План публикаций", "board": 5, "status": "done", "priority": "high", "assignee": 6, "tags": ["content", "strategy"]},
        {"title": "Тексты для главной", "desc": "Написать тексты", "board": 5, "status": "review", "priority": "high", "assignee": 8, "tags": ["content", "copywriting"]},
        {"title": "Посты в соцсети", "desc": "10 постов для Instagram", "board": 5, "status": "in_progress", "priority": "medium", "assignee": 8, "tags": ["content", "social"]},
        {"title": "Email рассылка", "desc": "Шаблон письма", "board": 5, "status": "todo", "priority": "low", "assignee": 6, "tags": ["content", "email"]},
        
        # ML Models (Board 6)
        {"title": "Сбор датасета", "desc": "Подготовка данных для обучения", "board": 6, "status": "done", "priority": "high", "assignee": 11, "tags": ["ml", "data"]},
        {"title": "Baseline модель", "desc": "Простая модель для сравнения", "board": 6, "status": "done", "priority": "high", "assignee": 11, "tags": ["ml", "model"]},
        {"title": "Обучение BERT", "desc": "Fine-tuning BERT модели", "board": 6, "status": "in_progress", "priority": "high", "assignee": 11, "tags": ["ml", "bert"]},
        {"title": "Оптимизация модели", "desc": "Квантизация и pruning", "board": 6, "status": "todo", "priority": "medium", "assignee": 11, "tags": ["ml", "optimization"]},
        
        # Testing & QA (Board 7)
        {"title": "Тест-план", "desc": "Составить план тестирования", "board": 7, "status": "done", "priority": "high", "assignee": 10, "tags": ["qa", "planning"]},
        {"title": "Функциональное тестирование", "desc": "Проверка всех функций", "board": 7, "status": "in_progress", "priority": "high", "assignee": 10, "tags": ["qa", "functional"]},
        {"title": "Нагрузочное тестирование", "desc": "Проверка под нагрузкой", "board": 7, "status": "todo", "priority": "medium", "assignee": 10, "tags": ["qa", "load"]},
    ]
    
    for idx, task_data in enumerate(tasks_data):
        task_id = str(uuid.uuid4())
        assignee_id = user_ids[task_data["assignee"]]
        
        task = Task(
            id=task_id,
            title=task_data["title"],
            description=task_data["desc"],
            status=task_data["status"],
            priority=task_data["priority"],
            board_id=board_ids[task_data["board"]],
            assignee_id=assignee_id,
            assignee=users_db[assignee_id].full_name,
            created_by=user_ids[0],
            created_at=now,
            updated_at=now,
            position=idx,
            tags=task_data["tags"]
        )
        tasks_db[task_id] = task

# Загружаем данные при запуске или создаём демо данные
if not load_data():
    print("🔧 Создаём демо данные...")
    init_demo_data()
    save_data()
    print("✅ Демо данные созданы и сохранены")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

