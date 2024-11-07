import request from '@/utils/request'

export function getGoodsList(params) {
  return request({
    url: '/goods/list',
    method: 'get',
    params
  })
}

export function getGoodsDetail(id) {
  return request({
    url: `/goods/${id}`,
    method: 'get'
  })
}

export function searchGoods(params) {
  return request({
    url: '/goods/search',
    method: 'get',
    params
  })
} 