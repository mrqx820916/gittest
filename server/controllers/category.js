import Category from '../models/category.js'

// 获取分类列表
export const getCategoryList = async (req, res) => {
  const list = await Category.find({ status: 1 })
    .sort({ sort: 1 })
  
  res.json({
    code: 200,
    data: list
  })
} 