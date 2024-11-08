<template>
  <div class="category">
    <!-- 搜索栏 -->
    <van-search
      v-model="keyword"
      placeholder="请输入搜索关键词"
      readonly
      @click="onSearch"
    />
    
    <div class="container">
      <!-- 左侧分类导航 -->
      <van-sidebar v-model="activeCategory" class="sidebar">
        <van-sidebar-item
          v-for="item in categories"
          :key="item.id"
          :title="item.name"
        />
      </van-sidebar>
      
      <!-- 右侧商品列表 -->
      <div class="content">
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
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { getCategories, getGoodsList } from '@/api/goods'
import GoodsCard from '@/components/goods-card/index.vue'

const router = useRouter()
const route = useRoute()

// 搜索相关
const keyword = ref('')
const onSearch = () => {
  router.push('/search')
}

// 分类数据
const categories = ref([])
const activeCategory = ref(0)

// 商品列表
const goodsList = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)
const pageSize = 10

// 加载分类
const loadCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res
    
    // 如果有 id 参数，设置对应的分类
    if (route.query.id) {
      const index = categories.value.findIndex(item => item.id === route.query.id)
      if (index > -1) {
        activeCategory.value = index
      }
    }
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

// 加载商品
const loadGoods = async () => {
  if (!categories.value.length) return
  
  try {
    const currentCategory = categories.value[activeCategory.value]
    const res = await getGoodsList({
      category: currentCategory.id,
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

// 商品点击
const onGoodsClick = (goods) => {
  router.push(`/goods/${goods.id}`)
}

const onAddCart = (goods) => {
  router.push(`/goods/${goods.id}`)
}

// 监听分类切换
watch(activeCategory, () => {
  pageNum.value = 1
  finished.value = false
  goodsList.value = []
  loadGoods()
})

// 初始化
onMounted(() => {
  loadCategories()
})
</script>

<style scoped lang="scss">
.category {
  min-height: 100vh;
  background: #f5f5f5;
  
  .container {
    display: flex;
    height: calc(100vh - 54px);
    
    .sidebar {
      flex: none;
      width: 85px;
      background: #fff;
    }
    
    .content {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
    }
  }
}
</style> 