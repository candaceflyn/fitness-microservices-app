@echo off
setlocal EnableDelayedExpansion
cd /d %~dp0

echo ==================================================
echo STOPPING FITNESS MICROSERVICES
echo ==================================================

echo.
echo Stopping Spring Boot services (Java processes)...
taskkill /F /IM java.exe >nul 2>&1

echo.
echo Stopping frontend (Node)...
taskkill /F /IM node.exe >nul 2>&1

echo.
echo Stopping Docker infrastructure...
docker compose down

echo.
echo ==================================================
echo ALL SERVICES STOPPED
echo ==================================================

pause
exit /b
