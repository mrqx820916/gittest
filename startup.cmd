@echo off
chcp 65001
setlocal EnableDelayedExpansion

cls
echo ================================
echo      Meituan H5 Startup Tool
echo ================================
echo.

REM Create log file
echo Start Time: %date% %time% > startup.log

REM Check Node.js
echo [1/6] Checking Node.js...
node --version >> startup.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] Please install Node.js first
    echo [Error] Please install Node.js first >> startup.log
    pause
    exit /b 1
)

REM Check MongoDB
echo [2/6] Checking MongoDB...
mongod --version >> startup.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] Please install MongoDB first
    echo [Error] Please install MongoDB first >> startup.log
    pause
    exit /b 1
)

REM Create data directory
if not exist "C:\data\db" (
    echo Creating MongoDB data directory...
    mkdir "C:\data\db"
)

REM Start MongoDB
echo [3/6] Starting MongoDB...
start "MongoDB Server" cmd /k "mongod --dbpath=C:\data\db"

REM Wait for MongoDB
echo Waiting for MongoDB...
:wait_mongodb
timeout /t 2 /nobreak > nul
mongosh --eval "db.version()" --quiet > nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is starting...
    goto wait_mongodb
)
echo MongoDB is ready

REM Install dependencies
echo [4/6] Installing dependencies...
echo Installing frontend dependencies... >> startup.log
call npm install >> startup.log 2>&1

echo Installing backend dependencies... >> startup.log
cd server
call npm install >> ../startup.log 2>&1
cd ..

echo Installing admin dependencies... >> startup.log
cd admin
call npm install >> ../startup.log 2>&1
cd ..

REM Initialize database
echo [5/6] Initializing database...
cd server
echo Starting data initialization... >> ../startup.log
call npm run init >> ../startup.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] Database initialization failed
    echo Please check startup.log for details
    cd ..
    pause
    exit /b 1
)
cd ..

REM Start all services
echo [6/6] Starting services...

REM Start backend
cd server
start "Backend Service" cmd /k "color 0A && echo Starting backend service... && npm run dev"
cd ..

REM Wait for backend
timeout /t 5 /nobreak > nul

REM Start frontend
start "Frontend Service" cmd /k "color 0B && echo Starting frontend service... && npm run dev"

REM Wait for frontend
timeout /t 3 /nobreak > nul

REM Start admin
cd admin
start "Admin Service" cmd /k "color 0C && echo Starting admin service... && npm run dev"
cd ..

cls
echo ================================
echo        Services Started
echo ================================
echo.
echo Service URLs:
echo - Frontend: http://localhost:8080
echo - Backend: http://localhost:3000
echo - Admin: http://localhost:8081
echo.
echo Test Accounts:
echo 1. Admin Account
echo    Phone: 13000000000
echo    Code: 123456
echo.
echo 2. Test User Account
echo    Phone: 13111111111
echo    Code: 123456
echo.
echo Notes:
echo 1. Do not close any command windows
echo 2. To stop services, close all windows
echo 3. Check startup.log for issues
echo.
echo Press any key to exit...
pause > nul