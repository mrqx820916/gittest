import Order from '../models/order.js'
import Goods from '../models/goods.js'
import { AppError } from '../middlewares/error.js'
import { generateOrderNo } from '../utils/index.js'

// 创建订单
export const createOrder = async (req, res, next) => {
  try {
    const {
      goods,
      address,
      deliveryType,
      couponId,
      remark,
      totalPrice,
      deliveryFee,
      discountAmount,
      finalPrice
    } = req.body
    
    // 检查商品库存
    for (const item of goods) {
      const goodsInfo = await Goods.findById(item.id)
      if (!goodsInfo || goodsInfo.stock < item.quantity) {
        throw new AppError(`商品 ${goodsInfo?.title || item.id} 库存不足`, 400)
      }
    }
    
    // 创建订单
    const order = await Order.create({
      user: req.user.id,
      orderNo: generateOrderNo(),
      goods,
      address,
      deliveryType,
      couponId,
      remark,
      totalPrice,
      deliveryFee,
      discountAmount,
      finalPrice,
      status: 1 // 待付款
    })
    
    // 扣减库存
    for (const item of goods) {
      await Goods.findByIdAndUpdate(item.id, {
        $inc: {
          stock: -item.quantity
        }
      })
    }
    
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
    const { type = 0, pageNum = 1, pageSize = 10 } = req.query
    
    // 构建查询条件
    const query = { user: req.user.id }
    if (type > 0) query.status = type
    
    const total = await Order.countDocuments(query)
    const list = await Order.find(query)
      .sort('-createdAt')
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

// 取消订单
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
      status: 1 // 只能取消待付款订单
    })
    
    if (!order) {
      throw new AppError('订单不存在或无法取消', 400)
    }
    
    // 更新订单状态
    order.status = 6 // 已取消
    await order.save()
    
    // 恢复库存
    for (const item of order.goods) {
      await Goods.findByIdAndUpdate(item.id, {
        $inc: {
          stock: item.quantity
        }
      })
    }
    
    res.json({
      code: 200,
      data: order
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
      status: 1 // 待付款
    })
    
    if (!order) {
      throw new AppError('订单不存在或已支付', 400)
    }
    
    // 更新订单状态
    order.status = 2 // 待发货
    order.paymentMethod = paymentMethod
    order.paymentTime = new Date()
    await order.save()
    
    // 更新商品销量
    for (const item of order.goods) {
      await Goods.findByIdAndUpdate(item.id, {
        $inc: {
          sales: item.quantity
        }
      })
    }
    
    res.json({
      code: 200,
      data: order
    })
  } catch (error) {
    next(error)
  }
}

// 确认收货
export const confirmOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        status: 3 // 待收货
      },
      {
        status: 4, // 待评价
        completedTime: new Date()
      },
      { new: true }
    )
    
    if (!order) {
      throw new AppError('订单不存在或无法确认收货', 400)
    }
    
    res.json({
      code: 200,
      data: order
    })
  } catch (error) {
    next(error)
  }
}

// 获取订单状态数量统计
export const getOrderStatusCount = async (req, res, next) => {
  try {
    const counts = await Order.aggregate([
      { $match: { user: req.user.id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
    
    const result = {
      unpaid: 0, // 待付款
      unshipped: 0, // 待发货
      unreceived: 0, // 待收货
      uncommented: 0, // 待评价
      refunding: 0 // 退款中
    }
    
    counts.forEach(({ _id, count }) => {
      switch (_id) {
        case 1:
          result.unpaid = count
          break
        case 2:
          result.unshipped = count
          break
        case 3:
          result.unreceived = count
          break
        case 4:
          result.uncommented = count
          break
        case 7:
          result.refunding = count
          break
      }
    })
    
    res.json({
      code: 200,
      data: result
    })
  } catch (error) {
    next(error)
  }
} 