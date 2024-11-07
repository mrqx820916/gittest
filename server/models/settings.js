import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  siteName: String,
  logo: String,
  minAmount: Number,
  deliveryFee: Number,
  freeDeliveryAmount: Number,
  paymentMethods: [String],
  wechatAppId: String,
  wechatSecret: String,
  alipayAppId: String,
  alipayPrivateKey: String,
  smsProvider: String,
  smsAccessKey: String,
  smsSecretKey: String,
  smsSignName: String,
  smsTemplateId: String,
  storage: String,
  ossAccessKey: String,
  ossSecretKey: String,
  ossBucket: String,
  ossRegion: String,
  cosSecretId: String,
  cosSecretKey: String,
  cosBucket: String,
  cosRegion: String
})

export default mongoose.model('Settings', settingsSchema) 