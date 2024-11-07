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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/store'

const router = useRouter()
const cartStore = useCartStore()
const showAddress = ref(false)
const selectedAddressId = ref('')
const deliveryType = ref('express')
const remark = ref('')

// 模拟数据
const addressList = ref([
  {
    id: '1',
    name: '张三',
    tel: '13000000000',
    address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
    isDefault: true
  }
])

const orderGoods = ref([
  {
    id: 1,
    title: '新鲜水果',
    price: 49.99,
    quantity: 2,
    thumb: 'https://img.yzcdn.cn/vant/apple-1.jpg',
    specs: { '规格': '大份', '套餐': '标准' }
  }
])

const selectedAddress = computed(() => {
  return addressList.value.find(item => item.id === selectedAddressId.value)
})

// 计算金额
const totalPrice = computed(() => {
  return orderGoods.value.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
})

const deliveryFee = computed(() => {
  return deliveryType.value === 'express' ? 8 : 0
})

const discountAmount = computed(() => {
  return selectedCoupon.value ? selectedCoupon.value.amount : 0
})

const finalPrice = computed(() => {
  return totalPrice.value + deliveryFee.value - discountAmount.value
})

// 优惠券相关
const selectedCoupon = ref(null)
const availableCoupons = ref([
  { id: 1, amount: 5, condition: 50 },
  { id: 2, amount: 10, condition: 100 }
])

// 方法
const onClickLeft = () => {
  router.back()
}

const formatAddress = (address) => {
  return `${address.address}`
}

const formatSpecs = (specs) => {
  return Object.entries(specs)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')
}

const showAddressList = () => {
  showAddress.value = true
}

const showCouponList = () => {
  // TODO: 显示优惠券列表
}

const onAddAddress = () => {
  router.push('/address/edit')
}

const onEditAddress = () => {
  router.push('/address/edit')
}

const onSelectAddress = (address) => {
  selectedAddressId.value = address.id
  showAddress.value = false
}

const onSubmit = async () => {
  if (!selectedAddress.value) {
    showToast('请选择收货地址')
    return
  }
  
  try {
    // TODO: 调用创建订单接口
    showToast('订单提交成功')
    router.replace('/order/list')
  } catch (error) {
    showToast('订单提交失败')
  }
}
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
      color: #ee0a24;
    }
  }
  
  :deep(.van-submit-bar) {
    bottom: 50px;
  }
}
</style> 