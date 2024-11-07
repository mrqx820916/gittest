import request from '@/utils/request'

// 获取消息列表
export function getNotifications(params) {
  return request({
    url: '/notification',
    method: 'get',
    params
  })
}

// 标记消息为已读
export function markAsRead(id) {
  return request({
    url: `/notification/${id}/read`,
    method: 'put'
  })
}

// 标记所有消息为已读
export function markAllAsRead() {
  return request({
    url: '/notification/read-all',
    method: 'put'
  })
} 