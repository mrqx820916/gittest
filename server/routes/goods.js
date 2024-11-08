import express from 'express'
import {
  getGoodsList,
  getGoodsDetail,
  getRecommendGoods,
  checkGoodsStock
} from '../controllers/goods.js'

const router = express.Router()

// 获取商品列表
router.get('/list', getGoodsList)

// 获取商品详情
router.get('/detail/:id', getGoodsDetail)

// 获取推荐商品
router.get('/recommend', getRecommendGoods)

// 检查商品库存
router.post('/stock', checkGoodsStock)

export default router 