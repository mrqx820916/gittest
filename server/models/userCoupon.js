import mongoose from 'mongoose'

const userCouponSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  status: {
    type: Number,
    default: 1  // 1: 未使用, 2: 已使用, 3: 已过期
  },
  usedTime: Date,
  orderId: mongoose.Schema.Types.ObjectId
}, {
  timestamps: true
})

// 添加索引
userCouponSchema.index({ user: 1, status: 1 })
userCouponSchema.index({ coupon: 1 })

export default mongoose.model('UserCoupon', userCouponSchema) 