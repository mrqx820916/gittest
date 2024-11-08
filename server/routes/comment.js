import express from 'express'
import { auth } from '../middlewares/auth.js'
import {
  createComment,
  getGoodsComments,
  getMyComments,
  deleteComment,
  likeComment
} from '../controllers/comment.js'

const router = express.Router()

router.get('/goods/:goodsId', getGoodsComments)

router.use(auth)

router.post('/', createComment)
router.get('/my', getMyComments)
router.delete('/:id', deleteComment)
router.post('/:id/like', likeComment)

export default router 