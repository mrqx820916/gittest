import mongoose from 'mongoose'

const goodsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  desc: String,
  sales: {
    type: Number,
    default: 0
  },
  images: [String],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  specs: [{
    name: String,
    values: [String]
  }],
  params: {
    type: Map,
    of: String
  },
  detail: String,
  status: {
    type: Number,
    default: 1 // 1: 上架, 0: 下架
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// 全文搜索索引
goodsSchema.index({
  title: 'text',
  desc: 'text'
})

export default mongoose.model('Goods', goodsSchema) 