import request from '@/utils/request'

// 获取商品列表
export function getGoodsList(params) {
  return request({
    url: '/goods/list',
    method: 'get',
    params
  })
}

// 创建商品
export function createGoods(data) {
  return request({
    url: '/goods',
    method: 'post',
    data
  })
}

// 更新商品
export function updateGoods(id, data) {
  return request({
    url: `/goods/${id}`,
    method: 'put',
    data
  })
}

// 删除商品
export function deleteGoods(id) {
  return request({
    url: `/goods/${id}`,
    method: 'delete'
  })
}

// 获取商品分类列表
export function getCategoryList() {
  return request({
    url: '/category/list',
    method: 'get'
  })
}

// 创建分类
export function createCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

// 更新分类
export function updateCategory(id, data) {
  return request({
    url: `/category/${id}`,
    method: 'put',
    data
  })
}

// 删除分类
export function deleteCategory(id) {
  return request({
    url: `/category/${id}`,
    method: 'delete'
  })
} 