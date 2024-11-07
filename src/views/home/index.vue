<template>
  <div class="home">
    <!-- 顶部搜索栏 -->
    <van-search
      v-model="searchValue"
      placeholder="请输入搜索关键词"
      shape="round"
      @search="onSearch"
    />
    
    <!-- 骨架屏 -->
    <van-skeleton title avatar :row="3" :loading="initialLoading">
      <!-- 轮播图 -->
      <van-swipe class="banner" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="item in banners" :key="item.id">
          <img :src="item.image" lazy-load />
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
            :tag="item.tag"
            :desc="item.desc"
            @click="onGoodsClick(item)"
          >
            <template #footer>
              <van-button size="mini" @click.stop="addToCart(item)">加入购物车</van-button>
            </template>
          </van-card>
        </van-list>
      </van-pull-refresh>
    </van-skeleton>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getBanners, getGoodsList } from '@/api/home'
import { getCategoryList } from '@/api/category'

const router = useRouter()
const searchValue = ref('')
const banners = ref([])
const categories = ref([])
const goodsList = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const initialLoading = ref(true)
const pageNum = ref(1)
const pageSize = 10

// 初始化数据
onMounted(async () => {
  try {
    const [bannerRes, categoryRes] = await Promise.all([
      getBanners(),
      getCategoryList()
    ])
    banners.value = bannerRes
    categories.value = categoryRes
  } catch (error) {
    console.error('初始化数据失败:', error)
  } finally {
    initialLoading.value = false
  }
})

// 搜索
const onSearch = (value) => {
  router.push({
    path: '/search',
    query: { keyword: value }
  })
}

// 加载更多
const onLoad = async () => {
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

// 刷新
const onRefresh = () => {
  finished.value = false
  pageNum.value = 1
  onLoad()
}

// 点击分类
const onCategoryClick = (category) => {
  router.push(`/category/${category.id}`)
}

// 点击商品
const onGoodsClick = (goods) => {
  router.push(`/goods/${goods.id}`)
}

// 加入购物车
const addToCart = (goods) => {
  showToast('加入购物车成功')
}
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: #f5f5f5;
  
  .banner {
    height: 200px;
    margin-bottom: 10px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  :deep(.van-card) {
    margin-bottom: 10px;
    background: #fff;
  }
}
</style> 