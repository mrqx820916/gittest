<template>
  <div class="profile">
    <van-nav-bar
      title="个人资料"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 头像 -->
    <van-cell-group inset class="avatar-card">
      <van-cell title="头像" is-link center @click="showUploader = true">
        <template #right-icon>
          <van-image
            round
            width="50"
            height="50"
            :src="form.avatar"
            error-icon="contact"
          />
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 基本信息 -->
    <van-cell-group inset class="info-card">
      <van-field
        v-model="form.nickname"
        label="昵称"
        placeholder="请输入昵称"
        maxlength="20"
        show-word-limit
      />
      <van-field
        v-model="form.phone"
        label="手机号"
        readonly
        right-icon="arrow"
        @click="onChangePhone"
      />
      <van-cell title="性别" is-link :value="genderText" @click="showGender = true" />
      <van-field
        v-model="form.birthday"
        label="生日"
        readonly
        right-icon="arrow"
        @click="showCalendar = true"
      />
      <van-field
        v-model="form.email"
        label="邮箱"
        placeholder="请输入邮箱"
        type="email"
      />
    </van-cell-group>
    
    <!-- 保存按钮 -->
    <div class="submit-bar">
      <van-button 
        type="danger" 
        block 
        :loading="submitting"
        @click="onSubmit"
      >
        保存
      </van-button>
    </div>
    
    <!-- 头像上传弹窗 -->
    <van-action-sheet v-model:show="showUploader" title="修改头像">
      <div class="uploader-content">
        <van-uploader
          v-model="avatarFile"
          :max-count="1"
          :after-read="afterRead"
        >
          <van-image
            width="200"
            height="200"
            :src="form.avatar"
            error-icon="contact"
          />
        </van-uploader>
        <div class="uploader-tips">点击图片修改头像</div>
      </div>
    </van-action-sheet>
    
    <!-- 性别选择弹窗 -->
    <van-action-sheet
      v-model:show="showGender"
      :actions="genderOptions"
      cancel-text="取消"
      @select="onSelectGender"
    />
    
    <!-- 日期选择弹窗 -->
    <van-calendar
      v-model:show="showCalendar"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onSelectDate"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/store'
import { updateUserInfo } from '@/api/user'
import { uploadFile } from '@/utils/upload'
import { formatDate } from '@/utils'

const router = useRouter()
const userStore = useUserStore()

// 表单数据
const form = ref({
  avatar: userStore.userInfo?.avatar || '',
  nickname: userStore.userInfo?.nickname || '',
  phone: userStore.userInfo?.phone || '',
  gender: userStore.userInfo?.gender || 0,
  birthday: userStore.userInfo?.birthday || '',
  email: userStore.userInfo?.email || ''
})

// 状态控制
const submitting = ref(false)
const showUploader = ref(false)
const showGender = ref(false)
const showCalendar = ref(false)
const avatarFile = ref([])

// 性别选项
const genderOptions = [
  { name: '男', value: 1 },
  { name: '女', value: 2 }
]

// 日期限制
const minDate = new Date(1900, 0, 1)
const maxDate = new Date()

// 性别文本
const genderText = computed(() => {
  const option = genderOptions.find(item => item.value === form.value.gender)
  return option ? option.name : '请选择'
})

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 上传头像
const afterRead = async (file) => {
  try {
    file.status = 'uploading'
    const url = await uploadFile(file.file)
    form.value.avatar = url
    file.status = 'done'
  } catch (error) {
    file.status = 'failed'
    showToast('上传失败')
  }
}

// 修改手机号
const onChangePhone = () => {
  router.push('/profile/phone')
}

// 选择性别
const onSelectGender = (action) => {
  form.value.gender = action.value
  showGender.value = false
}

// 选择日期
const onSelectDate = (date) => {
  form.value.birthday = formatDate(date, 'YYYY-MM-DD')
  showCalendar.value = false
}

// 提交表单
const onSubmit = async () => {
  if (submitting.value) return
  
  // 表单验证
  if (!form.value.nickname.trim()) {
    showToast('请输入昵称')
    return
  }
  
  if (form.value.email && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(form.value.email)) {
    showToast('邮箱格式不正确')
    return
  }
  
  submitting.value = true
  try {
    await updateUserInfo(form.value)
    await userStore.getUserInfo()
    showToast('保存成功')
    router.back()
  } catch (error) {
    showToast('保存失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.profile {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
  
  .avatar-card,
  .info-card {
    margin-top: 12px;
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
  
  .uploader-content {
    padding: 20px;
    text-align: center;
    
    .uploader-tips {
      margin-top: 10px;
      color: #999;
      font-size: 14px;
    }
  }
}
</style> 