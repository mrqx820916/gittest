import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import OSS from 'ali-oss'
import COS from 'cos-nodejs-sdk-v5'
import { nanoid } from 'nanoid'
import Settings from '../models/settings.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 获取存储设置
const getStorageConfig = async () => {
  const settings = await Settings.findOne()
  return settings?.storage || 'local'
}

// 本地存储配置
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${nanoid()}${ext}`)
  }
})

// 阿里云OSS配置
const ossStorage = async () => {
  const settings = await Settings.findOne()
  return new OSS({
    accessKeyId: settings.ossAccessKey,
    accessKeySecret: settings.ossSecretKey,
    bucket: settings.ossBucket,
    region: settings.ossRegion
  })
}

// 腾讯云COS配置
const cosStorage = async () => {
  const settings = await Settings.findOne()
  return new COS({
    SecretId: settings.cosSecretId,
    SecretKey: settings.cosSecretKey
  })
}

// 文件上传处理
export const upload = async (req, res) => {
  try {
    const storage = await getStorageConfig()
    
    switch (storage) {
      case 'local':
        // 本地上传
        const upload = multer({ storage: localStorage }).single('file')
        upload(req, res, (err) => {
          if (err) {
            return res.status(400).json({
              code: 400,
              message: '上传失败'
            })
          }
          
          res.json({
            code: 200,
            data: {
              url: `/uploads/${req.file.filename}`
            }
          })
        })
        break
        
      case 'oss':
        // 阿里云OSS上传
        const ossClient = await ossStorage()
        const ossResult = await ossClient.put(
          `uploads/${nanoid()}${path.extname(req.file.originalname)}`,
          req.file.buffer
        )
        
        res.json({
          code: 200,
          data: {
            url: ossResult.url
          }
        })
        break
        
      case 'cos':
        // 腾讯云COS上传
        const cosClient = await cosStorage()
        const settings = await Settings.findOne()
        
        const cosResult = await new Promise((resolve, reject) => {
          cosClient.putObject({
            Bucket: settings.cosBucket,
            Region: settings.cosRegion,
            Key: `uploads/${nanoid()}${path.extname(req.file.originalname)}`,
            Body: req.file.buffer
          }, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        })
        
        res.json({
          code: 200,
          data: {
            url: `https://${settings.cosBucket}.cos.${settings.cosRegion}.myqcloud.com/${cosResult.Key}`
          }
        })
        break
        
      default:
        throw new Error('未知的存储方式')
    }
  } catch (error) {
    console.error('文件上传失败:', error)
    res.status(500).json({
      code: 500,
      message: '文件上传失败'
    })
  }
} 