import request from '@/utils/request'

// 获取轮播图列表
export function getBannerList(params) {
  return request({
    url: '/banner/list',
    method: 'get',
    params
  })
} 