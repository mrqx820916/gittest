# 美团优选 H5商城

基于 Vue 3 + Vant + Express + MongoDB 的移动端商城项目

## 测试账号

### H5 前端
- 手机号：13111111111
- 验证码：123456（开发环境下固定验证码）

### 管理后台
- 用户名：admin
- 密码：admin123

访问地址：
- H5前端：http://localhost:8080
- 管理后台：http://localhost:8081
- 后端API：http://localhost:3000

## 功能特性

### 用户端
- 商品浏览与搜索
- SKU选择与购买
- 购物车管理
- 订单管理
- 地址管理
- 用户中心
- 支付功能
- 评价功能

### 管理后台
- 商品管理
- 订单管理
- 用户管理
- 数据统计
- 系统设置

## 技术栈

### 前端
- Vue 3
- Vue Router
- Pinia
- Vant UI
- Sass
- Axios
- Vite

### 后端
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Multer

## 项目结构

```
.
├── admin/                 # 管理后台
├── server/               # 后端服务
└── src/                 # 前端H5
    ├── api/            # API接口
    ├── assets/         # 静态资源
    ├── components/     # 公共组件
    ├── router/         # 路由配置
    ├── store/          # 状态管理
    ├── styles/         # 样式文件
    ├── utils/          # 工具函数
    └── views/          # 页面组件
```

## 开发环境

- Node.js >= 16
- MongoDB >= 4.4
- npm >= 8

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/your-username/meituan-h5.git
cd meituan-h5
```

2. 使用启动脚本
```bash
# Windows
startup.cmd

# Linux/Mac
./start.sh
```

启动脚本会自动：
- 检查环境依赖
- 安装项目依赖
- 启动 MongoDB
- 初始化测试数据
- 启动前端、后端和管理后台服务

## 服务地址

- 前端 H5：http://localhost:8080
- 后端服务：http://localhost:3000
- 管理后台：http://localhost:8081

## 环境变量配置

### 开发环境 (.env.development)
```ini
VITE_APP_TITLE=美团优选
VITE_APP_API_BASE_URL=/api
VITE_APP_UPLOAD_URL=/api/upload
VITE_APP_ENV=development
```

### 生产环境 (.env.production)
```ini
VITE_APP_TITLE=美团优选
VITE_APP_API_BASE_URL=https://api.example.com
VITE_APP_UPLOAD_URL=https://api.example.com/upload
VITE_APP_ENV=production
```

## 注意事项

1. 确保 MongoDB 服务正常运行
2. 首次运行需要初始化测试数据
3. 开发环境验证码统一使用：123456
4. 上传功能需要配置 OSS 或本地存储
5. 支付功能需要配置微信支付和支付宝支付

## 更新日志

### v1.0.0 (2024-03-01)
- 初始版本发布
- 实现基础功能

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起 Pull Request

## 许可证

MIT License