<template>
  <div class="order-stats">
    <van-grid :border="false" :column-num="4">
      <van-grid-item
        v-for="(item, index) in orderTypes"
        :key="index"
        :icon="item.icon"
        :text="item.text"
        :badge="counts[item.type] || ''"
        :to="item.path"
      />
    </van-grid>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getOrderCounts } from '@/api/order'

const props = defineProps({
  showBadge: {
    type: Boolean,
    default: true
  }
})

// 订单类型
const orderTypes = [
  { icon: 'pending-payment', text: '待付款', type: 1, path: '/order/list?type=1' },
  { icon: 'logistics', text: '待发货', type: 2, path: '/order/list?type=2' },
  { icon: 'send-gift', text: '待收货', type: 3, path: '/order/list?type=3' },
  { icon: 'comment', text: '待评价', type: 4, path: '/order/list?type=4' }
]

// 订单数量统计
const counts = ref({})

// 加载订单统计
const loadCounts = async () => {
  try {
    const res = await getOrderCounts()
    counts.value = res
  } catch (error) {
    console.error('获取���单统计失败:', error)
  }
}

onMounted(() => {
  if (props.showBadge) {
    loadCounts()
  }
})
</script>

<style scoped lang="scss">
.order-stats {
  background: #fff;
}
</style> 