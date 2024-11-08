import axios from 'axios'
import crypto from 'crypto'
import config from '../config/index.js'

// 微信支付
export const wechatPay = async (order) => {
  // 生成支付参数
  const params = {
    appid: config.wechat.appId,
    mch_id: config.wechat.mchId,
    nonce_str: Math.random().toString(36).substr(2),
    body: '美团优选-商品购买',
    out_trade_no: order.orderNo,
    total_fee: Math.round(order.finalPrice * 100),
    spbill_create_ip: '127.0.0.1',
    notify_url: config.wechat.notifyUrl,
    trade_type: 'JSAPI'
  }
  
  // 签名
  const sign = createSign(params, config.wechat.mchKey)
  
  // 请求支付接口
  const result = await axios.post(
    'https://api.mch.weixin.qq.com/pay/unifiedorder',
    { ...params, sign }
  )
  
  return result.data
}

// 支付宝支付
export const alipay = async (order) => {
  // 生成支付参数
  const params = {
    app_id: config.alipay.appId,
    method: 'alipay.trade.create',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString(),
    version: '1.0',
    notify_url: config.alipay.notifyUrl,
    biz_content: {
      out_trade_no: order.orderNo,
      total_amount: order.finalPrice,
      subject: '美团优选-商品购买'
    }
  }
  
  // 签名
  const sign = createAlipaySign(params, config.alipay.privateKey)
  
  // 请求支付接口
  const result = await axios.post(
    'https://openapi.alipay.com/gateway.do',
    { ...params, sign }
  )
  
  return result.data
}

// 创建签名
const createSign = (params, key) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  return crypto
    .createHash('md5')
    .update(`${sortedParams}&key=${key}`)
    .digest('hex')
    .toUpperCase()
}

// 创建支付宝签名
const createAlipaySign = (params, privateKey) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(sortedParams)
  return sign.sign(privateKey, 'base64')
}

// 支付回调处理
export const handlePaymentCallback = async (type, data) => {
  // TODO: 处理支付回调
  // 1. 验证签名
  // 2. 查询订单
  // 3. 更新订单状态
  // 4. 发送通知
} 