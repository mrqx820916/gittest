// 生成订单号
export const generateOrderNo = () => {
  const now = new Date()
  const timestamp = now.getTime().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${timestamp}${random}`
}

// 计算订单金额
export const calculateOrderAmount = (goods, deliveryFee = 0, discount = 0) => {
  const totalPrice = goods.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
  
  const finalPrice = totalPrice + deliveryFee - discount
  
  return {
    totalPrice,
    deliveryFee,
    discountAmount: discount,
    finalPrice
  }
}

// 订单状态文本
export const ORDER_STATUS = {
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '待评价',
  5: '已完成',
  6: '已取消'
}

// 验证订单状态转换是否合法
export const validateOrderStatus = (currentStatus, newStatus) => {
  const validTransitions = {
    1: [6],        // 待付款 -> 已取消
    2: [3],        // 待发货 -> 待收货
    3: [4],        // 待收货 -> 待评价
    4: [5]         // 待评价 -> 已完成
  }
  
  return validTransitions[currentStatus]?.includes(newStatus) || false
} 