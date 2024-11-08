<template>
  <div class="change-phone">
    <van-nav-bar
      title="修改手机号"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 步骤条 -->
    <van-steps :active="currentStep" active-color="#ee0a24">
      <van-step>验证原手机号</van-step>
      <van-step>绑定新手机号</van-step>
    </van-steps>
    
    <!-- 验证原手机号 -->
    <template v-if="currentStep === 0">
      <van-cell-group inset class="form-group">
        <van-field
          v-model="oldPhone"
          label="原手机号"
          readonly
        />
        <van-field
          v-model="oldCode"
          label="验证码"
          placeholder="请输入验证码"
          maxlength="6"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="oldCountdown > 0"
              @click="sendCode('old')"
            >
              {{ oldCountdown > 0 ? `${oldCountdown}s` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
      
      <div class="submit-bar">
        <van-button 
          type="danger" 
          block 
          :loading="verifying"
          :disabled="!oldCode || oldCode.length !== 6"
          @click="verifyOldPhone"
        >
          下一步
        </van-button>
      </div>
    </template>
    
    <!-- 绑定新手机号 -->
    <template v-else>
      <van-cell-group inset class="form-group">
        <van-field
          v-model="newPhone"
          label="新手机号"
          type="tel"
          maxlength="11"
          placeholder="请输入新手机号"
          :rules="[
            { required: true, message: '请输入手机号' },
            { validator: validatePhone, message: '手机号格式不正确' }
          ]"
        />
        <van-field
          v-model="newCode"
          label="验证码"
          placeholder="请输入验证码"
          maxlength="6"
          :rules="[{ required: true, message: '请输入验证码' }]"
        >
          <template #button>
            <van-button
              size="small"
              type="primary"
              :disabled="!isValidPhone || newCountdown > 0"
              @click="sendCode('new')"
            >
              {{ newCountdown > 0 ? `${newCountdown}s` : '获取验证码' }}
            </van-button>
          </template>
        </van-field>
      </van-cell-group>
      
      <div class="tips">
        <van-icon name="info-o" />
        <span>更换手机号后，下次登录可使用新手机号登录</span>
      </div>
      
      <div class="submit-bar">
        <van-button 
          type="danger" 
          block 
          :loading="submitting"
          :disabled="!isFormValid"
          @click="onSubmit"
        >
          确认修改
        </van-button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useUserStore } from '@/store'
import { sendVerifyCode, verifyCode, updatePhone } from '@/api/user'
import { isPhone } from '@/utils/validate'
import { getStorage, setStorage } from '@/utils/storage'
import { checkRiskLevel } from '@/utils/security'

const router = useRouter()
const userStore = useUserStore()

// 步骤控制
const currentStep = ref(0)

// 表单数据
const oldPhone = ref(userStore.userInfo?.phone || '')
const oldCode = ref('')
const newPhone = ref('')
const newCode = ref('')

// 倒计时
const oldCountdown = ref(0)
const newCountdown = ref(0)
let oldTimer = null
let newTimer = null

// 状态控制
const verifying = ref(false)
const submitting = ref(false)

// 验证码发送限制
const CODE_LIMIT_KEY = 'verifyCodeLimit'
const CODE_LIMIT_TIME = 60 * 1000 // 60秒内最多发送3次
const CODE_LIMIT_COUNT = 3

// 检查验证码发送限制
const checkCodeLimit = () => {
  const now = Date.now()
  const limitInfo = getStorage(CODE_LIMIT_KEY) || { count: 0, time: now }
  
  // 重置计数
  if (now - limitInfo.time > CODE_LIMIT_TIME) {
    limitInfo.count = 0
    limitInfo.time = now
  }
  
  // 检查次数
  if (limitInfo.count >= CODE_LIMIT_COUNT) {
    const waitTime = Math.ceil((CODE_LIMIT_TIME - (now - limitInfo.time)) / 1000)
    showToast(`操作太频繁，请${waitTime}秒后再试`)
    return false
  }
  
  // 更新计数
  limitInfo.count++
  setStorage(CODE_LIMIT_KEY, limitInfo)
  return true
}

// 手机号验证
const validatePhone = (val) => {
  if (!isPhone(val)) return false
  if (val === oldPhone.value) return '新手机号不能与原手机号相同'
  return true
}

const isValidPhone = computed(() => isPhone(newPhone.value) && newPhone.value !== oldPhone.value)

// 发送验证码
const sendCode = async (type) => {
  // 检查发送限制
  if (!checkCodeLimit()) return
  
  try {
    const phone = type === 'old' ? oldPhone.value : newPhone.value
    
    // 检查手机号
    if (!isPhone(phone)) {
      showToast('请输入正确的手机号')
      return
    }
    
    // 检查风险等级
    const riskLevel = await checkRiskLevel()
    if (riskLevel === 'high') {
      showDialog({
        title: '安全提示',
        message: '检测到账号存在风险，请完成安全验证',
        confirmButtonText: '去验证',
        cancelButtonText: '取消'
      }).then(() => {
        router.push('/security/verify')
      })
      return
    }
    
    // 发送验证码
    await sendVerifyCode(phone)
    showToast('验证码已发送')
    
    // 开始倒计时
    const countdown = type === 'old' ? oldCountdown : newCountdown
    const timer = type === 'old' ? oldTimer : newTimer
    
    countdown.value = 60
    if (timer) clearInterval(timer)
    
    const newTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(newTimer)
      }
    }, 1000)
    
    if (type === 'old') {
      oldTimer = newTimer
    } else {
      newTimer = newTimer
    }
  } catch (error) {
    showToast('发送失败')
  }
}

// 验证原手机号
const verifyOldPhone = async () => {
  if (!oldCode.value || oldCode.value.length !== 6) {
    showToast('请输入验证码')
    return
  }
  
  verifying.value = true
  try {
    const valid = await verifyCode(oldPhone.value, oldCode.value)
    if (valid) {
      currentStep.value = 1
    } else {
      showToast('验证码错误')
    }
  } catch (error) {
    showToast('验证失败')
  } finally {
    verifying.value = false
  }
}

// 提交修改
const onSubmit = async () => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要更换手机号吗？',
      showCancelButton: true
    })
    
    submitting.value = true
    
    // 检查新手机号是否已被使用
    const exists = await checkPhoneExists(newPhone.value)
    if (exists) {
      throw new Error('该手机号已被使用')
    }
    
    // 更新手机号
    await updatePhone({
      oldPhone: oldPhone.value,
      oldCode: oldCode.value,
      newPhone: newPhone.value,
      newCode: newCode.value
    })
    
    await userStore.getUserInfo()
    showToast('修改成功')
    
    // 记录修改记录
    const record = {
      time: Date.now(),
      oldPhone: oldPhone.value,
      newPhone: newPhone.value,
      ip: await getClientIP()
    }
    savePhoneChangeRecord(record)
    
    router.back()
  } catch (error) {
    if (error.message) {
      showToast(error.message)
    } else {
      showToast('修改失败')
    }
  } finally {
    submitting.value = false
  }
}

// 检查手机号是否存在
const checkPhoneExists = async (phone) => {
  try {
    const res = await request({
      url: '/user/check-phone',
      method: 'post',
      data: { phone }
    })
    return res.exists
  } catch (error) {
    return false
  }
}

// 保存手机号修改记录
const savePhoneChangeRecord = (record) => {
  const records = getStorage('phoneChangeRecords') || []
  records.unshift(record)
  // 最多保存10条记录
  if (records.length > 10) {
    records.pop()
  }
  setStorage('phoneChangeRecords', records)
}

// 获取客户端IP
const getClientIP = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    return data.ip
  } catch (error) {
    return ''
  }
}

// 组件销毁前清除定时器
onBeforeUnmount(() => {
  if (oldTimer) clearInterval(oldTimer)
  if (newTimer) clearInterval(newTimer)
})
</script>

<style scoped lang="scss">
.change-phone {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
  
  .van-steps {
    margin: 12px 0;
    background: #fff;
    padding: 20px 0;
  }
  
  .form-group {
    margin-top: 12px;
  }
  
  .tips {
    margin: 12px 16px;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #999;
    
    .van-icon {
      margin-right: 4px;
      color: $warning-color;
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