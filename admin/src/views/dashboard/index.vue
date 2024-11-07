<template>
  <div class="dashboard">
    <!-- 数据概览 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>今日订单</span>
              <el-tag size="small">较昨日 +{{ todayOrderIncrease }}%</el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ todayOrderCount }}</div>
            <div class="amount">金额：¥{{ todayOrderAmount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>今日用户</span>
              <el-tag size="small" type="success">较昨日 +{{ todayUserIncrease }}%</el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ todayUserCount }}</div>
            <div class="amount">总用户：{{ totalUserCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>商品总数</span>
              <el-tag size="small" type="warning">较昨日 +{{ goodsIncrease }}</el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ goodsCount }}</div>
            <div class="amount">上架中：{{ onSaleCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>总销售额</span>
              <el-tag size="small" type="info">较昨日 +{{ salesIncrease }}%</el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="number">¥{{ totalSales }}</div>
            <div class="amount">今日：¥{{ todaySales }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订单趋势</span>
              <el-radio-group v-model="orderChartType" size="small">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div ref="orderChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售额趋势</span>
              <el-radio-group v-model="salesChartType" size="small">
                <el-radio-button label="week">近7天</el-radio-button>
                <el-radio-button label="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container">
            <div ref="salesChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>商品销���排行</span>
              <el-select v-model="rankType" size="small">
                <el-option label="今日" value="today" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
            </div>
          </template>
          <div class="rank-list">
            <div
              v-for="(item, index) in goodsRank"
              :key="item.id"
              class="rank-item"
            >
              <span class="rank-number" :class="{ top3: index < 3 }">{{ index + 1 }}</span>
              <el-image
                :src="item.thumb"
                fit="cover"
                class="goods-image"
              />
              <div class="goods-info">
                <div class="goods-title">{{ item.title }}</div>
                <div class="goods-sales">销量：{{ item.sales }}</div>
              </div>
              <div class="goods-amount">¥{{ item.amount }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>分类销售占比</span>
            </div>
          </template>
          <div class="chart-container">
            <div ref="pieChart" class="chart"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

// 数据概览
const todayOrderCount = ref(0)
const todayOrderAmount = ref(0)
const todayOrderIncrease = ref(0)
const todayUserCount = ref(0)
const totalUserCount = ref(0)
const todayUserIncrease = ref(0)
const goodsCount = ref(0)
const onSaleCount = ref(0)
const goodsIncrease = ref(0)
const totalSales = ref(0)
const todaySales = ref(0)
const salesIncrease = ref(0)

// 图表相关
const orderChartType = ref('week')
const salesChartType = ref('week')
const rankType = ref('today')
const orderChart = ref(null)
const salesChart = ref(null)
const pieChart = ref(null)
let orderChartInstance = null
let salesChartInstance = null
let pieChartInstance = null

// 商品排行
const goodsRank = ref([])

// 初始化数据
onMounted(async () => {
  await Promise.all([
    loadOverview(),
    loadChartData(),
    loadGoodsRank()
  ])
  
  // 初始化图表
  initOrderChart()
  initSalesChart()
  initPieChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 加载数据概览
const loadOverview = async () => {
  // TODO: 调用获取数据概览接口
  todayOrderCount.value = 100
  todayOrderAmount.value = 9999.99
  todayOrderIncrease.value = 15
  todayUserCount.value = 50
  totalUserCount.value = 1000
  todayUserIncrease.value = 10
  goodsCount.value = 500
  onSaleCount.value = 450
  goodsIncrease.value = 5
  totalSales.value = 99999.99
  todaySales.value = 9999.99
  salesIncrease.value = 20
}

// 加载图表数据
const loadChartData = async () => {
  // TODO: 调用获取图表数据接口
}

// 加载商品排行
const loadGoodsRank = async () => {
  // TODO: 调用获取商品排行接口
  goodsRank.value = [
    {
      id: 1,
      title: '新鲜水果大礼包',
      thumb: 'https://img.yzcdn.cn/vant/apple-1.jpg',
      sales: 100,
      amount: 9999.99
    }
  ]
}

// 初始化订单趋势图表
const initOrderChart = () => {
  const chartDom = orderChart.value
  orderChartInstance = echarts.init(chartDom)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
        smooth: true
      }
    ]
  }
  
  orderChartInstance.setOption(option)
}

// 初始化销售额趋势图表
const initSalesChart = () => {
  const chartDom = salesChart.value
  salesChartInstance = echarts.init(chartDom)
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
        areaStyle: {}
      }
    ]
  }
  
  salesChartInstance.setOption(option)
}

// 初始化分类占比图表
const initPieChart = () => {
  const chartDom = pieChart.value
  pieChartInstance = echarts.init(chartDom)
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '水果' },
          { value: 735, name: '蔬菜' },
          { value: 580, name: '肉类' },
          { value: 484, name: '海鲜' },
          { value: 300, name: '零食' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  pieChartInstance.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  orderChartInstance?.resize()
  salesChartInstance?.resize()
  pieChartInstance?.resize()
}

// 监听图表类型变化
watch([orderChartType, salesChartType, rankType], async () => {
  await Promise.all([
    loadChartData(),
    loadGoodsRank()
  ])
})
</script>

<style scoped lang="scss">
.dashboard {
  .data-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .card-body {
      text-align: center;
      
      .number {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .amount {
        color: #666;
      }
    }
  }
  
  .chart-row {
    margin-top: 20px;
  }
  
  .chart-container {
    height: 300px;
    
    .chart {
      width: 100%;
      height: 100%;
    }
  }
  
  .rank-list {
    .rank-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
      
      .rank-number {
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background: #eee;
        border-radius: 4px;
        margin-right: 10px;
        
        &.top3 {
          color: #fff;
          background: #f56c6c;
        }
      }
      
      .goods-image {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      
      .goods-info {
        flex: 1;
        
        .goods-title {
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .goods-sales {
          font-size: 12px;
          color: #999;
        }
      }
      
      .goods-amount {
        color: #f56c6c;
        font-weight: bold;
      }
    }
  }
}
</style> 