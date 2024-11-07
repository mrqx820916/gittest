<template>
  <div class="cart">
    <van-nav-bar title="购物车" />
    
    <!-- 购物车为空时显示 -->
    <van-empty
      v-if="!cartList.length"
      description="购物车还是空的"
      image="cart"
    >
      <van-button round type="danger" to="/" class="go-shopping">
        去逛逛
      </van-button>
    </van-empty>
    
    <!-- 购物车列表 -->
    <template v-else>
      <van-checkbox-group v-model="checkedGoods" class="card-list">
        <van-swipe-cell v-for="item in cartList" :key="item.id">
          <van-card
            :price="item.price"
            :title="item.title"
            :thumb="item.thumb"
          >
            <template #tags>
              <van-tag type="danger" v-if="item.tag">{{ item.tag }}</van-tag>
            </template>
            
            <template #num>
              <van-stepper
                v-model="item.quantity"
                :min="1"
                :max="99"
                @change="updateQuantity(item)"
              />
            </template>
            
            <template #checkbox>
              <van-checkbox :name="item.id" />
            </template>
          </van-card>
          
          <template #right>
            <van-button
              square
              text="删除"
              type="danger"
              class="delete-button"
              @click="removeFromCart(item)"
            />
          </template>
        </van-swipe-cell>
      </van-checkbox-group>
      
      <!-- 提交订单栏 -->
      <van-submit-bar
        :price="totalPrice * 100"
        :button-text="submitButtonText"
        :disabled="!checkedGoods.length"
        @submit="onSubmit"
      >
        <van-checkbox v-model="checkedAll" @click="toggleAll">
          全选
        </van-checkbox>
      </van-submit-bar>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/store/modules/cart'

const router = useRouter()
const cartStore = useCartStore()

const checkedGoods = ref([])
const cartList = computed(() => cartStore.items)

// 计算总价
const totalPrice = computed(() => {
  return cartList.value.reduce((total, item) => {
    if (checkedGoods.value.includes(item.id)) {
      return total + item.price * item.quantity
    }
    return total
  }, 0)
})

// 是否全选
const checkedAll = computed({
  get() {
    return cartList.value.length === checkedGoods.value.length
  },
  set(value) {
    checkedGoods.value = value
      ? cartList.value.map(item => item.id)
      : []
  }
})

// 提交按钮文字
const submitButtonText = computed(() => {
  const count = checkedGoods.value.length
  return count ? `结算(${count})` : '结算'
})

// 更新商品数量
const updateQuantity = (item) => {
  // TODO: 调用接口更新购物车
  showToast('更新成功')
}

// 从购物车移除
const removeFromCart = (item) => {
  cartStore.removeFromCart(item.id)
  showToast('删除成功')
}

// 全选/取消全选
const toggleAll = () => {
  checkedAll.value = !checkedAll.value
}

// 提交订单
const onSubmit = () => {
  if (!checkedGoods.value.length) {
    showToast('请选择商品')
    return
  }
  
  // TODO: 跳转到订单确认页
  router.push({
    path: '/order/confirm',
    query: {
      goods: checkedGoods.value.join(',')
    }
  })
}
</script>

<style scoped lang="scss">
.cart {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
  
  .go-shopping {
    margin-top: 20px;
  }
  
  .card-list {
    padding: 10px;
    
    .van-card {
      margin-bottom: 10px;
      background: #fff;
    }
  }
  
  .delete-button {
    height: 100%;
  }
  
  :deep(.van-submit-bar) {
    bottom: 50px;
  }
}
</style> 