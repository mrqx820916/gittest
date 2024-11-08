<template>
  <div class="search-result">
    <van-nav-bar
      title="搜索结果"
      left-arrow
      @click-left="onClickLeft"
    >
      <template #right>
        <van-icon name="search" size="18" @click="onClickSearch" />
      </template>
    </van-nav-bar>
    
    <!-- 筛选栏 -->
    <van-sticky>
      <van-dropdown-menu>
        <van-dropdown-item v-model="sortType" :options="sortOptions" />
        <van-dropdown-item v-model="filterType" :options="filterOptions" />
      </van-dropdown-menu>
    </van-sticky>
    
    <!-- 商品列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-card
          v-for="item in goodsList"
          :key="item.id"
          :price="item.price"
          :title="item.title"
          :thumb="item.thumb"
          @click="onGoodsClick(item)"
        >
          <template #tags>
            <van-tag plain type="danger" v-if="item.tag">{{ item.tag }}</van-tag>
          </template>
          <template #footer>
            <van-button size="mini" @click.stop="addToCart(item)">加入购物车</van-button>
          </template>
        </van-card>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/store'
import { searchGoods } from '@/api/goods'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

// 搜索关键词
const keyword = ref(route.query.keyword || '')

// 排序和筛选
const sortType = ref(0)
const filterType = ref(0)
const sortOptions = [
  { text: '综合排序', value: 0 },
  { text: '销量优先', value: 1 },
  { text: '价格低到高', value: 2 },
  { text: '价格高到低', value: 3 }
]
const filterOptions = [
  { text: '全部商品', value: 0 },
  { text: '有货优先', value: 1 },
  { text: '促销商品', value: 2 }
]

// 商品列表
const goodsList = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)
const pageSize = 10

// 加载商品列表
const loadGoods = async () => {
  if (!keyword.value) return
  
  try {
    const res = await searchGoods({
      keyword: keyword.value,
      sortType: sortType.value,
      filterType: filterType.value,
      pageNum: pageNum.value,
      pageSize
    })
    
    if (refreshing.value) {
      goodsList.value = []
      refreshing.value = false
    }
    
    goodsList.value.push(...res.list)
    pageNum.value++
    
    if (res.list.length < pageSize) {
      finished.value = true
    }
  } catch (error) {
    showToast('加载失败')
  } finally {
    loading.value = false
  }
}

// 刷新列表
const onRefresh = () => {
  finished.value = false
  pageNum.value = 1
  loadGoods()
}

// 加载更多
const onLoad = () => {
  loadGoods()
}

// 商品点击
const onGoodsClick = (goods) => {
  router.push(`/goods/${goods.id}`)
}

// 加入购物车
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

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 点击搜索
const onClickSearch = () => {
  router.push('/search')
}

// 监听排序和筛选变化
watch([sortType, filterType], () => {
  pageNum.value = 1
  finished.value = false
  goodsList.value = []
  loadGoods()
})
</script>

<style scoped lang="scss">
.search-result {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
  
  .van-card {
    margin-bottom: 10px;
    background: #fff;
  }
}
</style> 