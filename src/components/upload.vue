<template>
  <div class="upload">
    <van-uploader
      v-model="fileList"
      :max-count="maxCount"
      :after-read="afterRead"
      @delete="onDelete"
    >
      <template #preview-cover="{ file }">
        <div class="preview-cover" v-if="file.status === 'uploading'">
          <van-loading type="spinner" size="20" />
          <span class="upload-text">上传中...</span>
        </div>
      </template>
    </van-uploader>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { uploadFile } from '@/utils/upload'

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  maxCount: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:value'])

const fileList = ref([])

watch(() => props.value, (val) => {
  fileList.value = val.map(url => ({
    url,
    isImage: true
  }))
}, { immediate: true })

const afterRead = async (file) => {
  file.status = 'uploading'
  
  try {
    const url = await uploadFile(file.file)
    file.url = url
    file.status = 'done'
    
    const urls = fileList.value
      .filter(item => item.status === 'done')
      .map(item => item.url)
    emit('update:value', urls)
  } catch (error) {
    file.status = 'failed'
  }
}

const onDelete = (file) => {
  const urls = fileList.value
    .filter(item => item !== file && item.status === 'done')
    .map(item => item.url)
  emit('update:value', urls)
}
</script>

<style scoped lang="scss">
.upload {
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
</style> 