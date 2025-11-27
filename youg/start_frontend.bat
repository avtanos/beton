@echo off
echo Installing frontend dependencies...
cd frontend
call npm install
echo.
echo Starting Frontend Server...
call npm run dev
pause

