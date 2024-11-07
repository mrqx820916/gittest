import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  
  getters: {
    totalCount: (state) => state.items.length,
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)
    }
  },
  
  actions: {
    addToCart(goods) {
      const existing = this.items.find(item => item.id === goods.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({
          ...goods,
          quantity: 1
        })
      }
    },
    
    removeFromCart(goodsId) {
      const index = this.items.findIndex(item => item.id === goodsId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    }
  }
}) 