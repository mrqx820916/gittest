import express from 'express'
import { auth } from '../middlewares/auth.js'
import {
  uploadImage,
  uploadImages,
  getUploadToken
} from '../controllers/upload.js'

const router = express.Router()

// 需要登录的路由
router.use(auth)

router.post('/image', uploadImage)
router.post('/images', uploadImages)
router.get('/token', getUploadToken)

export default router 