<template>
  <div class="statistics">
    <!-- 数据概览 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>销售额</span>
              <el-select v-model="salesType" size="small">
                <el-option label="今日" value="day" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
            </div>
          </template>
          <div class="card-body">
            <div class="number">¥{{ salesAmount }}</div>
            <div class="chart-container">
              <div ref="salesChart" class="chart"></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>订单量</span>
              <el-select v-model="orderType" size="small">
                <el-option label="今日" value="day" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ orderCount }}</div>
            <div class="chart-container">
              <div ref="orderChart" class="chart"></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>用户数</span>
              <el-select v-model="userType" size="small">
                <el-option label="今日" value="day" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ userCount }}</div>
            <div class="chart-container">
              <div ref="userChart" class="chart"></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 商品销量排行 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>商品销量排行</span>
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
const salesType = ref('day')
const orderType = ref('day')
const userType = ref('day')
const salesAmount = ref(0)
const orderCount = ref(0)
const userCount = ref(0)

// 图表相关
const salesChart = ref(null)
const orderChart = ref(null)
const userChart = ref(null)
const pieChart = ref(null)
let salesChartInstance = null
let orderChartInstance = null
let userChartInstance = null
let pieChartInstance = null

// 商品排行
const rankType = ref('today')
const goodsRank = ref([])

// 初始化数据
onMounted(async () => {
  await Promise.all([
    loadSalesData(),
    loadOrderData(),
    loadUserData(),
    loadGoodsRank()
  ])
  
  // 初始化图表
  initSalesChart()
  initOrderChart()
  initUserChart()
  initPieChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 加载销售数据
const loadSalesData = async () => {
  // TODO: 调用获取销售统计接口
}

// 加载订单数据
const loadOrderData = async () => {
  // TODO: 调用获取订单统计接口
}

// 加载用户数据
const loadUserData = async () => {
  // TODO: 调用获取用户统计接口
}

// 加载商品排行
const loadGoodsRank = async () => {
  // TODO: 调用获取商品排行接口
}

// 初始化销售额图表
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

// 初始化订单量图表
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

// 初始化用户数图表
const initUserChart = () => {
  const chartDom = userChart.value
  userChartInstance = echarts.init(chartDom)
  
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
        data: [50, 45, 65, 85, 95, 120, 150],
        type: 'line',
        smooth: true
      }
    ]
  }
  
  userChartInstance.setOption(option)
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
  salesChartInstance?.resize()
  orderChartInstance?.resize()
  userChartInstance?.resize()
  pieChartInstance?.resize()
}

// 监听类型变化
watch([salesType, orderType, userType, rankType], async () => {
  await Promise.all([
    loadSalesData(),
    loadOrderData(),
    loadUserData(),
    loadGoodsRank()
  ])
})
</script>

<style scoped lang="scss">
.statistics {
  .data-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .card-body {
      .number {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
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