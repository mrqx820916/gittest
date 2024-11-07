<template>
  <div class="user">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <template v-if="userStore.isLogin">
        <van-row class="user-info">
          <van-col span="8">
            <van-image
              round
              width="4rem"
              height="4rem"
              :src="userStore.userInfo?.avatar"
              error-icon="contact"
            />
          </van-col>
          <van-col span="16" class="info-content">
            <div class="username">{{ userStore.userInfo?.nickname }}</div>
            <div class="user-id">ID: {{ userStore.userInfo?.id }}</div>
          </div>
        </van-row>
      </template>
      <template v-else>
        <van-row class="user-info">
          <van-col span="24">
            <van-button 
              type="primary" 
              size="small" 
              round 
              @click="goToLogin"
            >
              去登录
            </van-button>
          </van-col>
        </van-row>
      </template>
    </div>

    <!-- 我的订单 -->
    <van-cell-group class="order-card" inset>
      <van-cell title="我的订单" value="全部订单" is-link to="/order/list" />
      <van-grid :border="false" :column-num="4">
        <van-grid-item
          v-for="(item, index) in orderTypes"
          :key="index"
          :icon="item.icon"
          :text="item.text"
          :badge="orderCounts[item.type] || ''"
          :to="item.path"
        />
      </van-grid>
    </van-cell-group>

    <!-- 我的资产 -->
    <van-cell-group class="assets-card" inset>
      <van-grid :border="false" :column-num="4">
        <van-grid-item
          icon="balance-o"
          text="余额"
          :value="userInfo.balance || '0.00'"
        />
        <van-grid-item
          icon="coupon-o"
          text="优惠券"
          :value="userInfo.couponCount || '0'"
          to="/coupon"
        />
        <van-grid-item
          icon="point-gift-o"
          text="积分"
          :value="userInfo.points || '0'"
        />
        <van-grid-item
          icon="star-o"
          text="收藏"
          :value="userInfo.collectCount || '0'"
          to="/collect"
        />
      </van-grid>
    </van-cell-group>

    <!-- 功能列表 -->
    <van-cell-group class="function-list" inset>
      <van-cell title="收货地址" is-link to="/address" />
      <van-cell title="我的收藏" is-link to="/collect" />
      <van-cell title="优惠券" is-link to="/coupon" />
      <van-cell title="客服中心" is-link to="/service" />
      <van-cell title="设置" is-link to="/settings" />
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { getOrderCounts } from '@/api/order'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = ref({
  balance: '0.00',
  couponCount: 0,
  points: 0,
  collectCount: 0
})

// 订单类型
const orderTypes = [
  { icon: 'pending-payment', text: '待付款', type: 1, path: '/order/list?type=1' },
  { icon: 'logistics', text: '待发货', type: 2, path: '/order/list?type=2' },
  { icon: 'send-gift', text: '待收货', type: 3, path: '/order/list?type=3' },
  { icon: 'comment', text: '待评价', type: 4, path: '/order/list?type=4' }
]

// 订单数量统计
const orderCounts = ref({})

// 加载订单统计
const loadOrderCounts = async () => {
  try {
    const res = await getOrderCounts()
    orderCounts.value = res
  } catch (error) {
    console.error('获取订单统计失败:', error)
  }
}

// 加载用户信息
const loadUserInfo = async () => {
  if (!userStore.isLogin) return
  
  try {
    const res = await userStore.getUserInfo()
    userInfo.value = res
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 去登录
const goToLogin = () => {
  router.push('/login')
}

// 初始化数据
onMounted(() => {
  if (userStore.isLogin) {
    loadUserInfo()
    loadOrderCounts()
  }
})
</script>

<style scoped lang="scss">
.user {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;

  .user-card {
    background: linear-gradient(to right, #ff6034, #ee0a24);
    padding: 20px;
    color: #fff;

    .user-info {
      display: flex;
      align-items: center;

      .info-content {
        padding-left: 15px;

        .username {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .user-id {
          font-size: 12px;
          opacity: 0.8;
        }
      }
    }
  }

  .order-card,
  .assets-card {
    margin-top: 12px;
  }

  .function-list {
    margin-top: 12px;
  }
}
</style> 