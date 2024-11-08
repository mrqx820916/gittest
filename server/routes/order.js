import express from 'express'
import {
  createOrder,
  getOrderList,
  getOrderDetail,
  cancelOrder,
  payOrder,
  confirmOrder,
  getOrderStatusCount
} from '../controllers/order.js'

const router = express.Router()

router.post('/', createOrder)
router.get('/list', getOrderList)
router.get('/detail/:id', getOrderDetail)
router.post('/:id/cancel', cancelOrder)
router.post('/:id/pay', payOrder)
router.post('/:id/confirm', confirmOrder)
router.get('/status/count', getOrderStatusCount)

export default router 