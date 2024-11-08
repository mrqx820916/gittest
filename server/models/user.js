import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    select: false
  },
  nickname: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  balance: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  email: String,
  verified: {
    type: Boolean,
    default: false
  },
  hasPassword: {
    type: Boolean,
    default: false
  },
  hasPayPassword: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// 密码加密
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
    this.hasPassword = true
  }
  next()
})

// 验证密码
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema) 