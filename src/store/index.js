import { createPinia } from 'pinia'
import { useUserStore } from './modules/user'
import { useCartStore } from './modules/cart'

const store = createPinia()

export { useUserStore, useCartStore }
export default store 