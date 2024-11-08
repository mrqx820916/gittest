// 地址解析正则
const NAME_REG = /^[\u4e00-\u9fa5]{2,6}$/
const PHONE_REG = /^1[3-9]\d{9}$/
const ADDRESS_REG = /^(北京|天津|河北|山西|内蒙古|辽宁|吉林|黑龙江|上海|江苏|浙江|安徽|福建|江西|山东|河南|湖北|湖南|广东|广西|海南|重庆|四川|贵州|云南|西藏|陕西|甘肃|青海|宁夏|新疆)(?:省|市|自治区)?([^省]+?)(?:市|自治州|地区|区划|县)?([^市]+?)(?:区|县|镇|乡)?(.+)$/

// 解析地址文本
export const parseAddress = async (text) => {
  // 清理文本
  text = text.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  
  // 提取手机号
  const phoneMatch = text.match(PHONE_REG)
  const phone = phoneMatch ? phoneMatch[0] : ''
  if (phone) {
    text = text.replace(phone, ' ')
  }
  
  // 提取姓名（假设姓名在手机号前后5个字符内）
  let name = ''
  const nameMatches = text.match(/[\u4e00-\u9fa5]{2,6}/g) || []
  for (const match of nameMatches) {
    if (NAME_REG.test(match)) {
      const phoneIndex = text.indexOf(phone)
      const nameIndex = text.indexOf(match)
      if (Math.abs(phoneIndex - nameIndex) <= 5) {
        name = match
        text = text.replace(match, ' ')
        break
      }
    }
  }
  
  // 提取地址
  const addressMatch = text.match(ADDRESS_REG)
  if (!addressMatch) {
    return null
  }
  
  const [, province, city, county, addressDetail] = addressMatch
  
  // 使用高德地图API验证地址
  try {
    const response = await fetch(`https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(text)}&key=${YOUR_AMAP_KEY}`)
    const data = await response.json()
    
    if (data.status === '1' && data.geocodes.length > 0) {
      const geocode = data.geocodes[0]
      const [validProvince, validCity, validDistrict] = geocode.formatted_address.split(',')
      
      return {
        name,
        tel: phone,
        province: validProvince || province,
        city: validCity || city,
        county: validDistrict || county,
        addressDetail: addressDetail.trim()
      }
    }
  } catch (error) {
    console.error('地址验证失败:', error)
  }
  
  // 如果API验证失败，返回正则匹配结果
  return {
    name,
    tel: phone,
    province,
    city,
    county,
    addressDetail: addressDetail.trim()
  }
} 