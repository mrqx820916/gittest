import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/error.js'
import config from './config/index.js'

const app = express()

// 连接数据库
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由
app.use('/api', routes)

// 错误处理
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app 