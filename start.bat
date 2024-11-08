@echo off
setlocal EnableDelayedExpansion

echo [%date% %time%] Starting Meituan H5 Project... > startup.log

REM 检查 Node.js
echo Checking Node.js...
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed! Please install Node.js first. >> startup.log
    echo Node.js is not installed! Please install Node.js first.
    pause
    exit /b 1
)

REM 检查 MongoDB
echo Checking MongoDB...
mongod --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MongoDB is not installed! Please install MongoDB first. >> startup.log
    echo MongoDB is not installed! Please install MongoDB first.
    pause
    exit /b 1
)

REM 检查 MongoDB 服务是否运行
net start | find "MongoDB" > nul
if %errorlevel% neq 0 (
    echo Starting MongoDB service...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to start MongoDB service. >> startup.log
        echo Failed to start MongoDB service.
        pause
        exit /b 1
    )
)

REM 检查并创建 .env 文件
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create .env file. >> startup.log
        echo Failed to create .env file.
        pause
        exit /b 1
    )
)

REM 检查端口占用
netstat -ano | find "8080" > nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 8080 is already in use. >> startup.log
    echo Port 8080 is already in use.
    choice /M "Do you want to continue"
    if !errorlevel! equ 2 exit /b 1
)

netstat -ano | find "3000" > nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 3000 is already in use. >> startup.log
    echo Port 3000 is already in use.
    choice /M "Do you want to continue"
    if !errorlevel! equ 2 exit /b 1
)

netstat -ano | find "8081" > nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 8081 is already in use. >> startup.log
    echo Port 8081 is already in use.
    choice /M "Do you want to continue"
    if !errorlevel! equ 2 exit /b 1
)

REM 安装依赖
echo Installing dependencies...
echo [%date% %time%] Installing dependencies... >> startup.log

call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install root dependencies. >> startup.log
    echo Failed to install root dependencies.
    pause
    exit /b 1
)

cd server
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install server dependencies. >> startup.log
    echo Failed to install server dependencies.
    cd ..
    pause
    exit /b 1
)
cd ..

cd admin
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install admin dependencies. >> startup.log
    echo Failed to install admin dependencies.
    cd ..
    pause
    exit /b 1
)
cd ..

REM 初始化数据库
echo Initializing database...
echo [%date% %time%] Initializing database... >> startup.log
cd server
call npm run init
if %errorlevel% neq 0 (
    echo [ERROR] Failed to initialize database. >> startup.log
    echo Failed to initialize database.
    cd ..
    pause
    exit /b 1
)
cd ..

REM 启动所有服务
echo Starting services...
echo [%date% %time%] Starting services... >> startup.log

start "Backend Server" cmd /k "cd server && npm run dev"
start "Frontend" cmd /k "npm run dev"
start "Admin Dashboard" cmd /k "cd admin && npm run dev"

echo [%date% %time%] All services started successfully. >> startup.log
echo.
echo All services are starting...
echo Frontend: http://localhost:8080
echo Backend: http://localhost:3000
echo Admin: http://localhost:8081
echo.
echo Check startup.log for detailed information.
echo Press any key to exit...
pause > nul