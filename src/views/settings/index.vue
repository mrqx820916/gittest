<template>
  <div class="settings">
    <van-nav-bar
      title="设置"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 账号设置 -->
    <van-cell-group inset class="setting-group">
      <van-cell title="个人资料" is-link to="/profile" />
      <van-cell title="账号安全" is-link to="/security" />
      <van-cell title="实名认证" is-link to="/verify">
        <template #right-icon>
          <van-tag type="warning" v-if="!userInfo.verified">未认证</van-tag>
          <van-tag type="success" v-else>已认证</van-tag>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 消息设置 -->
    <van-cell-group inset class="setting-group">
      <van-cell title="消息通知" is-link to="/notification" />
      <van-cell title="隐私设置" is-link to="/privacy" />
      <van-cell title="清除缓存" is-link @click="clearCache">
        <template #right-icon>
          <span class="cache-size">{{ cacheSize }}</span>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 其他设置 -->
    <van-cell-group inset class="setting-group">
      <van-cell title="关于我们" is-link to="/about" />
      <van-cell title="用户协议" is-link to="/agreement" />
      <van-cell title="隐私政策" is-link to="/privacy-policy" />
      <van-cell title="当前版本">
        <template #right-icon>
          <span class="version">v{{ version }}</span>
          <van-tag type="primary" size="small" v-if="hasUpdate">有新版本</van-tag>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 退出登录 -->
    <div class="logout-bar">
      <van-button 
        block 
        type="danger" 
        plain
        @click="onLogout"
      >
        退出登录
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useUserStore } from '@/store'
import { checkUpdate } from '@/api/app'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo || {})

// 版本信息
const version = ref('1.0.0')
const hasUpdate = ref(false)
const cacheSize = ref('0MB')

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 检查更新
const checkAppUpdate = async () => {
  try {
    const res = await checkUpdate(version.value)
    hasUpdate.value = res.hasUpdate
    if (res.hasUpdate) {
      showDialog({
        title: '发现新版本',
        message: res.updateInfo,
        confirmButtonText: '立即更新',
        cancelButtonText: '暂不更新',
        showCancelButton: true
      }).then(() => {
        // 执行更新操作
        window.location.href = res.downloadUrl
      }).catch(() => {
        // 取消更新
      })
    }
  } catch (error) {
    console.error('检查更新失败:', error)
  }
}

// 计算缓存大小
const calculateCacheSize = () => {
  try {
    const size = localStorage.length * 2 / 1024 // KB
    cacheSize.value = size > 1024 ? `${(size / 1024).toFixed(1)}MB` : `${size.toFixed(1)}KB`
  } catch (error) {
    cacheSize.value = '0MB'
  }
}

// 清除缓存
const clearCache = async () => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要清除缓存吗？',
      showCancelButton: true
    })
    
    // 清除本地存储
    localStorage.clear()
    // 清除搜索历史
    localStorage.removeItem('searchHistory')
    // 保留登录信息
    const token = userStore.token
    if (token) {
      localStorage.setItem('token', token)
    }
    
    calculateCacheSize()
    showToast('清除成功')
  } catch {
    // 取消清除
  }
}

// 退出登录
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

// 初始化数据
calculateCacheSize()
checkAppUpdate()
</script>

<style scoped lang="scss">
.settings {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
  
  .setting-group {
    margin-top: 12px;
    
    .cache-size {
      font-size: 14px;
      color: #999;
    }
    
    .version {
      font-size: 14px;
      color: #999;
      margin-right: 8px;
    }
  }
  
  .logout-bar {
    margin: 20px 16px;
  }
}
</style> 