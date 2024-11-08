import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/error.js'
import config from './config/index.js'
import logger from './utils/logger.js'

const app = express()

// 连接数据库
mongoose.connect(config.mongoURI)
  .then(() => logger.info('MongoDB connected'))
  .catch(err => {
    logger.error('MongoDB connection error:', err)
    process.exit(1)
  })

// 基础中间件
app.use(cors({
  origin: config.corsOrigins,
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session 配置
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.mongoURI,
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}))

// 静态文件服务
app.use('/uploads', express.static('uploads'))

// API 路由
app.use('/', routes)

// 错误处理
app.use(errorHandler)

// 未找到的路由
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'Not Found'
  })
})

// 启动服务器
const PORT = config.port || 3000
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
})

export default app 