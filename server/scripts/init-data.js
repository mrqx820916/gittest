import mongoose from 'mongoose'
import User from '../models/user.js'
import Goods from '../models/goods.js'

// 连接数据库
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// 初始化数据
const initData = async () => {
  try {
    // 清空集合
    await User.deleteMany()
    await Goods.deleteMany()

    // 添加测试数据
    await User.create({ username: 'admin', password: '123456' })
    await Goods.create({ name: 'Test Product', price: 100 })

    console.log('数据初始化完成')
    process.exit(0)
  } catch (error) {
    console.error('数据初始化失败:', error)
    process.exit(1)
  }
}

initData() 