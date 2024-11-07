<template>
  <div class="home">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <van-search
        v-model="keyword"
        placeholder="请输入搜索关键词"
        shape="round"
        background="#fff"
        @focus="onSearchFocus"
      />
    </div>
    
    <!-- 轮播图 -->
    <van-swipe class="banner" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in banners" :key="item.id">
        <img :src="item.image" @click="onBannerClick(item)">
      </van-swipe-item>
    </van-swipe>
    
    <!-- 分类导航 -->
    <van-grid :column-num="5" :border="false" class="nav">
      <van-grid-item
        v-for="item in categories"
        :key="item.id"
        :icon="item.icon"
        :text="item.name"
        @click="onCategoryClick(item)"
      />
    </van-grid>
    
    <!-- 商品列表 -->
    <div class="goods-list">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/store'
import { getBannerList } from '@/api/banner'
import { getCategoryList } from '@/api/category'
import { getGoodsList } from '@/api/goods'

const router = useRouter()
const cartStore = useCartStore()

// 搜索相关
const keyword = ref('')
const onSearchFocus = () => {
  router.push('/search')
}

// 轮播图相关
const banners = ref([])
const loadBanners = async () => {
  try {
    banners.value = await getBannerList()
  } catch (error) {
    console.error('加载轮播图失败:', error)
  }
}
const onBannerClick = (banner) => {
  if (banner.url) {
    router.push(banner.url)
  }
}

// 分类相关
const categories = ref([])
const loadCategories = async () => {
  try {
    categories.value = await getCategoryList()
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}
const onCategoryClick = (category) => {
  router.push({
    path: '/category',
    query: { id: category.id }
  })
}

// 商品列表相关
const goodsList = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)
const pageSize = 10

const loadGoods = async () => {
  try {
    const res = await getGoodsList({
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
    console.error('加载商品列表失败:', error)
  } finally {
    loading.value = false
  }
}

const onLoad = () => {
  loadGoods()
}

const onRefresh = () => {
  finished.value = false
  pageNum.value = 1
  loadGoods()
}

// 商品相关
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

// 初始化数据
onMounted(async () => {
  await Promise.all([
    loadBanners(),
    loadCategories()
  ])
})
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
  
  .search-bar {
    position: sticky;
    top: 0;
    z-index: 999;
  }
  
  .banner {
    height: 150px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .nav {
    background: #fff;
    margin-bottom: 10px;
  }
  
  .goods-list {
    .van-card {
      margin-bottom: 10px;
      background: #fff;
    }
  }
}
</style> 