import multer from 'multer'
import { AppError } from '../middlewares/error.js'
import { uploadToOSS } from '../utils/oss.js'
import config from '../config/index.js'

// 配置 multer
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制 5MB
    files: 9 // 最多9张图片
  },
  fileFilter: (req, file, cb) => {
    // 只允许上传图片
    if (!file.mimetype.startsWith('image/')) {
      cb(new AppError('只能上传图片文件', 400), false)
    } else {
      cb(null, true)
    }
  }
}).array('files')

// 上传图片
export const uploadImages = async (req, res, next) => {
  try {
    // 使用 Promise 包装 multer 中间件
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          reject(new AppError(err.message, 400))
        } else if (err) {
          reject(err)
        }
        resolve()
      })
    })
    
    if (!req.files?.length) {
      throw new AppError('请选择要上传的图片', 400)
    }
    
    // 上传到 OSS
    const urls = await Promise.all(
      req.files.map(file => uploadToOSS(file))
    )
    
    res.json({
      code: 200,
      data: {
        urls
      }
    })
  } catch (error) {
    next(error)
  }
}

// 上传单张图片
export const uploadImage = async (req, res, next) => {
  try {
    const singleUpload = multer({
      storage,
      limits: {
        fileSize: 2 * 1024 * 1024 // 限制 2MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          cb(new AppError('只能上传图片文件', 400), false)
        } else {
          cb(null, true)
        }
      }
    }).single('file')
    
    await new Promise((resolve, reject) => {
      singleUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          reject(new AppError(err.message, 400))
        } else if (err) {
          reject(err)
        }
        resolve()
      })
    })
    
    if (!req.file) {
      throw new AppError('请选择要上传的图片', 400)
    }
    
    // 上传到 OSS
    const url = await uploadToOSS(req.file)
    
    res.json({
      code: 200,
      data: {
        url
      }
    })
  } catch (error) {
    next(error)
  }
}

// 获取上传 Token
export const getUploadToken = async (req, res, next) => {
  try {
    // 生成临时上传凭证
    const token = {
      accessKeyId: config.aliyun.accessKeyId,
      accessKeySecret: config.aliyun.accessKeySecret,
      stsToken: '', // 如果使用 STS，这里需要调用 STS 服务获取临时凭证
      region: config.aliyun.oss.region,
      bucket: config.aliyun.oss.bucket,
      expires: Date.now() + 3600 * 1000 // 1小时有效期
    }
    
    res.json({
      code: 200,
      data: token
    })
  } catch (error) {
    next(error)
  }
} 