import OSS from 'ali-oss'
import config from '../config/index.js'

let client = null

// 初始化 OSS 客户端
const initOssClient = () => {
  if (!client && config.aliyun?.accessKeyId && config.aliyun?.accessKeySecret) {
    client = new OSS({
      region: config.aliyun.oss.region,
      accessKeyId: config.aliyun.accessKeyId,
      accessKeySecret: config.aliyun.accessKeySecret,
      bucket: config.aliyun.oss.bucket
    })
  }
}

// 上传文件到 OSS
export const uploadToOSS = async (file) => {
  // 开发环境保存到本地
  if (process.env.NODE_ENV === 'development') {
    // 模拟上传成功
    console.log('开发环境模拟文件上传:', file.originalname)
    return `http://localhost:3000/uploads/${file.originalname}`
  }

  try {
    initOssClient()
    if (!client) {
      throw new Error('OSS 未配置')
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(-6)}.${file.originalname.split('.').pop()}`
    
    const result = await client.put(
      `uploads/${filename}`,
      file.buffer
    )
    
    return result.url
  } catch (error) {
    console.error('上传文件失败:', error)
    throw error
  }
}

// 从 OSS 删除文件
export const deleteFromOSS = async (url) => {
  // 开发环境不执行删除
  if (process.env.NODE_ENV === 'development') {
    console.log('开发环境模拟文件删除:', url)
    return true
  }

  try {
    initOssClient()
    if (!client) {
      throw new Error('OSS 未配置')
    }

    const filename = url.split('/').pop()
    await client.delete(`uploads/${filename}`)
    return true
  } catch (error) {
    console.error('删除文件失败:', error)
    return false
  }
} 