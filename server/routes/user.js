import express from 'express'
import { auth } from '../middlewares/auth.js'
import {
  sendCode,
  login,
  getUserInfo,
  updateUserInfo,
  updatePhone
} from '../controllers/user.js'

const router = express.Router()

// 公开路由
router.post('/sendCode', sendCode)
router.post('/login', login)

// 需要登录的路由
router.get('/info', auth, getUserInfo)
router.put('/info', auth, updateUserInfo)
router.put('/phone', auth, updatePhone)

export default router 