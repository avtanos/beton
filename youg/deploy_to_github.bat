@echo off
echo ========================================
echo   TeamS Tracker - Deploy to GitHub
echo ========================================
echo.

echo Этот скрипт поможет задеплоить на GitHub Pages
echo.

:check_git
echo Проверка Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git не установлен!
    echo Установите Git: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✅ Git установлен
echo.

:check_repo
echo Проверка git репозитория...
if not exist ".git" (
    echo.
    echo Репозиторий не инициализирован.
    echo Хотите создать новый? (Y/N)
    set /p create_repo=
    if /i "%create_repo%"=="Y" (
        git init
        echo ✅ Git репозиторий создан
    ) else (
        echo Отменено
        pause
        exit /b 0
    )
)

echo.
echo Введите URL вашего GitHub репозитория:
echo Например: https://github.com/username/repo.git
set /p repo_url=

if "%repo_url%"=="" (
    echo ❌ URL не указан
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Сборка проекта...
echo ========================================
cd frontend
call npm install
call npm run build

if not exist "dist" (
    echo ❌ Ошибка сборки!
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo   Коммит и Push на GitHub...
echo ========================================

git add .
git commit -m "Deploy TeamS Task Tracker to GitHub Pages"

rem Проверяем есть ли remote origin
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin %repo_url%
) else (
    git remote set-url origin %repo_url%
)

git push -u origin main

echo.
echo ========================================
echo   ✅ Код загружен на GitHub!
echo ========================================
echo.
echo Следующие шаги:
echo.
echo 1. Откройте ваш репозиторий на GitHub
echo 2. Перейдите в Settings ^> Pages
echo 3. Source: выберите "GitHub Actions"
echo 4. Дождитесь завершения деплоя (вкладка Actions)
echo 5. Ваш сайт будет доступен на:
echo    https://YOUR_USERNAME.github.io/YOUR_REPO/
echo.
echo Не забудьте задеплоить backend отдельно!
echo См. DEPLOYMENT.md для инструкций
echo.
pause

