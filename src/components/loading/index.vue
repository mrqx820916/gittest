<template>
  <div 
    class="loading-wrapper"
    :class="{
      fullscreen,
      fixed,
      transparent
    }"
  >
    <div class="loading-content">
      <van-loading :size="size" :color="color" :type="type">
        <template #default>
          <span v-if="text" class="loading-text">{{ text }}</span>
        </template>
      </van-loading>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: '24px'
  },
  color: {
    type: String,
    default: '#1989fa'
  },
  type: {
    type: String,
    default: 'spinner'
  },
  text: {
    type: String,
    default: '加载中...'
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  fixed: {
    type: Boolean,
    default: false
  },
  transparent: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  
  &.fullscreen {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
  }
  
  &.fixed {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
  }
  
  &:not(.transparent) {
    background: rgba(255, 255, 255, 0.9);
  }
  
  .loading-content {
    text-align: center;
    
    .loading-text {
      display: block;
      margin-top: 8px;
      color: #969799;
      font-size: 14px;
    }
  }
}
</style> 