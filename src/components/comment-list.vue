<template>
  <div class="comment-list">
    <!-- 评分统计 -->
    <div class="rating-stats" v-if="showStats">
      <div class="rating-overall">
        <div class="rating-score">{{ averageRating }}</div>
        <div class="rating-text">综合评分</div>
        <rate-component :model-value="averageRating" readonly />
      </div>
      <div class="rating-tags">
        <van-tag
          v-for="tag in ratingTags"
          :key="tag.name"
          :type="tag.active ? 'danger' : 'default'"
          plain
          round
          size="medium"
          @click="onTagClick(tag)"
        >
          {{ tag.name }}({{ tag.count }})
        </van-tag>
      </div>
    </div>

    <!-- 评价列表 -->
    <div class="comment-items">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="user-info">
          <van-image
            round
            width="40"
            height="40"
            :src="comment.user.avatar"
          />
          <div class="user-name">{{ comment.user.nickname }}</div>
          <div class="comment-time">{{ formatDate(comment.createdAt) }}</div>
        </div>
        <div class="comment-content">
          <rate-component v-model="comment.rating" readonly />
          <div class="comment-text">{{ comment.content }}</div>
          <div class="comment-images" v-if="comment.images?.length">
            <van-image
              v-for="(image, index) in comment.images"
              :key="index"
              width="80"
              height="80"
              :src="image"
              @click="previewImage(comment.images, index)"
            />
          </div>
          <div class="goods-spec" v-if="comment.specs">
            {{ formatSpecs(comment.specs) }}
          </div>
          <div class="comment-reply" v-if="comment.reply">
            <div class="reply-title">商家回复：</div>
            <div class="reply-content">{{ comment.reply }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { showImagePreview } from 'vant'
import { formatDate, formatSpecs } from '@/utils'
import RateComponent from './rate.vue'

const props = defineProps({
  showStats: {
    type: Boolean,
    default: true
  },
  comments: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  finished: Boolean
})

const emit = defineEmits(['load', 'tag-click'])

// 评分统计
const averageRating = computed(() => {
  if (!props.comments.length) return 0
  const total = props.comments.reduce((sum, item) => sum + item.rating, 0)
  return (total / props.comments.length).toFixed(1)
})

// 评价标签
const ratingTags = ref([
  { name: '全部', count: 0, active: true },
  { name: '好评', count: 0, active: false },
  { name: '中评', count: 0, active: false },
  { name: '差评', count: 0, active: false },
  { name: '有图', count: 0, active: false },
])

// 标签点击
const onTagClick = (tag) => {
  ratingTags.value.forEach(item => {
    item.active = item.name === tag.name
  })
  emit('tag-click', tag)
}

// 图片预览
const previewImage = (images, index) => {
  showImagePreview({
    images,
    startPosition: index
  })
}

// 加载更多
const onLoad = () => {
  emit('load')
}
</script>

<style scoped lang="scss">
.comment-list {
  .rating-stats {
    padding: 15px;
    border-bottom: 1px solid #eee;

    .rating-overall {
      text-align: center;
      margin-bottom: 15px;

      .rating-score {
        font-size: 24px;
        font-weight: bold;
        color: #ee0a24;
      }

      .rating-text {
        font-size: 12px;
        color: #999;
        margin: 5px 0;
      }
    }

    .rating-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }

  .comment-items {
    .comment-item {
      padding: 15px;
      border-bottom: 1px solid #eee;

      .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .user-name {
          margin-left: 10px;
          font-size: 14px;
          color: #333;
        }

        .comment-time {
          margin-left: auto;
          font-size: 12px;
          color: #999;
        }
      }

      .comment-content {
        .comment-text {
          margin: 10px 0;
          font-size: 14px;
          color: #333;
        }

        .comment-images {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 10px;
        }

        .goods-spec {
          font-size: 12px;
          color: #999;
          margin-bottom: 10px;
        }

        .comment-reply {
          background: #f5f5f5;
          padding: 10px;
          border-radius: 4px;

          .reply-title {
            color: #999;
            font-size: 12px;
            margin-bottom: 5px;
          }

          .reply-content {
            color: #666;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style> 