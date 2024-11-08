import mongoose from 'mongoose'

const collectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goods: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goods',
    required: true
  }
}, {
  timestamps: true
})

// 创建联合索引
collectSchema.index({ user: 1, goods: 1 }, { unique: true })

export default mongoose.model('Collect', collectSchema) 