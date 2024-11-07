import Notification from '../models/notification.js'
import { AppError } from '../middlewares/error.js'

// 获取消息列表
export const getNotifications = async (req, res, next) => {
  try {
    const { pageNum = 1, pageSize = 10 } = req.query
    
    const query = { user: req.user.id }
    const total = await Notification.countDocuments(query)
    const list = await Notification.find(query)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
    
    res.json({
      code: 200,
      data: {
        list,
        total,
        pageNum: Number(pageNum),
        pageSize: Number(pageSize)
      }
    })
  } catch (error) {
    next(error)
  }
}

// 标记消息为已读
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      { isRead: true },
      { new: true }
    )
    
    if (!notification) {
      throw new AppError('消息不存在', 404)
    }
    
    res.json({
      code: 200,
      data: notification
    })
  } catch (error) {
    next(error)
  }
}

// 标记所有消息为已读
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false
      },
      { isRead: true }
    )
    
    res.json({
      code: 200,
      message: '操作成功'
    })
  } catch (error) {
    next(error)
  }
}

// 发送消息（内部使用）
export const sendNotification = async ({
  user,
  title,
  content,
  type,
  data
}) => {
  await Notification.create({
    user,
    title,
    content,
    type,
    data
  })
} 