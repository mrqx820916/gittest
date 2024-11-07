@echo off
echo Starting project...

REM 启动 MongoDB
echo Starting MongoDB...
start mongod
ping -n 6 127.0.0.1 >nul

REM 启动后端服务
echo Starting Backend Server...
cd server
start cmd /k "npm install && npm run dev"
ping -n 6 127.0.0.1 >nul

REM 启动前端 H5
echo Starting Frontend H5...
cd ..
start cmd /k "npm install && npm run dev"
ping -n 6 127.0.0.1 >nul

REM 启动管理后台
echo Starting Admin Dashboard...
cd admin
start cmd /k "npm install && npm run dev"

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
echo Press any key to exit...
pause 