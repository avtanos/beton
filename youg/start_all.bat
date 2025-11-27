@echo off
echo Starting Task Tracker Application...
echo.
echo Starting Backend in new window...
start "Backend Server" cmd /k "cd backend && python main.py"
echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak > nul
echo.
echo Starting Frontend in new window...
start "Frontend Server" cmd /k "cd frontend && npm install && npm run dev"
echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
pause

