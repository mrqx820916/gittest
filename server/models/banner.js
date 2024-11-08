import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema({
  title: String,
  image: String,
  url: String,
  sort: { type: Number, default: 0 },
  status: { type: Number, default: 1 }
}, {
  timestamps: true
})

export default mongoose.model('Banner', bannerSchema) 