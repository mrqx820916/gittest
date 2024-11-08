import Core from '@alicloud/pop-core'
import config from '../config/index.js'

let client = null

// 初始化短信客户端
const initSmsClient = () => {
  if (!client && config.aliyun.accessKeyId && config.aliyun.accessKeySecret) {
    client = new Core({
      accessKeyId: config.aliyun.accessKeyId,
      accessKeySecret: config.aliyun.accessKeySecret,
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    })
  }
}

// 发送短信验证码
export const sendSms = async (phone, code) => {
  // 开发环境直接返回成功
  if (process.env.NODE_ENV === 'development') {
    console.log(`开发环境模拟发送短信：手机号 ${phone}，验证码 ${code}`)
    return true
  }

  try {
    initSmsClient()
    if (!client) {
      throw new Error('短信服务未配置')
    }

    const params = {
      PhoneNumbers: phone,
      SignName: config.aliyun.sms.signName,
      TemplateCode: config.aliyun.sms.templateCode,
      TemplateParam: JSON.stringify({ code })
    }
    
    const requestOption = {
      method: 'POST'
    }
    
    await client.request('SendSms', params, requestOption)
    return true
  } catch (error) {
    console.error('发送短信失败:', error)
    return false
  }
} 