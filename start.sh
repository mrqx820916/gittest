#!/bin/bash

# 设置错误处理
set -e
trap 'handle_error $? $LINENO' ERR

# 错误处理函数
handle_error() {
    echo "[ERROR] Failed with exit code $1 at line $2"
    echo "[$(date)] Failed with exit code $1 at line $2" >> startup.log
    exit 1
}

# 记录启动日志
echo "[$(date)] Starting Meituan H5 Project..." > startup.log

# 检查 Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed! Please install Node.js first."
    echo "[$(date)] Node.js is not installed!" >> startup.log
    exit 1
fi

# 检查 MongoDB
echo "Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "[ERROR] MongoDB is not installed! Please install MongoDB first."
    echo "[$(date)] MongoDB is not installed!" >> startup.log
    exit 1
fi

# 检查 MongoDB 服务
if ! pgrep mongod > /dev/null; then
    echo "Starting MongoDB service..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start mongodb-community
    else
        sudo systemctl start mongod
    fi
fi

# 检查并创建 .env 文件
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env || {
        echo "[ERROR] Failed to create .env file."
        echo "[$(date)] Failed to create .env file." >> startup.log
        exit 1
    }
fi

# 检查端口占用
check_port() {
    if lsof -i:$1 > /dev/null 2>&1; then
        echo "[WARNING] Port $1 is already in use."
        echo "[$(date)] Port $1 is already in use." >> startup.log
        read -p "Do you want to continue? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

check_port 8080
check_port 3000
check_port 8081

# 安装依赖
echo "Installing dependencies..."
echo "[$(date)] Installing dependencies..." >> startup.log

npm install || {
    echo "[ERROR] Failed to install root dependencies."
    echo "[$(date)] Failed to install root dependencies." >> startup.log
    exit 1
}

(cd server && npm install) || {
    echo "[ERROR] Failed to install server dependencies."
    echo "[$(date)] Failed to install server dependencies." >> startup.log
    exit 1
}

(cd admin && npm install) || {
    echo "[ERROR] Failed to install admin dependencies."
    echo "[$(date)] Failed to install admin dependencies." >> startup.log
    exit 1
}

# 初始化数据库
echo "Initializing database..."
echo "[$(date)] Initializing database..." >> startup.log
(cd server && npm run init) || {
    echo "[ERROR] Failed to initialize database."
    echo "[$(date)] Failed to initialize database." >> startup.log
    exit 1
}

# 启动所有服务
echo "Starting services..."
echo "[$(date)] Starting services..." >> startup.log

# 使用 trap 确保子进程在脚本退出时被终止
trap 'kill $(jobs -p) 2>/dev/null' EXIT

# 启动服务
(cd server && npm run dev) &
npm run dev &
(cd admin && npm run dev) &

echo "[$(date)] All services started successfully." >> startup.log
echo
echo "All services are starting..."
echo "Frontend: http://localhost:8080"
echo "Backend: http://localhost:3000"
echo "Admin: http://localhost:8081"
echo
echo "Check startup.log for detailed information."
echo "Press Ctrl+C to stop all services..."

# 等待所有后台进程
wait