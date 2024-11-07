import { showToast } from 'vant'
import request from './request'

export const uploadFile = async (file, options = {}) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await request({
      url: '/upload',
      method: 'post',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...options
    })
    
    return res.url
  } catch (error) {
    showToast('上传失败')
    throw error
  }
} 