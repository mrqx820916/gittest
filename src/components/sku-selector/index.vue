<template>
  <div class="sku-selector">
    <!-- 商品信息 -->
    <div class="goods-info">
      <van-image
        :src="selectedSku?.image || goods.thumb"
        width="100"
        height="100"
      />
      <div class="info">
        <div class="price">
          <span class="symbol">¥</span>
          <span class="number">{{ selectedSku?.price || goods.price }}</span>
          <span class="original" v-if="selectedSku?.originalPrice || goods.originalPrice">
            ¥{{ selectedSku?.originalPrice || goods.originalPrice }}
          </span>
        </div>
        <div class="stock">库存: {{ selectedSku?.stock || goods.stock }}</div>
        <div class="selected">
          已选：{{ selectedText }}
        </div>
      </div>
    </div>
    
    <!-- 规格列表 -->
    <div class="sku-list">
      <div
        v-for="(spec, index) in specs"
        :key="index"
        class="sku-group"
      >
        <div class="title">{{ spec.name }}</div>
        <div class="options">
          <span
            v-for="value in spec.values"
            :key="value"
            class="option"
            :class="{
              active: selectedSpecs[spec.name] === value,
              disabled: !isValueSelectable(spec.name, value)
            }"
            @click="selectSpec(spec.name, value)"
          >
            {{ value }}
            <van-icon name="cross" v-if="selectedSpecs[spec.name] === value" />
          </span>
        </div>
      </div>
    </div>
    
    <!-- 数量选择 -->
    <div class="quantity">
      <span class="label">购买数量</span>
      <van-stepper
        v-model="quantity"
        :min="1"
        :max="maxBuyQuantity"
        :disabled="!isSkuSelected || maxBuyQuantity <= 0"
        @change="onQuantityChange"
      />
    </div>
    
    <!-- 库存提示 -->
    <div v-if="selectedSku && selectedSku.stock <= 0" class="stock-warning">
      <van-icon name="warning-o" />
      <span>所选规格已售罄</span>
    </div>
    <div v-else-if="selectedSku && selectedSku.stock < 10" class="stock-warning">
      <van-icon name="warning-o" />
      <span>所选规格库存不足10件</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { showToast } from 'vant'

const props = defineProps({
  goods: {
    type: Object,
    required: true
  },
  specs: {
    type: Array,
    required: true
  },
  skuList: {
    type: Array,
    required: true
  },
  initialSku: {
    type: Object,
    default: () => ({})
  },
  initialQuantity: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 选中的规格
const selectedSpecs = ref({ ...props.initialSku })
const quantity = ref(props.initialQuantity)

// 计算选中的SKU
const selectedSku = computed(() => {
  if (!isSkuSelected.value) return null
  
  return props.skuList.find(sku => {
    return Object.entries(selectedSpecs.value).every(([key, value]) => {
      return sku.specs[key] === value
    })
  })
})

// 是否已选择完所有规格
const isSkuSelected = computed(() => {
  return props.specs.every(spec => selectedSpecs.value[spec.name])
})

// 选中规格的文本
const selectedText = computed(() => {
  if (!isSkuSelected.value) return '请选择规格'
  return Object.entries(selectedSpecs.value)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')
})

// 最大可购买数量
const maxBuyQuantity = computed(() => {
  if (!selectedSku.value) return 0
  // 考虑库存和限购数量
  const maxByStock = selectedSku.value.stock
  const maxByLimit = props.goods.buyLimit || 99
  return Math.min(maxByStock, maxByLimit)
})

// 选择规格
const selectSpec = (name, value) => {
  if (!isValueSelectable(name, value)) return
  
  if (selectedSpecs.value[name] === value) {
    // 取消选择
    delete selectedSpecs.value[name]
  } else {
    // 选择新规格
    selectedSpecs.value[name] = value
  }
  
  // 重置数量
  if (quantity.value > maxBuyQuantity.value) {
    quantity.value = Math.max(1, maxBuyQuantity.value)
  }
  
  emitChange()
}

// 判断规格值是否可选
const isValueSelectable = (name, value) => {
  // 创建临时规格对象
  const tempSpecs = { ...selectedSpecs.value, [name]: value }
  
  // 检查是否有对应的SKU
  return props.skuList.some(sku => {
    return Object.entries(tempSpecs).every(([key, val]) => {
      if (!val) return true // 未选择的规格不参与匹配
      return sku.specs[key] === val
    })
  })
}

// 数量变化
const onQuantityChange = (value) => {
  quantity.value = value
  emitChange()
}

// 发送变化事件
const emitChange = () => {
  emit('change', {
    selectedSpecs: { ...selectedSpecs.value },
    selectedSku: selectedSku.value,
    quantity: quantity.value
  })
}

// 监听初始值变化
watch(() => props.initialSku, (newValue) => {
  selectedSpecs.value = { ...newValue }
}, { deep: true })

watch(() => props.initialQuantity, (newValue) => {
  quantity.value = newValue
})

// 价格计算
const calculatePrice = (specs) => {
  if (!specs) return null
  
  // 查找匹配的SKU
  const sku = props.skuList.find(item => {
    return Object.entries(specs).every(([key, value]) => {
      return item.specs[key] === value
    })
  })
  
  if (!sku) return null
  
  // 计算会员价
  const userStore = useUserStore()
  const discount = userStore.userLevel?.discount || 1
  
  return {
    ...sku,
    price: sku.price * discount
  }
}

// 监听规格变化，更新价格
watch(() => selectedSpecs.value, (specs) => {
  if (!specs) return
  selectedSku.value = calculatePrice(specs)
}, { deep: true })
</script>

<style scoped lang="scss">
.sku-selector {
  padding: 16px;
  
  .goods-info {
    display: flex;
    margin-bottom: 20px;
    
    .info {
      flex: 1;
      margin-left: 12px;
      
      .price {
        color: $primary-color;
        margin-bottom: 8px;
        
        .symbol {
          font-size: 14px;
        }
        
        .number {
          font-size: 20px;
          font-weight: bold;
        }
        
        .original {
          font-size: 12px;
          color: #999;
          text-decoration: line-through;
          margin-left: 8px;
        }
      }
      
      .stock {
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
      }
      
      .selected {
        font-size: 12px;
        color: #666;
      }
    }
  }
  
  .sku-list {
    .sku-group {
      margin-bottom: 16px;
      
      .title {
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
      }
      
      .options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .option {
          position: relative;
          padding: 6px 12px;
          border: 1px solid #eee;
          border-radius: 4px;
          font-size: 12px;
          color: #333;
          
          &.active {
            color: $primary-color;
            border-color: $primary-color;
            background: rgba($primary-color, 0.1);
            
            .van-icon {
              position: absolute;
              top: -6px;
              right: -6px;
              padding: 2px;
              border-radius: 50%;
              background: $primary-color;
              color: #fff;
              font-size: 12px;
            }
          }
          
          &.disabled {
            color: #999;
            background: #f5f5f5;
            cursor: not-allowed;
          }
        }
      }
    }
  }
  
  .quantity {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    
    .label {
      font-size: 14px;
      color: #333;
    }
  }
  
  .stock-warning {
    margin-top: 12px;
    color: $primary-color;
    font-size: 12px;
    
    .van-icon {
      margin-right: 4px;
    }
  }
}
</style> 