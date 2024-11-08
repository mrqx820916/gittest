import express from 'express'
import { auth } from '../middlewares/auth.js'
import {
  getAddressList,
  getAddressDetail,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/address.js'

const router = express.Router()

router.use(auth)

router.get('/list', getAddressList)
router.get('/detail/:id', getAddressDetail)
router.post('/', createAddress)
router.put('/:id', updateAddress)
router.delete('/:id', deleteAddress)
router.put('/:id/default', setDefaultAddress)

export default router 