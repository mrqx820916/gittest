import Coupon from '../models/coupon.js'
import UserCoupon from '../models/userCoupon.js'
import { AppError } from '../middlewares/error.js'

// 获取优惠券列表
export const getCouponList = async (req, res, next) => {
  try {
    const { status, pageNum = 1, pageSize = 10 } = req.query
    
    const query = {}
    if (status !== undefined) {
      query.status = Number(status)
    }
    
    const total = await Coupon.countDocuments(query)
    const list = await Coupon.find(query)
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
    next(error)
  }
}

// 创建优惠券
export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body)
    
    res.json({
      code: 200,
      data: coupon
    })
  } catch (error) {
    next(error)
  }
}

// 更新优惠券
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    
    if (!coupon) {
      throw new AppError('优惠券不存在', 404)
    }
    
    res.json({
      code: 200,
      data: coupon
    })
  } catch (error) {
    next(error)
  }
}

// 领取优惠券
export const receiveCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    
    if (!coupon) {
      throw new AppError('优惠券不存在', 404)
    }
    
    // 检查优惠券是否可领取
    if (coupon.status !== 1) {
      throw new AppError('优惠券已禁用', 400)
    }
    
    const now = new Date()
    if (now < coupon.startTime || now > coupon.endTime) {
      throw new AppError('不在领取时间范围内', 400)
    }
    
    if (coupon.used >= coupon.total) {
      throw new AppError('优惠券已领完', 400)
    }
    
    // 检查用户是否已领取
    const exists = await UserCoupon.findOne({
      user: req.user.id,
      coupon: coupon._id
    })
    
    if (exists) {
      throw new AppError('已领取过该优惠券', 400)
    }
    
    // 创建用户优惠券记录
    await UserCoupon.create({
      user: req.user.id,
      coupon: coupon._id
    })
    
    // 更新优惠券使用数量
    await Coupon.findByIdAndUpdate(coupon._id, {
      $inc: { used: 1 }
    })
    
    res.json({
      code: 200,
      message: '领取成功'
    })
  } catch (error) {
    next(error)
  }
}

// 获取我的优惠券
export const getMyCoupons = async (req, res, next) => {
  try {
    const { status, pageNum = 1, pageSize = 10 } = req.query
    
    const query = { user: req.user.id }
    if (status !== undefined) {
      query.status = Number(status)
    }
    
    const total = await UserCoupon.countDocuments(query)
    const list = await UserCoupon.find(query)
      .populate('coupon')
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
    next(error)
  }
}

// 获取可用优惠券
export const getAvailableCoupons = async (req, res, next) => {
  try {
    const { amount } = req.query
    
    const userCoupons = await UserCoupon.find({
      user: req.user.id,
      status: 1
    }).populate('coupon')
    
    // 筛选可用优惠券
    const availableCoupons = userCoupons.filter(item => {
      const coupon = item.coupon
      const now = new Date()
      
      return (
        coupon.status === 1 &&
        now >= coupon.startTime &&
        now <= coupon.endTime &&
        amount >= coupon.minAmount
      )
    })
    
    res.json({
      code: 200,
      data: availableCoupons
    })
  } catch (error) {
    next(error)
  }
} 