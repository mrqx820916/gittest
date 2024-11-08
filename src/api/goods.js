import request from '@/utils/request'

// 获取轮播图列表
export function getBanners() {
  return request({
    url: '/banner/list',
    method: 'get'
  })
}

// 获取商品列表
export function getGoodsList(params) {
  return request({
    url: '/goods/list',
    method: 'get',
    params
  })
}

// 获取商品详情
export function getGoodsDetail(id) {
  return request({
    url: `/goods/${id}`,
    method: 'get'
  })
}

// 获取分类列表
export function getCategories() {
  return request({
    url: '/category/list',
    method: 'get'
  })
}

// 获取分类商品
export function getCategoryGoods(categoryId, params) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: {
      ...params,
      category: categoryId
    }
  })
}

// 获取推荐商品
export function getRecommendGoods(id) {
  return request({
    url: '/goods/recommend',
    method: 'get',
    params: { id }
  })
}

// 检查商品库存
export function checkGoodsStock(ids) {
  return request({
    url: '/goods/stock',
    method: 'post',
    data: { ids }
  })
} 