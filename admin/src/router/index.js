import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('../views/goods/index.vue'),
        meta: { title: '商品管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查登录状态
  const token = localStorage.getItem('admin-token')
  
  if (to.path === '/login' && token) {
    // 已登录且要跳转登录页，重定向到主页
    next('/')
  } else if (to.path !== '/login' && !token) {
    // 未登录且要跳转其他页面，重定向到登录页
    next('/login')
  } else {
    next()
  }
})

export default router 