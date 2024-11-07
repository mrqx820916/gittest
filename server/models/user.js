import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  nickname: String,
  avatar: String,
  password: String,
  addresses: [{
    name: String,
    tel: String,
    province: String,
    city: String,
    county: String,
    addressDetail: String,
    isDefault: Boolean
  }],
  coupons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  }]
}, {
  timestamps: true
})

export default mongoose.model('User', userSchema) 