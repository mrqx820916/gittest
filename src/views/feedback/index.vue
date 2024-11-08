<template>
  <div class="feedback">
    <van-nav-bar
      title="意见反馈"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 反馈类型 -->
    <van-cell-group inset class="type-group">
      <van-field
        label="反馈类型"
        readonly
        :model-value="feedbackTypes[selectedType]?.text"
        right-icon="arrow"
        @click="showTypePopup = true"
      />
    </van-cell-group>
    
    <!-- 反馈内容 -->
    <van-cell-group inset class="content-group">
      <van-field
        v-model="content"
        type="textarea"
        placeholder="请详细描述您遇到的问题或建议..."
        maxlength="500"
        rows="5"
        show-word-limit
        autosize
      />
    </van-cell-group>
    
    <!-- 图片上传 -->
    <van-cell-group inset class="upload-group">
      <div class="upload-title">问题截图（选填）</div>
      <van-uploader
        v-model="images"
        multiple
        :max-count="6"
        :after-read="afterRead"
        @delete="onDeleteImage"
      >
        <template #preview-cover="{ file }">
          <div class="preview-cover" v-if="file.status === 'uploading'">
            <van-loading type="spinner" size="20" />
            <span class="upload-text">上传中...</span>
          </div>
        </template>
      </van-uploader>
      <div class="upload-tips">最多上传6张图片，每张不超过5MB</div>
    </van-cell-group>
    
    <!-- 联系方式 -->
    <van-cell-group inset class="contact-group">
      <van-field
        v-model="contact"
        label="联系方式"
        placeholder="请留下您的手机号或邮箱（选填）"
      />
    </van-cell-group>
    
    <!-- 提交按钮 -->
    <div class="submit-bar">
      <van-button 
        type="danger" 
        block 
        :loading="submitting"
        :disabled="!isValid"
        @click="onSubmit"
      >
        提交反馈
      </van-button>
    </div>
    
    <!-- 反馈类型选择弹窗 -->
    <van-popup
      v-model:show="showTypePopup"
      position="bottom"
      round
    >
      <van-picker
        :columns="feedbackTypes"
        @confirm="onSelectType"
        @cancel="showTypePopup = false"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { uploadFile } from '@/utils/upload'
import { createFeedback } from '@/api/feedback'

const router = useRouter()

// 反馈类型
const feedbackTypes = [
  { text: '功能异常', value: 1 },
  { text: '体验问题', value: 2 },
  { text: '商品相关', value: 3 },
  { text: '配送相关', value: 4 },
  { text: '客服相关', value: 5 },
  { text: '其他建议', value: 6 }
]

// 表单数据
const selectedType = ref(0)
const content = ref('')
const images = ref([])
const contact = ref('')
const showTypePopup = ref(false)
const submitting = ref(false)

// 表单验证
const isValid = computed(() => {
  return content.value.trim().length >= 10
})

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 选择反馈类型
const onSelectType = (type) => {
  selectedType.value = feedbackTypes.findIndex(item => item.value === type.value)
  showTypePopup.value = false
}

// 上传图片
const afterRead = async (file) => {
  try {
    file.status = 'uploading'
    const url = await uploadFile(file.file)
    file.url = url
    file.status = 'done'
  } catch (error) {
    file.status = 'failed'
    showToast('图片上传失败')
  }
}

// 删除图片
const onDeleteImage = (file) => {
  const index = images.value.indexOf(file)
  if (index !== -1) {
    images.value.splice(index, 1)
  }
}

// 提交反馈
const onSubmit = async () => {
  if (!isValid.value) {
    showToast('请详细描述您的问题或建议（至少10个字）')
    return
  }
  
  if (submitting.value) return
  submitting.value = true
  
  try {
    await createFeedback({
      type: feedbackTypes[selectedType.value].value,
      content: content.value,
      images: images.value.map(item => item.url),
      contact: contact.value
    })
    
    showToast('提交成功')
    router.back()
  } catch (error) {
    showToast('提交失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.feedback {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
  
  .type-group,
  .content-group,
  .upload-group,
  .contact-group {
    margin-top: 12px;
  }
  
  .upload-group {
    padding: 16px;
    
    .upload-title {
      margin-bottom: 12px;
      font-size: 14px;
      color: #666;
    }
    
    .upload-tips {
      margin-top: 8px;
      font-size: 12px;
      color: #999;
    }
    
    .preview-cover {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      
      .upload-text {
        margin-top: 5px;
        font-size: 12px;
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