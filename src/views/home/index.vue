<template>
  <div class="home">
    <!-- 搜索栏 -->
    <van-search
      v-model="keyword"
      placeholder="请输入搜索关键词"
      readonly
      @click="onSearch"
    />
    
    <!-- 轮播图 -->
    <van-swipe class="banner" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="item in banners" :key="item.id" @click="onBannerClick(item)">
        <van-image :src="item.image" fit="cover" />
      </van-swipe-item>
    </van-swipe>
    
    <!-- 分类导航 -->
    <van-grid :column-num="5" :border="false">
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
          <van-grid :column-num="2" :gutter="10">
            <van-grid-item
              v-for="item in goodsList"
              :key="item.id"
            >
              <goods-card
                :goods="item"
                @click="onGoodsClick(item)"
                @add-cart="onAddCart"
              />
            </van-grid-item>
          </van-grid>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getBanners } from '@/api/banner'
import { getCategories, getGoodsList } from '@/api/goods'
import GoodsCard from '@/components/goods-card/index.vue'

const router = useRouter()

// 搜索相关
const keyword = ref('')
const onSearch = () => {
  router.push('/search')
}

// 轮播图数据
const banners = ref([])
const loadBanners = async () => {
  try {
    const res = await getBanners()
    banners.value = res
  } catch (error) {
    console.error('获取轮播图失败:', error)
  }
}

// 分类数据
const categories = ref([])
const loadCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

// 商品列表
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
    console.error('获取商品列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 下拉刷新
const onRefresh = () => {
  finished.value = false
  pageNum.value = 1
  loadGoods()
}

// 加载更多
const onLoad = () => {
  if (refreshing.value) {
    return
  }
  loadGoods()
}

// 点击事件处理
const onBannerClick = (banner) => {
  if (banner.url) {
    router.push(banner.url)
  }
}

const onCategoryClick = (category) => {
  router.push({
    path: '/category',
    query: { id: category.id }
  })
}

const onGoodsClick = (goods) => {
  router.push(`/goods/${goods.id}`)
}

const onAddCart = (goods) => {
  router.push(`/goods/${goods.id}`)
}

// 初始化数据
onMounted(() => {
  loadBanners()
  loadCategories()
})
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
  
  .banner {
    height: 150px;
    
    .van-image {
      width: 100%;
      height: 100%;
    }
  }
  
  .goods-list {
    padding: 12px;
  }
}
</style> 