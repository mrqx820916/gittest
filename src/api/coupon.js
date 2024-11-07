import request from '@/utils/request'

// 获取优惠券列表
export function getCouponList(params) {
  return request({
    url: '/coupon/list',
    method: 'get',
    params
  })
}

// 领取优惠券
export function receiveCoupon(id) {
  return request({
    url: `/coupon/${id}/receive`,
    method: 'post'
  })
}

// 获取我的优惠券
export function getMyCoupons(params) {
  return request({
    url: '/coupon/my',
    method: 'get',
    params
  })
}

// 获取可用优惠券
export function getAvailableCoupons(params) {
  return request({
    url: '/coupon/available',
    method: 'get',
    params
  })
} 