<template>
  <div class="order-list-content">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="order-item" v-for="order in orderList" :key="order.id">
          <van-cell-group inset>
            <van-cell>
              <template #title>
                <span class="order-no">订单号：{{ order.orderNo }}</span>
              </template>
              <template #value>
                <span :class="['order-status', `status-${order.status}`]">
                  {{ getStatusText(order.status) }}
                </span>
              </template>
            </van-cell>
            
            <van-card
              v-for="goods in order.goods"
              :key="goods.id"
              :num="goods.quantity"
              :price="goods.price"
              :title="goods.title"
              :thumb="goods.thumb"
              @click="onGoodsClick(goods)"
            >
              <template #tags>
                <van-tag plain type="danger" v-if="goods.specs">
                  {{ formatSpecs(goods.specs) }}
                </van-tag>
              </template>
            </van-card>
            
            <van-cell>
              <template #title>
                <span class="total-price">
                  共{{ order.totalQuantity }}件商品 合计：
                  <span class="price">¥{{ order.totalPrice }}</span>
                </span>
              </template>
            </van-cell>
            
            <van-cell>
              <template #default>
                <div class="order-actions">
                  <template v-if="order.status === 1">
                    <van-button 
                      size="small" 
                      type="default"
                      @click="cancelOrder(order)"
                    >
                      取消订单
                    </van-button>
                    <van-button 
                      size="small" 
                      type="danger"
                      @click="payOrder(order)"
                    >
                      立即付款
                    </van-button>
                  </template>
                  
                  <template v-if="order.status === 3">
                    <van-button 
                      size="small" 
                      type="danger"
                      @click="confirmOrder(order)"
                    >
                      确认收货
                    </van-button>
                  </template>
                  
                  <template v-if="order.status === 4">
                    <van-button 
                      size="small" 
                      type="danger"
                      @click="commentOrder(order)"
                    >
                      评价订单
                    </van-button>
                  </template>
                  
                  <van-button 
                    size="small" 
                    plain
                    type="primary"
                    @click="viewOrder(order)"
                  >
                    查看详情
                  </van-button>
                </div>
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { getOrderList, cancelOrder, confirmOrder } from '@/api/order'
import { formatSpecs } from '@/utils'

const props = defineProps({
  type: {
    type: Number,
    default: 0
  }
})

const router = useRouter()

// 订单列表数据
const orderList = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)
const pageSize = 10

// 获取订单状态文本
const getStatusText = (status) => {
  const statusMap = {
    1: '待付款',
    2: '待发货',
    3: '待收货',
    4: '待评价',
    5: '已完成',
    6: '已取消'
  }
  return statusMap[status] || ''
}

// 加载订单列表
const loadOrders = async () => {
  try {
    const res = await getOrderList({
      type: props.type,
      pageNum: pageNum.value,
      pageSize
    })
    
    if (refreshing.value) {
      orderList.value = []
      refreshing.value = false
    }
    
    orderList.value.push(...res.list)
    pageNum.value++
    
    if (res.list.length < pageSize) {
      finished.value = true
    }
  } catch (error) {
    showToast('加载订单失败')
  } finally {
    loading.value = false
  }
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  pageNum.value = 1
  loadOrders()
}

// 加载更多
const onLoad = () => {
  loadOrders()
}

// 取消订单
const cancelOrder = async (order) => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要取消此订单吗？',
      showCancelButton: true
    })
    
    await cancelOrder(order.id)
    showToast('取消成功')
    onRefresh()
  } catch {
    // 取消操作
  }
}

// 支付订单
const payOrder = (order) => {
  router.push(`/order/pay/${order.id}`)
}

// 确认收货
const confirmOrder = async (order) => {
  try {
    await showDialog({
      title: '提示',
      message: '确认已收到商品？',
      showCancelButton: true
    })
    
    await confirmOrder(order.id)
    showToast('确认收货成功')
    onRefresh()
  } catch {
    // 取消操作
  }
}

// 评价订单
const commentOrder = (order) => {
  router.push(`/order/comment/${order.id}`)
}

// 查看订单详情
const viewOrder = (order) => {
  router.push(`/order/detail/${order.id}`)
}

// 查看商品详情
const onGoodsClick = (goods) => {
  router.push(`/goods/${goods.id}`)
}
</script>

<style scoped lang="scss">
.order-list-content {
  .order-item {
    margin: 12px;
    
    .order-no {
      font-size: 12px;
      color: #666;
    }
    
    .order-status {
      font-size: 12px;
      
      &.status-1 { color: $warning-color; }
      &.status-2 { color: $primary-color; }
      &.status-3 { color: $primary-color; }
      &.status-4 { color: $success-color; }
      &.status-5 { color: #999; }
      &.status-6 { color: #999; }
    }
    
    .total-price {
      font-size: 12px;
      color: #666;
      
      .price {
        color: $primary-color;
        font-weight: bold;
      }
    }
    
    .order-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }
}
</style> 
</style> 