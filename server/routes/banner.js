import express from 'express'
import { getBanners } from '../controllers/banner.js'

const router = express.Router()

router.get('/list', getBanners)

export default router 