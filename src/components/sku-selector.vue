<template>
  <div class="sku-selector">
    <div
      v-for="(spec, index) in specs"
      :key="index"
      class="sku-group"
    >
      <div class="sku-group-title">{{ spec.name }}</div>
      <div class="sku-group-content">
        <van-button
          v-for="item in spec.values"
          :key="item"
          :type="selectedSpecs[spec.name] === item ? 'danger' : 'default'"
          size="small"
          @click="selectSpec(spec.name, item)"
        >
          {{ item }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  specs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['change'])

const selectedSpecs = ref({})

const selectSpec = (name, value) => {
  selectedSpecs.value[name] = value
  emit('change', selectedSpecs.value)
}

const isComplete = computed(() => {
  return props.specs.every(spec => selectedSpecs.value[spec.name])
})

defineExpose({
  selectedSpecs,
  isComplete
})
</script>

<style scoped lang="scss">
.sku-selector {
  .sku-group {
    margin-bottom: 15px;
    
    .sku-group-title {
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    .sku-group-content {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
}
</style> 