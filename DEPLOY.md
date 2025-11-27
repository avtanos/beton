# Инструкция по деплою проекта

## Деплой на GitHub Pages (Frontend)

### Автоматический деплой через GitHub Actions

1. **Создайте репозиторий на GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/avtanos/beton.git
   git push -u origin main
   ```

2. **Включите GitHub Pages**
   - Перейдите в Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` или `main` (в зависимости от workflow)

3. **Настройте base path в vite.config.ts**
   - Если репозиторий называется `beton`, используйте `base: '/beton/'`
   - Если репозиторий называется `username.github.io`, используйте `base: '/'`

4. **Workflow автоматически задеплоит при push в main**

### Ручной деплой

```bash
cd frontend
npm install
npm run build
# Затем загрузите содержимое dist/ в GitHub Pages
```

## Деплой Backend

### Вариант 1: Heroku

1. Установите Heroku CLI
2. Создайте приложение:
   ```bash
   cd backend
   heroku create your-app-name
   ```
3. Настройте переменные окружения:
   ```bash
   heroku config:set DATABASE_URL=postgresql://...
   heroku config:set SECRET_KEY=your-secret-key
   ```
4. Деплой:
   ```bash
   git subtree push --prefix backend heroku main
   ```

### Вариант 2: Railway

1. Подключите репозиторий к Railway
2. Укажите корневую директорию: `backend`
3. Настройте переменные окружения
4. Railway автоматически задеплоит

### Вариант 3: VPS (Ubuntu/Debian)

```bash
# На сервере
sudo apt update
sudo apt install python3 python3-pip postgresql nginx

# Клонирование репозитория
git clone https://github.com/avtanos/beton.git
cd beton/backend

# Создание виртуального окружения
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Настройка systemd service
sudo nano /etc/systemd/system/beton-backend.service
```

Содержимое service файла:
```ini
[Unit]
Description=Beton Plant Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/beton/backend
Environment="PATH=/path/to/beton/backend/venv/bin"
ExecStart=/path/to/beton/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable beton-backend
sudo systemctl start beton-backend
```

## Настройка CORS для продакшена

В `backend/main.py` обновите CORS настройки:

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

## Переменные окружения для продакшена

Создайте `.env` файл в `backend/`:

```env
DATABASE_URL=postgresql://user:password@localhost/beton_plant
SECRET_KEY=your-very-secret-key-change-this
CORS_ORIGINS=https://avtanos.github.io
```

## Инициализация БД на продакшене

```bash
cd backend
python -m backend.init_db
```

