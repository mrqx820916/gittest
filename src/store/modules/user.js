import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/user'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getStorage('token') || '',
    userInfo: getStorage('userInfo') || null
  }),
  
  getters: {
    isLogin: (state) => !!state.token,
    userLevel: (state) => {
      const points = state.userInfo?.points || 0
      if (points >= 10000) return { name: '钻石会员', discount: 0.8 }
      if (points >= 5000) return { name: '金牌会员', discount: 0.85 }
      if (points >= 1000) return { name: '银牌会员', discount: 0.9 }
      return { name: '普通会员', discount: 0.95 }
    }
  },
  
  actions: {
    setToken(token) {
      this.token = token
      setStorage('token', token)
    },
    
    setUserInfo(info) {
      this.userInfo = info
      setStorage('userInfo', info)
    },
    
    async getUserInfo() {
      try {
        const info = await getUserInfo()
        this.setUserInfo(info)
        return info
      } catch (error) {
        console.error('获取用户信息失败:', error)
        return null
      }
    },
    
    logout() {
      this.token = ''
      this.userInfo = null
      removeStorage('token')
      removeStorage('userInfo')
    }
  }
}) 