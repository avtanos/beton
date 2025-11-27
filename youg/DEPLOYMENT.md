# 🚀 Деплой TeamS Task Tracker на GitHub Pages

## 📋 Подготовка к деплою

### Шаг 1: Настройка API URL для продакшена

Создайте переменные окружения для разных режимов:

**frontend/.env.development**
```env
VITE_API_URL=http://localhost:8000/api
```

**frontend/.env.production**
```env
VITE_API_URL=https://your-backend-api.com/api
```

Затем обновите `frontend/src/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
```

### Шаг 2: Обновите base path в vite.config.js

Замените `/youg/` на имя вашего репозитория:

```javascript
base: '/your-repo-name/',  // Например: '/teams-tracker/'
```

Или для деплоя в корень (username.github.io):
```javascript
base: '/',
```

---

## 🏗️ Сборка проекта

### Локальная сборка

```bash
cd frontend
npm install
npm run build
```

Это создаст папку `frontend/dist` с production build.

### Тестирование сборки

```bash
npm run preview
```

Откроется http://localhost:4173 с production версией.

---

## 🌐 Деплой на GitHub Pages

### Вариант 1: Автоматический деплой через GitHub Actions (Рекомендуется)

#### 1. Создайте репозиторий на GitHub

```bash
# Инициализируйте git (если ещё не сделали)
git init
git add .
git commit -m "Initial commit - TeamS Task Tracker"

# Добавьте remote репозиторий
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

#### 2. Настройте GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Settings → Pages
3. Source: **GitHub Actions**

#### 3. Запушьте изменения

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push
```

GitHub Actions автоматически:
- ✅ Соберёт проект
- ✅ Задеплоит на GitHub Pages
- ✅ Будет доступно на `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

### Вариант 2: Ручной деплой через gh-pages

#### 1. Установите gh-pages

```bash
cd frontend
npm install --save-dev gh-pages
```

#### 2. Деплой командой

```bash
npm run deploy
```

Это автоматически:
- Соберёт проект
- Создаст ветку `gh-pages`
- Загрузит файлы на GitHub

#### 3. Настройте GitHub Pages

Settings → Pages → Source: **Deploy from branch** → Branch: **gh-pages** → Folder: **/ (root)**

---

## 🔧 Backend для продакшена

**Важно!** GitHub Pages - это **статический хостинг**, он не может запускать Python backend.

### Варианты для backend:

#### 1. Render.com (Рекомендуется, бесплатно)

1. Создайте аккаунт на https://render.com
2. New → Web Service
3. Подключите GitHub репозиторий
4. Настройки:
   - **Environment:** Python 3
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && python main.py`
   - **Port:** 8000

URL будет вида: `https://your-app.onrender.com`

#### 2. Railway.app (Простой, бесплатно)

```bash
# Установите Railway CLI
npm install -g @railway/cli

# Деплой
cd backend
railway login
railway init
railway up
```

#### 3. Heroku (Платно)

Создайте `Procfile` в корне:
```
web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

```bash
heroku create your-app-name
git push heroku main
```

#### 4. Vercel (для Python)

Создайте `vercel.json`:
```json
{
  "builds": [
    {
      "src": "backend/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/main.py"
    }
  ]
}
```

---

## 📁 Структура для деплоя

После сборки структура будет:

```
frontend/dist/           ← Деплоится на GitHub Pages
├── index.html
├── assets/
│   ├── index-xxx.js
│   ├── index-xxx.css
│   └── ...
└── .nojekyll           ← Важно для GitHub Pages
```

---

## ⚙️ Настройка API URL

После деплоя backend обновите:

**frontend/.env.production**
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

Пересоберите:
```bash
npm run build
```

---

## 🔒 CORS для продакшена

Обновите `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://YOUR_USERNAME.github.io",  # Добавьте ваш GitHub Pages URL
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)
```

---

## 📋 Чеклист деплоя

### Подготовка:
- [ ] Обновите `base` в `vite.config.js`
- [ ] Настройте `.env.production` с URL backend
- [ ] Обновите CORS в backend
- [ ] Протестируйте локально (`npm run build && npm run preview`)

### GitHub Pages (Frontend):
- [ ] Создайте репозиторий на GitHub
- [ ] Запушьте код
- [ ] Настройте GitHub Pages в Settings
- [ ] Дождитесь автоматической сборки
- [ ] Откройте URL и проверьте

### Backend:
- [ ] Выберите платформу (Render/Railway/Heroku)
- [ ] Создайте сервис
- [ ] Задеплойте backend
- [ ] Обновите CORS с GitHub Pages URL
- [ ] Обновите API_URL в frontend
- [ ] Пересоберите и задеплойте frontend

---

## 🎯 Быстрый старт

### 1. Обновите vite.config.js

```javascript
base: '/your-repo-name/',  // Имя репозитория
```

### 2. Соберите проект

```bash
cd frontend
npm run build
```

### 3. Создайте репозиторий и запушьте

```bash
git init
git add .
git commit -m "TeamS Task Tracker - Production build"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 4. Настройте GitHub Pages

Settings → Pages → Source: **GitHub Actions**

### 5. Деплойте backend отдельно

Используйте Render.com или Railway.app (см. инструкции выше)

---

## 📊 Что деплоится

### Frontend на GitHub Pages:
- ✅ React приложение (статические файлы)
- ✅ HTML, CSS, JavaScript
- ✅ Images и assets
- ✅ Работает как SPA

### Backend отдельно:
- ✅ FastAPI на Render/Railway/Heroku
- ✅ REST API
- ✅ База данных
- ✅ CORS настроен для GitHub Pages

---

## 🌟 После деплоя

Ваше приложение будет доступно по адресу:

**Frontend:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

**Backend API:**
```
https://your-app.onrender.com/api
или
https://your-app.railway.app/api
```

---

## 📝 Примечания

**GitHub Pages:**
- ✅ Бесплатно
- ✅ Автоматические обновления
- ✅ HTTPS из коробки
- ❌ Только статические файлы (нет backend)

**Backend хостинг:**
- Render.com - бесплатный tier (засыпает через 15 мин)
- Railway.app - $5 месяц
- Heroku - от $7 месяц

---

**Готово! Следуйте инструкциям для деплоя!** 🚀

