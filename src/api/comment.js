import request from '@/utils/request'

// 创建评价
export function createComment(data) {
  return request({
    url: '/comment',
    method: 'post',
    data
  })
}

// 获取商品评价列表
export function getGoodsComments(params) {
  return request({
    url: '/comment/goods',
    method: 'get',
    params
  })
} 