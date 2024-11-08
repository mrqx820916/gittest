<template>
  <div class="comment-list">
    <!-- 评价标签 -->
    <div class="tags">
      <span
        v-for="tag in tags"
        :key="tag.type"
        class="tag"
        :class="{ active: activeTag === tag.type }"
        @click="onTagClick(tag.type)"
      >
        {{ tag.text }}
        <span class="count">({{ tag.count }})</span>
      </span>
    </div>
    
    <!-- 评价列表 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div
        v-for="item in list"
        :key="item.id"
        class="comment-item"
      >
        <!-- 用户信息 -->
        <div class="user-info">
          <van-image
            round
            width="32"
            height="32"
            :src="item.user.avatar"
          />
          <span class="nickname">{{ item.user.nickname }}</span>
          <van-rate
            v-model="item.rating"
            readonly
            size="12"
          />
        </div>
        
        <!-- 评价内容 -->
        <div class="content">{{ item.content }}</div>
        
        <!-- 评价图片 -->
        <div v-if="item.images?.length" class="images">
          <van-image
            v-for="(image, index) in item.images"
            :key="index"
            width="80"
            height="80"
            :src="image"
            @click="previewImage(item.images, index)"
          />
        </div>
        
        <!-- 商品规格 -->
        <div class="specs">
          {{ formatSpecs(item.specs) }}
        </div>
        
        <!-- 评价时间 -->
        <div class="time">{{ formatDate(item.createdAt) }}</div>
        
        <!-- 商家回复 -->
        <div v-if="item.reply" class="reply">
          <span class="label">商家回复：</span>
          {{ item.reply.content }}
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showImagePreview } from 'vant'
import { formatDate, formatSpecs } from '@/utils'

const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  finished: Boolean
})

const emit = defineEmits(['load', 'tag-click'])

// 评价标签
const activeTag = ref('all')
const tags = computed(() => [
  { type: 'all', text: '全部', count: props.comments.length },
  { type: 'good', text: '好评', count: props.comments.filter(item => item.rating >= 4).length },
  { type: 'middle', text: '中评', count: props.comments.filter(item => item.rating === 3).length },
  { type: 'bad', text: '差评', count: props.comments.filter(item => item.rating <= 2).length },
  { type: 'hasImage', text: '有图', count: props.comments.filter(item => item.images?.length).length }
])

// 评价列表
const list = computed(() => {
  if (activeTag.value === 'all') return props.comments
  if (activeTag.value === 'good') return props.comments.filter(item => item.rating >= 4)
  if (activeTag.value === 'middle') return props.comments.filter(item => item.rating === 3)
  if (activeTag.value === 'bad') return props.comments.filter(item => item.rating <= 2)
  if (activeTag.value === 'hasImage') return props.comments.filter(item => item.images?.length)
  return props.comments
})

// 切换标签
const onTagClick = (type) => {
  activeTag.value = type
  emit('tag-click', type)
}

// 加载更多
const onLoad = () => {
  emit('load')
}

// 预览图片
const previewImage = (images, index) => {
  showImagePreview({
    images,
    startPosition: index
  })
}
</script>

<style scoped lang="scss">
.comment-list {
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    background: #fff;
    
    .tag {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #666;
      background: #f5f5f5;
      cursor: pointer;
      
      &.active {
        color: $primary-color;
        background: rgba($primary-color, 0.1);
      }
      
      .count {
        color: #999;
      }
    }
  }
  
  .comment-item {
    padding: 16px;
    background: #fff;
    margin-bottom: 8px;
    
    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      .nickname {
        margin: 0 8px;
        font-size: 14px;
        color: #333;
      }
    }
    
    .content {
      font-size: 14px;
      color: #333;
      line-height: 1.5;
      margin-bottom: 8px;
    }
    
    .images {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .specs {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
    }
    
    .time {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
    }
    
    .reply {
      font-size: 12px;
      color: #666;
      background: #f5f5f5;
      padding: 8px;
      border-radius: 4px;
      
      .label {
        color: #999;
      }
    }
  }
}
</style> 