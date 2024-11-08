import request from '@/utils/request'

// 上传图片
export function uploadImage(file, options = {}) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/upload/image',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...options
  })
}

// 上传多张图片
export function uploadImages(files, options = {}) {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file)
  })
  
  return request({
    url: '/upload/images',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...options
  })
}

// 上传文件
export function uploadFile(file, options = {}) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/upload/file',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...options
  })
}

// 获取上传Token
export function getUploadToken() {
  return request({
    url: '/upload/token',
    method: 'get'
  })
} 