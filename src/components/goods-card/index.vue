<template>
  <div class="goods-card" @click="onClick">
    <!-- 商品图片 -->
    <van-image
      :src="goods.thumb"
      class="goods-img"
      fit="cover"
      lazy-load
    >
      <template #loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>
    
    <!-- 商品信息 -->
    <div class="goods-info">
      <!-- 商品标题 -->
      <div class="goods-title">{{ goods.title }}</div>
      
      <!-- 商品标签 -->
      <div class="goods-tags" v-if="goods.tags?.length">
        <van-tag 
          v-for="tag in goods.tags"
          :key="tag"
          plain
          type="danger"
          size="mini"
        >
          {{ tag }}
        </van-tag>
      </div>
      
      <!-- 商品价格 -->
      <div class="goods-price">
        <span class="price">
          <span class="symbol">¥</span>
          <span class="number">{{ goods.price }}</span>
        </span>
        <span class="original-price" v-if="goods.originalPrice">
          ¥{{ goods.originalPrice }}
        </span>
      </div>
      
      <!-- 销量和评分 -->
      <div class="goods-bottom">
        <span class="sales">销量 {{ goods.sales }}</span>
        <template v-if="goods.rating">
          <van-rate 
            v-model="goods.rating" 
            readonly 
            size="12" 
            color="#ee0a24"
            void-icon="star"
            void-color="#eee"
          />
        </template>
      </div>
    </div>
    
    <!-- 购物车按钮 -->
    <div 
      v-if="showCart" 
      class="cart-btn"
      @click.stop="onAddCart"
    >
      <van-icon name="cart-o" />
    </div>
  </div>
</template>

<script setup>
import { showToast } from 'vant'
import { useCartStore } from '@/store'

const props = defineProps({
  goods: {
    type: Object,
    required: true
  },
  showCart: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click', 'add-cart'])

const cartStore = useCartStore()

// 点击商品卡片
const onClick = () => {
  emit('click', props.goods)
}

// 添加到购物车
const onAddCart = () => {
  // 如果商品有规格，则不能直接加入购物车
  if (props.goods.specs?.length) {
    emit('add-cart', props.goods)
    return
  }
  
  // 检查库存
  if (props.goods.stock <= 0) {
    showToast('商品库存不足')
    return
  }
  
  cartStore.addToCart({
    id: props.goods.id,
    title: props.goods.title,
    price: props.goods.price,
    thumb: props.goods.thumb,
    quantity: 1
  })
  
  showToast('已加入购物车')
}
</script>

<style scoped lang="scss">
.goods-card {
  position: relative;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  
  .goods-img {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
  }
  
  .goods-info {
    padding: 8px;
    
    .goods-title {
      font-size: 14px;
      line-height: 20px;
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    
    .goods-tags {
      margin-top: 4px;
      
      .van-tag {
        margin-right: 4px;
      }
    }
    
    .goods-price {
      margin-top: 4px;
      display: flex;
      align-items: baseline;
      
      .price {
        color: $primary-color;
        
        .symbol {
          font-size: 12px;
        }
        
        .number {
          font-size: 16px;
          font-weight: bold;
        }
      }
      
      .original-price {
        margin-left: 4px;
        font-size: 12px;
        color: #999;
        text-decoration: line-through;
      }
    }
    
    .goods-bottom {
      margin-top: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .sales {
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .cart-btn {
    position: absolute;
    right: 8px;
    bottom: 8px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 50%;
    background: $primary-color;
    color: #fff;
    font-size: 14px;
  }
}
</style> 