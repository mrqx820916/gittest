// 获取数据概览
export const getOverview = async (req, res) => {
  try {
    // TODO: 从数据库获取统计数据
    const data = {
      todayOrderCount: 100,
      todayOrderAmount: 9999.99,
      todayOrderIncrease: 15,
      todayUserCount: 50,
      totalUserCount: 1000,
      todayUserIncrease: 10,
      goodsCount: 500,
      onSaleCount: 450,
      goodsIncrease: 5,
      totalSales: 99999.99,
      todaySales: 9999.99,
      salesIncrease: 20
    }
    
    res.json({
      code: 200,
      data
    })
  } catch (error) {
    console.error('获取数据概览失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取数据概览失败'
    })
  }
}

// 获取订单趋势
export const getOrderTrend = async (req, res) => {
  try {
    const { type } = req.query
    // TODO: 从数据库获取订单趋势数据
    const data = {
      dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [150, 230, 224, 218, 135, 147, 260]
    }
    
    res.json({
      code: 200,
      data
    })
  } catch (error) {
    console.error('获取订单趋势失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取订单趋势失败'
    })
  }
}

// 获取销售额趋势
export const getSalesTrend = async (req, res) => {
  try {
    const { type } = req.query
    // TODO: 从数据库获取销售额趋势数据
    const data = {
      dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [820, 932, 901, 934, 1290, 1330, 1320]
    }
    
    res.json({
      code: 200,
      data
    })
  } catch (error) {
    console.error('获取销售额趋势失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取销售额趋势失败'
    })
  }
}

// 获取商品销量排行
export const getGoodsRank = async (req, res) => {
  try {
    const { type } = req.query
    // TODO: 从数据库获取商品销量排行数据
    const data = [
      {
        id: 1,
        title: '新鲜水果大礼包',
        thumb: 'https://img.yzcdn.cn/vant/apple-1.jpg',
        sales: 100,
        amount: 9999.99
      }
    ]
    
    res.json({
      code: 200,
      data
    })
  } catch (error) {
    console.error('获取商品销量排行失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取商品销量排行失败'
    })
  }
}

// 获取分类销售占比
export const getCategoryRatio = async (req, res) => {
  try {
    // TODO: 从数据库获取分类销售占比数据
    const data = [
      { value: 1048, name: '水果' },
      { value: 735, name: '蔬菜' },
      { value: 580, name: '肉类' },
      { value: 484, name: '海鲜' },
      { value: 300, name: '零食' }
    ]
    
    res.json({
      code: 200,
      data
    })
  } catch (error) {
    console.error('获取分类销售占比失败:', error)
    res.status(500).json({
      code: 500,
      message: '获取分类销售占比失败'
    })
  }
} 