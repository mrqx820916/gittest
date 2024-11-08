// 默认过期时间（7天）
const DEFAULT_EXPIRE = 7 * 24 * 60 * 60 * 1000

// 设置缓存
export const setStorage = (key, value, expire = DEFAULT_EXPIRE) => {
  const data = {
    value,
    expire: Date.now() + expire
  }
  localStorage.setItem(key, JSON.stringify(data))
}

// 获取缓存
export const getStorage = (key) => {
  const data = localStorage.getItem(key)
  if (!data) return null
  
  try {
    const { value, expire } = JSON.parse(data)
    if (Date.now() > expire) {
      localStorage.removeItem(key)
      return null
    }
    return value
  } catch (error) {
    return null
  }
}

// 移除缓存
export const removeStorage = (key) => {
  localStorage.removeItem(key)
}

// 清空缓存
export const clearStorage = () => {
  localStorage.clear()
}

// 获取缓存大小
export const getStorageSize = () => {
  let size = 0
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      size += localStorage.getItem(key).length
    }
  }
  return (size / 1024).toFixed(2) + 'KB'
}

// 常用缓存键
export const StorageKey = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  CART: 'cart',
  SEARCH_HISTORY: 'searchHistory',
  ADDRESS_LIST: 'addressList'
} 