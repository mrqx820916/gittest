import { defineStore } from 'pinia'
import { getCollectList, addCollect, cancelCollect } from '@/api/collect'

export const useCollectStore = defineStore('collect', {
  state: () => ({
    collectList: []
  }),
  
  actions: {
    async getCollectList(params) {
      const res = await getCollectList(params)
      this.collectList = res.list
      return res
    },
    
    async addCollect(id) {
      await addCollect(id)
      await this.getCollectList()
    },
    
    async cancelCollect(id) {
      await cancelCollect(id)
      const index = this.collectList.findIndex(item => item.id === id)
      if (index > -1) {
        this.collectList.splice(index, 1)
      }
    }
  }
}) 