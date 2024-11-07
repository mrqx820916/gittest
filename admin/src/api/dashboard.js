import request from '@/utils/request'

// 获取数据概览
export function getOverview() {
  return request({
    url: '/dashboard/overview',
    method: 'get'
  })
}

// 获取订单趋势
export function getOrderTrend(params) {
  return request({
    url: '/dashboard/order-trend',
    method: 'get',
    params
  })
}

// 获取销售额趋势
export function getSalesTrend(params) {
  return request({
    url: '/dashboard/sales-trend',
    method: 'get',
    params
  })
}

// 获取商品销量排行
export function getGoodsRank(params) {
  return request({
    url: '/dashboard/goods-rank',
    method: 'get',
    params
  })
}

// 获取分类销售占比
export function getCategoryRatio() {
  return request({
    url: '/dashboard/category-ratio',
    method: 'get'
  })
} 