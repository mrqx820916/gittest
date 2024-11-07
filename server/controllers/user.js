import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/user.js'
import config from '../config/index.js'

// 发送验证码
export const sendCode = async (req, res) => {
  try {
    const { phone } = req.body
    // TODO: 调用短信服务发送验证码
    res.json({
      code: 200,
      message: '验证码发送成功'
    })
  } catch (error) {
    console.error('发送验证码失败:', error)
    res.status(500).json({
      code: 500,
      message: '发送验证码失败'
    })
  }
}

// 用户登录
export const login = async (req, res) => {
  try {
    const { phone, code } = req.body
    // TODO: 验证验证码
    
    // 查找或创建用户
    let user = await User.findOne({ phone })
    if (!user) {
      user = await User.create({
        phone,
        nickname: `用户${phone.slice(-4)}`
      })
    }
    
    // 生成 token
    const token = jwt.sign(
      { id: user._id },
      config.jwtSecret,
      { expiresIn: '7d' }
    )
    
    res.json({
      code: 200,
      data: {
        token,
        user: {
          id: user._id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: user.avatar
        }
      }
    })
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({
      code: 500,
      message: '登录失败'
    })
  }
}

// 管理员登录
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body
    
    // 验证用户名和密码
    if (username !== 'admin' || password !== '123456') {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误'
      })
    }
    
    // 生成 token
    const token = jwt.sign(
      { id: 'admin' },
      config.jwtSecret,
      { expiresIn: '7d' }
    )
    
    res.json({
      code: 200,
      data: {
        token,
        user: {
          id: 'admin',
          username: 'admin',
          nickname: '管理员',
          avatar: ''
        }
      }
    })
  } catch (error) {
    console.error('管理员登录失败:', error)
    res.status(500).json({
      code: 500,
      message: '登录失败'
    })
  }
}

// 获取用户信息
export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json({
      code: 200,
      data: user
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取用户信息失败'
    })
  }
}

// 更新用户信息
export const updateUserInfo = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select('-password')
    
    res.json({
      code: 200,
      data: user
    })
  } catch (error) {
    console.error('更新用户信息失败:', error)
    res.status(500).json({
      code: 500,
      message: '更新用户信息失败'
    })
  }
}

// 获取用户列表
export const getUserList = async (req, res) => {
  try {
    const { pageNum = 1, pageSize = 10 } = req.query
    
    const total = await User.countDocuments()
    const list = await User.find()
      .select('-password')
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
    
    res.json({
      code: 200,
      data: {
        list,
        total,
        pageNum: Number(pageNum),
        pageSize: Number(pageSize)
      }
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取用户列表失败'
    })
  }
} 