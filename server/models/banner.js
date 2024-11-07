import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  url: String,
  sort: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 1  // 1: 启用, 0: 禁用
  }
}, {
  timestamps: true
})

// 添加索引
bannerSchema.index({ sort: 1, status: 1 })

export default mongoose.model('Banner', bannerSchema) 