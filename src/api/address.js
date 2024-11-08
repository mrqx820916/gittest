import request from '@/utils/request'

// 获取地址列表
export function getAddressList() {
  return request({
    url: '/address/list',
    method: 'get'
  })
}

// 获取地址详情
export function getAddressDetail(id) {
  return request({
    url: `/address/${id}`,
    method: 'get'
  })
}

// 新增地址
export function createAddress(data) {
  return request({
    url: '/address',
    method: 'post',
    data
  })
}

// 更新地址
export function updateAddress(id, data) {
  return request({
    url: `/address/${id}`,
    method: 'put',
    data
  })
}

// 删除地址
export function deleteAddress(id) {
  return request({
    url: `/address/${id}`,
    method: 'delete'
  })
}

// 设置默认地址
export function setDefaultAddress(id) {
  return request({
    url: `/address/${id}/default`,
    method: 'put'
  })
}

// 获取默认地址
export function getDefaultAddress() {
  return request({
    url: '/address/default',
    method: 'get'
  })
}

// 获取收货地区列表
export function getAreaList(parentId) {
  return request({
    url: '/address/areas',
    method: 'get',
    params: { parentId }
  })
} 