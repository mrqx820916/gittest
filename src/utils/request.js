import axios from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    if (config.showLoading !== false) {
      showLoadingToast({
        message: '加载中...',
        forbidClick: true
      })
    }
    
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    closeToast()
    const res = response.data
    
    if (res.code !== 200) {
      showToast({
        message: res.message || '请求错误',
        type: 'fail'
      })
      return Promise.reject(new Error(res.message || '请求错误'))
    }
    return res.data
  },
  error => {
    closeToast()
    showToast({
      message: error.message || '请求错误',
      type: 'fail'
    })
    return Promise.reject(error)
  }
)

export default service 