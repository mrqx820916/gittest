import { showToast } from 'vant'

// 微信支付
export const wechatPay = async (params) => {
  try {
    // TODO: 调用微信支付接口
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000)
    })
  } catch (error) {
    showToast('支付失败')
    return { success: false }
  }
}

// 支付宝支付
export const alipay = async (params) => {
  try {
    // TODO: 调用支付宝支付接口
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000)
    })
  } catch (error) {
    showToast('支付失败')
    return { success: false }
  }
} 