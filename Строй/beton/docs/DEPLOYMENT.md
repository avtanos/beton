# Руководство по деплою

## Деплой Frontend на GitHub Pages

### Автоматический деплой

Проект настроен для автоматического деплоя через GitHub Actions. При каждом push в ветку `main` или `master` frontend автоматически собирается и деплоится на GitHub Pages.

**Требования:**
1. Репозиторий должен быть публичным (или использовать GitHub Pro)
2. Включите GitHub Pages в настройках репозитория (Settings → Pages)
3. Выберите источник: "GitHub Actions"
4. Workflow файл уже создан в `.github/workflows/deploy.yml`

**Настройка base path:**

Если ваш репозиторий называется `beton`, base path уже настроен как `/beton/` в:
- `frontend/vite.config.production.ts`
- `frontend/src/main.tsx` (BrowserRouter basename)

Если репозиторий называется `username.github.io`, измените:
- В `.github/workflows/deploy.yml`: `VITE_BASE_PATH: /`
- В `frontend/vite.config.production.ts`: `base: '/'`
- В `frontend/src/main.tsx`: `basename: '/'`

**Как это работает:**
1. При push в `main`/`master` автоматически запускается workflow
2. Устанавливаются зависимости Node.js
3. Собирается production build с правильным base path
4. Результат деплоится на GitHub Pages
5. Сайт доступен по адресу: `https://username.github.io/beton/`

### Ручной деплой

```bash
cd frontend
npm install
npm run build
# Загрузите содержимое dist/ в GitHub Pages
```

## Деплой Backend

### Heroku

1. Установите Heroku CLI
2. Войдите: `heroku login`
3. Создайте приложение: `heroku create your-app-name`
4. Настройте переменные:
   ```bash
   heroku config:set DATABASE_URL=postgresql://...
   heroku config:set SECRET_KEY=your-secret-key
   ```
5. Деплой:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Railway

1. Подключите GitHub репозиторий к Railway
2. Укажите корневую директорию: `backend`
3. Настройте переменные окружения
4. Railway автоматически задеплоит

### VPS (Ubuntu/Debian)

См. подробную инструкцию в [DEPLOY.md](../DEPLOY.md)

## Переменные окружения

### Backend

Создайте `.env` в `backend/`:

```env
DATABASE_URL=postgresql://user:password@localhost/beton_plant
SECRET_KEY=your-very-secret-key-change-this-in-production
CORS_ORIGINS=https://avtanos.github.io,https://your-domain.com
```

### Frontend

Создайте `.env.production` в `frontend/`:

```env
VITE_API_URL=https://your-backend-api.com/api
```

## Настройка CORS

В `backend/main.py` обновите список разрешенных источников:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://avtanos.github.io",
        "https://your-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

