<template>
  <div class="order-confirm">
    <van-nav-bar
      title="确认订单"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 收货地址 -->
    <div class="address-card">
      <van-contact-card
        v-if="selectedAddress"
        type="edit"
        :name="selectedAddress.name"
        :tel="selectedAddress.tel"
        :address="formatAddress(selectedAddress)"
        @click="showAddressList"
      />
      <van-contact-card
        v-else
        type="add"
        @click="showAddressList"
      />
    </div>
    
    <!-- 商品列表 -->
    <van-cell-group class="goods-list" inset>
      <van-card
        v-for="item in orderGoods"
        :key="item.id"
        :num="item.quantity"
        :price="item.price"
        :title="item.title"
        :thumb="item.thumb"
      >
        <template #tags>
          <van-tag v-if="item.specs" type="primary">
            {{ formatSpecs(item.specs) }}
          </van-tag>
        </template>
      </van-card>
    </van-cell-group>
    
    <!-- 优惠券 -->
    <van-cell-group inset>
      <van-cell title="优惠券" is-link @click="showCouponList">
        <template #value>
          <span v-if="selectedCoupon">
            -￥{{ selectedCoupon.amount }}
          </span>
          <span v-else class="text-gray">
            {{ availableCoupons.length }}张可用
          </span>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 配送方式 -->
    <van-cell-group inset>
      <van-cell title="配送方式">
        <template #value>
          <van-radio-group v-model="deliveryType" direction="horizontal">
            <van-radio name="express">快递配送</van-radio>
            <van-radio name="self">到店自提</van-radio>
          </van-radio-group>
        </template>
      </van-cell>
      <van-field
        v-if="deliveryType === 'express'"
        v-model="remark"
        label="备注"
        type="textarea"
        placeholder="请输入备注信息"
        rows="1"
        autosize
      />
    </van-cell-group>
    
    <!-- 订单金额 -->
    <van-cell-group inset>
      <van-cell title="商品总额">
        <template #value>
          <span class="price">￥{{ totalPrice }}</span>
        </template>
      </van-cell>
      <van-cell title="运费">
        <template #value>
          <span class="price">￥{{ deliveryFee }}</span>
        </template>
      </van-cell>
      <van-cell title="优惠金额" v-if="discountAmount > 0">
        <template #value>
          <span class="price red">-￥{{ discountAmount }}</span>
        </template>
      </van-cell>
      <van-cell title="实付金额" size="large">
        <template #value>
          <span class="price large">￥{{ finalPrice }}</span>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 提交订单栏 -->
    <van-submit-bar
      :price="finalPrice * 100"
      button-text="提交订单"
      @submit="onSubmit"
    />
    
    <!-- 地址列表弹窗 -->
    <van-popup
      v-model:show="showAddress"
      position="bottom"
      round
      safe-area-inset-bottom
    >
      <van-address-list
        v-model="selectedAddressId"
        :list="addressList"
        default-tag-text="默认"
        @add="onAddAddress"
        @edit="onEditAddress"
        @select="onSelectAddress"
      />
    </van-popup>
    
    <!-- 优惠券列表弹窗 -->
    <van-popup
      v-model:show="showCoupon"
      position="bottom"
      round
      safe-area-inset-bottom
    >
      <van-coupon-list
        :coupons="availableCoupons"
        :chosen-coupon="selectedCouponIndex"
        @change="onSelectCoupon"
        @exchange="onExchangeCoupon"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/store'
import { getAddressList } from '@/api/address'
import { getAvailableCoupons } from '@/api/coupon'
import { createOrder } from '@/api/order'
import { formatAddress, formatSpecs, formatPrice } from '@/utils'

const router = useRouter()
const cartStore = useCartStore()

// 地址相关
const showAddress = ref(false)
const selectedAddressId = ref('')
const addressList = ref([])
const selectedAddress = computed(() => {
  return addressList.value.find(item => item.id === selectedAddressId.value)
})

// 商品相关
const orderGoods = computed(() => cartStore.checkedItems)

// 优惠券相关
const showCoupon = ref(false)
const availableCoupons = ref([])
const selectedCouponIndex = ref(-1)
const selectedCoupon = computed(() => {
  return selectedCouponIndex.value > -1 ? availableCoupons.value[selectedCouponIndex.value] : null
})

// 配送相关
const deliveryType = ref('express')
const remark = ref('')

// 金额计算
const totalPrice = computed(() => cartStore.checkedPrice)
const deliveryFee = computed(() => deliveryType.value === 'express' ? 8 : 0)
const discountAmount = computed(() => selectedCoupon.value?.amount || 0)
const finalPrice = computed(() => {
  return totalPrice.value + deliveryFee.value - discountAmount.value
})

// 加载地址列表
const loadAddressList = async () => {
  try {
    const res = await getAddressList()
    addressList.value = res
    // 设置默认地址
    const defaultAddress = res.find(item => item.isDefault)
    if (defaultAddress) {
      selectedAddressId.value = defaultAddress.id
    }
  } catch (error) {
    showToast('获取地址列表失败')
  }
}

// 加载优惠券
const loadCoupons = async () => {
  try {
    const res = await getAvailableCoupons({ amount: totalPrice.value })
    availableCoupons.value = res
  } catch (error) {
    showToast('获取优惠券失败')
  }
}

// 地址相关方法
const onAddAddress = () => {
  router.push('/address/edit')
}

const onEditAddress = (item) => {
  router.push({
    path: '/address/edit',
    query: { id: item.id }
  })
}

const onSelectAddress = (item) => {
  selectedAddressId.value = item.id
  showAddress.value = false
}

// 优惠券相关方法
const onSelectCoupon = (index) => {
  selectedCouponIndex.value = index
  showCoupon.value = false
}

const onExchangeCoupon = (code) => {
  // TODO: 实现优惠券兑换
  showToast('优惠券兑换功能开发中')
}

// 提交订单
const onSubmit = async () => {
  if (!selectedAddress.value) {
    showToast('请选择收货地址')
    return
  }
  
  try {
    const order = await createOrder({
      address: selectedAddress.value,
      goods: orderGoods.value,
      deliveryType: deliveryType.value,
      couponId: selectedCoupon.value?.id,
      remark: remark.value,
      totalPrice: totalPrice.value,
      deliveryFee: deliveryFee.value,
      discountAmount: discountAmount.value,
      finalPrice: finalPrice.value
    })
    
    // 清空已选商品
    cartStore.clearChecked()
    
    // 跳转到支付页面
    router.replace(`/order/pay/${order.id}`)
  } catch (error) {
    showToast('创建订单失败')
  }
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 初始化数据
onMounted(() => {
  loadAddressList()
  loadCoupons()
})
</script>

<style scoped lang="scss">
.order-confirm {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
  
  .address-card {
    margin: 12px;
  }
  
  .goods-list {
    margin: 12px 0;
  }
  
  .price {
    color: #333;
    font-weight: bold;
    
    &.red {
      color: $primary-color;
    }
    
    &.large {
      font-size: 16px;
      color: $primary-color;
    }
  }
  
  :deep(.van-submit-bar) {
    bottom: 50px;
  }
}
</style>