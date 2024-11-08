<template>
  <div class="address-edit">
    <van-form @submit="onSubmit">
      <!-- 联系人 -->
      <van-cell-group inset>
        <van-field
          v-model="form.name"
          label="收货人"
          placeholder="请输入收货人姓名"
          :rules="[{ required: true, message: '请输入收货人姓名' }]"
        />
        <van-field
          v-model="form.tel"
          type="tel"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
          ]"
        />
      </van-cell-group>
      
      <!-- 地址选择 -->
      <van-cell-group inset>
        <van-field
          v-model="areaText"
          label="所在地区"
          placeholder="请选择所在地区"
          readonly
          :rules="[{ required: true, message: '请选择所在地区' }]"
          @click="showArea = true"
        />
        <van-field
          v-model="form.addressDetail"
          label="��细地址"
          type="textarea"
          placeholder="请输入详细地址"
          :rules="[{ required: true, message: '请输入详细地址' }]"
        />
      </van-cell-group>
      
      <!-- 设置默认地址 -->
      <van-cell-group inset>
        <van-cell title="设为默认收货地址" center>
          <template #right-icon>
            <van-switch v-model="form.isDefault" size="24" />
          </template>
        </van-cell>
      </van-cell-group>
      
      <!-- 提交按钮 -->
      <div class="submit-bar">
        <van-button
          round
          block
          type="danger"
          native-type="submit"
          :loading="submitting"
        >
          保存
        </van-button>
      </div>
    </van-form>
    
    <!-- 地区选择器 -->
    <van-popup
      v-model:show="showArea"
      position="bottom"
      round
    >
      <van-area
        :area-list="areaList"
        @confirm="onConfirmArea"
        @cancel="showArea = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showToast } from 'vant'
import { areaList } from '@vant/area-data'

const props = defineProps({
  address: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit'])

// 表单数据
const form = ref({
  name: props.address.name || '',
  tel: props.address.tel || '',
  province: props.address.province || '',
  city: props.address.city || '',
  county: props.address.county || '',
  addressDetail: props.address.addressDetail || '',
  areaCode: props.address.areaCode || '',
  isDefault: props.address.isDefault || false
})

// 地区选择
const showArea = ref(false)
const areaText = computed(() => {
  if (!form.value.province) return ''
  return `${form.value.province} ${form.value.city} ${form.value.county}`
})

// 提交状态
const submitting = ref(false)

// 确认选择地区
const onConfirmArea = ([province, city, county]) => {
  form.value.province = province.name
  form.value.city = city.name
  form.value.county = county.name
  form.value.areaCode = county.code
  showArea.value = false
}

// 提交表单
const onSubmit = () => {
  submitting.value = true
  emit('submit', { ...form.value })
}
</script>

<style scoped lang="scss">
.address-edit {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 12px 0;
  
  .van-cell-group {
    margin-bottom: 12px;
  }
  
  .submit-bar {
    margin: 24px 16px;
  }
}
</style> 