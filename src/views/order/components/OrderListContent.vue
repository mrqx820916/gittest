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
          <van-cell :title="order.shopName" value="待付款" />
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

// 模拟订单数据
const mockOrders = [
  {
    id: 1,
    shopName: '水果店',
    status: 1,
    totalPrice: 99.99,
    totalQuantity: 2,
    goods: [
      {
        id: 1,
        title: '新鲜水果',
        price: 49.99,
        quantity: 2,
        thumb: 'https://img.yzcdn.cn/vant/apple-1.jpg'
      }
    ]
  }
]

const onLoad = () => {
  // 模拟加载数据
  setTimeout(() => {
    if (refreshing.value) {
      orderList.value = []
      refreshing.value = false
    }
    
    orderList.value.push(...mockOrders)
    loading.value = false
    finished.value = true
  }, 1000)
}

const onRefresh = () => {
  finished.value = false
  loading.value = true
  onLoad()
}

const onPay = (order) => {
  showToast('跳转支付')
}

const onConfirm = (order) => {
  showToast('确认收货')
}

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