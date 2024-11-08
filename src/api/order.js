import request from '@/utils/request'

// 获取订单列表
export function getOrderList(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params
  })
}

// 获取订单详情
export function getOrderDetail(id) {
  return request({
    url: `/order/${id}`,
    method: 'get'
  })
}

// 获取订单状态数量统计
export function getOrderCounts() {
  return request({
    url: '/order/status/count',
    method: 'get'
  })
}

// 创建订单
export function createOrder(data) {
  return request({
    url: '/order',
    method: 'post',
    data
  })
}

// 取消订单
export function cancelOrder(id) {
  return request({
    url: `/order/${id}/cancel`,
    method: 'post'
  })
}

// 支付订单
export function payOrder(id, data) {
  return request({
    url: `/order/${id}/pay`,
    method: 'post',
    data
  })
}

// 确认收货
export function confirmOrder(id) {
  return request({
    url: `/order/${id}/confirm`,
    method: 'post'
  })
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: `/order/${id}`,
    method: 'delete'
  })
}

// 获取物流信息
export function getOrderLogistics(id) {
  return request({
    url: `/order/${id}/logistics`,
    method: 'get'
  })
}

// 申请退款
export function refundOrder(id, data) {
  return request({
    url: `/order/${id}/refund`,
    method: 'post',
    data
  })
} 