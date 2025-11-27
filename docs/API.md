# API Документация

## Базовый URL

- **Разработка**: `http://localhost:8000/api`
- **Продакшен**: `https://your-backend-api.com/api`

## Аутентификация

Большинство endpoints требуют JWT токен в заголовке:

```
Authorization: Bearer <access_token>
```

Получить токен можно через `/api/auth/login`

## Endpoints

### Аутентификация

#### POST /api/auth/login
Вход в систему

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

#### GET /api/auth/me
Получение информации о текущем пользователе

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@beton.ru",
  "full_name": "Администратор",
  "role": "admin",
  "is_active": true,
  "created_at": "2024-11-18T10:00:00"
}
```

### Заказы

#### GET /api/orders
Список заказов

**Query параметры:**
- `status` (optional): `pending`, `in_progress`, `completed`, `cancelled`
- `skip` (optional, default: 0): количество пропущенных записей
- `limit` (optional, default: 100): максимальное количество записей

#### POST /api/orders
Создание заказа

**Request:**
```json
{
  "concrete_grade": "Б25",
  "volume_m3": 10.5,
  "recipe_id": 1,
  "planned_time": "2024-11-18T14:00:00",
  "customer_name": "ООО СтройКомплекс",
  "delivery_address": "ул. Строителей, д. 15",
  "vehicle_number": "А123БВ777"
}
```

### Рецептуры

#### GET /api/recipes
Список рецептур

#### POST /api/recipes
Создание рецептуры (требуется роль технолога)

**Request:**
```json
{
  "name": "Бетон Б25",
  "code": "B25",
  "cement_kg": 350,
  "sand_kg": 600,
  "gravel_kg": 1200,
  "water_kg": 180,
  "additive1_kg": 2.5,
  "mixing_time_sec": 120,
  "is_gost": true
}
```

### Партии

#### GET /api/batches
Список партий

#### POST /api/batches/{id}/start
Запуск производства партии

#### POST /api/batches/{id}/complete-dosing
Завершение дозирования

**Request:**
```
?actual_cement=3675&actual_sand=6300&actual_gravel=12600&actual_water=1890
```

Полная документация доступна по адресу `/docs` (Swagger UI) при запущенном backend.

