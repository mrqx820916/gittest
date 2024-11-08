import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    enum: [1, 2], // 1: 满减券, 2: 折扣券
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  condition: {
    type: Number,
    required: true
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
    required: true
  },
  used: {
    type: Number,
    default: 0
  },
  perLimit: {
    type: Number,
    default: 1
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  goods: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goods'
  }],
  code: String,
  status: {
    type: Number,
    enum: [0, 1], // 0: 停用, 1: 启用
    default: 1
  }
}, {
  timestamps: true
})

export default mongoose.model('Coupon', couponSchema) 