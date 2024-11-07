import request from '@/utils/request'

// 获取首页轮播图
export function getBanners() {
  return request({
    url: '/home/banners',
    method: 'get'
  })
}

// 获取商品列表
export function getGoodsList(params) {
  return request({
    url: '/home/goods',
    method: 'get',
    params
  })
} 