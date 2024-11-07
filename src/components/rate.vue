<template>
  <div class="rate">
    <van-rate
      v-model="value"
      :size="size"
      :color="color"
      :void-color="voidColor"
      :void-icon="voidIcon"
      :allow-half="allowHalf"
      :readonly="readonly"
      @change="onChange"
    />
    <span v-if="showScore" class="score">{{ value }}分</span>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    default: 20
  },
  color: {
    type: String,
    default: '#ffd21e'
  },
  voidColor: {
    type: String,
    default: '#c8c9cc'
  },
  voidIcon: {
    type: String,
    default: 'star'
  },
  allowHalf: {
    type: Boolean,
    default: true
  },
  readonly: {
    type: Boolean,
    default: false
  },
  showScore: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const value = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  value.value = val
})

const onChange = (val) => {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<style scoped lang="scss">
.rate {
  display: flex;
  align-items: center;
  
  .score {
    margin-left: 10px;
    color: #666;
    font-size: 14px;
  }
}
</style> 