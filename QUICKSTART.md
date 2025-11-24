# Быстрый старт

## Шаг 1: Настройка Backend

```bash
# Перейти в корень проекта
cd D:\Строй\beton

# Создать виртуальное окружение (если ещё не создано)
python -m venv backend\venv

# Активировать виртуальное окружение
# Windows PowerShell:
.\backend\venv\Scripts\Activate.ps1
# Windows CMD:
backend\venv\Scripts\activate.bat
# Linux/Mac:
source backend/venv/bin/activate

# Установить зависимости
pip install -r backend/requirements.txt

# Инициализировать базу данных с тестовыми данными
python -m backend.init_db

# Запустить сервер
uvicorn backend.main:app --reload
```

Backend будет доступен на http://localhost:8000
API документация: http://localhost:8000/docs

## Шаг 2: Настройка Frontend

В новом терминале:

```bash
# Перейти в директорию frontend
cd frontend

# Установить зависимости
npm install

# Запустить dev сервер
npm run dev
```

Frontend будет доступен на http://localhost:3000

## Шаг 3: Вход в систему

Используйте тестовые учетные данные:

- **Администратор**: `admin` / `admin123`
- **Оператор**: `operator` / `operator123`
- **Технолог**: `technologist` / `tech123`

## Возможные проблемы

### Backend не запускается

1. Убедитесь, что Python 3.10+ установлен
2. Проверьте, что виртуальное окружение активировано
3. Убедитесь, что все зависимости установлены: `pip install -r requirements.txt`

### Frontend не запускается

1. Убедитесь, что Node.js 18+ установлен
2. Удалите `node_modules` и `package-lock.json`, затем выполните `npm install` заново
3. Проверьте, что порт 3000 свободен

### Ошибки подключения к API

1. Убедитесь, что backend запущен на порту 8000
2. Проверьте настройки прокси в `frontend/vite.config.ts`
3. Проверьте CORS настройки в `backend/main.py`

