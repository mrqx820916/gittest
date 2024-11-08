import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: String,
  icon: String,
  sort: { type: Number, default: 0 },
  status: { type: Number, default: 1 }
}, {
  timestamps: true
})

export default mongoose.model('Category', categorySchema) 