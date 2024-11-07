<template>
  <div class="order-list-content">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group
          v-for="order in orderList"
          :key="order.id"
          inset
          class="order-item"
        >
          <van-cell :title="order.shopName" :value="getStatusText(order.status)" />
          <van-card
            v-for="goods in order.goods"
            :key="goods.id"
            :num="goods.quantity"
            :price="goods.price"
            :title="goods.title"
            :thumb="goods.thumb"
          />
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
                <van-button
                  size="small"
                  v-if="order.status === 1"
                  type="danger"
                  @click="onPay(order)"
                >
                  付款
                </van-button>
                <van-button
                  size="small"
                  v-if="order.status === 3"
                  type="primary"
                  @click="onConfirm(order)"
                >
                  确认收货
                </van-button>
                <van-button
                  size="small"
                  plain
                  type="primary"
                  @click="onViewDetail(order)"
                >
                  查看详情
                </van-button>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getOrderList } from '@/api/order'

const props = defineProps({
  type: {
    type: Number,
    default: 0
  }
})

const router = useRouter()
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const orderList = ref([])
const pageNum = ref(1)
const pageSize = 10

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
    console.error('加载订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

const onLoad = () => {
  loadOrders()
}

const onRefresh = () => {
  finished.value = false
  pageNum.value = 1
  loadOrders()
}

// 获取状态文本
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

// 支付订单
const onPay = (order) => {
  router.push(`/order/pay/${order.id}`)
}

// 确认收货
const onConfirm = async (order) => {
  try {
    // TODO: 调用确认收货接口
    showToast('确认收货成功')
    loadOrders()
  } catch (error) {
    console.error('确认收货失败:', error)
  }
}

// 查看订单详情
const onViewDetail = (order) => {
  router.push(`/order/detail/${order.id}`)
}
</script>

<style scoped lang="scss">
.order-list-content {
  .order-item {
    margin: 12px;
    
    .total-price {
      font-size: 14px;
      
      .price {
        color: #ee0a24;
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