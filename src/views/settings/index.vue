<template>
  <div class="settings">
    <van-nav-bar
      title="设置"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <van-cell-group inset>
      <van-cell title="个人资料" is-link to="/profile" />
      <van-cell title="账号安全" is-link to="/security" />
      <van-cell title="隐私设置" is-link to="/privacy" />
      <van-cell title="通知设置" is-link to="/notification" />
      <van-cell title="关于我们" is-link to="/about" />
    </van-cell-group>
    
    <div class="logout-btn">
      <van-button round block type="danger" @click="onLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showDialog } from 'vant'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

const onClickLeft = () => {
  router.back()
}

const onLogout = async () => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要退出登录吗？',
      showCancelButton: true
    })
    
    userStore.logout()
    router.replace('/login')
  } catch {
    // 取消退出
  }
}
</script>

<style scoped lang="scss">
.settings {
  min-height: 100vh;
  background: #f5f5f5;
  
  .logout-btn {
    margin: 20px;
  }
}
</style> 