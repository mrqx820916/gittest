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
        <span class="current-price">¥{{ selectedSku?.price || goods.price }}</span>
        <span class="original-price" v-if="selectedSku?.originalPrice || goods.originalPrice">
          ¥{{ selectedSku?.originalPrice || goods.originalPrice }}
        </span>
      </div>
      <div class="title">{{ goods.title }}</div>
      <div class="desc">{{ goods.desc }}</div>
      <div class="sales">销量 {{ goods.sales }}</div>
    </div>

    <!-- 商品规格 -->
    <van-cell-group inset class="goods-specs">
      <van-cell title="选择规格" is-link @click="showSku = true">
        <template #value>
          <span v-if="selectedSpecs">{{ formatSelectedSpecs }}</span>
          <span v-else class="text-gray">请选择规格</span>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 服务说明 -->
    <van-cell-group inset class="service-card">
      <van-cell title="服务说明" is-link @click="showService = true">
        <template #value>
          <span v-for="(item, index) in services" :key="index" class="service-tag">
            <van-icon :name="item.icon" :color="item.color" />
            {{ item.text }}
          </span>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 商品参数 -->
    <van-cell-group inset class="params-card">
      <van-cell title="商品参数" is-link @click="showParams = true">
        <template #value>
          <span class="param-preview">
            {{ Object.keys(goods.params || {}).length }}项参数
          </span>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 商品详情 -->
    <div class="goods-detail-content">
      <van-tabs v-model:active="activeTab" sticky>
        <van-tab title="商品介绍">
          <div class="detail-content" v-html="goods.detail"></div>
        </van-tab>
        <van-tab title="商品评价">
          <comment-list
            :comments="comments"
            :loading="commentLoading"
            :finished="commentFinished"
            @load="loadMoreComments"
            @tag-click="onCommentTagClick"
          />
        </van-tab>
      </van-tabs>
    </div>

    <!-- 相关推荐 -->
    <div class="recommend-goods">
      <div class="title">相关推荐</div>
      <van-grid :column-num="2" :border="false">
        <van-grid-item
          v-for="item in recommendGoods"
          :key="item.id"
          @click="onGoodsClick(item)"
        >
          <goods-card :goods="item" />
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 底部操作栏 -->
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" @click="onClickService" />
      <van-goods-action-icon 
        icon="cart-o" 
        text="购物车" 
        :badge="cartCount" 
        to="/cart" 
      />
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
    <van-popup
      v-model:show="showSku"
      position="bottom"
      round
      closeable
    >
      <sku-selector
        :goods="goods"
        :specs="goods.specs"
        :sku-list="goods.skuList"
        :initial-sku="selectedSpecs"
        @change="onSkuChange"
      />
      <div class="sku-actions">
        <van-button 
          block 
          type="danger" 
          :disabled="!selectedSku"
          @click="onConfirmSku"
        >
          {{ buyNow ? '立即购买' : '加入购物车' }}
        </van-button>
      </div>
    </van-popup>

    <!-- 服务说明弹窗 -->
    <van-action-sheet v-model:show="showService" title="服务说明">
      <div class="service-list">
        <div v-for="item in services" :key="item.text" class="service-item">
          <van-icon :name="item.icon" :color="item.color" size="20" />
          <div class="content">
            <div class="title">{{ item.text }}</div>
            <div class="desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
    </van-action-sheet>

    <!-- 商品参数弹窗 -->
    <van-action-sheet v-model:show="showParams" title="商品参数">
      <div class="params-list">
        <van-cell
          v-for="(value, key) in goods.params"
          :key="key"
          :title="key"
          :value="value"
        />
      </div>
    </van-action-sheet>

    <!-- 分享面板 -->
    <van-share-sheet
      v-model:show="showShare"
      title="立即分享给好友"
      :options="shareOptions"
      @select="onShareSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast, showImagePreview } from 'vant'
import { useCartStore, useCollectStore } from '@/store'
import { getGoodsDetail, getRecommendGoods } from '@/api/goods'
import { getGoodsComments } from '@/api/comment'
import { initShare, shareToWechat, copyLink } from '@/utils/share'
import SkuSelector from '@/components/sku-selector/index.vue'
import CommentList from '@/components/comment-list/index.vue'
import GoodsCard from '@/components/goods-card/index.vue'
import { generatePoster } from '@/utils/poster'
import { setStorage, getStorage } from '@/utils/storage'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const collectStore = useCollectStore()

// 商品数据
const goods = ref({})
const selectedSpecs = ref(null)
const selectedSku = ref(null)
const buyNow = ref(false)

// 评价数据
const comments = ref([])
const commentLoading = ref(false)
const commentFinished = ref(false)
const commentPage = ref(1)

// 推荐商品
const recommendGoods = ref([])

// 弹窗控制
const showSku = ref(false)
const showService = ref(false)
const showParams = ref(false)
const showShare = ref(false)
const activeTab = ref(0)

// 购物车数量
const cartCount = computed(() => cartStore.totalCount)

// 是否已收藏
const isCollected = computed(() => collectStore.isCollected(route.params.id))

// 服务说明
const services = [
  {
    icon: 'passed',
    color: '#07c160',
    text: '正品保证',
    desc: '所有商品均为正品，假一赔十'
  },
  {
    icon: 'logistics',
    color: '#1989fa',
    text: '极速发货',
    desc: '当天下单，48小时内发货'
  },
  {
    icon: 'after-sale',
    color: '#ff976a',
    text: '售后无忧',
    desc: '7天无理由退换货'
  },
  {
    icon: 'location',
    color: '#ee0a24',
    text: '同城配送',
    desc: '同城订单当天可送达'
  }
]

// 分享配置
const shareOptions = [
  { name: '微信', icon: 'wechat' },
  { name: '朋友圈', icon: 'wechat-moments' },
  { name: '复制链接', icon: 'link' },
  { name: '分享海报', icon: 'poster' }
]

// 格式化选中的规格
const formatSelectedSpecs = computed(() => {
  if (!selectedSpecs.value) return ''
  return Object.entries(selectedSpecs.value)
    .map(([key, value]) => `${key}:${value}`)
    .join(';')
})

// 加载商品详情
const loadGoodsDetail = async () => {
  try {
    const res = await getGoodsDetail(route.params.id)
    goods.value = res
  } catch (error) {
    showToast('获取商品详情失败')
  }
}

// 加载评价列表
const loadMoreComments = async () => {
  if (commentLoading.value) return
  
  commentLoading.value = true
  try {
    const res = await getGoodsComments({
      goodsId: route.params.id,
      page: commentPage.value,
      pageSize: 10
    })
    
    comments.value.push(...res.list)
    commentPage.value++
    
    if (res.list.length < 10) {
      commentFinished.value = true
    }
  } catch (error) {
    showToast('加载评价失败')
  } finally {
    commentLoading.value = false
  }
}

// 浏览记录相关
const saveViewHistory = () => {
  const MAX_HISTORY = 100 // 最多保存100条
  const history = getStorage('viewHistory') || []
  
  // 移除重复记录
  const index = history.findIndex(item => item.id === goods.value.id)
  if (index > -1) {
    history.splice(index, 1)
  }
  
  // 添加新记录
  history.unshift({
    id: goods.value.id,
    title: goods.value.title,
    price: goods.value.price,
    thumb: goods.value.thumb,
    viewTime: Date.now()
  })
  
  // 限制记录数量
  if (history.length > MAX_HISTORY) {
    history.pop()
  }
  
  setStorage('viewHistory', history)
}

// 相关推荐缓存
const RECOMMEND_CACHE_KEY = 'recommendGoods'
const RECOMMEND_CACHE_TIME = 5 * 60 * 1000 // 5分钟缓存

const loadRecommendGoods = async () => {
  try {
    // 检查缓存
    const cached = getStorage(RECOMMEND_CACHE_KEY)
    if (cached && cached.time > Date.now() - RECOMMEND_CACHE_TIME) {
      recommendGoods.value = cached.data
      return
    }
    
    // 加载新数据
    const res = await getRecommendGoods(route.params.id)
    recommendGoods.value = res
    
    // 更新缓存
    setStorage(RECOMMEND_CACHE_KEY, {
      time: Date.now(),
      data: res
    })
  } catch (error) {
    console.error('加载推荐商品失败:', error)
  }
}

// 生成分享海报
const generateSharePoster = async () => {
  try {
    showLoadingToast({
      message: '正在生成海报...',
      duration: 0
    })
    
    const poster = await generatePoster({
      title: goods.value.title,
      price: selectedSku.value?.price || goods.value.price,
      image: goods.value.images[0],
      qrcode: window.location.href
    })
    
    closeToast()
    
    // 显示海报
    showImagePreview({
      images: [poster],
      closeable: true,
      closeIconPosition: 'top-right',
      closeOnPopstate: true
    })
  } catch (error) {
    closeToast()
    showToast('生成海报失败')
  }
}

// SKU 相关方法
const onSkuChange = ({ selectedSpecs: specs, selectedSku: sku }) => {
  selectedSpecs.value = specs
  selectedSku.value = sku
}

const onConfirmSku = () => {
  if (!selectedSku.value) {
    showToast('请选择规格')
    return
  }
  
  if (buyNow.value) {
    // 立即购买
    router.push({
      path: '/order/confirm',
      query: {
        goods: JSON.stringify([{
          id: goods.value.id,
          title: goods.value.title,
          price: selectedSku.value.price,
          thumb: goods.value.images[0],
          specs: selectedSpecs.value,
          quantity: 1
        }])
      }
    })
  } else {
    // 加入购物车
    cartStore.addToCart({
      id: goods.value.id,
      title: goods.value.title,
      price: selectedSku.value.price,
      thumb: goods.value.images[0],
      specs: selectedSpecs.value,
      quantity: 1
    })
    showToast('已加入购物车')
  }
  
  showSku.value = false
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

// 分享处理
const onShareSelect = async (option) => {
  const shareData = {
    title: goods.value.title,
    desc: goods.value.desc,
    link: window.location.href,
    imgUrl: goods.value.images[0]
  }
  
  switch (option.name) {
    case '微信':
      shareToWechat(shareData)
      break
    case '朋友圈':
      shareToWechat({ ...shareData, scene: 'timeline' })
      break
    case '复制链接':
      await copyLink()
      break
    case '分享海报':
      await generateSharePoster()
      break
  }
  
  showShare.value = false
}

// 其他方法
const onClickService = () => {
  showToast('联系客服')
}

const onClickBuy = () => {
  buyNow.value = true
  showSku.value = true
}

const onGoodsClick = (goods) => {
  router.push(`/goods/${goods.id}`)
}

const onCommentTagClick = (tag) => {
  comments.value = []
  commentPage.value = 1
  commentFinished.value = false
  loadMoreComments()
}

// 初始化
onMounted(() => {
  loadGoodsDetail()
  loadMoreComments()
  loadRecommendGoods()
  initShare()
  saveViewHistory()
})

// 离开页面时重置状态
onBeforeUnmount(() => {
  selectedSpecs.value = null
  selectedSku.value = null
  buyNow.value = false
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
        color: $primary-color;
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

  .goods-specs,
  .service-card,
  .params-card {
    margin-top: 12px;
  }

  .service-tag {
    margin-right: 8px;
    font-size: 12px;
    color: #666;

    .van-icon {
      margin-right: 2px;
    }
  }

  .goods-detail-content {
    margin-top: 12px;
    background: #fff;

    .detail-content {
      padding: 15px;
    }
  }

  .recommend-goods {
    margin-top: 12px;
    padding: 16px;
    background: #fff;

    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 12px;
    }
  }

  .service-list {
    padding: 16px;

    .service-item {
      display: flex;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      .content {
        flex: 1;
        margin-left: 8px;

        .title {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }

        .desc {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  .params-list {
    max-height: 60vh;
    overflow-y: auto;
  }

  .sku-actions {
    padding: 16px;
  }
}

/* 添加海报预览样式 */
:deep(.van-image-preview__cover) {
  background-color: rgba(0, 0, 0, 0.9);
}

:deep(.van-image-preview__image) {
  background-color: #fff;
}
</style> 