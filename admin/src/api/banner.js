import request from '@/utils/request'

// 获取轮播图列表
export function getBannerList(params) {
  return request({
    url: '/banner/list',
    method: 'get',
    params
  })
}

// 创建轮播图
export function createBanner(data) {
  return request({
    url: '/banner',
    method: 'post',
    data
  })
}

// 更新轮播图
export function updateBanner(id, data) {
  return request({
    url: `/banner/${id}`,
    method: 'put',
    data
  })
}

// 删除轮播图
export function deleteBanner(id) {
  return request({
    url: `/banner/${id}`,
    method: 'delete'
  })
} 