<template>
  <div class="address-edit">
    <van-nav-bar
      :title="isEdit ? '编辑地址' : '新增地址'"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <van-address-edit
      :area-list="areaList"
      :address-info="addressInfo"
      show-delete
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      @change-detail="onChangeDetail"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { areaList } from '@vant/area-data'

const route = useRoute()
const router = useRouter()
const searchResult = ref([])

const isEdit = computed(() => !!route.query.id)

const addressInfo = ref({
  name: '',
  tel: '',
  province: '',
  city: '',
  county: '',
  addressDetail: '',
  areaCode: '',
  postalCode: '',
  isDefault: false
})

const onClickLeft = () => {
  router.back()
}

const onSave = async (content) => {
  try {
    // TODO: 调用保存地址接口
    showToast('保存成功')
    router.back()
  } catch (error) {
    showToast('保存失败')
  }
}

const onDelete = async () => {
  try {
    await showConfirmDialog({
      title: '提示',
      message: '确定要删除此地址吗？'
    })
    
    // TODO: 调用删除地址接口
    showToast('删除成功')
    router.back()
  } catch {
    // 取消删除
  }
}

const onChangeDetail = (val) => {
  if (val) {
    // TODO: 调用地址搜索接口
    searchResult.value = [
      {
        name: '杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
        address: '杭州市西湖区'
      }
    ]
  } else {
    searchResult.value = []
  }
}
</script>

<style scoped lang="scss">
.address-edit {
  min-height: 100vh;
  background: #f5f5f5;
}
</style> 