import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'
import Goods from '../models/goods.js'
import Category from '../models/category.js'
import Banner from '../models/banner.js'
import Order from '../models/order.js'
import Comment from '../models/comment.js'
import config from '../config/index.js'
import logger from '../utils/logger.js'

// 初始化数据
async function initData() {
  try {
    console.log('开始初始化数据...')
    
    // 连接数据库
    console.log('正在连接数据库...')
    await mongoose.connect(config.mongoURI)
    console.log('MongoDB 连接成功')
    
    // 清空数据库
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections) {
      await collection.drop().catch(() => {})
    }
    console.log('数据库已清空')
    
    // 创建商品分类
    const categories = await Category.create([
      { name: '新鲜水果', icon: 'fruit', sort: 1 },
      { name: '时令蔬菜', icon: 'vegetable', sort: 2 },
      { name: '肉禽蛋品', icon: 'meat', sort: 3 },
      { name: '海鲜水产', icon: 'seafood', sort: 4 },
      { name: '乳品烘焙', icon: 'milk', sort: 5 }
    ])

    // 创建测试商品
    const goodsList = [
      // 水果类
      {
        title: '云南红富士苹果',
        price: 19.9,
        originalPrice: 29.9,
        category: categories[0]._id,
        sales: 1000,
        stock: 500,
        thumb: 'https://img14.360buyimg.com/n1/jfs/t1/36429/19/19671/193202/63da3cc3F34b831c6/4ab93d1c1613c3d4.jpg',
        images: [
          'https://img14.360buyimg.com/n1/jfs/t1/36429/19/19671/193202/63da3cc3F34b831c6/4ab93d1c1613c3d4.jpg',
          'https://img14.360buyimg.com/n1/jfs/t1/117201/25/23901/165424/63da3cc3F4d37afa1/8b2d8a41799c1da6.jpg'
        ],
        desc: '云南高原红富士苹果，甜度高，口感好',
        detail: '<p>产地：云南</p><p>规格：约500g/个</p><p>甜度：高</p>',
        specs: [
          {
            name: '规格',
            values: ['小果', '中果', '大果']
          },
          {
            name: '包装',
            values: ['散装', '礼盒']
          }
        ],
        skuList: [
          {
            specs: { '规格': '小果', '包装': '散装' },
            price: 19.9,
            originalPrice: 29.9,
            stock: 100
          },
          {
            specs: { '规格': '中果', '包装': '散装' },
            price: 25.9,
            originalPrice: 35.9,
            stock: 100
          },
          {
            specs: { '规格': '大果', '包装': '散装' },
            price: 29.9,
            originalPrice: 39.9,
            stock: 100
          }
        ],
        status: 1,
        tags: ['热销', '包邮']
      }
    ]

    await Goods.create(goodsList)

    // 创建轮播图
    await Banner.create([
      {
        title: '新人专享',
        image: 'https://img30.360buyimg.com/mobilecms/jfs/t1/146172/35/37955/244362/65bf4f6fF4c7c2f67/f6b8e21f71c7e046.jpg',
        url: '/goods/1',
        sort: 1
      },
      {
        title: '限时特惠',
        image: 'https://img30.360buyimg.com/mobilecms/jfs/t1/232759/27/1993/183685/65bf4f6fF4d37afa1/8b2d8a41799c1da6.jpg',
        url: '/goods/2',
        sort: 2
      },
      {
        title: '品质生活',
        image: 'https://img30.360buyimg.com/mobilecms/jfs/t1/232759/27/1993/183685/65bf4f6fF4d37afa1/8b2d8a41799c1da6.jpg',
        url: '/goods/3',
        sort: 3
      }
    ])

    // 创建测试用户
    await User.create([
      {
        phone: '13000000000',
        password: bcrypt.hashSync('admin123', 10),
        nickname: '管理员',
        role: 'admin'
      },
      {
        phone: '13111111111',
        password: bcrypt.hashSync('123456', 10),
        nickname: '测试用户1'
      },
      {
        phone: '13222222222',
        password: bcrypt.hashSync('123456', 10),
        nickname: '测试用户2'
      }
    ])
    
    console.log('数据初始化完成')
    process.exit(0)
  } catch (error) {
    console.error('数据初始化失败:', error)
    process.exit(1)
  }
}

// 执行初始化
initData()