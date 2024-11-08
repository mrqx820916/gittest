import Comment from '../models/comment.js'
import Order from '../models/order.js'
import { AppError } from '../middlewares/error.js'

// 创建评价
export const createComment = async (req, res, next) => {
  try {
    const {
      orderId,
      goodsId,
      content,
      rating,
      images = [],
      anonymous = false
    } = req.body
    
    // 检查订单状态
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
      status: 4
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
      images,
      anonymous
    })
    
    // 更新订单状态
    await Order.findByIdAndUpdate(orderId, { status: 5 })
    
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
    const { goodsId } = req.params
    const { pageNum = 1, pageSize = 10, type } = req.query
    
    // 构建查询条件
    const query = { goods: goodsId }
    if (type === 'good') query.rating = { $gte: 4 }
    if (type === 'middle') query.rating = { $in: [2, 3] }
    if (type === 'bad') query.rating = { $lte: 1 }
    if (type === 'hasImage') query.images = { $ne: [] }
    
    const total = await Comment.countDocuments(query)
    const list = await Comment.find(query)
      .populate('user', 'nickname avatar')
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

// 获取我的评价列表
export const getMyComments = async (req, res, next) => {
  try {
    const { pageNum = 1, pageSize = 10 } = req.query
    
    const total = await Comment.countDocuments({ user: req.user.id })
    const list = await Comment.find({ user: req.user.id })
      .populate('goods', 'title thumb price')
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

// 删除评价
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    })
    
    if (!comment) {
      throw new AppError('评价不存在', 404)
    }
    
    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    next(error)
  }
}

// 点赞评价
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
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