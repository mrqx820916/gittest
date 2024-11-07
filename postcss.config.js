export default {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // Vant 官方推荐值
      propList: ['*'],
      selectorBlackList: ['.norem'] // 不转换的类名
    }
  }
} 