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
              @click="showAvatarUpload = true"
            />
          </van-col>
          <van-col span="16" class="info-content">
            <div class="username">{{ userStore.userInfo?.nickname || '设置昵称' }}</div>
            <div class="user-id">ID: {{ userStore.userInfo?.id }}</div>
            <div class="phone">{{ formatPhone(userStore.userInfo?.phone) }}</div>
            <div class="level-info">
              <van-tag type="danger">{{ currentLevel.name }}</van-tag>
              <span class="points">积分: {{ userStore.userInfo?.points || 0 }}</span>
            </div>
          </van-col>
        </van-row>
      </template>
      <template v-else>
        <van-row class="user-info">
          <van-col span="24" class="login-btn">
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

    <!-- 订单统计 -->
    <van-cell-group inset class="order-card">
      <van-cell title="我的订单" value="全部订单" is-link to="/order/list" />
      <order-stats :counts="orderCounts" />
    </van-cell-group>

    <!-- 我的资产 -->
    <van-cell-group inset class="assets-card">
      <van-grid :border="false" :column-num="4">
        <van-grid-item
          icon="balance-o"
          text="余额"
          :value="formatPrice(userStore.userInfo?.balance || 0)"
          @click="showRecharge = true"
        />
        <van-grid-item
          icon="coupon-o"
          text="优惠券"
          :value="userInfo.couponCount || 0"
          to="/coupon"
        />
        <van-grid-item
          icon="point-gift-o"
          text="积分"
          :value="userStore.userInfo?.points || 0"
          to="/points"
        />
        <van-grid-item
          icon="star-o"
          text="收藏"
          :value="userInfo.collectCount || 0"
          to="/collect"
        />
      </van-grid>
    </van-cell-group>

    <!-- 功能列表 -->
    <van-cell-group inset class="function-list">
      <van-cell title="收货地址" icon="location-o" is-link to="/address" />
      <van-cell title="我的收藏" icon="star-o" is-link to="/collect" />
      <van-cell title="优惠券" icon="coupon-o" is-link to="/coupon" />
      <van-cell title="积分商城" icon="gift-o" is-link to="/points-mall" />
      <van-cell title="邀请分享" icon="share-o" is-link @click="showShare = true" />
      <van-cell title="帮助中心" icon="question-o" is-link to="/help" />
      <van-cell title="意见反馈" icon="comment-o" is-link to="/feedback" />
      <van-cell title="设置" icon="setting-o" is-link to="/settings" />
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'
import { formatPhone, formatPrice } from '@/utils'
import OrderStats from '@/components/order-stats/index.vue'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = ref({})
const orderCounts = ref({})

// 会员等级配置
const memberLevels = {
  diamond: {
    name: '钻石会员',
    discount: 0.8,
    color: '#ee0a24',
    icon: 'gem-o',
    points: 10000,
    benefits: ['正常商品8折', 'VIP专享价', '生日礼包']
  },
  gold: {
    name: '金牌会员',
    discount: 0.85,
    color: '#ff976a',
    icon: 'diamond-o',
    points: 5000,
    benefits: ['正常商品8.5折', '专属优惠券', '优先发货']
  },
  silver: {
    name: '银牌会员',
    discount: 0.9,
    color: '#969799',
    icon: 'medal-o',
    points: 1000,
    benefits: ['正常商品9折', '生日双倍积分', '免费退换货']
  },
  normal: {
    name: '普通会员',
    discount: 0.95,
    color: '#969799',
    icon: 'friends-o',
    points: 0,
    benefits: ['正常商品9.5折', '生日特权', '专属客服']
  }
}

// 获取当前用户等级
const getCurrentLevel = (points) => {
  if (points >= memberLevels.diamond.points) return memberLevels.diamond
  if (points >= memberLevels.gold.points) return memberLevels.gold
  if (points >= memberLevels.silver.points) return memberLevels.silver
  return memberLevels.normal
}

// 计算当前用户等级
const currentLevel = computed(() => {
  const points = userStore.userInfo?.points || 0
  return getCurrentLevel(points)
})

// 去登录
const goToLogin = () => {
  router.push('/login')
}

// 初始化
onMounted(() => {
  if (userStore.isLogin) {
    userStore.getUserInfo()
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
        margin-left: 15px;
        
        .username {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .user-id,
        .phone {
          font-size: 14px;
          margin-bottom: 5px;
          opacity: 0.8;
        }
        
        .level-info {
          display: flex;
          align-items: center;
          
          .points {
            margin-left: 10px;
            font-size: 12px;
          }
        }
      }
      
      .login-btn {
        text-align: center;
        padding: 20px 0;
      }
    }
  }
  
  .order-card,
  .assets-card,
  .function-list {
    margin-top: 12px;
  }
}
</style> 