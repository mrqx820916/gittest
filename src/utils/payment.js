import { showToast, showDialog } from 'vant'

// 初始化微信支付SDK
const initWxSDK = async () => {
  if (window.wx) return true
  
  try {
    // 加载微信SDK
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
    
    // 配置微信SDK
    const config = await getWxConfig()
    window.wx.config({
      debug: false,
      appId: config.appId,
      timestamp: config.timestamp,
      nonceStr: config.nonceStr,
      signature: config.signature,
      jsApiList: ['chooseWXPay']
    })
    
    return new Promise((resolve, reject) => {
      window.wx.ready(() => resolve(true))
      window.wx.error(reject)
    })
  } catch (error) {
    console.error('初始化微信SDK失败:', error)
    return false
  }
}

// 支付结果轮询
const pollPaymentResult = async (orderId, maxAttempts = 60) => {
  let attempts = 0
  
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const result = await checkPaymentStatus(orderId)
        if (result.paid) {
          clearInterval(timer)
          resolve(true)
        }
        
        attempts++
        if (attempts >= maxAttempts) {
          clearInterval(timer)
          reject(new Error('支付超时'))
        }
      } catch (error) {
        clearInterval(timer)
        reject(error)
      }
    }, 1000)
    
    // 设置支付超时
    setTimeout(() => {
      clearInterval(timer)
      reject(new Error('支付超时'))
    }, 5 * 60 * 1000) // 5分钟超时
  })
}

// 检查支付环境
const checkPaymentEnv = () => {
  const ua = navigator.userAgent.toLowerCase()
  if (/micromessenger/.test(ua)) {
    return 'wechat'
  }
  if (/miniprogram/.test(ua)) {
    return 'miniprogram'
  }
  return 'h5'
}

// 微信支付
export const wechatPay = async (params) => {
  try {
    const env = checkPaymentEnv()
    
    if (env === 'miniprogram') {
      // 小程序支付
      const { orderId, ...payParams } = params
      await wx.requestPayment(payParams)
      return await pollPaymentResult(orderId)
    } else if (env === 'wechat') {
      // 微信内H5支付
      const ready = await initWxSDK()
      if (!ready) {
        throw new Error('微信SDK初始化失败')
      }
      
      await new Promise((resolve, reject) => {
        wx.chooseWXPay({
          ...params,
          success: () => resolve(true),
          fail: (res) => reject(new Error(res.errMsg))
        })
      })
      
      return await pollPaymentResult(params.orderId)
    } else {
      // 普通H5支付
      window.location.href = params.mwebUrl
      return true
    }
  } catch (error) {
    showToast(error.message || '支付失败')
    return false
  }
}

// 支付宝支付
export const alipay = async (params) => {
  try {
    const { orderId, ...payParams } = params
    
    // 创建表单
    const form = document.createElement('form')
    form.setAttribute('method', 'post')
    form.setAttribute('action', 'https://openapi.alipay.com/gateway.do')
    
    // 添加参数
    Object.entries(payParams).forEach(([key, value]) => {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('value', value)
      form.appendChild(input)
    })
    
    // 提交表单
    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
    
    // 轮询支付结果
    return await pollPaymentResult(orderId)
  } catch (error) {
    showToast(error.message || '支付失败')
    return false
  }
}

// 余额支付
export const balancePay = async (amount, password) => {
  try {
    // 验证支付密码
    const valid = await verifyPayPassword(password)
    if (!valid) {
      throw new Error('支付密码错误')
    }
    
    // 检查余额
    const balance = await checkBalance()
    if (balance < amount) {
      throw new Error('余额不足')
    }
    
    // 扣除余额
    await deductBalance(amount)
    return true
  } catch (error) {
    showToast(error.message || '支付失败')
    return false
  }
}

// 检查支付状态
const checkPaymentStatus = async (orderId) => {
  const res = await request({
    url: `/pay/status/${orderId}`,
    method: 'get'
  })
  return res
}

// 选择支付方式
export const choosePay = (amount) => {
  return new Promise((resolve, reject) => {
    showDialog({
      title: '选择支付方式',
      message: `支付金额：¥${amount}`,
      showCancelButton: true,
      confirmButtonText: '确认支付',
      beforeClose: async (action) => {
        if (action === 'confirm') {
          // 检查是否在微信环境
          const isWechat = /MicroMessenger/i.test(navigator.userAgent)
          if (isWechat) {
            resolve('wechat')
          } else {
            // 显示支付方式选择
            showDialog({
              title: '请选择支付方式',
              message: `支付金额：¥${amount}`,
              showCancelButton: true,
              confirmButtonText: '支付宝支付',
              cancelButtonText: '余额支付'
            }).then(() => {
              resolve('alipay')
            }).catch(() => {
              resolve('balance')
            })
          }
          return false
        } else {
          reject(new Error('取消支付'))
          return true
        }
      }
    })
  })
}

// 验证支付密码
const verifyPayPassword = async (password) => {
  try {
    const res = await request({
      url: '/user/verify-pay-password',
      method: 'post',
      data: { password }
    })
    return res.valid
  } catch (error) {
    return false
  }
}

// 检查余额
const checkBalance = async () => {
  try {
    const res = await request({
      url: '/user/balance',
      method: 'get'
    })
    return res.balance
  } catch (error) {
    return 0
  }
}

// 扣除余额
const deductBalance = async (amount) => {
  await request({
    url: '/user/deduct-balance',
    method: 'post',
    data: { amount }
  })
}

// 获取微信配置
const getWxConfig = async () => {
  const res = await request({
    url: '/pay/wx-config',
    method: 'get'
  })
  return res
}