import request from '@/utils/request'

// 发送验证码
export function sendVerifyCode(phone) {
  return request({
    url: '/user/sendCode',
    method: 'post',
    data: { phone }
  })
}

// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return request({
    url: '/user/info',
    method: 'put',
    data
  })
}

// 获取浏览历史
export function getHistoryList(params) {
  return request({
    url: '/user/history',
    method: 'get',
    params
  })
}

// 收藏商品
export function addCollect(id) {
  return request({
    url: `/user/collect/${id}`,
    method: 'post'
  })
}

// 取消收藏
export function cancelCollect(id) {
  return request({
    url: `/user/collect/${id}`,
    method: 'delete'
  })
}

// 获取收藏列表
export function getCollectList(params) {
  return request({
    url: '/user/collects',
    method: 'get',
    params
  })
}

// 修改手机号
export function updatePhone(data) {
  return request({
    url: '/user/phone',
    method: 'put',
    data
  })
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}

// 设置支付密码
export function setPayPassword(data) {
  return request({
    url: '/user/payPassword',
    method: 'put',
    data
  })
}

// 实名认证
export function verifyIdentity(data) {
  return request({
    url: '/user/verify',
    method: 'post',
    data
  })
}

// 获取用户优惠券列表
export function getCouponList(params) {
  return request({
    url: '/user/coupons',
    method: 'get',
    params
  })
}

// 领取优惠券
export function receiveCoupon(id) {
  return request({
    url: `/user/coupon/${id}`,
    method: 'post'
  })
}

// 获取用户积分记录
export function getPointsRecord(params) {
  return request({
    url: '/user/points/record',
    method: 'get',
    params
  })
}

// 获取用户余额记录
export function getBalanceRecord(params) {
  return request({
    url: '/user/balance/record',
    method: 'get',
    params
  })
} 