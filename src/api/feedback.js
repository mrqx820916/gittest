import request from '@/utils/request'

// 提交反馈
export function createFeedback(data) {
  return request({
    url: '/feedback',
    method: 'post',
    data
  })
}

// 获取反馈列表
export function getFeedbackList(params) {
  return request({
    url: '/feedback/list',
    method: 'get',
    params
  })
}

// 获取反馈详情
export function getFeedbackDetail(id) {
  return request({
    url: `/feedback/${id}`,
    method: 'get'
  })
}

// 更新反馈状态
export function updateFeedbackStatus(id, status) {
  return request({
    url: `/feedback/${id}/status`,
    method: 'put',
    data: { status }
  })
} 