import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'
import { addCollect, cancelCollect, getCollectList } from '@/api/user'

export const useCollectStore = defineStore('collect', {
  state: () => ({
    collectList: getStorage('collectList') || []
  }),
  
  getters: {
    isCollected: (state) => (id) => {
      return state.collectList.some(item => item.id === id)
    }
  },
  
  actions: {
    async loadCollectList() {
      try {
        const list = await getCollectList()
        this.collectList = list
        setStorage('collectList', list)
      } catch (error) {
        console.error('获取收藏列表失败:', error)
      }
    },
    
    async addCollect(id) {
      await addCollect(id)
      await this.loadCollectList()
    },
    
    async cancelCollect(id) {
      await cancelCollect(id)
      await this.loadCollectList()
    }
  }
}) 