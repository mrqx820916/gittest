// 统一错误处理中间件
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)
  
  // 处理 MongoDB 错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      code: 400,
      message: '数据验证失败',
      errors: Object.values(err.errors).map(e => e.message)
    })
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      code: 400,
      message: '无效的ID格式'
    })
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      code: 400,
      message: '数据已存在'
    })
  }
  
  // 处理自定义错误
  if (err.status) {
    return res.status(err.status).json({
      code: err.status,
      message: err.message
    })
  }
  
  // 处理其他错误
  res.status(500).json({
    code: 500,
    message: '服务器内部错误'
  })
}

// 自定义错误类
export class AppError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
} 