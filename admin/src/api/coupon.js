import request from '@/utils/request'

// 获取优惠券列表
export function getCouponList(params) {
  return request({
    url: '/coupon/list',
    method: 'get',
    params
  })
}

// 创建优惠券
export function createCoupon(data) {
  return request({
    url: '/coupon',
    method: 'post',
    data
  })
}

// 更新优惠券
export function updateCoupon(id, data) {
  return request({
    url: `/coupon/${id}`,
    method: 'put',
    data
  })
} 