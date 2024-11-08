<template>
  <div class="order">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="订单号">
          <el-input
            v-model="searchForm.orderNo"
            placeholder="请输入订单号"
            clearable
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择订单状态"
            clearable
          >
            <el-option
              v-for="item in orderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 订单列表 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
          <el-button type="primary" @click="onExport">导出订单</el-button>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column label="商品信息">
          <template #default="{ row }">
            <div
              v-for="item in row.goods"
              :key="item.id"
              class="goods-item"
            >
              <el-image
                :src="item.thumb"
                :preview-src-list="[item.thumb]"
                fit="cover"
                class="goods-image"
              />
              <div class="goods-info">
                <div class="goods-title">{{ item.title }}</div>
                <div class="goods-spec">
                  规格：{{ formatSpecs(item.specs) }}
                </div>
                <div class="goods-price">
                  ¥{{ item.price }} x {{ item.quantity }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="收货信息" width="200">
          <template #default="{ row }">
            <div>{{ row.address.name }}</div>
            <div>{{ row.address.tel }}</div>
            <div>{{ formatAddress(row.address) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" width="150">
          <template #default="{ row }">
            <div>商品总额：¥{{ row.totalPrice }}</div>
            <div>运费：¥{{ row.deliveryFee }}</div>
            <div>优惠：-¥{{ row.discountAmount }}</div>
            <div class="final-price">实付：¥{{ row.finalPrice }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusType(row.status)">
              {{ getOrderStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="onDetail(row)"
            >
              详情
            </el-button>
            <el-button
              v-if="row.status === 2"
              link
              type="success"
              @click="onDeliver(row)"
            >
              发货
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 发货对话框 -->
    <el-dialog
      v-model="deliverVisible"
      title="订单发货"
      width="500px"
    >
      <el-form
        ref="deliverFormRef"
        :model="deliverForm"
        :rules="deliverRules"
        label-width="100px"
      >
        <el-form-item label="物流公司" prop="company">
          <el-select v-model="deliverForm.company">
            <el-option label="顺丰快递" value="SF" />
            <el-option label="圆通快递" value="YTO" />
            <el-option label="中通快递" value="ZTO" />
            <el-option label="韵达快递" value="YD" />
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="trackingNo">
          <el-input v-model="deliverForm.trackingNo" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deliverVisible = false">取消</el-button>
          <el-button type="primary" @click="onDeliverSubmit(deliverFormRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="订单详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">
          {{ currentOrder?.orderNo }}
        </el-descriptions-item>
        <el-descriptions-item label="下单时间">
          {{ formatDate(currentOrder?.createdAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getOrderStatusType(currentOrder?.status)">
            {{ getOrderStatusText(currentOrder?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">
          {{ currentOrder?.paymentMethod }}
        </el-descriptions-item>
        <el-descriptions-item label="收货人" :span="2">
          {{ currentOrder?.address.name }} {{ currentOrder?.address.tel }}
          <br>
          {{ formatAddress(currentOrder?.address) }}
        </el-descriptions-item>
        <el-descriptions-item label="商品信息" :span="2">
          <div
            v-for="item in currentOrder?.goods"
            :key="item.id"
            class="goods-item"
          >
            <el-image
              :src="item.thumb"
              :preview-src-list="[item.thumb]"
              fit="cover"
              class="goods-image"
            />
            <div class="goods-info">
              <div class="goods-title">{{ item.title }}</div>
              <div class="goods-spec">
                规格：{{ formatSpecs(item.specs) }}
              </div>
              <div class="goods-price">
                ¥{{ item.price }} x {{ item.quantity }}
              </div>
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="订单金额" :span="2">
          <div>商品总额：¥{{ currentOrder?.totalPrice }}</div>
          <div>运费：¥{{ currentOrder?.deliveryFee }}</div>
          <div>优惠：-¥{{ currentOrder?.discountAmount }}</div>
          <div class="final-price">实付：¥{{ currentOrder?.finalPrice }}</div>
        </el-descriptions-item>
        <el-descriptions-item
          v-if="currentOrder?.status >= 2"
          label="支付信息"
          :span="2"
        >
          支付时间：{{ formatDate(currentOrder?.paymentTime) }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="currentOrder?.status >= 3"
          label="发货信息"
          :span="2"
        >
          发货时间：{{ formatDate(currentOrder?.deliveryTime) }}
          <br>
          物流公司：{{ getLogisticsCompany(currentOrder?.logistics?.company) }}
          <br>
          物流单号：{{ currentOrder?.logistics?.trackingNo }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="currentOrder?.status >= 4"
          label="收货信息"
          :span="2"
        >
          收货时间：{{ formatDate(currentOrder?.completedTime) }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="currentOrder?.remark"
          label="订单备注"
          :span="2"
        >
          {{ currentOrder?.remark }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

// 订单状态
const orderStatus = [
  { value: 1, label: '待付款' },
  { value: 2, label: '待发货' },
  { value: 3, label: '待收货' },
  { value: 4, label: '待评价' },
  { value: 5, label: '已完成' },
  { value: 6, label: '已取消' }
]

// 搜索表单
const searchForm = ref({
  orderNo: '',
  status: '',
  dateRange: []
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 发货对话框
const deliverVisible = ref(false)
const deliverFormRef = ref()
const deliverForm = ref({
  company: '',
  trackingNo: ''
})
const deliverRules = {
  company: [
    { required: true, message: '请选择物流公司', trigger: 'change' }
  ],
  trackingNo: [
    { required: true, message: '请输入物流单号', trigger: 'blur' }
  ]
}

// 详情对话框
const detailVisible = ref(false)
const currentOrder = ref(null)

// 初始化数据
onMounted(() => {
  loadData()
})

// 加载表格数据
const loadData = async () => {
  loading.value = true
  try {
    // TODO: 调用获取订单列表接口
    tableData.value = []
    total.value = 0
  } catch (error) {
    console.error('加载订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const onSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置
const onReset = () => {
  searchForm.value = {
    orderNo: '',
    status: '',
    dateRange: []
  }
  onSearch()
}

// 导出订单
const onExport = () => {
  // TODO: 调用导出订单接口
  ElMessage.success('导出成功')
}

// 查看详情
const onDetail = (row) => {
  currentOrder.value = row
  detailVisible.value = true
}

// 发货
const onDeliver = (row) => {
  deliverForm.value = {
    company: '',
    trackingNo: ''
  }
  currentOrder.value = row
  deliverVisible.value = true
}

// 提交发货
const onDeliverSubmit = async (formEl) => {
  if (!formEl) return
  
  try {
    await formEl.validate()
    // TODO: 调用��单发货接口
    ElMessage.success('发货成功')
    deliverVisible.value = false
    loadData()
  } catch (error) {
    console.error('表单校验失败:', error)
  }
}

// 分页相关方法
const onSizeChange = () => {
  currentPage.value = 1
  loadData()
}

const onCurrentChange = () => {
  loadData()
}

// 工具方法
const formatDate = (date) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'
}

const formatAddress = (address) => {
  if (!address) return '-'
  return `${address.province}${address.city}${address.county}${address.addressDetail}`
}

const formatSpecs = (specs) => {
  if (!specs) return '-'
  return Object.entries(specs)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')
}

const getOrderStatusType = (status) => {
  switch (status) {
    case 1: return 'warning'
    case 2: return ''
    case 3: return 'info'
    case 4: return 'success'
    case 5: return 'success'
    case 6: return 'danger'
    default: return ''
  }
}

const getOrderStatusText = (status) => {
  const item = orderStatus.find(item => item.value === status)
  return item ? item.label : '-'
}

const getLogisticsCompany = (code) => {
  const companies = {
    SF: '顺丰快递',
    YTO: '圆通快递',
    ZTO: '中通快递',
    YD: '韵达快递'
  }
  return companies[code] || code
}
</script>

<style scoped lang="scss">
.order {
  .search-card {
    margin-bottom: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .goods-item {
    display: flex;
    align-items: flex-start;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
    
    .goods-image {
      width: 60px;
      height: 60px;
      margin-right: 10px;
    }
    
    .goods-info {
      flex: 1;
      
      .goods-title {
        font-size: 14px;
        margin-bottom: 5px;
      }
      
      .goods-spec {
        font-size: 12px;
        color: #999;
        margin-bottom: 5px;
      }
      
      .goods-price {
        font-size: 12px;
        color: #666;
      }
    }
  }
  
  .final-price {
    color: #f56c6c;
    font-weight: bold;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 