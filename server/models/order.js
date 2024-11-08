import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNo: {
    type: String,
    required: true,
    unique: true
  },
  goods: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goods',
      required: true
    },
    title: String,
    price: Number,
    thumb: String,
    quantity: Number,
    specs: Object
  }],
  address: {
    name: String,
    tel: String,
    province: String,
    city: String,
    county: String,
    addressDetail: String,
    areaCode: String
  },
  totalPrice: Number,
  deliveryFee: Number,
  discountAmount: {
    type: Number,
    default: 0
  },
  finalPrice: Number,
  paymentMethod: String,
  paymentTime: Date,
  deliveryTime: Date,
  completedTime: Date,
  status: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6], // 1: 待付款, 2: 待发货, 3: 待收货, 4: 待评价, 5: 已完成, 6: 已取消
    default: 1
  },
  remark: String,
  logistics: {
    company: String,
    trackingNo: String
  }
}, {
  timestamps: true
})

// 生成订单号
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    const date = new Date()
    this.orderNo = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0') +
      date.getHours().toString().padStart(2, '0') +
      date.getMinutes().toString().padStart(2, '0') +
      date.getSeconds().toString().padStart(2, '0') +
      Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  }
  next()
})

export default mongoose.model('Order', orderSchema) 