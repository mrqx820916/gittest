import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('admin-token') || '',
    userInfo: null
  }),
  
  actions: {
    // 登录
    async login(data) {
      // TODO: 调用登录 API
      if (data.username === 'admin' && data.password === 'admin123') {
        this.token = 'admin-token'
        localStorage.setItem('admin-token', this.token)
        return true
      }
      throw new Error('用户名或密码错误')
    },
    
    // 登出
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('admin-token')
    }
  }
}) 