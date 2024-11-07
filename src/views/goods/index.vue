<template>
  <div class="goods-detail">
    <!-- 商品轮播图 -->
    <van-swipe class="goods-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in goods.images" :key="index">
        <van-image :src="image" fit="cover" />
      </van-swipe-item>
    </van-swipe>

    <!-- 商品信息 -->
    <div class="goods-info">
      <div class="price">
        <span class="current-price">¥{{ goods.price }}</span>
        <span class="original-price" v-if="goods.originalPrice">¥{{ goods.originalPrice }}</span>
      </div>
      <div class="title">{{ goods.title }}</div>
      <div class="desc">{{ goods.desc }}</div>
      <div class="sales">销量 {{ goods.sales }}</div>
    </div>

    <!-- 商品规格 -->
    <van-cell-group inset class="goods-specs">
      <van-cell title="选择规格" is-link @click="showSku = true">
        <template #value>
          <span v-if="selectedSku">已选：{{ selectedSku }}</span>
          <span v-else class="text-gray">请选择规格</span>
        </template>
      </van-cell>
      <van-cell title="商品参数" is-link @click="showParams = true" />
    </van-cell-group>

    <!-- 商品详情 -->
    <div class="goods-detail-content">
      <van-tabs v-model:active="activeTab">
        <van-tab title="商品介绍">
          <div class="detail-content" v-html="goods.detail"></div>
        </van-tab>
        <van-tab title="规格参数">
          <van-cell-group inset>
            <van-cell
              v-for="(value, key) in goods.params"
              :key="key"
              :title="key"
              :value="value"
            />
          </van-cell-group>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 底部操作栏 -->
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" @click="onClickService" />
      <van-goods-action-icon icon="cart-o" text="购物车" :badge="cartCount" to="/cart" />
      <van-goods-action-button
        type="warning"
        text="加入购物车"
        @click="showSku = true"
      />
      <van-goods-action-button
        type="danger"
        text="立即购买"
        @click="onClickBuy"
      />
    </van-goods-action>

    <!-- SKU 弹出层 -->
    <van-action-sheet v-model:show="showSku" title="商品规格">
      <div class="sku-content">
        <!-- 规格选择 -->
        <div class="sku-group" v-for="(spec, index) in goods.specs" :key="index">
          <div class="sku-group-title">{{ spec.name }}</div>
          <div class="sku-group-content">
            <van-button
              v-for="item in spec.values"
              :key="item"
              :type="selectedSpecs[spec.name] === item ? 'danger' : 'default'"
              size="small"
              @click="selectSpec(spec.name, item)"
            >
              {{ item }}
            </van-button>
          </div>
        </div>

        <!-- 数量选择 -->
        <div class="amount-picker">
          <span class="label">购买数量</span>
          <van-stepper v-model="buyAmount" :min="1" :max="99" />
        </div>

        <!-- 确认按钮 -->
        <div class="sku-actions">
          <van-button type="danger" block @click="confirmSku">确定</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useCartStore } from '@/store/modules/cart'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

// 商品数据（模拟）
const goods = ref({
  id: 1,
  title: '新鲜水果大礼包',
  price: 99.99,
  originalPrice: 129.99,
  desc: '精选新鲜水果，品质保证',
  sales: 1000,
  images: [
    'https://img.yzcdn.cn/vant/apple-1.jpg',
    'https://img.yzcdn.cn/vant/apple-2.jpg'
  ],
  specs: [
    {
      name: '规格',
      values: ['小份', '中份', '大份']
    },
    {
      name: '套餐',
      values: ['标准', '豪华', '尊享']
    }
  ],
  params: {
    '产地': '中国',
    '保质期': '7天',
    '储存条件': '常温'
  },
  detail: '<p>商品详情内容</p>'
})

// 状态管理
const showSku = ref(false)
const showParams = ref(false)
const activeTab = ref(0)
const buyAmount = ref(1)
const selectedSpecs = ref({})
const cartCount = computed(() => cartStore.totalCount)

// 选择规格
const selectSpec = (name, value) => {
  selectedSpecs.value[name] = value
}

// 获取已选规格文本
const selectedSku = computed(() => {
  const specs = []
  for (const [name, value] of Object.entries(selectedSpecs.value)) {
    specs.push(`${name}:${value}`)
  }
  return specs.length ? specs.join(';') : ''
})

// 确认规格选择
const confirmSku = () => {
  if (Object.keys(selectedSpecs.value).length < goods.value.specs.length) {
    showToast('请选择完整规格')
    return
  }
  
  const item = {
    id: goods.value.id,
    title: goods.value.title,
    price: goods.value.price,
    thumb: goods.value.images[0],
    specs: selectedSpecs.value,
    quantity: buyAmount.value
  }
  
  cartStore.addToCart(item)
  showToast('已加入购物车')
  showSku.value = false
}

// 立即购买
const onClickBuy = () => {
  showSku.value = true
}

// 联系客服
const onClickService = () => {
  showToast('联系客服')
}
</script>

<style scoped lang="scss">
.goods-detail {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;

  .goods-swipe {
    height: 300px;

    .van-image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info {
    padding: 15px;
    background: #fff;

    .price {
      margin-bottom: 10px;

      .current-price {
        font-size: 24px;
        color: #ee0a24;
        font-weight: bold;
      }

      .original-price {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
        margin-left: 10px;
      }
    }

    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .desc {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .sales {
      font-size: 12px;
      color: #999;
    }
  }

  .goods-specs {
    margin-top: 12px;
  }

  .goods-detail-content {
    margin-top: 12px;
    background: #fff;

    .detail-content {
      padding: 15px;
    }
  }

  .sku-content {
    padding: 20px 15px;

    .sku-group {
      margin-bottom: 15px;

      .sku-group-title {
        margin-bottom: 10px;
        font-size: 14px;
      }

      .sku-group-content {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
    }

    .amount-picker {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0;

      .label {
        font-size: 14px;
      }
    }

    .sku-actions {
      margin-top: 20px;
    }
  }
}
</style> 