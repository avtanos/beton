# Руководство по деплою

## Деплой Frontend на GitHub Pages

### Автоматический деплой

Проект настроен для автоматического деплоя через GitHub Actions. При каждом push в ветку `main` или `master` frontend автоматически собирается и деплоится на GitHub Pages.

**Требования:**
1. Репозиторий должен быть публичным (или использовать GitHub Pro)
2. Включите GitHub Pages в настройках репозитория (Settings → Pages)
3. Выберите источник: "GitHub Actions"

**Настройка base path:**

Если ваш репозиторий называется `beton`, в `frontend/vite.config.ts` должно быть:
```typescript
base: '/beton/'
```

Если репозиторий называется `username.github.io`, используйте:
```typescript
base: '/'
```

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
CORS_ORIGINS=https://your-username.github.io,https://your-domain.com
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
        "https://your-username.github.io",
        "https://your-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

