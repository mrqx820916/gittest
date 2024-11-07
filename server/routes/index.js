import express from 'express'
import * as userController from '../controllers/user.js'
import * as goodsController from '../controllers/goods.js'
import * as orderController from '../controllers/order.js'
import * as categoryController from '../controllers/category.js'
import * as uploadController from '../controllers/upload.js'
import * as settingsController from '../controllers/settings.js'
import * as dashboardController from '../controllers/dashboard.js'
import * as bannerController from '../controllers/banner.js'
import * as commentController from '../controllers/comment.js'
import * as statisticsController from '../controllers/statistics.js'
import * as notificationController from '../controllers/notification.js'
import { auth, adminAuth } from '../middlewares/auth.js'

const router = express.Router()

// 用户相关
router.post('/user/sendCode', userController.sendCode)
router.post('/user/login', userController.login)
router.get('/user/info', auth, userController.getUserInfo)
router.put('/user/info', auth, userController.updateUserInfo)
router.get('/user/list', auth, userController.getUserList)

// 商品相关
router.get('/goods/list', goodsController.getGoodsList)
router.get('/goods/:id', goodsController.getGoodsDetail)
router.post('/goods', adminAuth, goodsController.createGoods)
router.put('/goods/:id', adminAuth, goodsController.updateGoods)
router.delete('/goods/:id', adminAuth, goodsController.deleteGoods)

// 订单相关
router.get('/order/list', auth, orderController.getOrderList)
router.get('/order/:id', auth, orderController.getOrderDetail)
router.post('/order', auth, orderController.createOrder)
router.put('/order/:id/status', auth, orderController.updateOrderStatus)
router.post('/order/:id/pay', auth, orderController.payOrder)
router.post('/order/:id/deliver', adminAuth, orderController.deliverOrder)
router.post('/order/:id/confirm', auth, orderController.confirmOrder)

// 分类相关
router.get('/category/list', categoryController.getCategoryList)
router.post('/category', adminAuth, categoryController.createCategory)
router.put('/category/:id', adminAuth, categoryController.updateCategory)
router.delete('/category/:id', adminAuth, categoryController.deleteCategory)

// 轮播图相关
router.get('/banner/list', bannerController.getBannerList)
router.post('/banner', adminAuth, bannerController.createBanner)
router.put('/banner/:id', adminAuth, bannerController.updateBanner)
router.delete('/banner/:id', adminAuth, bannerController.deleteBanner)

// 文件上传
router.post('/upload', auth, uploadController.upload)

// 系统设置
router.get('/settings', auth, settingsController.getSettings)
router.put('/settings', adminAuth, settingsController.updateSettings)

// 仪表盘相关
router.get('/dashboard/overview', adminAuth, dashboardController.getOverview)
router.get('/dashboard/order-trend', adminAuth, dashboardController.getOrderTrend)
router.get('/dashboard/sales-trend', adminAuth, dashboardController.getSalesTrend)
router.get('/dashboard/goods-rank', adminAuth, dashboardController.getGoodsRank)
router.get('/dashboard/category-ratio', adminAuth, dashboardController.getCategoryRatio)

// 评价相关
router.post('/comment', auth, commentController.createComment)
router.get('/comment/goods', commentController.getGoodsComments)
router.put('/comment/:id/reply', adminAuth, commentController.replyComment)

// 统计相关
router.get('/statistics/sales', adminAuth, statisticsController.getSalesStatistics)
router.get('/statistics/goods', adminAuth, statisticsController.getGoodsRanking)
router.get('/statistics/user', adminAuth, statisticsController.getUserStatistics)

// 支付相关
router.post('/order/:id/pay/wechat', auth, orderController.wechatPay)
router.post('/order/:id/pay/alipay', auth, orderController.alipayPay)
router.post('/payment/wechat/callback', orderController.wechatPayCallback)
router.post('/payment/alipay/callback', orderController.alipayCallback)

// 消息通知相关
router.get('/notification', auth, notificationController.getNotifications)
router.put('/notification/:id/read', auth, notificationController.markAsRead)
router.put('/notification/read-all', auth, notificationController.markAllAsRead)

// 管理后台登录
router.post('/admin/login', userController.adminLogin)

export default router 