import { defineStore } from 'pinia'
import { getStorage, setStorage } from '@/utils/storage'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: getStorage('cartItems') || []
  }),
  
  getters: {
    totalCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },
    
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0)
    },
    
    checkedItems: (state) => {
      return state.items.filter(item => item.checked)
    }
  },
  
  actions: {
    addToCart(goods) {
      const existing = this.items.find(item => {
        return item.id === goods.id && 
          JSON.stringify(item.specs) === JSON.stringify(goods.specs)
      })
      
      if (existing) {
        existing.quantity += goods.quantity
      } else {
        this.items.push({ ...goods, checked: true })
      }
      
      this.saveToStorage()
    },
    
    updateQuantity(index, quantity) {
      this.items[index].quantity = quantity
      this.saveToStorage()
    },
    
    removeItem(index) {
      this.items.splice(index, 1)
      this.saveToStorage()
    },
    
    setChecked(index, checked) {
      this.items[index].checked = checked
      this.saveToStorage()
    },
    
    setAllChecked(checked) {
      this.items.forEach(item => item.checked = checked)
      this.saveToStorage()
    },
    
    clearChecked() {
      this.items = this.items.filter(item => !item.checked)
      this.saveToStorage()
    },
    
    saveToStorage() {
      setStorage('cartItems', this.items)
    }
  }
}) 