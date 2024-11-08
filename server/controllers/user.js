import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { AppError } from '../middlewares/error.js'
import config from '../config/index.js'
import { sendSms } from '../utils/sms.js'

// 发送验证码
export const sendCode = async (req, res, next) => {
  try {
    const { phone } = req.body
    
    // 生成验证码
    const code = Math.random().toString().slice(-6)
    
    // 发送短信
    await sendSms(phone, code)
    
    // 将验证码存入 session
    req.session.verifyCode = {
      phone,
      code,
      expires: Date.now() + 5 * 60 * 1000 // 5分钟有效期
    }
    
    res.json({
      code: 200,
      message: '验证码已发送'
    })
  } catch (error) {
    next(error)
  }
}

// 登录
export const login = async (req, res, next) => {
  try {
    const { phone, code } = req.body
    
    // 验证验证码
    const verifyCode = req.session.verifyCode
    if (!verifyCode || 
        verifyCode.phone !== phone || 
        verifyCode.code !== code ||
        verifyCode.expires < Date.now()) {
      throw new AppError('验证码错误或已过期', 400)
    }
    
    // 查找或创建用户
    let user = await User.findOne({ phone })
    if (!user) {
      user = await User.create({ phone })
    }
    
    // 生成 token
    const token = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpires
    })
    
    // 清除验证码
    delete req.session.verifyCode
    
    res.json({
      code: 200,
      data: {
        token,
        user: {
          id: user._id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: user.avatar,
          role: user.role
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

// 获取用户信息
export const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      throw new AppError('用户不存在', 404)
    }
    
    res.json({
      code: 200,
      data: {
        id: user._id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        role: user.role,
        balance: user.balance,
        points: user.points
      }
    })
  } catch (error) {
    next(error)
  }
}

// 更新用户信息
export const updateUserInfo = async (req, res, next) => {
  try {
    const { nickname, avatar } = req.body
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { nickname, avatar },
      { new: true }
    )
    
    res.json({
      code: 200,
      data: {
        id: user._id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar
      }
    })
  } catch (error) {
    next(error)
  }
}

// 修改手机号
export const updatePhone = async (req, res, next) => {
  try {
    const { oldPhone, oldCode, newPhone, newCode } = req.body
    
    // 验证原手机号验证码
    const oldVerifyCode = req.session.oldVerifyCode
    if (!oldVerifyCode || 
        oldVerifyCode.phone !== oldPhone || 
        oldVerifyCode.code !== oldCode ||
        oldVerifyCode.expires < Date.now()) {
      throw new AppError('原手机号验证码错误或已过期', 400)
    }
    
    // 验证新手机号验证码
    const newVerifyCode = req.session.newVerifyCode
    if (!newVerifyCode || 
        newVerifyCode.phone !== newPhone || 
        newVerifyCode.code !== newCode ||
        newVerifyCode.expires < Date.now()) {
      throw new AppError('新手机号验证码错误或已过期', 400)
    }
    
    // 检查新手机号是否已被使用
    const exists = await User.findOne({ phone: newPhone })
    if (exists) {
      throw new AppError('该手机号已被使用', 400)
    }
    
    // 更新手机号
    await User.findByIdAndUpdate(req.user.id, { phone: newPhone })
    
    // 清除验证码
    delete req.session.oldVerifyCode
    delete req.session.newVerifyCode
    
    res.json({
      code: 200,
      message: '手机号修改成功'
    })
  } catch (error) {
    next(error)
  }
} 