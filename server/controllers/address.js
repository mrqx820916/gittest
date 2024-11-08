import Address from '../models/address.js'
import { AppError } from '../middlewares/error.js'

// 获取地址列表
export const getAddressList = async (req, res, next) => {
  try {
    const list = await Address.find({ user: req.user.id })
      .sort('-isDefault -updatedAt')
    
    res.json({
      code: 200,
      data: list
    })
  } catch (error) {
    next(error)
  }
}

// 获取地址详情
export const getAddressDetail = async (req, res, next) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    })
    
    if (!address) {
      throw new AppError('地址不存在', 404)
    }
    
    res.json({
      code: 200,
      data: address
    })
  } catch (error) {
    next(error)
  }
}

// 创建地址
export const createAddress = async (req, res, next) => {
  try {
    const {
      name,
      tel,
      province,
      city,
      county,
      addressDetail,
      areaCode,
      isDefault
    } = req.body
    
    // 如果是默认地址，先取消其他默认地址
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id },
        { isDefault: false }
      )
    }
    
    const address = await Address.create({
      user: req.user.id,
      name,
      tel,
      province,
      city,
      county,
      addressDetail,
      areaCode,
      isDefault
    })
    
    res.json({
      code: 200,
      data: address
    })
  } catch (error) {
    next(error)
  }
}

// 更新地址
export const updateAddress = async (req, res, next) => {
  try {
    const {
      name,
      tel,
      province,
      city,
      county,
      addressDetail,
      areaCode,
      isDefault
    } = req.body
    
    // 如果是默认地址，先取消其他默认地址
    if (isDefault) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: req.params.id } },
        { isDefault: false }
      )
    }
    
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        name,
        tel,
        province,
        city,
        county,
        addressDetail,
        areaCode,
        isDefault
      },
      { new: true }
    )
    
    if (!address) {
      throw new AppError('地址不存在', 404)
    }
    
    res.json({
      code: 200,
      data: address
    })
  } catch (error) {
    next(error)
  }
}

// 删除地址
export const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    })
    
    if (!address) {
      throw new AppError('地址不存在', 404)
    }
    
    res.json({
      code: 200,
      message: '删除成功'
    })
  } catch (error) {
    next(error)
  }
}

// 设置默认地址
export const setDefaultAddress = async (req, res, next) => {
  try {
    // 取消其他默认地址
    await Address.updateMany(
      { user: req.user.id, _id: { $ne: req.params.id } },
      { isDefault: false }
    )
    
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isDefault: true },
      { new: true }
    )
    
    if (!address) {
      throw new AppError('地址不存在', 404)
    }
    
    res.json({
      code: 200,
      data: address
    })
  } catch (error) {
    next(error)
  }
} 