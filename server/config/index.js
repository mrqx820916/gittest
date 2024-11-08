export default {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/meituan',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpires: '7d',
  sessionSecret: process.env.SESSION_SECRET || 'session-secret',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:8080', 'http://localhost:8081'],
  
  // 阿里云配置
  aliyun: {
    accessKeyId: process.env.ALI_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALI_ACCESS_KEY_SECRET,
    oss: {
      region: process.env.ALI_OSS_REGION,
      bucket: process.env.ALI_OSS_BUCKET
    },
    sms: {
      signName: process.env.ALI_SMS_SIGN_NAME,
      templateCode: process.env.ALI_SMS_TEMPLATE_CODE
    }
  },
  
  // 微信支付配置
  wechat: {
    appId: process.env.WECHAT_APP_ID,
    appSecret: process.env.WECHAT_APP_SECRET,
    mchId: process.env.WECHAT_MCH_ID,
    mchKey: process.env.WECHAT_MCH_KEY,
    notifyUrl: process.env.WECHAT_NOTIFY_URL
  },
  
  // 支付宝配置
  alipay: {
    appId: process.env.ALIPAY_APP_ID,
    privateKey: process.env.ALIPAY_PRIVATE_KEY,
    publicKey: process.env.ALIPAY_PUBLIC_KEY,
    notifyUrl: process.env.ALIPAY_NOTIFY_URL
  }
} 