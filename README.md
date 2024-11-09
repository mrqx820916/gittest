# 美团优选项目

## 项目介绍
基于 Vue 3 + Vite + Element Plus 开发的美团优选电商平台,包含前台商城和后台管理系统。

## 访问地址

### 后台管理系统
- 开发环境: http://localhost:8081/admin
- 测试环境: http://test-admin.meituan.com
- 生产环境: https://admin.meituan.com

### 测试账号

#### 管理员账号
- 账号：admin
- 密码：admin123
- 权限：所有权限

#### 运营账号
- 账号：operator
- 密码：operator123
- 权限：商品管理、订单管理、营销管理

#### 客服账号
- 账号：service
- 密码：service123
- 权限：订单管理、评价管理

## 项目结构

```
.cursor-tutor/
├── admin/                         # 后台管理系统
│   ├── public/                    # 静态资源
│   ├── src/
│   │   ├── api/                  # API 接口
│   │   │   ├── banner.js         # 轮播图接口
│   │   │   ├── coupon.js         # 优惠券接口
│   │   │   ├── dashboard.js      # 仪表盘接口
│   │   │   ├── goods.js          # 商品接口
│   │   │   └── user.js           # 用户接口
│   │   ├── layout/               # 布局组件
│   │   │   └── index.vue         # 主布局
│   │   ├── router/               # 路由配置
│   │   │   └── index.js          # 路由定义
│   │   ├── store/                # 状态管理
│   │   │   └── index.js          # Pinia store
│   │   ├── styles/               # 全局样式
│   │   │   └── index.scss        # 主样式文件
│   │   ├── utils/                # 工具函数
│   │   │   └── request.js        # axios 封装
│   │   ├── views/                # 页面组件
│   │   │   ├── banner/           # 轮播图管理
│   │   │   │   └── index.vue
│   │   │   ├── comment/          # 评论管理
│   │   │   │   └── index.vue  
│   │   │   ├── dashboard/        # 仪表盘
│   │   │   │   └── index.vue
│   │   │   └── goods/           # 商品管理
│   │   │       ├── index.vue    # 商品列表
│   │   │       └── category.vue # 分类管理
│   │   ├── App.vue              # 根组件
│   │   └── main.js              # 入口文件
│   ├── .env.development         # 开发环境配置
│   ├── .env.production          # 生产环境配置
│   ├── index.html              # HTML 模板
│   ├── package.json            # 项目依赖
│   └── vite.config.js          # Vite 配置
│
├── src/                        # 前台商城项目
│   └── views/
│       └── login/             # 登录页面
│
├── .env.development           # 开发环境配置
├── .env.example              # 环境变量示例
├── .env.production           # 生产环境配置
└── .gitignore               # Git 忽略文件
```

## 技术栈

### 后台管理系统 (Admin)

- 核心框架：Vue 3
- 构建工具：Vite 5.x
- UI 框架：Element Plus 2.x
- 状态管理：Pinia 2.x
- 路由管理：Vue Router 4.x
- HTTP 请求：Axios
- 图表库：ECharts 5.x
- 工具库：
  - dayjs (日期处理)
  - lodash-es (工具函数)
  - sass (CSS 预处理器)

### 主要功能模块

1. 用户管理
   - 用户列表
   - 角色管理
   - 权限管理

2. 商品管理
   - 商品列表
   - 分类管理
   - 库存管理
   - 商品评价

3. 订单管理
   - 订单列表
   - 订单详情
   - 发货管理

4. 营销管理
   - 轮播图管理
   - 优惠券管理
   - 活动管理

5. 统计分析
   - 销售统计
   - 用户分析
   - 商品分析

## 开发指南

### 环境要求

- Node.js >= 16
- pnpm >= 7

### 安装依赖

```bash
# 安装后台管理系统依赖
cd admin
pnpm install
```

### 开发服务

```bash
# 启动后台管理系统
cd admin
pnpm dev
```

### 构建部署

```bash
# 构建后台管理系统
cd admin
pnpm build
```

## 环境配置

项目包含多个环境配置文件：

- `.env.development`: 开发环境配置
- `.env.production`: 生产环境配置
- `.env.example`: 环境变量示例

主要配置项：

```bash
# 应用配置
VITE_APP_TITLE=美团优选
VITE_APP_API_BASE_URL=/api
VITE_APP_UPLOAD_URL=/api/upload
VITE_APP_ENV=development

# 服务器配置
PORT=3000
MONGO_URI=mongodb://localhost:27017/meituan

# JWT配置
JWT_SECRET=your-secret-key
SESSION_SECRET=session-secret

# 文件上传配置
ALI_OSS_REGION=oss-cn-hangzhou
ALI_OSS_BUCKET=your-bucket-name
```

## 代码规范

项目遵循 Vue 3 官方推荐的代码规范和最佳实践：

- 使用 Composition API
- 使用 `<script setup>` 语法
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case
- 使用 ESLint + Prettier 进行代码格式化

## 目录命名规范

- 文件夹采用小写字母命名
- 组件文件采用大驼峰命名
- API 接口文件采用小驼峰命名
- 工具函数文件采用小驼峰命名

## Git 提交规范

- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式化
- refactor: 代码重构
- test: 测试用例
- chore: 构建过程或辅助工具的变动

## 作者

- Author: [Your Name]
- Email: [your-email@example.com]

## 许可证

[MIT License](LICENSE)

## 本地开发

1. 克隆项目
```bash
git clone https://github.com/your-username/meituan-clone.git
cd meituan-clone
```

2. 安装依赖
```bash
# 安装后台管理系统依赖
cd admin
pnpm install
```

3. 启动开发服务器
```bash
# 启动后台管理系统
pnpm dev
```

4. 访问地址
- 后台管理系统: http://localhost:8081/admin