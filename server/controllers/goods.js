import Goods from '../models/goods.js'
import { AppError } from '../middlewares/error.js'

// 获取商品列表
export const getGoodsList = async (req, res, next) => {
  try {
    const { pageNum = 1, pageSize = 10, category, keyword, sort } = req.query
    
    // 构建查询条件
    const query = { status: 1 }
    if (category) query.category = category
    if (keyword) query.title = new RegExp(keyword, 'i')
    
    // 构建排序条件
    let sortOption = {}
    switch (sort) {
      case 'price-asc':
        sortOption.price = 1
        break
      case 'price-desc':
        sortOption.price = -1
        break
      case 'sales':
        sortOption.sales = -1
        break
      default:
        sortOption.createdAt = -1
    }
    
    // 查询商品
    const total = await Goods.countDocuments(query)
    const list = await Goods.find(query)
      .populate('category', 'name')
      .sort(sortOption)
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

// 获取商品详情
export const getGoodsDetail = async (req, res, next) => {
  try {
    const goods = await Goods.findById(req.params.id)
      .populate('category', 'name')
    
    if (!goods) {
      throw new AppError('商品不存在', 404)
    }
    
    res.json({
      code: 200,
      data: goods
    })
  } catch (error) {
    next(error)
  }
}

// 获取推荐商品
export const getRecommendGoods = async (req, res, next) => {
  try {
    const { id } = req.query
    
    // 获取当前商品的分类
    const goods = await Goods.findById(id)
    if (!goods) {
      throw new AppError('商品不存在', 404)
    }
    
    // 查询同分类的其他商品
    const list = await Goods.find({
      category: goods.category,
      _id: { $ne: id },
      status: 1
    })
    .limit(10)
    .sort('-sales')
    
    res.json({
      code: 200,
      data: list
    })
  } catch (error) {
    next(error)
  }
}

// 检查商品库存
export const checkGoodsStock = async (req, res, next) => {
  try {
    const { ids } = req.body
    
    const stockInfo = {}
    for (const id of ids) {
      const goods = await Goods.findById(id)
      if (goods) {
        stockInfo[id] = goods.stock
      }
    }
    
    res.json({
      code: 200,
      data: stockInfo
    })
  } catch (error) {
    next(error)
  }
} 