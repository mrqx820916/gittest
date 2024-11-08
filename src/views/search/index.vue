<template>
  <div class="search">
    <!-- 搜索栏 -->
    <van-search
      v-model="keyword"
      placeholder="请输入搜索关键词"
      show-action
      @search="onSearch"
      @cancel="onCancel"
    >
      <template #action>
        <div @click="onCancel">取消</div>
      </template>
    </van-search>
    
    <!-- 搜索历史 -->
    <div v-if="!keyword && searchHistory.length" class="search-history">
      <div class="header">
        <span>搜索历史</span>
        <van-icon name="delete" @click="clearHistory" />
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
    <div v-if="keyword" class="search-result">
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getStorage, setStorage } from '@/utils/storage'
import { getGoodsList } from '@/api/goods'
import GoodsCard from '@/components/goods-card/index.vue'

const router = useRouter()

// 搜索关键词
const keyword = ref('')
const searchHistory = ref([])

// 商品列表
const goodsList = ref([])
const loading = ref(false)
const finished = ref(false)
const pageNum = ref(1)
const pageSize = 10

// 加载搜索历史
const loadSearchHistory = () => {
  searchHistory.value = getStorage('searchHistory') || []
}

// 保存搜索历史
const saveSearchHistory = (keyword) => {
  const history = new Set([keyword, ...searchHistory.value])
  searchHistory.value = Array.from(history).slice(0, 10)
  setStorage('searchHistory', searchHistory.value)
}

// 清空搜索历史
const clearHistory = () => {
  searchHistory.value = []
  setStorage('searchHistory', [])
}

// 搜索商品
const onSearch = () => {
  if (!keyword.value) {
    showToast('请输入搜索关键词')
    return
  }
  
  saveSearchHistory(keyword.value)
  pageNum.value = 1
  finished.value = false
  goodsList.value = []
  loadGoods()
}

// 加载商品
const loadGoods = async () => {
  if (!keyword.value) return
  
  try {
    loading.value = true
    const res = await getGoodsList({
      keyword: keyword.value,
      pageNum: pageNum.value,
      pageSize
    })
    
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

// 取消搜索
const onCancel = () => {
  router.back()
}

// 点击历史记录
const onHistoryClick = (item) => {
  keyword.value = item
  onSearch()
}

// 商品点击
const onGoodsClick = (goods) => {
  router.push(`/goods/${goods.id}`)
}

const onAddCart = (goods) => {
  router.push(`/goods/${goods.id}`)
}

// 初始化
onMounted(() => {
  loadSearchHistory()
})
</script>

<style scoped lang="scss">
.search {
  min-height: 100vh;
  background: #f5f5f5;
  
  .search-history {
    background: #fff;
    padding: 12px;
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      span {
        font-size: 14px;
        color: #666;
      }
    }
    
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
  
  .search-result {
    padding: 12px;
  }
}
</style> 