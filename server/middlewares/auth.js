import jwt from 'jsonwebtoken'
import { AppError } from './error.js'
import config from '../config/index.js'
import User from '../models/user.js'

// 验证 token
export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      throw new AppError('未登录', 401)
    }
    
    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = { id: decoded.id }
    
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('无效的 token', 401))
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('token 已过期', 401))
    } else {
      next(error)
    }
  }
}

// 验证管理员权限
export const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    
    if (!user || user.role !== 'admin') {
      throw new AppError('无权限', 403)
    }
    
    next()
  } catch (error) {
    next(error)
  }
} 