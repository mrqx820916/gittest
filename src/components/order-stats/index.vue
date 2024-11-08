<template>
  <div class="order-stats">
    <van-grid :border="false" :column-num="5">
      <van-grid-item
        v-for="(item, index) in orderStats"
        :key="index"
        :icon="item.icon"
        :text="item.text"
        :badge="counts[item.key] || ''"
        :to="item.path"
      >
        <template #icon>
          <van-icon :name="item.icon" :color="item.color" size="24" />
        </template>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  counts: {
    type: Object,
    default: () => ({})
  }
})

// 订单统计配置
const orderStats = [
  {
    icon: 'pending-payment',
    color: '#ee0a24',
    text: '待付款',
    key: 'unpaid',
    path: '/order/list?type=1'
  },
  {
    icon: 'tosend',
    color: '#ff976a',
    text: '待发货',
    key: 'unshipped',
    path: '/order/list?type=2'
  },
  {
    icon: 'logistics',
    color: '#07c160',
    text: '待收货',
    key: 'unreceived',
    path: '/order/list?type=3'
  },
  {
    icon: 'comment-o',
    color: '#1989fa',
    text: '待评价',
    key: 'uncommented',
    path: '/order/list?type=4'
  },
  {
    icon: 'after-sale',
    color: '#7232dd',
    text: '退款/售后',
    key: 'refunding',
    path: '/order/refund'
  }
]

// 计算是否有未完成订单
const hasUnfinishedOrder = computed(() => {
  return Object.values(props.counts).some(count => count > 0)
})
</script>

<style scoped lang="scss">
.order-stats {
  background: #fff;
  
  :deep(.van-grid-item__content) {
    padding: 16px 8px;
  }
  
  :deep(.van-grid-item__icon) {
    font-size: 24px;
  }
  
  :deep(.van-grid-item__text) {
    color: #333;
    font-size: 12px;
    margin-top: 8px;
  }
  
  :deep(.van-badge) {
    transform: translate(50%, -50%);
  }
}
</style> 