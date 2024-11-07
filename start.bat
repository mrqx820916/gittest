@echo off
echo Starting project...

REM 检查 MongoDB 是否已安装
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: MongoDB is not installed or not in PATH
    echo Please install MongoDB first
    pause
    exit /b 1
)

REM 检查 Node.js 是否已安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js first
    pause
    exit /b 1
)

REM 设置工作目录为批处理文件所在目录
cd /d "%~dp0"

REM 启动 MongoDB
echo Starting MongoDB...
start /b mongod
ping -n 6 127.0.0.1 >nul

REM 检查 MongoDB 是否启动成功
echo Checking MongoDB connection...
mongosh --eval "db.version()" >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Failed to connect to MongoDB
    echo Please make sure MongoDB is running
    pause
    exit /b 1
)

REM 启动后端服务
echo Starting Backend Server...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)

start /b cmd /k "npm run dev"
ping -n 6 127.0.0.1 >nul

REM 启动前端 H5
echo Starting Frontend H5...
cd ..
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)

start /b cmd /k "npm run dev"
ping -n 6 127.0.0.1 >nul

REM 启动管理后台
echo Starting Admin Dashboard...
cd admin
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install admin dependencies
    pause
    exit /b 1
)

start /b cmd /k "npm run dev"

echo.
echo All services are starting...
echo.
echo Access URLs:
echo H5: http://localhost:8080
echo Admin: http://localhost:8081
echo API: http://localhost:3000
echo.
echo Tips for mobile preview:
echo 1. Use Chrome DevTools (F12) and toggle device toolbar
echo 2. Or scan QR code in terminal to open on your phone
echo 3. Or use your phone to visit your computer's IP address:8080
echo.
echo Your IP addresses:
ipconfig | findstr "IPv4"
echo.
echo Services are running in background.
echo Press any key to exit (services will continue running)...
pause 