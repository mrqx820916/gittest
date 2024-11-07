import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),
  
  getters: {
    isLogin: state => !!state.token
  },
  
  actions: {
    // 登录
    async login(data) {
      const res = await login(data)
      this.token = res.token
      this.userInfo = res.user
      localStorage.setItem('token', res.token)
    },
    
    // 获取用户信息
    async getUserInfo() {
      const res = await getUserInfo()
      this.userInfo = res
    },
    
    // 退出登录
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    }
  }
}) 