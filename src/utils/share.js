// 分享配置
const shareConfig = {
  title: '美团优选',
  desc: '品质生活，优选美团',
  link: window.location.href,
  imgUrl: 'https://example.com/logo.png'
}

// 初始化分享配置
export const initShare = (config = {}) => {
  const finalConfig = { ...shareConfig, ...config }
  
  // 微信分享
  if (window.wx) {
    window.wx.updateAppMessageShareData({
      title: finalConfig.title,
      desc: finalConfig.desc,
      link: finalConfig.link,
      imgUrl: finalConfig.imgUrl,
      success: () => {
        console.log('分享设置成功')
      }
    })
    
    window.wx.updateTimelineShareData({
      title: finalConfig.title,
      link: finalConfig.link,
      imgUrl: finalConfig.imgUrl,
      success: () => {
        console.log('分享设置成功')
      }
    })
  }
}

// 分享到微信
export const shareToWechat = (config = {}) => {
  if (!window.wx) {
    showToast('请在微信中打开')
    return
  }
  
  window.wx.showOptionMenu()
}

// 生成分享海报
export const generatePoster = async (data) => {
  // TODO: 实现海报生成逻辑
}

// 复制分享链��
export const copyLink = async (link = window.location.href) => {
  try {
    await navigator.clipboard.writeText(link)
    showToast('复制成功')
    return true
  } catch (error) {
    showToast('复制失败')
    return false
  }
} 