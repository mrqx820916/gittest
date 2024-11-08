<template>
  <div class="security">
    <van-nav-bar
      title="账号安全"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 安全等级 -->
    <van-cell-group inset class="security-level">
      <van-cell title="安全等级">
        <template #value>
          <div class="level-box">
            <div class="level-text">{{ securityLevel.text }}</div>
            <div class="level-progress">
              <span 
                class="progress-bar" 
                :style="{ width: `${securityLevel.score}%` }"
                :class="securityLevel.class"
              ></span>
            </div>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 安全设置 -->
    <van-cell-group inset class="security-settings">
      <!-- 登录密码 -->
      <van-cell
        title="登录密码"
        :value="userInfo.hasPassword ? '已设置' : '未设置'"
        :is-link="true"
        @click="onSetPassword"
      >
        <template #right-icon>
          <van-tag 
            :type="userInfo.hasPassword ? 'success' : 'warning'"
            size="medium"
          >
            {{ userInfo.hasPassword ? '已设置' : '未设置' }}
          </van-tag>
        </template>
      </van-cell>
      
      <!-- 手机号 -->
      <van-cell
        title="手机号"
        :value="maskPhone(userInfo.phone)"
        is-link
        to="/profile/phone"
      >
        <template #right-icon>
          <van-tag type="success" size="medium">已绑定</van-tag>
        </template>
      </van-cell>
      
      <!-- 邮箱 -->
      <van-cell
        title="邮箱"
        :value="userInfo.email ? maskEmail(userInfo.email) : '未绑定'"
        :is-link="true"
        @click="onSetEmail"
      >
        <template #right-icon>
          <van-tag 
            :type="userInfo.email ? 'success' : 'warning'"
            size="medium"
          >
            {{ userInfo.email ? '已绑定' : '未绑定' }}
          </van-tag>
        </template>
      </van-cell>
      
      <!-- 实名认证 -->
      <van-cell
        title="实名认证"
        :value="userInfo.verified ? '已认证' : '未认证'"
        :is-link="true"
        @click="onVerify"
      >
        <template #right-icon>
          <van-tag 
            :type="userInfo.verified ? 'success' : 'warning'"
            size="medium"
          >
            {{ userInfo.verified ? '已认证' : '未认证' }}
          </van-tag>
        </template>
      </van-cell>
      
      <!-- 支付密码 -->
      <van-cell
        title="支付密码"
        :value="userInfo.hasPayPassword ? '已设置' : '未设置'"
        :is-link="true"
        @click="onSetPayPassword"
      >
        <template #right-icon>
          <van-tag 
            :type="userInfo.hasPayPassword ? 'success' : 'warning'"
            size="medium"
          >
            {{ userInfo.hasPayPassword ? '已设置' : '未设置' }}
          </van-tag>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 登录设备 -->
    <van-cell-group inset class="login-devices">
      <van-cell
        title="登录设备管理"
        is-link
        @click="onManageDevices"
      >
        <template #value>
          <span class="device-count">{{ deviceCount }}台设备</span>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 账号注销 -->
    <van-cell-group inset class="account-delete">
      <van-cell
        title="账号注销"
        is-link
        @click="onDeleteAccount"
      >
        <template #value>
          <span class="delete-text">永久注销账号</span>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo || {})

// 设备数量
const deviceCount = ref(1)

// 计算安全等级
const securityLevel = computed(() => {
  let score = 0
  if (userInfo.value.hasPassword) score += 20
  if (userInfo.value.phone) score += 20
  if (userInfo.value.email) score += 20
  if (userInfo.value.verified) score += 20
  if (userInfo.value.hasPayPassword) score += 20
  
  let level = {
    score,
    text: '低',
    class: 'danger'
  }
  
  if (score >= 80) {
    level.text = '高'
    level.class = 'success'
  } else if (score >= 40) {
    level.text = '中'
    level.class = 'warning'
  }
  
  return level
})

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 设置登录密码
const onSetPassword = () => {
  router.push('/security/password')
}

// 设置邮箱
const onSetEmail = () => {
  router.push('/security/email')
}

// 实名认证
const onVerify = () => {
  router.push('/security/verify')
}

// 设置支付密码
const onSetPayPassword = () => {
  router.push('/security/pay-password')
}

// 管理登录设备
const onManageDevices = () => {
  router.push('/security/devices')
}

// 账号注销
const onDeleteAccount = () => {
  showDialog({
    title: '账号注销提醒',
    message: '注销后，账号将永久删除且无法恢复，请谨慎操作！',
    confirmButtonText: '确认注销',
    confirmButtonColor: '#ee0a24',
    showCancelButton: true
  }).then(() => {
    router.push('/security/delete')
  })
}

// 工具函数：手机号脱敏
const maskPhone = (phone) => {
  return phone?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 工具函数：邮箱脱敏
const maskEmail = (email) => {
  const [name, domain] = email.split('@')
  const maskedName = name.slice(0, 3) + '****'
  return `${maskedName}@${domain}`
}
</script>

<style scoped lang="scss">
.security {
  min-height: 100vh;
  background: #f5f5f5;
  
  .security-level,
  .security-settings,
  .login-devices,
  .account-delete {
    margin-top: 12px;
  }
  
  .level-box {
    display: flex;
    align-items: center;
    
    .level-text {
      margin-right: 10px;
      font-size: 14px;
    }
    
    .level-progress {
      width: 100px;
      height: 4px;
      background: #eee;
      border-radius: 2px;
      overflow: hidden;
      
      .progress-bar {
        display: block;
        height: 100%;
        transition: width 0.3s ease;
        
        &.success {
          background: $success-color;
        }
        
        &.warning {
          background: $warning-color;
        }
        
        &.danger {
          background: $danger-color;
        }
      }
    }
  }
  
  .device-count {
    font-size: 14px;
    color: #666;
  }
  
  .delete-text {
    font-size: 14px;
    color: $danger-color;
  }
}
</style> 