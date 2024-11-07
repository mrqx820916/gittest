import { createApp } from 'vue'
import App from './App.vue'
import 'amfe-flexible' // 自动设置根元素font-size
import router from './router'
import store from './store'

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app') 