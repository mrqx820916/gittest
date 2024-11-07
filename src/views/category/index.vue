<template>
  <div class="category">
    <!-- 搜索栏 -->
    <van-search
      v-model="keyword"
      placeholder="请输入搜索关键词"
      shape="round"
      @focus="onSearchFocus"
    />
    
    <div class="container">
      <!-- 左侧分类导航 -->
      <van-sidebar v-model="activeIndex">
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
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/store'
import { getCategoryList } from '@/api/category'
import { getGoodsList } from '@/api/goods'

const router = useRouter()
const cartStore = useCartStore()

// 搜索相关
const keyword = ref('')
const onSearchFocus = () => {
  router.push('/search')
}

// 分类相关
const categories = ref([])
const activeIndex = ref(0)

const loadCategories = async () => {
  try {
    categories.value = await getCategoryList()
  } catch (error) {
    console.error('加载分类失败:', error)
  }
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
    const currentCategory = categories.value[activeIndex.value]
    if (!currentCategory) return
    
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

// 监听分类切换
watch(activeIndex, () => {
  pageNum.value = 1
  finished.value = false
  goodsList.value = []
  loadGoods()
})

// 初始化数据
onMounted(async () => {
  await loadCategories()
})
</script>

<style scoped lang="scss">
.category {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
  
  .container {
    display: flex;
    height: calc(100vh - 54px - 50px);
    
    .van-sidebar {
      width: 85px;
      height: 100%;
      overflow-y: auto;
    }
    
    .content {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      padding: 10px;
      
      .van-card {
        margin-bottom: 10px;
        background: #fff;
      }
    }
  }
}
</style> 