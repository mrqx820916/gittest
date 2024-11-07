<template>
  <div class="user">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="手机号">
          <el-input
            v-model="searchForm.phone"
            placeholder="请输入手机号"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 用户列表 -->
    <el-card>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              {{ row.nickname?.charAt(0) }}
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column label="收货地址">
          <template #default="{ row }">
            <el-popover
              v-if="row.addresses?.length"
              placement="top"
              trigger="hover"
              :width="300"
            >
              <template #reference>
                <el-tag>{{ row.addresses.length }}个地址</el-tag>
              </template>
              <div
                v-for="address in row.addresses"
                :key="address.id"
                class="address-item"
              >
                <div>{{ address.name }} {{ address.tel }}</div>
                <div>{{ formatAddress(address) }}</div>
              </div>
            </el-popover>
            <span v-else>暂无地址</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="onViewOrders(row)"
            >
              查看订单
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
    
    <!-- 订单对话框 -->
    <el-dialog
      v-model="orderVisible"
      title="用户订单"
      width="1000px"
    >
      <el-table
        :data="orderList"
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
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="orderCurrentPage"
          v-model:page-size="orderPageSize"
          :total="orderTotal"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onOrderSizeChange"
          @current-change="onOrderCurrentChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

// 搜索表单
const searchForm = ref({
  phone: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 订单数据
const orderVisible = ref(false)
const orderList = ref([])
const orderCurrentPage = ref(1)
const orderPageSize = ref(10)
const orderTotal = ref(0)
const currentUser = ref(null)

// 订单状态
const orderStatus = [
  { value: 1, label: '待付款' },
  { value: 2, label: '待发货' },
  { value: 3, label: '待收货' },
  { value: 4, label: '待评价' },
  { value: 5, label: '已完成' },
  { value: 6, label: '已取消' }
]

// 加载用户列表
const loadData = async () => {
  loading.value = true
  try {
    // TODO: 调用获取用户列表接口
    tableData.value = []
    total.value = 0
  } catch (error) {
    console.error('加载用户列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载用户订单
const loadOrders = async () => {
  try {
    // TODO: 调用获取用户订单列表接口
    orderList.value = []
    orderTotal.value = 0
  } catch (error) {
    console.error('加载用户订单失败:', error)
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
    phone: ''
  }
  onSearch()
}

// 查看订单
const onViewOrders = (row) => {
  currentUser.value = row
  orderCurrentPage.value = 1
  orderVisible.value = true
  loadOrders()
}

// 分页相关方法
const onSizeChange = () => {
  currentPage.value = 1
  loadData()
}

const onCurrentChange = () => {
  loadData()
}

const onOrderSizeChange = () => {
  orderCurrentPage.value = 1
  loadOrders()
}

const onOrderCurrentChange = () => {
  loadOrders()
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
</script>

<style scoped lang="scss">
.user {
  .search-card {
    margin-bottom: 20px;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .address-item {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
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
}
</style> 