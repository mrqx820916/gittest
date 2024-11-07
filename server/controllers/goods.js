import Goods from '../models/goods.js'

// 获取商品列表
export const getGoodsList = async (req, res) => {
  try {
    const { pageNum = 1, pageSize = 10, category, keyword } = req.query
    
    const query = {}
    if (category) {
      query.category = category
    }
    if (keyword) {
      query.title = new RegExp(keyword, 'i')
    }
    
    const total = await Goods.countDocuments(query)
    const list = await Goods.find(query)
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
    console.error('获取商品列表失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取商品列表失败'
    })
  }
}

// 获取商品详情
export const getGoodsDetail = async (req, res) => {
  try {
    const goods = await Goods.findById(req.params.id)
    if (!goods) {
      return res.status(404).json({
        code: 404,
        message: '商品不存在'
      })
    }
    
    res.json({
      code: 200,
      data: goods
    })
  } catch (error) {
    console.error('获取商品详情失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取商品详情失败'
    })
  }
}

// 创建商品
export const createGoods = async (req, res) => {
  try {
    const goods = await Goods.create(req.body)
    res.json({
      code: 200,
      data: goods
    })
  } catch (error) {
    console.error('创建商品失败:', error)
    res.status(500).json({
      code: 500,
      message: '创建商品失败'
    })
  }
}

// 更新商品
export const updateGoods = async (req, res) => {
  try {
    const goods = await Goods.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    
    if (!goods) {
      return res.status(404).json({
        code: 404,
        message: '商品不存在'
      })
    }
    
    res.json({
      code: 200,
      data: goods
    })
  } catch (error) {
    console.error('更新商品失败:', error)
    res.status(500).json({
      code: 500,
      message: '更新商品失败'
    })
  }
}

// 删除商品
export const deleteGoods = async (req, res) => {
  try {
    const goods = await Goods.findByIdAndDelete(req.params.id)
    if (!goods) {
      return res.status(404).json({
        code: 404,
        message: '商品不存在'
      })
    }
    
    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    console.error('删除商品失败:', error)
    res.status(500).json({
      code: 500,
      message: '删除商品失败'
    })
  }
} 