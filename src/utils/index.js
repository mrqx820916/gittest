// 格式化金额
export const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

// 格式化日期
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

// 格式化手机号
export const formatPhone = (phone) => {
  return phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 格式化地址
export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.province}${address.city}${address.county}${address.addressDetail}`
}

// 格式化商品规格
export const formatSpecs = (specs) => {
  if (!specs) return ''
  return Object.entries(specs)
    .map(([key, value]) => `${key}:${value}`)
    .join('; ')
}

// 防抖函数
export const debounce = (fn, delay = 300) => {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 节流函数
export const throttle = (fn, delay = 300) => {
  let timer = null
  return function(...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 深拷贝
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  const clone = Array.isArray(obj) ? [] : {}
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key])
    }
  }
  return clone
}

// 获取图片完整路径
export const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${import.meta.env.VITE_APP_IMAGE_URL}${url}`
}

// 获取文件扩展名
export const getFileExt = (filename) => {
  return filename.substring(filename.lastIndexOf('.') + 1)
}

// 检查文件类型
export const checkFileType = (file, types) => {
  const ext = getFileExt(file.name).toLowerCase()
  return types.includes(ext)
}

// 检查文件大小
export const checkFileSize = (file, maxSize) => {
  return file.size <= maxSize * 1024 * 1024
} 