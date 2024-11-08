import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { vant } from './plugins/vant'

// 导入样式
import 'vant/lib/index.css'
import './styles/index.scss'

// 导入移动端适配
import 'amfe-flexible'

// 创建应用实例
const app = createApp(App)

// 安装插件
app.use(createPinia())
app.use(router)

// 注册 Vant 组件
vant(app)

// 开发环境打印调试信息
if (import.meta.env.DEV) {
  console.log('应用启动')
  console.log('环境变量:', import.meta.env)
  
  router.beforeEach((to, from, next) => {
    console.log('路由跳转:', { from: from.path, to: to.path })
    next()
  })
}

// 挂载应用
app.mount('#app')

// 开发环境打印提示
if (import.meta.env.DEV) {
  console.log('当前环境：开发环境')
  console.log('API地址：', import.meta.env.VITE_APP_API_BASE_URL)
} 