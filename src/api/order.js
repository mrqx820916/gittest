import request from '@/utils/request'

export function createOrder(data) {
  return request({
    url: '/order',
    method: 'post',
    data
  })
}

export function getOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params
  })
}

export function getOrderDetail(id) {
  return request({
    url: `/order/${id}`,
    method: 'get'
  })
}

export function cancelOrder(id) {
  return request({
    url: `/order/${id}/cancel`,
    method: 'post'
  })
}

export function payOrder(id, data) {
  return request({
    url: `/order/${id}/pay`,
    method: 'post',
    data
  })
}

export function confirmOrder(id) {
  return request({
    url: `/order/${id}/confirm`,
    method: 'post'
  })
} 