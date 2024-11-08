<template>
  <div class="address-edit">
    <van-nav-bar
      :title="isEdit ? '编辑地址' : '新增地址'"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 地址编辑表单 -->
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      :show-delete="isEdit"
      :show-set-default="true"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { areaList } from '@vant/area-data'
import { getAddressDetail, createAddress, updateAddress, deleteAddress } from '@/api/address'

const router = useRouter()
const route = useRoute()

// 判断是否编辑模式
const isEdit = computed(() => !!route.query.id)

// 地址信息
const addressInfo = ref({
  name: '',
  tel: '',
  province: '',
  city: '',
  county: '',
  addressDetail: '',
  areaCode: '',
  isDefault: false
})

// 加载地址详情
const loadAddressDetail = async () => {
  if (!isEdit.value) return
  
  try {
    const res = await getAddressDetail(route.query.id)
    addressInfo.value = {
      id: res.id,
      name: res.name,
      tel: res.tel,
      province: res.province,
      city: res.city,
      county: res.county,
      addressDetail: res.addressDetail,
      areaCode: res.areaCode,
      isDefault: res.isDefault
    }
  } catch (error) {
    showToast('获取地址详情失败')
    router.back()
  }
}

// 保存地址
const onSave = async (content) => {
  try {
    if (isEdit.value) {
      await updateAddress(route.query.id, content)
    } else {
      await createAddress(content)
    }
    
    showToast('保存成功')
    router.back()
  } catch (error) {
    showToast('保存失败')
  }
}

// 删除地址
const onDelete = async () => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要删除此地址吗？',
      showCancelButton: true
    })
    
    await deleteAddress(route.query.id)
    showToast('删除成功')
    router.back()
  } catch {
    // 取消删除
  }
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 初始化数据
onMounted(() => {
  loadAddressDetail()
})
</script>

<style scoped lang="scss">
.address-edit {
  min-height: 100vh;
  background: #f5f5f5;
}
</style> 