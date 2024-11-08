<template>
  <div class="coupon">
    <van-nav-bar
      title="优惠券"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <van-tabs v-model:active="active">
      <van-tab title="可使用">
        <van-coupon-list
          :coupons="availableCoupons"
          :chosen-coupon="chosenCoupon"
          @change="onChange"
        />
      </van-tab>
      <van-tab title="已使用">
        <van-coupon-list
          :coupons="usedCoupons"
          :chosen-coupon="-1"
          disabled
        />
      </van-tab>
      <van-tab title="已过期">
        <van-coupon-list
          :coupons="expiredCoupons"
          :chosen-coupon="-1"
          disabled
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getMyCoupons } from '@/api/coupon'

const router = useRouter()
const active = ref(0)
const chosenCoupon = ref(-1)

const availableCoupons = ref([])
const usedCoupons = ref([])
const expiredCoupons = ref([])

const onClickLeft = () => {
  router.back()
}

const onChange = (index) => {
  chosenCoupon.value = index
  router.back()
}

const loadCoupons = async () => {
  try {
    const res = await getMyCoupons()
    availableCoupons.value = res.available
    usedCoupons.value = res.used
    expiredCoupons.value = res.expired
  } catch (error) {
    showToast('加载优惠券失败')
  }
}

onMounted(() => {
  loadCoupons()
})
</script>

<style scoped lang="scss">
.coupon {
  min-height: 100vh;
  background: #f5f5f5;
}
</style> 