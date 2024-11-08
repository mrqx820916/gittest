import express from 'express'
import userRoutes from './user.js'
import goodsRoutes from './goods.js'
import orderRoutes from './order.js'
import uploadRoutes from './upload.js'
import bannerRoutes from './banner.js'
import categoryRoutes from './category.js'
import { auth } from '../middlewares/auth.js'

const router = express.Router()

// 公开路由
router.use('/banner', bannerRoutes)
router.use('/category', categoryRoutes)
router.use('/goods', goodsRoutes)
router.use('/user', userRoutes)
router.use('/upload', uploadRoutes)

// 需要登录的路由
router.use('/order', auth, orderRoutes)

export default router 