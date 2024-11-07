import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store'
import Layout from '@/components/layout/index.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/index.vue'),
        meta: { title: '分类' }
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('@/views/cart/index.vue'),
        meta: { title: '购物车' }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '我的' }
      }
    ]
  },
  {
    path: '/goods/:id',
    name: 'Goods',
    component: () => import('@/views/goods/index.vue'),
    meta: { title: '商品详情' }
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: { title: '我的订单', requiresAuth: true }
      },
      {
        path: 'confirm',
        name: 'OrderConfirm',
        component: () => import('@/views/order/confirm.vue'),
        meta: { title: '确认订单', requiresAuth: true }
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: { title: '订单详情', requiresAuth: true }
      }
    ]
  },
  {
    path: '/address',
    component: Layout,
    children: [
      {
        path: 'list',
        name: 'AddressList',
        component: () => import('@/views/address/index.vue'),
        meta: { title: '收货地址', requiresAuth: true }
      },
      {
        path: 'edit',
        name: 'AddressEdit',
        component: () => import('@/views/address/edit.vue'),
        meta: { title: '编辑地址', requiresAuth: true }
      }
    ]
  },
  {
    path: '/coupon',
    name: 'Coupon',
    component: () => import('@/views/coupon/index.vue'),
    meta: { title: '优惠券', requiresAuth: true }
  },
  {
    path: '/collect',
    name: 'Collect',
    component: () => import('@/views/collect/index.vue'),
    meta: { title: '我的收藏', requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/index.vue'),
    meta: { title: '设置', requiresAuth: true }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/search/index.vue'),
    meta: { title: '搜索' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 设置标题
  document.title = to.meta.title || '美团优选'
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.isLogin) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  next()
})

export default router