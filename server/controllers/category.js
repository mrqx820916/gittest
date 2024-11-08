import Category from '../models/category.js'
import { AppError } from '../middlewares/error.js'

// 获取分类列表
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ status: 1 }).sort('sort')
    
    res.json({
      code: 200,
      data: categories
    })
  } catch (error) {
    next(error)
  }
} 