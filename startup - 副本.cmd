@echo off
chcp 65001
setlocal EnableDelayedExpansion

cls
echo ================================
echo      美团优选项目启动工具
echo ================================
echo.

REM 创建日志文件
echo 启动时间：%date% %time% > startup.log

REM 检查 Node.js
echo 检查 Node.js...
node --version >> startup.log 2>&1
if %errorlevel% neq 0 (
    echo [错误] 请先安装 Node.js
    echo [错误] 请先安装 Node.js >> startup.log
    pause
    exit /b 1
)

REM 检查 MongoDB
echo 检查 MongoDB...
mongod --version >> startup.log 2>&1
if %errorlevel% neq 0 (
    echo [错误] 请先安装 MongoDB
    echo [错误] 请先安装 MongoDB >> startup.log
    pause
    exit /b 1
)

REM 创建数据目录
if not exist "C:\data\db" (
    echo 创建 MongoDB 数据目录...
    mkdir "C:\data\db"
)

REM 启动 MongoDB
echo 启动 MongoDB...
start "MongoDB Server" cmd /k "mongod --dbpath=C:\data\db"

REM 等待 MongoDB 启动
echo 等待 MongoDB 启动...
:wait_mongodb
timeout /t 2 /nobreak > nul
mongosh --eval "db.version()" --quiet > nul 2>&1
if %errorlevel% neq 0 (
    echo 等待 MongoDB 启动中...
    goto wait_mongodb
) else (
    echo MongoDB 已启动
)

REM 检查环境变量
if not exist .env (
    echo 创建环境变量文件...
    copy .env.example .env >> startup.log 2>&1
)

REM 安装依赖
echo 安装依赖...
echo 前端依赖安装... >> startup.log
call npm install >> startup.log 2>&1

echo 后端依赖安装... >> startup.log
cd server
call npm install >> ../startup.log 2>&1
cd ..

echo 管理后台依赖安装... >> startup.log
cd admin
call npm install >> ../startup.log 2>&1
cd ..

REM 初始化数据库
echo 初始化数据库...
cd server
echo 开始初始化数据... >> ../startup.log
echo 请稍候，这可能需要几分钟时间...
call npm run init >> ../startup.log 2>&1
if %errorlevel% neq 0 (
    echo [错误] 数据库初始化失败
    echo 请检查 startup.log 获取详细错误信息
    cd ..
    pause
    exit /b 1
)
echo 数据库初始化成功
cd ..

REM 创建新的命令行窗口并保持打开
echo 正在启动服务...

REM 启动后端服务
echo 启动后端服务...
start "后端服务" cmd /k "color 0A && cd server && echo 正在启动后端服务... && timeout /t 2 > nul && npm run dev"

REM 等待 3 秒确保后端启动
timeout /t 3 /nobreak > nul

REM 启动前端服务
echo 启动前端服务...
start "前端服务" cmd /k "color 0B && echo 正在启动前端服务... && timeout /t 2 > nul && npm run dev"

REM 等待 2 秒
timeout /t 2 /nobreak > nul

REM 启动管理后台
echo 启动管理后台...
start "管理后台" cmd /k "color 0C && cd admin && echo 正在启动管理后台... && timeout /t 2 > nul && npm run dev"

echo.
echo ================================
echo 服务启动中，请稍候...
echo ================================
echo.

REM 等待 5 秒确保所有服务启动
timeout /t 5 /nobreak > nul

cls
echo ================================
echo        服务已启动完成
echo ================================
echo.
echo 服务访问地址：
echo - 前端：http://localhost:8080
echo - 后端：http://localhost:3000
echo - 管理后台：http://localhost:8081
echo.
echo 注意事项：
echo 1. 请不要关闭任何命令行窗口
echo 2. 如需停止服务，请关闭所有窗口
echo 3. 如遇问题，请查看 startup.log
echo.
echo 按任意键退出此窗口...
pause > nul