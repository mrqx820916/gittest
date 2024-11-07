import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart') || '[]')
  }),
  
  getters: {
    totalCount: state => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: state => state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  },
  
  actions: {
    // 添加到购物车
    addToCart(goods) {
      const existing = this.items.find(item => 
        item.id === goods.id && 
        JSON.stringify(item.specs) === JSON.stringify(goods.specs)
      )
      
      if (existing) {
        existing.quantity += goods.quantity
      } else {
        this.items.push(goods)
      }
      
      this.saveToLocal()
    },
    
    // 更新商品数量
    updateQuantity(index, quantity) {
      this.items[index].quantity = quantity
      this.saveToLocal()
    },
    
    // 删除商品
    removeItem(index) {
      this.items.splice(index, 1)
      this.saveToLocal()
    },
    
    // 清空购物车
    clearCart() {
      this.items = []
      this.saveToLocal()
    },
    
    // 保存到本地存储
    saveToLocal() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    }
  }
}) 