import Banner from '../models/banner.js'
import { AppError } from '../middlewares/error.js'

// 获取轮播图列表
export const getBannerList = async (req, res, next) => {
  try {
    const { status } = req.query
    
    const query = {}
    if (status !== undefined) {
      query.status = Number(status)
    }
    
    const list = await Banner.find(query)
      .sort({ sort: 1, createdAt: -1 })
    
    res.json({
      code: 200,
      data: list
    })
  } catch (error) {
    next(error)
  }
}

// 创建轮播图
export const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body)
    
    res.json({
      code: 200,
      data: banner
    })
  } catch (error) {
    next(error)
  }
}

// 更新轮播图
export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    
    if (!banner) {
      throw new AppError('轮播图不存在', 404)
    }
    
    res.json({
      code: 200,
      data: banner
    })
  } catch (error) {
    next(error)
  }
}

// 删除轮播图
export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id)
    
    if (!banner) {
      throw new AppError('轮播图不存在', 404)
    }
    
    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    next(error)
  }
} 