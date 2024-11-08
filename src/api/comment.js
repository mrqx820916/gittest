import request from '@/utils/request'

// 获取商品评价列表
export function getGoodsComments(params) {
  return request({
    url: '/comment/goods',
    method: 'get',
    params
  })
}

// 创建评价
export function createComment(data) {
  return request({
    url: '/comment',
    method: 'post',
    data
  })
}

// 获取我的评价列表
export function getMyComments(params) {
  return request({
    url: '/comment/my',
    method: 'get',
    params
  })
}

// 删除评价
export function deleteComment(id) {
  return request({
    url: `/comment/${id}`,
    method: 'delete'
  })
}

// 点赞评价
export function likeComment(id) {
  return request({
    url: `/comment/${id}/like`,
    method: 'post'
  })
} 