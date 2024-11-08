<template>
  <div class="set-password">
    <van-nav-bar
      :title="userInfo.hasPassword ? '修改密码' : '设置密码'"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 验证手机号 -->
    <template v-if="currentStep === 0">
      <van-cell-group inset class="form-group">
        <van-field
          v-model="phone"
          label="手机号"
          readonly
        />
        <van-field
          v-model="verifyCode"
          label="验证码"
          placeholder="请输入验证码"
          maxlength="6"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="countdown > 0"
              @click="sendCode"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
      
      <div class="submit-bar">
        <van-button 
          type="danger" 
          block 
          :loading="verifying"
          @click="verifyPhone"
        >
          下一步
        </van-button>
      </div>
    </template>
    
    <!-- 设置新密码 -->
    <template v-else>
      <van-cell-group inset class="form-group">
        <van-field
          v-model="password"
          label="新密码"
          type="password"
          placeholder="请输入6-20位密码"
          :rules="[
            { required: true, message: '请输入密码' },
            { pattern: /^[\w!@#$%^&*]{6,20}$/, message: '密码格式不正确' }
          ]"
        />
        <van-field
          v-model="confirmPassword"
          label="确认密码"
          type="password"
          placeholder="请再次输入密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword, message: '两次密码不一致' }
          ]"
        />
      </van-cell-group>
      
      <!-- 密码规则提示 -->
      <div class="password-tips">
        <div class="tips-title">密码要求：</div>
        <ul class="tips-list">
          <li>长度为6-20个字符</li>
          <li>可包含字母、数字、特殊字符</li>
          <li>不能包含空格</li>
        </ul>
      </div>
      
      <div class="submit-bar">
        <van-button 
          type="danger" 
          block 
          :loading="submitting"
          @click="onSubmit"
        >
          确认
        </van-button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/store'
import { sendVerifyCode, verifyCode, setPassword } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo || {})

// 步骤控制
const currentStep = ref(0)

// 表单数据
const phone = ref(userInfo.value.phone || '')
const verifyCode = ref('')
const password = ref('')
const confirmPassword = ref('')

// 状态控制
const countdown = ref(0)
const verifying = ref(false)
const submitting = ref(false)

// 发送验证码
const sendCode = async () => {
  try {
    await sendVerifyCode(phone.value)
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

// 验证手机号
const verifyPhone = async () => {
  if (!verifyCode.value) {
    showToast('请输入验证码')
    return
  }
  
  verifying.value = true
  try {
    await verifyCode(phone.value, verifyCode.value)
    currentStep.value = 1
  } catch (error) {
    showToast('验证码错误')
  } finally {
    verifying.value = false
  }
}

// 验证确认密码
const validateConfirmPassword = (val) => {
  return val === password.value
}

// 提交设置
const onSubmit = async () => {
  if (!password.value || !confirmPassword.value) {
    showToast('请填写完整密码信息')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    showToast('两次密码不一致')
    return
  }
  
  if (!/^[\w!@#$%^&*]{6,20}$/.test(password.value)) {
    showToast('密码格式不正确')
    return
  }
  
  submitting.value = true
  try {
    await setPassword({
      phone: phone.value,
      code: verifyCode.value,
      password: password.value
    })
    
    await userStore.getUserInfo()
    showToast('设置成功')
    router.back()
  } catch (error) {
    showToast('设置失败')
  } finally {
    submitting.value = false
  }
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.set-password {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
  
  .form-group {
    margin-top: 12px;
  }
  
  .password-tips {
    margin: 20px 16px;
    
    .tips-title {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .tips-list {
      margin: 0;
      padding-left: 20px;
      
      li {
        font-size: 12px;
        color: #999;
        line-height: 1.6;
      }
    }
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