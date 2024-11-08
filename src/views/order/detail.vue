<template>
  <div class="order-detail">
    <van-nav-bar
      title="订单详情"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 订单状态 -->
    <div class="status-card">
      <div class="status-text">{{ getStatusText(order.status) }}</div>
      <div class="status-desc">{{ getStatusDesc(order.status) }}</div>
    </div>
    
    <!-- 收货地址 -->
    <van-cell-group class="address-card" inset>
      <van-cell>
        <template #title>
          <div class="address-info">
            <div class="name-tel">
              <span>{{ order.address?.name }}</span>
              <span>{{ order.address?.tel }}</span>
            </div>
            <div class="address-detail">
              {{ formatAddress(order.address) }}
            </div>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 商品信息 -->
    <van-cell-group class="goods-card" inset>
      <van-card
        v-for="item in order.goods"
        :key="item.id"
        :num="item.quantity"
        :price="item.price"
        :title="item.title"
        :thumb="item.thumb"
      >
        <template #tags>
          <van-tag plain type="danger" v-if="item.specs">
            {{ formatSpecs(item.specs) }}
          </van-tag>
        </template>
      </van-card>
    </van-cell-group>
    
    <!-- 订单信息 -->
    <van-cell-group class="order-info" inset>
      <van-cell title="订单编号" :value="order.orderNo" />
      <van-cell title="下单时间" :value="formatDate(order.createdAt)" />
      <van-cell title="支付方式" :value="getPaymentMethod(order.paymentMethod)" v-if="order.paymentMethod" />
      <van-cell title="支付时间" :value="formatDate(order.paymentTime)" v-if="order.paymentTime" />
      <van-cell title="发货时间" :value="formatDate(order.deliveryTime)" v-if="order.deliveryTime" />
      <van-cell title="完成时间" :value="formatDate(order.completedTime)" v-if="order.completedTime" />
      <van-cell v-if="order.remark" title="备注" :value="order.remark" />
    </van-cell-group>
    
    <!-- 订单金额 -->
    <van-cell-group class="price-card" inset>
      <van-cell title="商品总额">
        <template #right-icon>
          <span class="price">¥{{ order.totalPrice }}</span>
        </template>
      </van-cell>
      <van-cell title="运费">
        <template #right-icon>
          <span class="price">¥{{ order.deliveryFee }}</span>
        </template>
      </van-cell>
      <van-cell title="优惠金额" v-if="order.discountAmount">
        <template #right-icon>
          <span class="price red">-¥{{ order.discountAmount }}</span>
        </template>
      </van-cell>
      <van-cell title="实付金额" size="large">
        <template #right-icon>
          <span class="price large">¥{{ order.finalPrice }}</span>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 底部按钮 -->
    <div class="bottom-buttons">
      <template v-if="order.status === 1">
        <van-button plain type="default" size="small" @click="onCancel">取消订单</van-button>
        <van-button type="danger" size="small" @click="onPay">立即支付</van-button>
      </template>
      <template v-if="order.status === 3">
        <van-button type="danger" size="small" @click="onConfirm">确认收货</van-button>
      </template>
      <template v-if="order.status === 4">
        <van-button type="danger" size="small" @click="onComment">评价订单</van-button>
      </template>
      <van-button v-if="[2,3,4,5].includes(order.status)" plain type="primary" size="small" @click="onViewLogistics">
        查看物流
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { getOrderDetail, cancelOrder, confirmOrder } from '@/api/order'
import { formatDate, formatAddress, formatSpecs } from '@/utils'

const route = useRoute()
const router = useRouter()
const order = ref({})

// 获取订单详情
const loadOrderDetail = async () => {
  try {
    const res = await getOrderDetail(route.params.id)
    order.value = res
  } catch (error) {
    showToast('获取订单详情失败')
  }
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

// 获取状态描述
const getStatusDesc = (status) => {
  const descMap = {
    1: '请尽快完成支付',
    2: '商家正在处理订单',
    3: '商品正在配送中',
    4: '期待您的评价',
    5: '订单已完成',
    6: '订单已取消'
  }
  return descMap[status] || ''
}

// 获取支付方式
const getPaymentMethod = (method) => {
  const methodMap = {
    wechat: '微信支付',
    alipay: '支付宝'
  }
  return methodMap[method] || method
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 取消订单
const onCancel = async () => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要取消此订单吗？',
      showCancelButton: true
    })
    
    await cancelOrder(order.value.id)
    showToast('取消成功')
    loadOrderDetail()
  } catch {
    // 取消操作
  }
}

// 支付订单
const onPay = () => {
  router.push(`/order/pay/${order.value.id}`)
}

// 确认收货
const onConfirm = async () => {
  try {
    await showDialog({
      title: '提示',
      message: '确认已收到商品？',
      showCancelButton: true
    })
    
    await confirmOrder(order.value.id)
    showToast('确认收货成功')
    loadOrderDetail()
  } catch {
    // 取消操作
  }
}

// 评价订单
const onComment = () => {
  router.push(`/order/comment/${order.value.id}`)
}

// 查看物流
const onViewLogistics = () => {
  router.push(`/order/logistics/${order.value.id}`)
}

onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped lang="scss">
.order-detail {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
  
  .status-card {
    background: $primary-color;
    color: #fff;
    padding: 20px;
    
    .status-text {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .status-desc {
      font-size: 14px;
      opacity: 0.8;
    }
  }
  
  .address-card,
  .goods-card,
  .order-info,
  .price-card {
    margin-top: 12px;
  }
  
  .address-info {
    .name-tel {
      margin-bottom: 5px;
      
      span {
        margin-right: 10px;
      }
    }
    
    .address-detail {
      color: #666;
      font-size: 14px;
    }
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
  
  .bottom-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 10px;
    background: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }
}
</style> 