import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: String,
  sort: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 1
  }
})

export default mongoose.model('Category', categorySchema) 