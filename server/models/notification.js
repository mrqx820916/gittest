import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'system', 'coupon'],
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  data: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
})

// 添加索引
notificationSchema.index({ user: 1, createdAt: -1 })
notificationSchema.index({ user: 1, isRead: 1 })

export default mongoose.model('Notification', notificationSchema) 