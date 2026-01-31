@echo off
setlocal EnableDelayedExpansion
REM ==========================================
REM Gemini API Environment Variables
REM ==========================================

set GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=
set GEMINI_API_KEY=YOUR_REAL_API_KEY_HERE

cd /d %~dp0

call :header "STARTING INFRASTRUCTURE (DOCKER)"

docker compose up -d

call :waitForPort 5672 "RabbitMQ"
call :waitForPort 8181 "Keycloak"

call :header "STARTING CORE SERVICES"

echo Starting Eureka Server...
cd eureka
start /B mvn spring-boot:run
cd ..
call :waitForPort 8761 "Eureka Server"

echo Starting Config Server...
cd configserver
start /B mvn spring-boot:run
cd ..
call :waitForPort 8888 "Config Server"

call :header "STARTING BUSINESS SERVICES"

echo Starting User Service...
cd userservice
start /B mvn spring-boot:run
cd ..
call :waitForPort 8081 "User Service"

echo Starting Activity Service...
cd activityservice
start /B mvn spring-boot:run
cd ..
call :waitForPort 8082 "Activity Service"

echo Starting AI Service...
cd aiservice
start /B mvn spring-boot:run
cd ..
call :waitForPort 8083 "AI Service"

echo Starting API Gateway...
cd gateway
start /B mvn spring-boot:run
cd ..
call :waitForPort 8080 "API Gateway"

call :header "STARTING FRONTEND"

cd fitness-app-frontend
call npm install
start /B npm run dev
cd ..
call :waitForPort 5173 "Frontend (React)"

call :header "ALL SERVICES UP AND RUNNING"

pause
exit /b


:waitForPort
echo Waiting for %2 on port %1...
:loop
powershell -Command "Test-NetConnection localhost -Port %1 -InformationLevel Quiet" | findstr True >nul
if errorlevel 1 (
  timeout /t 3 >nul
  goto loop
)
exit /b


:header
echo.
echo ==================================================
echo %~1
echo ==================================================
echo.
exit /b
