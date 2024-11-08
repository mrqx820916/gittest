<template>
  <div class="cart">
    <!-- 导航栏 -->
    <van-nav-bar title="购物车" />
    
    <!-- 购物车为空 -->
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
      <!-- 失效商品 -->
      <div v-if="invalidList.length" class="invalid-goods">
        <div class="header">
          <span>失效商品 {{ invalidList.length }}件</span>
          <span class="clear" @click="clearInvalid">清空失效商品</span>
        </div>
        <van-swipe-cell v-for="item in invalidList" :key="item.id">
          <van-card
            :price="item.price"
            :title="item.title"
            :thumb="item.thumb"
          >
            <template #tags>
              <van-tag type="danger">已失效</van-tag>
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
      </div>
      
      <!-- 有效商品 -->
      <van-checkbox-group v-model="checkedGoods" class="goods-list">
        <van-swipe-cell v-for="(item, index) in validList" :key="item.id">
          <van-card
            :price="item.price"
            :title="item.title"
            :thumb="item.thumb"
          >
            <template #tags>
              <van-tag plain type="danger" v-if="item.specs">
                {{ formatSpecs(item.specs) }}
              </van-tag>
              <van-tag type="warning" v-if="item.stock < 5">
                库存不足
              </van-tag>
            </template>
            
            <template #num>
              <van-stepper
                v-model="item.quantity"
                :min="1"
                :max="item.stock"
                :disabled="item.stock < 1"
                @change="updateQuantity(index, $event)"
              />
            </template>
            
            <template #checkbox>
              <van-checkbox
                :name="item.id"
                :disabled="item.stock < 1"
              />
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
      
      <!-- 配送时间选择 -->
      <van-cell-group inset class="delivery-time">
        <van-cell title="配送时间" is-link @click="showDeliveryPicker = true">
          <template #value>
            <span v-if="selectedTime">{{ selectedTime }}</span>
            <span v-else class="text-gray">请选择配送时间</span>
          </template>
        </van-cell>
      </van-cell-group>
      
      <!-- 优惠券选择 -->
      <van-cell-group inset>
        <van-cell title="优惠券" is-link @click="showCoupon = true">
          <template #value>
            <span v-if="selectedCoupon">
              -￥{{ selectedCoupon.amount }}
            </span>
            <span v-else class="text-gray">
              {{ availableCoupons.length }}张可用
            </span>
          </template>
        </van-cell>
      </van-cell-group>
      
      <!-- 提交订单栏 -->
      <van-submit-bar
        :price="finalPrice * 100"
        :button-text="submitButtonText"
        :disabled="!checkedGoods.length"
        @submit="onSubmit"
      >
        <van-checkbox v-model="checkedAll" @click="toggleAll">
          全选
        </van-checkbox>
      </van-submit-bar>
    </template>
    
    <!-- 配送时间选择器 -->
    <van-popup
      v-model:show="showDeliveryPicker"
      position="bottom"
      round
    >
      <van-time-picker
        v-model="deliveryTime"
        title="选择配送时间"
        :min-hour="9"
        :max-hour="22"
        @confirm="onConfirmDelivery"
        @cancel="showDeliveryPicker = false"
      />
    </van-popup>
    
    <!-- 优惠券列表 -->
    <van-popup
      v-model:show="showCoupon"
      position="bottom"
      round
    >
      <van-coupon-list
        :coupons="availableCoupons"
        :chosen-coupon="selectedCouponIndex"
        @change="onCouponChange"
        @exchange="onCouponExchange"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useCartStore, useUserStore } from '@/store'
import { getStorage, setStorage } from '@/utils/storage'
import { checkGoodsStock } from '@/api/goods'

const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

// 购物车列表
const cartList = computed(() => cartStore.items)

// 分离有效和失效商品
const validList = computed(() => cartList.value.filter(item => !item.invalid))
const invalidList = computed(() => cartList.value.filter(item => item.invalid))

// 选中的商品
const checkedGoods = ref([])

// 本地缓存购物车数据
watch(() => cartList.value, (list) => {
  setStorage('cart', list)
}, { deep: true })

// 更新商品数量
const updateQuantity = async (index, quantity) => {
  const item = cartList.value[index]
  // 检查库存
  try {
    const stockInfo = await checkGoodsStock([item.id])
    const stock = stockInfo[item.id]
    if (!stock) {
      item.invalid = true
      item.invalidReason = '商品已下架'
      showToast('商品已下架')
      return
    }
    if (quantity > stock) {
      quantity = stock
      showToast('库存不足')
    }
  } catch (error) {
    console.error('检查库存失败:', error)
  }
  
  cartStore.updateQuantity(index, quantity)
}

// 删除商品
const removeFromCart = async (index) => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要删除这个商品吗？',
      showCancelButton: true
    })
    cartStore.removeItem(index)
    // 同时移除选中状态
    const itemId = cartList.value[index].id
    const checkedIndex = checkedGoods.value.indexOf(itemId)
    if (checkedIndex > -1) {
      checkedGoods.value.splice(checkedIndex, 1)
    }
    showToast('删除成功')
  } catch {
    // 取消删除
  }
}

// 清空失效商品
const clearInvalid = async () => {
  try {
    await showDialog({
      title: '提示',
      message: '确定要清空失效商品吗？',
      showCancelButton: true
    })
    cartStore.removeInvalidItems()
    showToast('清空成功')
  } catch {
    // 取消清空
  }
}

// 初始化
onMounted(() => {
  const cachedCart = getStorage('cart')
  if (cachedCart) {
    cartStore.setItems(cachedCart)
  }
})

// 提交订单前检查库存
const checkBeforeSubmit = async () => {
  const checkedItems = cartList.value.filter(item => 
    checkedGoods.value.includes(item.id)
  )
  
  const goodsIds = checkedItems.map(item => item.id)
  const stockInfo = await checkGoodsStock(goodsIds)
  
  const invalidItems = checkedItems.filter(item => {
    const stock = stockInfo[item.id]
    return !stock || stock < item.quantity
  })
  
  if (invalidItems.length) {
    const names = invalidItems.map(item => item.title).join('、')
    showToast(`${names} 库存不足`)
    return false
  }
  
  return true
}

// 提交订单
const onSubmit = async () => {
  if (!userStore.isLogin) {
    router.push({
      path: '/login',
      query: { redirect: '/cart' }
    })
    return
  }
  
  if (!checkedGoods.value.length) {
    showToast('请选择商品')
    return
  }
  
  // 检查库存
  const valid = await checkBeforeSubmit()
  if (!valid) return
  
  // 设置选中状态
  cartStore.setCheckedGoods(checkedGoods.value)
  
  // 跳转到订单确认页
  router.push('/order/confirm')
}

// 配送时间选择
const showDeliveryPicker = ref(false)
const deliveryTime = ref(new Date())
const selectedTime = ref('')
const minDate = new Date()
const maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

// 优惠券选择
const showCoupon = ref(false)
const availableCoupons = ref([])
const selectedCouponIndex = ref(-1)
const selectedCoupon = computed(() => {
  return selectedCouponIndex.value > -1
    ? availableCoupons.value[selectedCouponIndex.value]
    : null
})

// 价格计算
const totalPrice = computed(() => {
  return validList.value.reduce((total, item) => {
    if (checkedGoods.value.includes(item.id)) {
      return total + item.price * item.quantity
    }
    return total
  }, 0)
})

const finalPrice = computed(() => {
  let price = totalPrice.value
  if (selectedCoupon.value) {
    price -= selectedCoupon.value.amount
  }
  return Math.max(price, 0)
})

// 提交按钮文字
const submitButtonText = computed(() => {
  const count = checkedGoods.value.length
  return count ? `结算(${count})` : '结算'
})

// 确认配送时间
const onConfirmDelivery = (value) => {
  selectedTime.value = formatDate(value, 'MM-DD HH:mm')
  showDeliveryPicker.value = false
}

// 优惠券相关方法
const onCouponChange = (index) => {
  selectedCouponIndex.value = index
  showCoupon.value = false
}

const onCouponExchange = async (code) => {
  try {
    // TODO: 实现优惠券兑换
    showToast('兑换成功')
  } catch {
    showToast('兑换失败')
  }
}

// 初始化数据
onMounted(async () => {
  if (totalPrice.value > 0) {
    const coupons = await getAvailableCoupons(totalPrice.value)
    availableCoupons.value = coupons
  }
})
</script>

<style scoped lang="scss">
.cart {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
  
  .go-shopping {
    margin-top: 20px;
  }
  
  .invalid-goods {
    margin-bottom: 12px;
    background: #fff;
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      font-size: 14px;
      
      .clear {
        color: #999;
      }
    }
  }
  
  .goods-list {
    margin-bottom: 12px;
    
    .van-card {
      background: #fff;
    }
  }
  
  .delivery-time {
    margin-bottom: 12px;
  }
  
  .delete-button {
    height: 100%;
  }
  
  :deep(.van-submit-bar) {
    bottom: 50px;
  }
}
</style> 