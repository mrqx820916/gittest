<template>
  <div class="order-comment">
    <van-nav-bar
      title="评价订单"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 商品列表 -->
    <van-cell-group inset class="goods-list">
      <div
        v-for="item in order.goods"
        :key="item.id"
        class="goods-item"
      >
        <!-- 商品信息 -->
        <van-card
          :num="item.quantity"
          :price="item.price"
          :title="item.title"
          :thumb="item.thumb"
        >
          <template #tags>
            <van-tag plain type="danger" v-if="item.specs">
              {{ formatSpecs(item.specs) }}
            </van-tag>
          </template>
        </van-card>
        
        <!-- 评分 -->
        <div class="rating-box">
          <span class="label">商品评分</span>
          <rate-component v-model="item.rating" />
        </div>
        
        <!-- 评价内容 -->
        <div class="comment-box">
          <van-field
            v-model="item.content"
            rows="3"
            autosize
            type="textarea"
            maxlength="200"
            placeholder="请输入评价内容"
            show-word-limit
          />
        </div>
        
        <!-- 图片上传 -->
        <div class="upload-box">
          <van-uploader
            v-model="item.images"
            multiple
            :max-count="6"
            :after-read="afterRead"
          />
        </div>
      </div>
    </van-cell-group>
    
    <!-- 匿名评价 -->
    <van-cell-group inset class="anonymous-box">
      <van-cell title="匿名评价">
        <template #right-icon>
          <van-switch v-model="anonymous" size="24" />
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 提交按钮 -->
    <div class="submit-bar">
      <van-button 
        type="danger" 
        block 
        :loading="submitting"
        :disabled="!isValid"
        @click="onSubmit"
      >
        提交评价
      </van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getOrderDetail } from '@/api/order'
import { createComment } from '@/api/comment'
import { uploadFile } from '@/utils/upload'
import { formatSpecs } from '@/utils'
import RateComponent from '@/components/rate.vue'

const route = useRoute()
const router = useRouter()

// 订单数据
const order = ref({
  goods: []
})
const anonymous = ref(false)
const submitting = ref(false)

// 获取订单详情
const loadOrderDetail = async () => {
  try {
    const res = await getOrderDetail(route.params.id)
    order.value = {
      ...res,
      goods: res.goods.map(item => ({
        ...item,
        rating: 5,
        content: '',
        images: []
      }))
    }
  } catch (error) {
    showToast('获取订单详情失败')
    router.back()
  }
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 图片上传
const afterRead = async (file) => {
  try {
    file.status = 'uploading'
    const url = await uploadFile(file.file)
    file.url = url
    file.status = 'done'
  } catch (error) {
    file.status = 'failed'
    showToast('图片上传失败')
  }
}

// 验证表单
const isValid = computed(() => {
  return order.value.goods.every(item => {
    return item.rating > 0 && item.content.trim()
  })
})

// 提交评价
const onSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  
  try {
    // 提交每个商品的评价
    await Promise.all(order.value.goods.map(item => {
      return createComment({
        orderId: order.value.id,
        goodsId: item.id,
        rating: item.rating,
        content: item.content,
        images: item.images.map(img => img.url),
        anonymous: anonymous.value
      })
    }))
    
    showToast('评价成功')
    router.replace('/order/list?type=5')
  } catch (error) {
    showToast('评价失败')
  } finally {
    submitting.value = false
  }
}

// 初始化数据
onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped lang="scss">
.order-comment {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 100px;
  
  .goods-list {
    margin-top: 12px;
    
    .goods-item {
      padding: 15px;
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
      
      .rating-box {
        display: flex;
        align-items: center;
        margin: 15px 0;
        
        .label {
          margin-right: 10px;
          font-size: 14px;
          color: #666;
        }
      }
      
      .comment-box {
        margin-bottom: 15px;
      }
      
      .upload-box {
        margin-bottom: 15px;
      }
    }
  }
  
  .anonymous-box {
    margin-top: 12px;
  }
  
  .submit-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 16px;
    background: #fff;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }
}
</style> 