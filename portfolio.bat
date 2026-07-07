@echo off
echo Stopping any existing Portfolio Server...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Launching Portfolio in the background...
cd /d "%~dp0frontend"
powershell -Command "Start-Process cmd -ArgumentList '/c npm run dev' -WindowStyle Hidden"

echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo Opening website...
start http://localhost:5173/
