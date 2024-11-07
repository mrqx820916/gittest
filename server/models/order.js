import mongoose from 'mongoose'
import { ORDER_STATUS } from '../utils/order.js'

const orderSchema = new mongoose.Schema({
  orderNo: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goods: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goods',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    specs: {
      type: Map,
      of: String
    },
    thumb: String
  }],
  address: {
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
    }
  },
  totalPrice: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  finalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: Number,
    enum: Object.keys(ORDER_STATUS).map(Number),
    default: 1
  },
  paymentMethod: String,
  paymentTime: Date,
  deliveryTime: Date,
  completedTime: Date,
  canceledTime: Date,
  remark: String,
  logistics: {
    company: String,
    trackingNo: String
  }
}, {
  timestamps: true
})

// 添加索引
orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ orderNo: 1 })
orderSchema.index({ status: 1 })

export default mongoose.model('Order', orderSchema) 