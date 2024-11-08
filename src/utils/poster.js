import html2canvas from 'html2canvas'
import QRCode from 'qrcode'

export const generatePoster = async ({
  title,
  price,
  image,
  qrcode
}) => {
  // 创建海报容器
  const container = document.createElement('div')
  container.style.cssText = `
    position: fixed;
    left: -9999px;
    width: 375px;
    background: #fff;
    padding: 20px;
  `
  
  // 生成二维码
  const qrcodeUrl = await QRCode.toDataURL(qrcode, {
    width: 100,
    margin: 0
  })
  
  // 构建海报HTML
  container.innerHTML = `
    <div class="poster">
      <img src="${image}" class="goods-image" />
      <div class="goods-info">
        <div class="title">${title}</div>
        <div class="price">¥${price}</div>
      </div>
      <img src="${qrcodeUrl}" class="qrcode" />
      <div class="tips">长按识别二维码查看商品</div>
    </div>
  `
  
  // 添加样式
  const style = document.createElement('style')
  style.textContent = `
    .poster {
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .goods-image {
      width: 100%;
      height: 375px;
      object-fit: cover;
    }
    .goods-info {
      margin: 15px 0;
    }
    .title {
      font-size: 16px;
      line-height: 1.4;
      color: #333;
      margin-bottom: 8px;
    }
    .price {
      font-size: 20px;
      font-weight: bold;
      color: #ee0a24;
    }
    .qrcode {
      width: 100px;
      height: 100px;
      margin: 0 auto;
      display: block;
    }
    .tips {
      text-align: center;
      font-size: 12px;
      color: #999;
      margin-top: 8px;
    }
  `
  
  document.body.appendChild(container)
  document.head.appendChild(style)
  
  try {
    // 生成海报图片
    const canvas = await html2canvas(container, {
      useCORS: true,
      scale: 2
    })
    
    const poster = canvas.toDataURL('image/jpeg', 0.8)
    
    // 清理DOM
    document.body.removeChild(container)
    document.head.removeChild(style)
    
    return poster
  } catch (error) {
    // 清理DOM
    document.body.removeChild(container)
    document.head.removeChild(style)
    throw error
  }
} 