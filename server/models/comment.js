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
  anonymous: {
    type: Boolean,
    default: false
  },
  reply: {
    content: String,
    time: Date
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default mongoose.model('Comment', commentSchema) 