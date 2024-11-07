<template>
  <div class="login">
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <div class="login-form">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="form.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ required: true, message: '请填写手机号' }]"
          />
          <van-field
            v-model="form.code"
            center
            clearable
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '请填写验证码' }]"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="isCountingDown"
                @click="sendCode"
              >
                {{ countDownText }}
              </van-button>
            </template>
          </van-field>
        </van-cell-group>
        
        <div class="submit-btn">
          <van-button round block type="primary" native-type="submit">
            登录
          </van-button>
        </div>
      </van-form>
      
      <div class="other-login">
        <div class="title">其他登录方式</div>
        <div class="icons">
          <van-icon name="wechat" size="24" color="#07c160" @click="wechatLogin" />
          <van-icon name="alipay" size="24" color="#1677ff" @click="alipayLogin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const form = ref({
  phone: '',
  code: ''
})

const countdown = ref(60)
const isCountingDown = ref(false)
const countDownText = ref('获取验证码')

const onClickLeft = () => {
  router.back()
}

const startCountDown = () => {
  isCountingDown.value = true
  countdown.value = 60
  countDownText.value = `${countdown.value}s`
  
  const timer = setInterval(() => {
    countdown.value--
    countDownText.value = `${countdown.value}s`
    
    if (countdown.value <= 0) {
      clearInterval(timer)
      isCountingDown.value = false
      countDownText.value = '获取验证码'
    }
  }, 1000)
}

const sendCode = () => {
  if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  
  // TODO: 调用发送验证码接口
  showToast('验证码已发送')
  startCountDown()
}

const onSubmit = () => {
  // TODO: 调用登录接口
  showToast('登录成功')
  router.replace('/')
}

const wechatLogin = () => {
  showToast('微信登录')
}

const alipayLogin = () => {
  showToast('支付宝登录')
}
</script>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  background: #fff;
  
  .login-form {
    padding: 20px;
    
    .submit-btn {
      margin: 20px;
    }
  }
  
  .other-login {
    text-align: center;
    margin-top: 40px;
    
    .title {
      color: #999;
      font-size: 14px;
      margin-bottom: 20px;
    }
    
    .icons {
      display: flex;
      justify-content: center;
      gap: 40px;
    }
  }
}
</style> 