# 📘 Полное руководство по деплою на GitHub Pages

## 🎯 Обзор

Этот гид поможет вам задеплоить **TeamS Task Tracker** на GitHub Pages за несколько шагов.

---

## 📦 Что вам понадобится

- ✅ Аккаунт на GitHub
- ✅ Git установлен на компьютере
- ✅ Node.js и npm установлены
- ✅ Код проекта готов

---

## 🚀 Быстрый деплой (5 шагов)

### Шаг 1: Обновите конфигурацию

**Откройте `frontend/vite.config.js`:**

Замените:
```javascript
base: '/youg/',
```

На:
```javascript
base: '/ИМЯ_ВАШЕГО_РЕПОЗИТОРИЯ/',  // Например: '/teams-tracker/'
```

Или для деплоя в корень (username.github.io):
```javascript
base: '/',
```

---

### Шаг 2: Соберите проект

**Запустите автоматический скрипт:**
```bash
build_for_github.bat
```

Или вручную:
```bash
cd frontend
npm install
npm run build
```

Появится папка `frontend/dist` с готовыми файлами! ✅

---

### Шаг 3: Создайте репозиторий на GitHub

1. Откройте https://github.com
2. Нажмите **New repository**
3. Введите имя (например: `teams-tracker`)
4. Нажмите **Create repository**

---

### Шаг 4: Загрузите код на GitHub

**Автоматический способ:**
```bash
deploy_to_github.bat
```

**Ручной способ:**
```bash
# Инициализируйте git (если не сделали)
git init

# Добавьте все файлы
git add .

# Сделайте коммит
git commit -m "Initial commit - TeamS Task Tracker"

# Добавьте remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Отправьте на GitHub
git branch -M main
git push -u origin main
```

---

### Шаг 5: Настройте GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** (шестерёнка)
3. В левом меню найдите **Pages**
4. В разделе **Source** выберите: **GitHub Actions**
5. Сохраните

**Готово!** GitHub автоматически:
- ✅ Соберёт проект
- ✅ Задеплоит на Pages
- ✅ Создаст URL вида: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## ⏱️ Процесс деплоя

### 1. GitHub Actions запустится автоматически

Перейдите во вкладку **Actions** в вашем репозитории.

Вы увидите workflow **"Deploy to GitHub Pages"** 🟢

### 2. Дождитесь завершения (~2-3 минуты)

Статусы:
- 🟡 **Queued** - в очереди
- 🔵 **In progress** - выполняется
- 🟢 **Success** - готово!
- 🔴 **Failed** - ошибка (проверьте логи)

### 3. Откройте ваш сайт

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

---

## 🔧 Backend - Отдельный деплой

**GitHub Pages НЕ поддерживает Python!** Backend нужно задеплоить отдельно.

### Рекомендуемая платформа: Render.com (бесплатно)

#### 1. Создайте аккаунт на Render.com

https://render.com

#### 2. Создайте Web Service

- Dashboard → **New** → **Web Service**
- Подключите GitHub репозиторий
- Или используйте Public Git URL

#### 3. Настройки:

```
Name: teams-tracker-api
Environment: Python 3
Region: выберите ближайший
Branch: main
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### 4. Environment Variables (опционально)

Можете добавить:
```
PYTHON_VERSION=3.11.0
```

#### 5. Нажмите **Create Web Service**

Деплой займёт ~5 минут. Получите URL вида:
```
https://teams-tracker-api.onrender.com
```

---

## 🔗 Связываем Frontend и Backend

### Шаг 1: Получите URL backend

После деплоя на Render, скопируйте URL (например: `https://teams-tracker-api.onrender.com`)

### Шаг 2: Обновите frontend

**Откройте `frontend/.env.production`:**
```env
VITE_API_URL=https://teams-tracker-api.onrender.com/api
```

### Шаг 3: Обновите CORS в backend

**Откройте `backend/main.py`:**

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://YOUR_USERNAME.github.io",  # ← Добавьте ваш GitHub Pages URL
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)
```

### Шаг 4: Пересоберите и обновите

```bash
# Пересоберите frontend
cd frontend
npm run build

# Закоммитьте и запушьте
cd ..
git add .
git commit -m "Update API URL for production"
git push
```

GitHub Actions автоматически пересоберёт и задеплоит! 🚀

---

## 🎬 Полный процесс деплоя

```
1. Собрать frontend          → npm run build
2. Запушить на GitHub         → git push
3. GitHub Actions деплоит     → автоматически
4. Frontend доступен          → GitHub Pages
5. Деплоить backend           → Render.com
6. Обновить API URL           → .env.production
7. Пересобрать frontend       → npm run build
8. Запушить изменения         → git push
9. ✅ Готово!                 → Всё работает
```

---

## 📁 Структура деплоя

```
GitHub Pages (Frontend):
https://username.github.io/repo/
├── index.html
├── assets/
│   ├── index-xxx.js
│   ├── index-xxx.css
│   └── vite.svg
└── .nojekyll

Render.com (Backend):
https://teams-tracker-api.onrender.com
└── /api/
    ├── /users
    ├── /companies
    ├── /projects
    ├── /boards
    └── /tasks
```

---

## ⚡ Альтернативные варианты backend

### Railway.app (Простой)

```bash
npm install -g @railway/cli
cd backend
railway login
railway init
railway up
```

URL: `https://your-app.up.railway.app`

### Vercel (Серверless)

```bash
npm install -g vercel
vercel login
vercel --prod
```

URL: `https://your-app.vercel.app`

### PythonAnywhere (Бесплатно)

1. Зарегистрируйтесь на https://www.pythonanywhere.com
2. Загрузите файлы backend
3. Настройте WSGI
4. URL: `https://username.pythonanywhere.com`

---

## 🔍 Проверка работы

### После деплоя проверьте:

**Frontend:**
1. Откройте `https://YOUR_USERNAME.github.io/YOUR_REPO/`
2. Страница загружается ✅
3. Интерфейс отображается ✅

**Backend API:**
1. Откройте `https://your-backend.onrender.com/docs`
2. Swagger UI загружается ✅
3. Endpoints доступны ✅

**Интеграция:**
1. Проверьте консоль браузера (F12)
2. Должны быть запросы к backend ✅
3. Нет CORS ошибок ✅
4. Данные загружаются ✅

---

## 🐛 Troubleshooting

### Проблема: Белая страница на GitHub Pages

**Решение:**
1. Проверьте `base` в `vite.config.js`
2. Должно быть: `base: '/имя-репозитория/'`
3. Пересоберите: `npm run build`

### Проблема: 404 при переходе по страницам

**Решение:**
Создайте `frontend/public/404.html` с содержимым `index.html`

### Проблема: CORS ошибки

**Решение:**
1. Проверьте CORS в backend
2. Добавьте GitHub Pages URL в `allow_origins`
3. Редеплойте backend

### Проблема: API не отвечает

**Решение:**
1. Проверьте что backend задеплоен
2. Откройте `https://your-backend.onrender.com/docs`
3. Проверьте переменную `VITE_API_URL`
4. Пересоберите frontend

---

## 📊 Стоимость хостинга

| Платформа | Frontend | Backend | Цена |
|-----------|----------|---------|------|
| GitHub Pages | ✅ | ❌ | **Бесплатно** |
| Render.com | ❌ | ✅ | **Бесплатно*** |
| Railway.app | ❌ | ✅ | $5/мес |
| Vercel | ✅ | ✅ | **Бесплатно** |
| Netlify | ✅ | ❌ | **Бесплатно** |

*Render бесплатный план засыпает через 15 минут неактивности

---

## 🎯 Рекомендуемая комбинация

**Для демо/тестирования:**
- Frontend: **GitHub Pages** (бесплатно)
- Backend: **Render.com** (бесплатно)

**Для продакшена:**
- Frontend: **Vercel/Netlify** (быстрее, CDN)
- Backend: **Railway/Render** (платно, не засыпает)
- Database: **PostgreSQL** (вместо JSON файла)

---

## 📚 Полезные ссылки

- [GitHub Pages Documentation](https://pages.github.com/)
- [Render.com Documentation](https://render.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Чеклист успешного деплоя

### Frontend (GitHub Pages):
- [ ] `vite.config.js` настроен (base path)
- [ ] `.env.production` создан с API URL
- [ ] `npm run build` выполнен успешно
- [ ] Код запушен на GitHub
- [ ] GitHub Pages настроен в Settings
- [ ] GitHub Actions успешно выполнен
- [ ] Сайт открывается по URL

### Backend (Render.com):
- [ ] Web Service создан на Render
- [ ] Build и Start команды настроены
- [ ] Backend успешно задеплоен
- [ ] `/docs` endpoint доступен
- [ ] CORS обновлён с GitHub Pages URL

### Интеграция:
- [ ] API URL обновлён в `.env.production`
- [ ] Frontend пересобран
- [ ] Изменения запушены
- [ ] Нет CORS ошибок
- [ ] Данные загружаются
- [ ] Все функции работают

---

## 🎉 Готово!

Ваш **TeamS Task Tracker** теперь в интернете!

**Frontend:** `https://username.github.io/repo/`  
**Backend:** `https://your-app.onrender.com`

**Поделитесь ссылкой с командой!** 🌟

---

*TeamS Task Tracker v2.2.0 - Готов к деплою!*

