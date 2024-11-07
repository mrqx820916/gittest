import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import { AppError } from './error.js'

// 验证 token 中间件
export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      throw new AppError('请先登录', 401)
    }
    
    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('无效的token', 401))
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('token已过期', 401))
    } else {
      next(error)
    }
  }
}

// 验证管理员权限中间件
export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        throw new AppError('无权限访问', 403)
      }
      next()
    })
  } catch (error) {
    next(error)
  }
} 