import Settings from '../models/settings.js'

// 获取设置
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne()
    
    if (!settings) {
      settings = await Settings.create({
        siteName: '美团优选',
        minAmount: 20,
        deliveryFee: 5,
        freeDeliveryAmount: 50,
        paymentMethods: ['wechat', 'alipay'],
        smsProvider: 'aliyun',
        storage: 'local'
      })
    }
    
    res.json({
      code: 200,
      data: settings
    })
  } catch (error) {
    console.error('获取设置失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取设置失败'
    })
  }
}

// 更新设置
export const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    )
    
    res.json({
      code: 200,
      data: settings
    })
  } catch (error) {
    console.error('更新设置失败:', error)
    res.status(500).json({
      code: 500,
      message: '更新设置失败'
    })
  }
} 