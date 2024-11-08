import axios from 'axios'
import { showToast } from 'vant'
import router from '@/router'
import { useUserStore } from '@/store'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    if (res.code !== 200) {
      showToast(res.message || '请求失败')
      
      // 401: Token 过期或未登录
      if (res.code === 401) {
        const userStore = useUserStore()
        userStore.logout()
        router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res.data
  },
  error => {
    console.error('响应错误:', error)
    showToast(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default service 