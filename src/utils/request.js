import axios from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant'
import router from '@/router'

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 显示加载提示
    showLoadingToast({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    
    // 添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    closeToast()
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    closeToast()
    const res = response.data
    
    if (res.code !== 200) {
      showToast(res.message || '请求失败')
      
      // 处理 401 未登录
      if (res.code === 401) {
        localStorage.removeItem('token')
        router.push('/login')
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res.data
  },
  error => {
    closeToast()
    console.error('响应错误:', error)
    showToast(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default service 