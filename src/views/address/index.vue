<template>
  <div class="address">
    <van-nav-bar
      title="收货地址"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <van-address-list
      v-model="selectedAddressId"
      :list="addressList"
      default-tag-text="默认"
      @add="onAdd"
      @edit="onEdit"
      @select="onSelect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedAddressId = ref('')
const addressList = ref([])

const onClickLeft = () => {
  router.back()
}

const onAdd = () => {
  router.push('/address/edit')
}

const onEdit = (item) => {
  router.push({
    path: '/address/edit',
    query: { id: item.id }
  })
}

const onSelect = (item) => {
  router.back()
}
</script>

<style scoped lang="scss">
.address {
  min-height: 100vh;
  background: #f5f5f5;
}
</style> 