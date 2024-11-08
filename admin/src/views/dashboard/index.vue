<template>
  <div class="dashboard">
    <!-- 数据概览 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日订单</span>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ stats.todayOrders }}</div>
            <div class="text">较昨日 {{ stats.orderGrowth > 0 ? '+' : '' }}{{ stats.orderGrowth }}%</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日销售额</span>
            </div>
          </template>
          <div class="card-body">
            <div class="number">¥{{ stats.todaySales }}</div>
            <div class="text">较昨日 {{ stats.salesGrowth > 0 ? '+' : '' }}{{ stats.salesGrowth }}%</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>新增用户</span>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ stats.newUsers }}</div>
            <div class="text">较昨日 {{ stats.userGrowth > 0 ? '+' : '' }}{{ stats.userGrowth }}%</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总访问量</span>
            </div>
          </template>
          <div class="card-body">
            <div class="number">{{ stats.totalVisits }}</div>
            <div class="text">较昨日 {{ stats.visitGrowth > 0 ? '+' : '' }}{{ stats.visitGrowth }}%</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
            </div>
          </template>
          <v-chart class="chart" :option="salesOption" autoresize />
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>用户分布</span>
            </div>
          </template>
          <v-chart class="chart" :option="userOption" autoresize />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 统计数据
const stats = ref({
  todayOrders: 156,
  orderGrowth: 12.5,
  todaySales: 25680,
  salesGrowth: 8.2,
  newUsers: 85,
  userGrowth: -2.8,
  totalVisits: 1256,
  visitGrowth: 5.6
})

// 销售趋势图配置
const salesOption = ref({
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
      smooth: true
    }
  ]
})

// 用户分布图配置
const userOption = ref({
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
        { value: 1048, name: '北京' },
        { value: 735, name: '上海' },
        { value: 580, name: '广州' },
        { value: 484, name: '深圳' },
        { value: 300, name: '其他' }
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
})

// 初始化
onMounted(() => {
  // TODO: 加载实际数据
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 20px;
  
  .el-row {
    margin-bottom: 20px;
  }
  
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
    
    .text {
      font-size: 14px;
      color: #999;
    }
  }
  
  .charts {
    .chart {
      height: 300px;
    }
  }
}
</style> 