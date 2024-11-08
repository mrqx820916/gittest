<template>
  <div class="login">
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <div class="login-form">
      <van-form @submit="onSubmit">
        <!-- 手机号 -->
        <van-field
          v-model="form.phone"
          type="tel"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
          ]"
        />
        
        <!-- 验证码 -->
        <van-field
          v-model="form.code"
          type="digit"
          label="验证码"
          placeholder="请输入验证码"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="!!countdown"
              @click="sendCode"
            >
              {{ countdown ? `${countdown}s` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>
        
        <!-- 登录按钮 -->
        <div style="margin: 16px;">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            登录
          </van-button>
        </div>
      </van-form>
      
      <!-- 提示 -->
      <div class="tips">
        <p>测试账号：</p>
        <p>手机号：13111111111</p>
        <p>验证码：123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/store'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 表单数据
const form = ref({
  phone: '',
  code: ''
})

// 状态控制
const loading = ref(false)
const countdown = ref(0)

// 发送验证码
const sendCode = async () => {
  if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  
  try {
    // 开发环境不真正发送验证码
    showToast('验证码已发送')
    
    // 开始倒计时
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    showToast('发送失败')
  }
}

// 提交登录
const onSubmit = async () => {
  try {
    loading.value = true
    await userStore.login(form.value)
    showToast('登录成功')
    
    // 跳转到来源页面或首页
    const redirect = route.query.redirect || '/'
    router.replace(redirect)
  } catch (error) {
    showToast(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  background: #fff;
  
  .login-form {
    padding: 20px;
  }
  
  .tips {
    margin-top: 20px;
    padding: 15px;
    background: #f7f8fa;
    border-radius: 8px;
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
}
</style> 