import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  county: {
    type: String,
    required: true
  },
  addressDetail: {
    type: String,
    required: true
  },
  areaCode: String,
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// 设置默认地址时，取消其他默认地址
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    )
  }
  next()
})

export default mongoose.model('Address', addressSchema) 