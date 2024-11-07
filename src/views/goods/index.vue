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
        <van-tab title="商品评价">
          <div class="comment-list">
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
                <div class="comment-reply" v-if="comment.reply">
                  <div class="reply-title">商家回复：</div>
                  <div class="reply-content">{{ comment.reply }}</div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 底部操作栏 -->
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" @click="onClickService" />
      <van-goods-action-icon icon="cart-o" text="购物车" :badge="cartCount" to="/cart" />
      <van-goods-action-icon 
        :icon="isCollected ? 'star' : 'star-o'"
        :text="isCollected ? '已收藏' : '收藏'"
        @click="toggleCollect"
      />
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

    <!-- SKU 选择器 -->
    <van-action-sheet v-model:show="showSku" title="商品规格">
      <sku-selector
        ref="skuSelector"
        :specs="goods.specs"
        @change="onSkuChange"
      />
      <div class="sku-stepper">
        <span class="label">购买数量</span>
        <van-stepper v-model="buyAmount" :min="1" :max="99" />
      </div>
      <div class="sku-actions">
        <van-button type="danger" block @click="confirmSku">确定</van-button>
      </div>
    </van-action-sheet>

    <!-- 参数弹出层 -->
    <van-action-sheet v-model:show="showParams" title="商品参数">
      <van-cell-group>
        <van-cell
          v-for="(value, key) in goods.params"
          :key="key"
          :title="key"
          :value="value"
        />
      </van-cell-group>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showImagePreview } from 'vant'
import { useCartStore, useCollectStore } from '@/store'
import { getGoodsDetail } from '@/api/goods'
import { getGoodsComments } from '@/api/comment'
import { formatDate } from '@/utils'
import SkuSelector from '@/components/sku-selector.vue'
import RateComponent from '@/components/rate.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const collectStore = useCollectStore()

// 商品数据
const goods = ref({
  images: [],
  specs: [],
  params: {}
})

// 评论数据
const comments = ref([])

// 状态管理
const showSku = ref(false)
const showParams = ref(false)
const activeTab = ref(0)
const buyAmount = ref(1)
const skuSelector = ref(null)
const cartCount = computed(() => cartStore.totalCount)
const isCollected = computed(() => collectStore.isCollected(route.params.id))

// 获取商品详情
const loadGoodsDetail = async () => {
  try {
    const res = await getGoodsDetail(route.params.id)
    goods.value = res
  } catch (error) {
    showToast('获取商品详情失败')
  }
}

// 获取商品评价
const loadComments = async () => {
  try {
    const res = await getGoodsComments({
      goodsId: route.params.id
    })
    comments.value = res.list
  } catch (error) {
    showToast('获取评价失败')
  }
}

// SKU 相关
const onSkuChange = (specs) => {
  selectedSpecs.value = specs
}

const confirmSku = () => {
  if (!skuSelector.value.isComplete) {
    showToast('请选择完整规格')
    return
  }
  
  const item = {
    id: goods.value.id,
    title: goods.value.title,
    price: goods.value.price,
    thumb: goods.value.images[0],
    specs: skuSelector.value.selectedSpecs,
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

// 收藏相关
const toggleCollect = async () => {
  try {
    if (isCollected.value) {
      await collectStore.cancelCollect(route.params.id)
      showToast('已取消收藏')
    } else {
      await collectStore.addCollect(route.params.id)
      showToast('收藏成功')
    }
  } catch (error) {
    showToast('操作失败')
  }
}

// 图片预览
const previewImage = (images, index) => {
  showImagePreview({
    images,
    startPosition: index
  })
}

// 联系客服
const onClickService = () => {
  showToast('联系客服')
}

// 初始化数据
onMounted(() => {
  loadGoodsDetail()
  loadComments()
})
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

    .comment-list {
      padding: 15px;

      .comment-item {
        padding: 15px 0;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

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

  .sku-stepper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;

    .label {
      font-size: 14px;
    }
  }

  .sku-actions {
    padding: 15px;
  }
}
</style> 