<template>
  <div class="order-list">
    <van-nav-bar
      title="我的订单"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <van-tabs v-model:active="active" sticky>
      <van-tab title="全部">
        <order-list-content :type="0" />
      </van-tab>
      <van-tab title="待付款">
        <order-list-content :type="1" />
      </van-tab>
      <van-tab title="待发货">
        <order-list-content :type="2" />
      </van-tab>
      <van-tab title="待收货">
        <order-list-content :type="3" />
      </van-tab>
      <van-tab title="待评价">
        <order-list-content :type="4" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import OrderListContent from './components/OrderListContent.vue'

const router = useRouter()
const route = useRoute()
const active = ref(Number(route.query.type) || 0)

const onClickLeft = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.order-list {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
}
</style> 