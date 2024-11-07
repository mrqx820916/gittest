<template>
  <div class="search">
    <van-search
      v-model="keyword"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
    />
    
    <!-- 搜索历史 -->
    <div class="history" v-if="!keyword && searchHistory.length">
      <div class="header">
        <span>搜索历史</span>
        <van-icon name="delete-o" @click="clearHistory" />
      </div>
      <div class="tags">
        <van-tag
          v-for="item in searchHistory"
          :key="item"
          plain
          type="primary"
          size="medium"
          @click="onHistoryClick(item)"
        >
          {{ item }}
        </van-tag>
      </div>
    </div>
    
    <!-- 搜索结果 -->
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
          <template #footer>
            <van-button size="mini" @click.stop="addToCart(item)">加入购物车</van-button>
          </template>
        </van-card>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'

const route = useRoute()
const router = useRouter()
const keyword = ref(route.query.keyword || '')
const searchHistory = ref([])
const goodsList = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const pageNum = ref(1)
const pageSize = 10

onMounted(() => {
  loadSearchHistory()
  if (keyword.value) {
    onSearch(keyword.value)
  }
})

const loadSearchHistory = () => {
  const history = localStorage.getItem('searchHistory')
  if (history) {
    searchHistory.value = JSON.parse(history)
  }
}

const saveSearchHistory = (keyword) => {
  const history = new Set([keyword, ...searchHistory.value])
  searchHistory.value = Array.from(history).slice(0, 10)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

const clearHistory = () => {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

const onSearch = (value) => {
  if (!value.trim()) return
  keyword.value = value
  saveSearchHistory(value)
  pageNum.value = 1
  finished.value = false
  goodsList.value = []
  onLoad()
}

const onCancel = () => {
  router.back()
}

const onHistoryClick = (value) => {
  keyword.value = value
  onSearch(value)
}

const onLoad = async () => {
  try {
    const res = await searchGoods({
      keyword: keyword.value,
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
    console.error('搜索商品失败:', error)
  } finally {
    loading.value = false
  }
}

const onRefresh = () => {
  pageNum.value = 1
  finished.value = false
  onLoad()
}

const onGoodsClick = (goods) => {
  router.push(`/goods/${goods.id}`)
}

const addToCart = (goods) => {
  showToast('加入购物车成功')
}
</script>

<style scoped lang="scss">
.search {
  min-height: 100vh;
  background: #f5f5f5;
  
  .history {
    background: #fff;
    padding: 15px;
    margin-bottom: 10px;
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      
      span {
        font-size: 14px;
        color: #666;
      }
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
  
  :deep(.van-card) {
    margin-bottom: 10px;
    background: #fff;
  }
}
</style> 