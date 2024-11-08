import mongoose from 'mongoose'

const goodsSchema = new mongoose.Schema({
  title: String,
  price: Number,
  originalPrice: Number,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  sales: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  thumb: String,
  images: [String],
  desc: String,
  detail: String,
  specs: [{
    name: String,
    values: [String]
  }],
  skuList: [{
    specs: Object,
    price: Number,
    originalPrice: Number,
    stock: Number
  }],
  status: { type: Number, default: 1 },
  tags: [String]
}, {
  timestamps: true
})

export default mongoose.model('Goods', goodsSchema) 