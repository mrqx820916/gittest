// 自定义错误类
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    
    Error.captureStackTrace(this, this.constructor)
  }
}

// 错误处理中间件
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  
  // 开发环境返回详细错误信息
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message,
      status: err.status,
      stack: err.stack
    })
  } else {
    // 生产环境只返回错误信息
    res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message,
      status: err.status
    })
  }
} 