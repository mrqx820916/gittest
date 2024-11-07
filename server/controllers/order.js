import Order from '../models/order.js'
import { AppError } from '../middlewares/error.js'
import {
  generateOrderNo,
  calculateOrderAmount,
  validateOrderStatus
} from '../utils/order.js'

// 创建订单
export const createOrder = async (req, res, next) => {
  try {
    const { goods, address, deliveryFee, discount, remark } = req.body
    
    // 计算订单金额
    const amount = calculateOrderAmount(goods, deliveryFee, discount)
    
    // 创建订单
    const order = await Order.create({
      orderNo: generateOrderNo(),
      user: req.user.id,
      goods,
      address,
      ...amount,
      remark
    })
    
    res.json({
      code: 200,
      data: order
    })
  } catch (error) {
    next(error)
  }
}

// 获取订单列表
export const getOrderList = async (req, res, next) => {
  try {
    const { status, pageNum = 1, pageSize = 10 } = req.query
    
    const query = { user: req.user.id }
    if (status) {
      query.status = Number(status)
    }
    
    const total = await Order.countDocuments(query)
    const list = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
    
    res.json({
      code: 200,
      data: {
        list,
        total,
        pageNum: Number(pageNum),
        pageSize: Number(pageSize)
      }
    })
  } catch (error) {
    next(error)
  }
}

// 获取订单详情
export const getOrderDetail = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    })
    
    if (!order) {
      throw new AppError('订单不存在', 404)
    }
    
    res.json({
      code: 200,
      data: order
    })
  } catch (error) {
    next(error)
  }
}

// 更新订单状态
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    })
    
    if (!order) {
      throw new AppError('订单不存在', 404)
    }
    
    if (!validateOrderStatus(order.status, status)) {
      throw new AppError('非法的状态转换', 400)
    }
    
    // 更新状态和相应的时间字段
    const update = { status }
    if (status === 4) {
      update.completedTime = new Date()
    } else if (status === 6) {
      update.canceledTime = new Date()
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      update,
      { new: true }
    )
    
    res.json({
      code: 200,
      data: updatedOrder
    })
  } catch (error) {
    next(error)
  }
}

// 支付订单
export const payOrder = async (req, res, next) => {
  try {
    const { paymentMethod } = req.body
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: 1
    })
    
    if (!order) {
      throw new AppError('订单不存在或无法支付', 400)
    }
    
    // TODO: 调用支付接口
    
    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      {
        status: 2,
        paymentMethod,
        paymentTime: new Date()
      },
      { new: true }
    )
    
    res.json({
      code: 200,
      data: updatedOrder
    })
  } catch (error) {
    next(error)
  }
}

// 发货
export const deliverOrder = async (req, res, next) => {
  try {
    const { company, trackingNo } = req.body
    const order = await Order.findOne({
      _id: req.params.id,
      status: 2
    })
    
    if (!order) {
      throw new AppError('订单不存在或无法发货', 400)
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      {
        status: 3,
        deliveryTime: new Date(),
        logistics: { company, trackingNo }
      },
      { new: true }
    )
    
    res.json({
      code: 200,
      data: updatedOrder
    })
  } catch (error) {
    next(error)
  }
}

// 确认收货
export const confirmOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: 3
    })
    
    if (!order) {
      throw new AppError('订单不存在或无法确认收货', 400)
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      {
        status: 4
      },
      { new: true }
    )
    
    res.json({
      code: 200,
      data: updatedOrder
    })
  } catch (error) {
    next(error)
  }
} 