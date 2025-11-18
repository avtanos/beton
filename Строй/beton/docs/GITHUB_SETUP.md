# Настройка проекта на GitHub

## Шаг 1: Создание репозитория

1. Создайте новый репозиторий на GitHub
2. Название: `beton` (или любое другое)
3. Выберите публичный или приватный

## Шаг 2: Первоначальная настройка Git

```bash
# Инициализация репозитория (если еще не сделано)
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: АСУ ТП Бетонного завода"

# Добавление remote
git remote add origin https://github.com/your-username/beton.git

# Push в main ветку
git branch -M main
git push -u origin main
```

## Шаг 3: Настройка GitHub Pages

1. Перейдите в **Settings** → **Pages**
2. **Source**: выберите "GitHub Actions"
3. Сохраните настройки

## Шаг 4: Настройка base path

Если ваш репозиторий называется `beton`, в `frontend/vite.config.ts` уже настроено:
```typescript
base: '/beton/'
```

Если репозиторий называется `username.github.io`, измените на:
```typescript
base: '/'
```

## Шаг 5: Настройка секретов (опционально)

Если у вас есть продакшен backend API:

1. Перейдите в **Settings** → **Secrets and variables** → **Actions**
2. Добавьте новый секрет:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-api.com/api`

## Шаг 6: Проверка деплоя

1. После push в `main` ветку, GitHub Actions автоматически запустится
2. Проверьте статус в **Actions** вкладке
3. После успешного деплоя, сайт будет доступен по адресу:
   - `https://your-username.github.io/beton/`

## Шаг 7: Обновление README

Не забудьте обновить ссылки в README.md:
- Замените `your-username` на ваш GitHub username
- Обновите ссылки на демо и документацию

## Полезные команды Git

```bash
# Проверка статуса
git status

# Добавление изменений
git add .

# Коммит
git commit -m "Описание изменений"

# Push
git push origin main

# Создание новой ветки
git checkout -b feature/new-feature

# Слияние веток
git merge feature/new-feature
```

## Структура для GitHub

Проект уже настроен с правильной структурой:
- `.github/workflows/` - GitHub Actions
- `.github/ISSUE_TEMPLATE/` - Шаблоны issues
- `docs/` - Документация
- `.gitignore` - Игнорируемые файлы
- `LICENSE` - Лицензия

Все готово для публикации!

