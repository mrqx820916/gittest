<template>
  <div class="collect">
    <van-nav-bar
      title="我的收藏"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-card
          v-for="item in collectList"
          :key="item.id"
          :price="item.price"
          :title="item.title"
          :thumb="item.thumb"
          @click="onGoodsClick(item)"
        >
          <template #footer>
            <van-button size="mini" @click.stop="addToCart(item)">加入购物车</van-button>
            <van-button size="mini" type="danger" plain @click.stop="cancelCollect(item)">取消收藏</van-button>
          </template>
        </van-card>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/store'
import { getCollectList, cancelCollect } from '@/api/collect'

const router = useRouter()
const cartStore = useCartStore()

const collectList = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)
const pageSize = 10

const onClickLeft = () => {
  router.back()
}

const loadData = async () => {
  try {
    const res = await getCollectList({
      pageNum: pageNum.value,
      pageSize
    })
    
    if (refreshing.value) {
      collectList.value = []
      refreshing.value = false
    }
    
    collectList.value.push(...res.list)
    pageNum.value++
    
    if (res.list.length < pageSize) {
      finished.value = true
    }
  } catch (error) {
    console.error('加载收藏列表失败:', error)
  } finally {
    loading.value = false
  }
}

const onLoad = () => {
  loadData()
}

const onRefresh = () => {
  finished.value = false
  pageNum.value = 1
  loadData()
}

const onGoodsClick = (goods) => {
  router.push(`/goods/${goods.id}`)
}

const addToCart = (goods) => {
  cartStore.addToCart({
    id: goods.id,
    title: goods.title,
    price: goods.price,
    thumb: goods.thumb,
    quantity: 1
  })
  showToast('已加入购物车')
}

const cancelCollect = async (goods) => {
  try {
    await cancelCollect(goods.id)
    showToast('取消收藏成功')
    const index = collectList.value.findIndex(item => item.id === goods.id)
    if (index > -1) {
      collectList.value.splice(index, 1)
    }
  } catch (error) {
    showToast('取消收藏失败')
  }
}
</script>

<style scoped lang="scss">
.collect {
  min-height: 100vh;
  background: #f5f5f5;
  
  .van-card {
    margin: 10px;
    background: #fff;
    
    :deep(.van-card__footer) {
      display: flex;
      gap: 10px;
    }
  }
}
</style> 