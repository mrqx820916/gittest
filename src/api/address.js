import request from '@/utils/request'

export function getAddressList() {
  return request({
    url: '/address/list',
    method: 'get'
  })
}

export function createAddress(data) {
  return request({
    url: '/address',
    method: 'post',
    data
  })
}

export function updateAddress(id, data) {
  return request({
    url: `/address/${id}`,
    method: 'put',
    data
  })
}

export function deleteAddress(id) {
  return request({
    url: `/address/${id}`,
    method: 'delete'
  })
} 