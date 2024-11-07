import Comment from '../models/comment.js'
import Order from '../models/order.js'
import { AppError } from '../middlewares/error.js'

// 创建评价
export const createComment = async (req, res, next) => {
  try {
    const { orderId, goodsId, content, rating, images } = req.body
    
    // 检查订单是否存在且可评价
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
      status: 4  // 待评价状态
    })
    
    if (!order) {
      throw new AppError('订单不存在或无法评价', 400)
    }
    
    // 创建评价
    const comment = await Comment.create({
      user: req.user.id,
      goods: goodsId,
      order: orderId,
      content,
      rating,
      images
    })
    
    // 更新订单状态
    await Order.findByIdAndUpdate(orderId, {
      status: 5,  // 已完成
      completedTime: new Date()
    })
    
    res.json({
      code: 200,
      data: comment
    })
  } catch (error) {
    next(error)
  }
}

// 获取商品评价列表
export const getGoodsComments = async (req, res, next) => {
  try {
    const { goodsId, pageNum = 1, pageSize = 10 } = req.query
    
    const query = {
      goods: goodsId,
      status: 1
    }
    
    const total = await Comment.countDocuments(query)
    const list = await Comment.find(query)
      .populate('user', 'nickname avatar')
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
    
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

// 回复评价
export const replyComment = async (req, res, next) => {
  try {
    const { reply } = req.body
    
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        reply,
        replyTime: new Date()
      },
      { new: true }
    )
    
    if (!comment) {
      throw new AppError('评价不存在', 404)
    }
    
    res.json({
      code: 200,
      data: comment
    })
  } catch (error) {
    next(error)
  }
} 