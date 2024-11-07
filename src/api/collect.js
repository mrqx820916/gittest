import request from '@/utils/request'

export function getCollectList(params) {
  return request({
    url: '/collect/list',
    method: 'get',
    params
  })
}

export function addCollect(id) {
  return request({
    url: `/collect/${id}`,
    method: 'post'
  })
}

export function cancelCollect(id) {
  return request({
    url: `/collect/${id}`,
    method: 'delete'
  })
} 