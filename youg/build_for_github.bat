@echo off
echo ========================================
echo   TeamS Tracker - GitHub Pages Build
echo ========================================
echo.

echo 1. Переход в папку frontend...
cd frontend

echo.
echo 2. Установка зависимостей...
call npm install

echo.
echo 3. Сборка production версии...
call npm run build

echo.
echo 4. Проверка сборки...
if exist "dist" (
    echo ✅ Сборка успешна! Файлы в frontend\dist
    echo.
    echo Структура:
    dir dist /b
) else (
    echo ❌ Ошибка сборки!
    goto :error
)

echo.
echo ========================================
echo   ✅ Сборка завершена успешно!
echo ========================================
echo.
echo Следующие шаги:
echo 1. Создайте репозиторий на GitHub
echo 2. Запушьте код: git push origin main
echo 3. Настройте GitHub Pages в Settings
echo 4. Задеплойте backend отдельно (Render/Railway)
echo 5. Обновите VITE_API_URL в .env.production
echo.
echo Подробнее см. DEPLOYMENT.md
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo   ❌ Ошибка при сборке!
echo ========================================
echo.
echo Проверьте:
echo - Node.js установлен (node --version)
echo - Нет ошибок в консоли выше
echo - package.json корректен
echo.
pause
exit /b 1

