import { createPinia } from 'pinia'
import { useUserStore } from './modules/user'
import { useCartStore } from './modules/cart'
import { useCollectStore } from './modules/collect'

const store = createPinia()

export {
  useUserStore,
  useCartStore,
  useCollectStore
}

export default store 