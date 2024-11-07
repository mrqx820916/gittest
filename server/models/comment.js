import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goods: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goods',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  images: [String],
  reply: String,
  replyTime: Date,
  status: {
    type: Number,
    default: 1  // 1: 正常, 0: 隐藏
  }
}, {
  timestamps: true
})

// 添加索引
commentSchema.index({ goods: 1, createdAt: -1 })
commentSchema.index({ user: 1, createdAt: -1 })

export default mongoose.model('Comment', commentSchema) 