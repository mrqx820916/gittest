<template>
  <div class="order-pay">
    <van-nav-bar
      title="订单支付"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 支付金额 -->
    <div class="pay-amount">
      <div class="label">支付金额</div>
      <div class="amount">¥{{ order.finalPrice }}</div>
    </div>
    
    <!-- 支付方式 -->
    <van-cell-group inset class="payment-methods">
      <van-cell title="支付方式" />
      <van-radio-group v-model="paymentMethod">
        <van-cell
          v-for="item in paymentMethods"
          :key="item.value"
          :title="item.label"
          clickable
          @click="paymentMethod = item.value"
        >
          <template #icon>
            <van-icon :name="item.icon" :color="item.color" size="20" />
          </template>
          <template #right-icon>
            <van-radio :name="item.value" />
          </template>
        </van-cell>
      </van-radio-group>
    </van-cell-group>
    
    <!-- 订单信息 -->
    <van-cell-group inset class="order-info">
      <van-cell title="订单编号" :value="order.orderNo" />
      <van-cell title="下单时间" :value="formatDate(order.createdAt)" />
      <van-cell title="商品金额" :value="`¥${order.totalPrice}`" />
      <van-cell title="运费" :value="`¥${order.deliveryFee}`" />
      <van-cell title="优惠金额" :value="`-¥${order.discountAmount}`" v-if="order.discountAmount" />
    </van-cell-group>
    
    <!-- 支付按钮 -->
    <div class="submit-bar">
      <van-button 
        type="danger" 
        block 
        :loading="paying"
        :disabled="!paymentMethod"
        @click="onSubmit"
      >
        立即支付
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getOrderDetail } from '@/api/order'
import { wechatPay, alipay } from '@/utils/payment'
import { formatDate } from '@/utils'

const route = useRoute()
const router = useRouter()

// 订单数据
const order = ref({})
const paying = ref(false)
const paymentMethod = ref('')

// 支付方式列表
const paymentMethods = [
  {
    label: '微信支付',
    value: 'wechat',
    icon: 'wechat',
    color: '#07c160'
  },
  {
    label: '支付宝',
    value: 'alipay',
    icon: 'alipay',
    color: '#1677ff'
  }
]

// 获取订单详情
const loadOrderDetail = async () => {
  try {
    const res = await getOrderDetail(route.params.id)
    order.value = res
  } catch (error) {
    showToast('获取订单详情失败')
    router.back()
  }
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 提交支付
const onSubmit = async () => {
  if (paying.value) return
  paying.value = true
  
  try {
    let result
    if (paymentMethod.value === 'wechat') {
      result = await wechatPay({
        orderId: order.value.id,
        amount: order.value.finalPrice
      })
    } else {
      result = await alipay({
        orderId: order.value.id,
        amount: order.value.finalPrice
      })
    }
    
    if (result.success) {
      showToast('支付成功')
      router.replace('/order/list?type=2')
    } else {
      showToast('支付失败')
    }
  } catch (error) {
    showToast('支付失败')
  } finally {
    paying.value = false
  }
}

// 初始化数据
onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped lang="scss">
.order-pay {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
  
  .pay-amount {
    background: $primary-color;
    color: #fff;
    padding: 30px 20px;
    text-align: center;
    
    .label {
      font-size: 14px;
      margin-bottom: 10px;
    }
    
    .amount {
      font-size: 32px;
      font-weight: bold;
    }
  }
  
  .payment-methods {
    margin-top: 12px;
    
    :deep(.van-cell__title) {
      display: flex;
      align-items: center;
      
      .van-icon {
        margin-right: 8px;
      }
    }
  }
  
  .order-info {
    margin-top: 12px;
  }
  
  .submit-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 16px;
    background: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }
}
</style> 