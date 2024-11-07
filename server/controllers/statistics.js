import Order from '../models/order.js'
import User from '../models/user.js'
import Goods from '../models/goods.js'
import dayjs from 'dayjs'

// 获取销售统计
export const getSalesStatistics = async (req, res, next) => {
  try {
    const { type = 'day' } = req.query
    const now = dayjs()
    let startTime, endTime, format
    
    switch (type) {
      case 'week':
        startTime = now.subtract(7, 'day').startOf('day')
        endTime = now.endOf('day')
        format = 'YYYY-MM-DD'
        break
      case 'month':
        startTime = now.subtract(30, 'day').startOf('day')
        endTime = now.endOf('day')
        format = 'YYYY-MM-DD'
        break
      case 'year':
        startTime = now.startOf('year')
        endTime = now.endOf('year')
        format = 'YYYY-MM'
        break
      default:
        startTime = now.startOf('day')
        endTime = now.endOf('day')
        format = 'HH:00'
    }
    
    const orders = await Order.find({
      status: { $in: [2, 3, 4, 5] },  // 已支付的订单
      createdAt: {
        $gte: startTime.toDate(),
        $lte: endTime.toDate()
      }
    })
    
    // 按时间分组统计
    const statistics = {}
    orders.forEach(order => {
      const time = dayjs(order.createdAt).format(format)
      if (!statistics[time]) {
        statistics[time] = {
          time,
          count: 0,
          amount: 0
        }
      }
      statistics[time].count++
      statistics[time].amount += order.finalPrice
    })
    
    res.json({
      code: 200,
      data: Object.values(statistics)
    })
  } catch (error) {
    next(error)
  }
}

// 获取商品销量排行
export const getGoodsRanking = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query
    
    const goods = await Goods.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'goods.id',
          as: 'orders'
        }
      },
      {
        $project: {
          title: 1,
          thumb: 1,
          sales: { $size: '$orders' },
          amount: {
            $sum: {
              $map: {
                input: '$orders',
                as: 'order',
                in: '$order.finalPrice'
              }
            }
          }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: Number(limit) }
    ])
    
    res.json({
      code: 200,
      data: goods
    })
  } catch (error) {
    next(error)
  }
}

// 获取用户统计
export const getUserStatistics = async (req, res, next) => {
  try {
    const today = dayjs().startOf('day')
    
    const totalUsers = await User.countDocuments()
    const newUsers = await User.countDocuments({
      createdAt: { $gte: today.toDate() }
    })
    const activeUsers = await User.countDocuments({
      lastLoginTime: { $gte: today.toDate() }
    })
    
    res.json({
      code: 200,
      data: {
        totalUsers,
        newUsers,
        activeUsers
      }
    })
  } catch (error) {
    next(error)
  }
} 