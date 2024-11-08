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
    enum: [1, 2, 3], // 1: 未使用, 2: 已使用, 3: 已过期
    default: 1
  },
  usedTime: Date,
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true
})

// 创建联合索引
userCouponSchema.index({ user: 1, coupon: 1 }, { unique: true })

export default mongoose.model('UserCoupon', userCouponSchema) 