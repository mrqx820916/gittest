import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true,
    enum: [1, 2], // 1: 满减券, 2: 折扣券
  },
  value: {
    type: Number,
    required: true  // 满减金额或折扣率(0-100)
  },
  minAmount: {
    type: Number,
    default: 0  // 最低使用金额
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  total: {
    type: Number,
    required: true  // 发放总量
  },
  used: {
    type: Number,
    default: 0  // 已使用数量
  },
  status: {
    type: Number,
    default: 1  // 1: 正常, 0: 禁用
  },
  description: String
}, {
  timestamps: true
})

// 添加索引
couponSchema.index({ status: 1, startTime: 1, endTime: 1 })

export default mongoose.model('Coupon', couponSchema) 