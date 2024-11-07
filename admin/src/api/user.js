import request from '@/utils/request'

// 管理员登录
export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

// 获取用户订单列表
export function getUserOrders(userId, params) {
  return request({
    url: `/user/${userId}/orders`,
    method: 'get',
    params
  })
} 