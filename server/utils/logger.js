import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logDir = path.join(__dirname, '../logs')

// 确保日志目录存在
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

// 写入日志
export const writeLog = (type, message) => {
  const date = new Date()
  const fileName = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.log`
  const filePath = path.join(logDir, fileName)
  
  const logMessage = `[${date.toISOString()}] [${type}] ${message}\n`
  
  fs.appendFileSync(filePath, logMessage)
}

// 日志类型
export const LogType = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  WARN: 'WARN',
  DEBUG: 'DEBUG'
}

// 日志方法
export const logger = {
  info: (message) => writeLog(LogType.INFO, message),
  error: (message) => writeLog(LogType.ERROR, message),
  warn: (message) => writeLog(LogType.WARN, message),
  debug: (message) => writeLog(LogType.DEBUG, message)
}

export default logger 