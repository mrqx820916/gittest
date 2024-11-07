<template>
  <div class="category">
    <van-nav-bar title="商品分类" />
    
    <van-tree-select
      v-model:active-id="activeId"
      v-model:main-active-index="activeIndex"
      :items="categories"
      height="calc(100vh - 46px)"
    >
      <template #content>
        <div class="category-content">
          <van-grid :column-num="3" :border="false">
            <van-grid-item
              v-for="item in subCategories"
              :key="item.id"
              :text="item.name"
              @click="onItemClick(item)"
            >
              <template #icon>
                <img :src="item.image" />
              </template>
            </van-grid-item>
          </van-grid>
        </div>
      </template>
    </van-tree-select>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeId = ref('')
const activeIndex = ref(0)

// 模拟分类数据
const categories = ref([
  {
    text: '水果',
    children: [
      { id: 1, name: '苹果', image: '/apple.png' },
      { id: 2, name: '香蕉', image: '/banana.png' },
      { id: 3, name: '橙子', image: '/orange.png' }
    ]
  },
  {
    text: '蔬菜',
    children: [
      { id: 4, name: '白菜', image: '/cabbage.png' },
      { id: 5, name: '胡萝卜', image: '/carrot.png' },
      { id: 6, name: '土豆', image: '/potato.png' }
    ]
  }
])

const subCategories = computed(() => {
  return categories.value[activeIndex.value]?.children || []
})

const onItemClick = (item) => {
  router.push(`/category/${item.id}`)
}
</script>

<style scoped lang="scss">
.category {
  height: 100vh;
  background: #fff;
  
  .category-content {
    padding: 10px;
    
    img {
      width: 60px;
      height: 60px;
    }
  }
}
</style> 