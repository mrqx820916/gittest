<template>
  <div class="user">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <template v-if="isLogin">
        <van-row class="user-info">
          <van-col span="8">
            <van-image
              round
              width="4rem"
              height="4rem"
              :src="userInfo.avatar"
              error-icon="contact"
            />
          </van-col>
          <van-col span="16" class="info-content">
            <div class="username">{{ userInfo.nickname }}</div>
            <div class="user-id">ID: {{ userInfo.id }}</div>
          </van-col>
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
          :to="item.path"
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(false)
const userInfo = ref({
  id: '10001',
  nickname: '测试用户',
  avatar: ''
})

// 订单类型
const orderTypes = [
  { icon: 'pending-payment', text: '待付款', path: '/order/list?type=1' },
  { icon: 'logistics', text: '待发货', path: '/order/list?type=2' },
  { icon: 'send-gift', text: '待收货', path: '/order/list?type=3' },
  { icon: 'comment', text: '待评价', path: '/order/list?type=4' }
]

// 去登录
const goToLogin = () => {
  router.push('/login')
}
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

  .order-card {
    margin-top: 12px;
  }

  .function-list {
    margin-top: 12px;
  }
}
</style> 