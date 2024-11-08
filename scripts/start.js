const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// 检查环境
async function checkEnvironment() {
  try {
    // 检查 MongoDB
    await new Promise((resolve, reject) => {
      const mongod = spawn('mongod', ['--version']);
      mongod.on('close', code => code === 0 ? resolve() : reject());
    });

    // 检查 .env 文件
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), '.env.example');
    
    if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('Created .env file from .env.example');
    }

    return true;
  } catch (error) {
    console.error('Environment check failed:', error);
    return false;
  }
}

// 安装依赖
async function installDependencies() {
  const install = async (cwd) => {
    return new Promise((resolve, reject) => {
      const npm = spawn(
        /^win/.test(process.platform) ? 'npm.cmd' : 'npm',
        ['install'],
        { cwd, stdio: 'inherit' }
      );
      npm.on('close', code => code === 0 ? resolve() : reject());
    });
  };

  try {
    console.log('Installing dependencies...');
    await install(process.cwd()); // 根目录
    await install(path.join(process.cwd(), 'server')); // 后端
    await install(path.join(process.cwd(), 'admin')); // 管理后台
    return true;
  } catch (error) {
    console.error('Dependencies installation failed:', error);
    return false;
  }
}

// 初始化数据库
async function initDatabase() {
  try {
    console.log('Initializing database...');
    await new Promise((resolve, reject) => {
      const init = spawn(
        /^win/.test(process.platform) ? 'npm.cmd' : 'npm',
        ['run', 'init'],
        { cwd: path.join(process.cwd(), 'server'), stdio: 'inherit' }
      );
      init.on('close', code => code === 0 ? resolve() : reject());
    });
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

// 启动服务
function startServices() {
  const npm = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';

  // 启动后端
  const server = spawn(npm, ['run', 'dev'], {
    cwd: path.join(process.cwd(), 'server'),
    stdio: 'inherit'
  });

  // 启动前端
  const client = spawn(npm, ['run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'inherit'
  });

  // 启动管理后台
  const admin = spawn(npm, ['run', 'dev'], {
    cwd: path.join(process.cwd(), 'admin'),
    stdio: 'inherit'
  });

  // 错误处理
  const handleError = (error) => {
    console.error('Service error:', error);
    process.exit(1);
  };

  server.on('error', handleError);
  client.on('error', handleError);
  admin.on('error', handleError);

  // 优雅退出
  process.on('SIGINT', () => {
    server.kill();
    client.kill();
    admin.kill();
    process.exit(0);
  });
}

// 主函数
async function main() {
  console.log('Starting Meituan H5 Project...');

  if (!await checkEnvironment()) {
    process.exit(1);
  }

  if (!await installDependencies()) {
    process.exit(1);
  }

  if (!await initDatabase()) {
    process.exit(1);
  }

  startServices();

  console.log('\nAll services are starting...');
  console.log('Frontend: http://localhost:8080');
  console.log('Backend: http://localhost:3000');
  console.log('Admin: http://localhost:8081');
}

main(); 