import request from '@/utils/request'

// 获取购物车列表
export function getCartList() {
  return request({
    url: '/cart/list',
    method: 'get'
  })
}

// 添加到购物车
export function addToCart(data) {
  return request({
    url: '/cart/add',
    method: 'post',
    data
  })
}

// 更新购物车商品数量
export function updateCartQuantity(id, quantity) {
  return request({
    url: `/cart/${id}/quantity`,
    method: 'put',
    data: { quantity }
  })
}

// 更新购物车商品选中状态
export function updateCartChecked(id, checked) {
  return request({
    url: `/cart/${id}/checked`,
    method: 'put',
    data: { checked }
  })
}

// 删除购物车商品
export function removeFromCart(ids) {
  return request({
    url: '/cart/remove',
    method: 'post',
    data: { ids }
  })
}

// 清空购物车
export function clearCart() {
  return request({
    url: '/cart/clear',
    method: 'post'
  })
}

// 获取购物车商品数量
export function getCartCount() {
  return request({
    url: '/cart/count',
    method: 'get'
  })
}

// 获取购物车商品总价
export function getCartAmount() {
  return request({
    url: '/cart/amount',
    method: 'get'
  })
}

// 获取可用优惠券
export function getAvailableCoupons(amount) {
  return request({
    url: '/cart/coupons',
    method: 'get',
    params: { amount }
  })
} 