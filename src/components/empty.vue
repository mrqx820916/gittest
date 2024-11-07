<template>
  <div class="empty">
    <van-empty
      :image="image"
      :description="description"
    >
      <template #default>
        <slot>
          <van-button
            v-if="buttonText"
            round
            type="danger"
            class="bottom-button"
            @click="$emit('click')"
          >
            {{ buttonText }}
          </van-button>
        </slot>
      </template>
    </van-empty>
  </div>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    default: 'error'
  },
  description: {
    type: String,
    default: '暂无数据'
  },
  buttonText: String
})

defineEmits(['click'])
</script>

<style scoped lang="scss">
.empty {
  padding: 32px 0;
  
  .bottom-button {
    width: 160px;
    height: 40px;
  }
}
</style> 