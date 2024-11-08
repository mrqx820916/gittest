<template>
  <div class="address">
    <van-nav-bar
      title="收货地址"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 地址列表 -->
    <div class="address-list">
      <van-swipe-cell
        v-for="(item, index) in sortedAddressList"
        :key="item.id"
      >
        <van-cell
          :border="false"
          center
          @click="onSelect(item)"
        >
          <template #title>
            <div class="address-info">
              <div class="name-tel">
                <span class="name">{{ item.name }}</span>
                <span class="tel">{{ item.tel }}</span>
                <van-tag type="danger" v-if="item.isDefault">默认</van-tag>
              </div>
              <div class="detail">{{ formatAddress(item) }}</div>
            </div>
          </template>
          <template #right-icon>
            <van-icon name="edit" class="edit-icon" @click.stop="onEdit(item)" />
          </template>
        </van-cell>
        
        <!-- 滑动操作 -->
        <template #right>
          <van-button
            v-if="!item.isDefault"
            square
            text="设为默认"
            type="primary"
            class="action-button"
            @click="setDefault(item)"
          />
          <van-button
            square
            text="删除"
            type="danger"
            class="action-button"
            @click="onDelete(item)"
          />
        </template>
      </van-swipe-cell>
    </div>
    
    <!-- 新增地址按钮 -->
    <div class="add-btn">
      <van-button 
        type="danger" 
        block 
        round
        icon="plus"
        @click="onAdd"
      >
        新增地址
      </van-button>
    </div>
    
    <!-- 地址编辑弹窗 -->
    <van-popup
      v-model:show="showEdit"
      position="bottom"
      round
      safe-area-inset-bottom
      :style="{ height: '90%' }"
    >
      <address-edit
        :address="currentAddress"
        @submit="onSubmit"
        @delete="onConfirmDelete"
      />
    </van-popup>
    
    <!-- 地区选择器 -->
    <van-popup
      v-model:show="showArea"
      position="bottom"
      round
    >
      <van-area
        :area-list="areaList"
        :value="selectedArea"
        @confirm="onConfirmArea"
        @cancel="showArea = false"
      />
    </van-popup>
    
    <!-- 快速操作按钮 -->
    <div class="quick-actions">
      <van-button 
        plain 
        type="primary" 
        size="small" 
        icon="scan" 
        @click="scanAddress"
      >
        扫描快递单
      </van-button>
      <van-button 
        plain 
        type="primary" 
        size="small" 
        icon="records" 
        @click="showAddressText = true"
      >
        文本识别
      </van-button>
      <van-button 
        plain 
        type="primary" 
        size="small" 
        icon="location-o" 
        @click="getLocation"
      >
        定位导入
      </van-button>
    </div>
    
    <!-- 常用地址快速选择 -->
    <div v-if="frequentAddresses.length" class="frequent-addresses">
      <div class="title">常用地址</div>
      <div class="address-tags">
        <van-tag
          v-for="item in frequentAddresses"
          :key="item.id"
          plain
          type="primary"
          size="medium"
          @click="onQuickSelect(item)"
        >
          {{ item.name }} {{ formatSimpleAddress(item) }}
        </van-tag>
      </div>
    </div>
    
    <!-- 文本识别弹窗 -->
    <van-dialog
      v-model:show="showAddressText"
      title="粘贴地址文本"
      show-cancel-button
      :before-close="onAddressTextClose"
    >
      <van-field
        v-model="addressText"
        type="textarea"
        rows="4"
        placeholder="请粘贴包含姓名、电话、地址的文本"
        maxlength="200"
        show-word-limit
      />
    </van-dialog>
    
    <!-- 地址智能识别结果确认 -->
    <van-dialog
      v-model:show="showRecognizeResult"
      title="识别结果确认"
      show-cancel-button
      @confirm="onConfirmRecognize"
    >
      <div class="recognize-result">
        <van-cell-group>
          <van-field
            v-model="recognizeResult.name"
            label="收货人"
            placeholder="请确认姓名"
          />
          <van-field
            v-model="recognizeResult.tel"
            label="手机号"
            placeholder="请确认手机号"
          />
          <van-field
            v-model="recognizeResult.address"
            label="地址"
            type="textarea"
            rows="2"
            placeholder="请确认地址"
          />
        </van-cell-group>
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { areaList } from '@vant/area-data'
import { 
  getAddressList,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '@/api/address'
import { formatAddress } from '@/utils'
import AddressEdit from '@/components/address-edit/index.vue'
import { parseAddress } from '@/utils/address'
import { scanQRCode } from '@/utils/scan'
import { getLocationInfo } from '@/utils/location'

const router = useRouter()
const route = useRoute()

// 地址列表
const addressList = ref([])
const showEdit = ref(false)
const showArea = ref(false)
const currentAddress = ref(null)
const selectedArea = ref('')

// 是否从订单确认页进入
const isSelect = computed(() => route.query.select === '1')

// 排序后的地址列表
const sortedAddressList = computed(() => {
  return [...addressList.value].sort((a, b) => {
    // 默认地址排在最前
    if (a.isDefault) return -1
    if (b.isDefault) return 1
    // 按更新时间倒序
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })
})

// 加载地址列表
const loadAddressList = async () => {
  try {
    const res = await getAddressList()
    addressList.value = res
  } catch (error) {
    showToast('获取地址列表失败')
  }
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 新增地址
const onAdd = () => {
  currentAddress.value = null
  showEdit.value = true
}

// 编辑地址
const onEdit = (item) => {
  currentAddress.value = { ...item }
  showEdit.value = true
}

// 选择地址
const onSelect = (item) => {
  if (isSelect.value) {
    // 返回订单确认页并传递选中的地址
    router.replace({
      path: '/order/confirm',
      query: {
        address: JSON.stringify(item)
      }
    })
  }
}

// 设为默认地址
const setDefault = async (item) => {
  try {
    await setDefaultAddress(item.id)
    await loadAddressList()
    showToast('设置成功')
  } catch (error) {
    showToast('设置失败')
  }
}

// 删除地址
const onDelete = async (item) => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要删除这个地址吗？',
      showCancelButton: true
    })
    
    await deleteAddress(item.id)
    await loadAddressList()
    showToast('删除成功')
  } catch {
    // 取消删除
  }
}

// 确认删除（从编辑页面）
const onConfirmDelete = async (id) => {
  try {
    await deleteAddress(id)
    await loadAddressList()
    showEdit.value = false
    showToast('删除成功')
  } catch (error) {
    showToast('删除失败')
  }
}

// 提交地址
const onSubmit = async (data) => {
  try {
    if (currentAddress.value) {
      await updateAddress(currentAddress.value.id, data)
    } else {
      await createAddress(data)
    }
    
    await loadAddressList()
    showEdit.value = false
    showToast('保存成功')
  } catch (error) {
    showToast('保存失败')
  }
}

// 确认选择地区
const onConfirmArea = (values) => {
  selectedArea.value = values[values.length - 1].code
  showArea.value = false
}

// 常用地址（根据使用频率排序）
const frequentAddresses = computed(() => {
  return addressList.value
    .filter(item => item.useCount > 0)
    .sort((a, b) => b.useCount - a.useCount)
    .slice(0, 3)
})

// 文本识别相关
const showAddressText = ref(false)
const addressText = ref('')
const showRecognizeResult = ref(false)
const recognizeResult = ref({})

// 扫描快递单
const scanAddress = async () => {
  try {
    const result = await scanQRCode()
    const parsed = await parseAddress(result)
    if (parsed) {
      recognizeResult.value = parsed
      showRecognizeResult.value = true
    } else {
      showToast('未识别到有效地址')
    }
  } catch (error) {
    showToast('扫描失败')
  }
}

// 地址文本识别
const onAddressTextClose = async (action) => {
  if (action === 'confirm' && addressText.value) {
    try {
      const parsed = await parseAddress(addressText.value)
      if (parsed) {
        recognizeResult.value = parsed
        showRecognizeResult.value = true
        return false // 阻止弹窗关闭
      } else {
        showToast('未识别到有效地址')
      }
    } catch (error) {
      showToast('识别失败')
    }
  }
  addressText.value = ''
  return true
}

// 获取当前位置
const getLocation = async () => {
  try {
    showToast.loading({
      message: '定位中...',
      forbidClick: true
    })
    
    const location = await getLocationInfo()
    recognizeResult.value = {
      name: '',
      tel: '',
      province: location.province,
      city: location.city,
      county: location.district,
      addressDetail: location.address
    }
    
    showToast.clear()
    showRecognizeResult.value = true
  } catch (error) {
    showToast.clear()
    showToast('获取位置失败')
  }
}

// 确认识别结果
const onConfirmRecognize = () => {
  const { name, tel, province, city, county, addressDetail } = recognizeResult.value
  
  // 验证必填信息
  if (!name || !tel || !addressDetail) {
    showToast('请完善地址信息')
    return
  }
  
  // 创建新地址
  createAddress({
    name,
    tel,
    province,
    city,
    county,
    addressDetail
  })
}

// 快速选择地址
const onQuickSelect = (address) => {
  if (isSelect.value) {
    router.replace({
      path: '/order/confirm',
      query: {
        address: JSON.stringify(address)
      }
    })
  } else {
    // 更新使用次数
    updateAddress(address.id, {
      ...address,
      useCount: (address.useCount || 0) + 1
    })
  }
}

// 格式化简单地址
const formatSimpleAddress = (address) => {
  return `${address.province}${address.city}${address.county}`
}

// 初始化数据
onMounted(() => {
  loadAddressList()
})
</script>

<style scoped lang="scss">
.address {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
  
  .address-list {
    padding: 12px;
    
    .address-info {
      .name-tel {
        margin-bottom: 8px;
        
        .name {
          font-size: 16px;
          font-weight: bold;
          margin-right: 8px;
        }
        
        .tel {
          color: #666;
        }
      }
      
      .detail {
        font-size: 14px;
        color: #666;
        line-height: 1.5;
      }
    }
    
    .edit-icon {
      color: #999;
      font-size: 20px;
    }
  }
  
  .action-button {
    height: 100%;
  }
  
  .add-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 16px;
    background: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .quick-actions {
    padding: 12px;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  
  .frequent-addresses {
    padding: 12px;
    background: #fff;
    margin-bottom: 12px;
    
    .title {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    
    .address-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
  
  .recognize-result {
    padding: 16px;
  }
}
</style> 