<template>
  <div class="order-logistics">
    <van-nav-bar
      title="物流详情"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 物流信息 -->
    <van-cell-group inset class="logistics-info">
      <van-cell>
        <template #title>
          <div class="logistics-company">
            <span class="label">物流公司：</span>
            <span class="value">{{ order.logistics?.company }}</span>
          </div>
          <div class="tracking-number">
            <span class="label">物流单号：</span>
            <span class="value">{{ order.logistics?.trackingNo }}</span>
            <van-button 
              size="mini" 
              type="primary" 
              plain
              @click="onCopy(order.logistics?.trackingNo)"
            >
              复制
            </van-button>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 收货信息 -->
    <van-cell-group inset class="address-info">
      <van-cell>
        <template #title>
          <div class="address-detail">
            <van-icon name="location" color="#ee0a24" size="18" />
            <div class="info">
              <div class="name-tel">
                <span>{{ order.address?.name }}</span>
                <span>{{ order.address?.tel }}</span>
              </div>
              <div class="address">
                {{ formatAddress(order.address) }}
              </div>
            </div>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 物流轨迹 -->
    <van-cell-group inset class="logistics-track">
      <van-cell title="物流轨迹" />
      <div class="track-list">
        <van-steps
          direction="vertical"
          :active="logistics.tracks.length - 1"
        >
          <van-step
            v-for="(item, index) in logistics.tracks"
            :key="index"
          >
            <h3>{{ item.status }}</h3>
            <p>{{ item.content }}</p>
            <p>{{ formatDate(item.time) }}</p>
          </van-step>
        </van-steps>
      </div>
    </van-cell-group>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getOrderDetail } from '@/api/order'
import { getLogisticsInfo } from '@/api/logistics'
import { formatDate, formatAddress } from '@/utils'

const route = useRoute()
const router = useRouter()

// 订单数据
const order = ref({})
const logistics = ref({
  tracks: []
})

// 获取订单详情
const loadOrderDetail = async () => {
  try {
    const res = await getOrderDetail(route.params.id)
    order.value = res
    if (res.logistics) {
      await loadLogisticsInfo(res.logistics.trackingNo)
    }
  } catch (error) {
    showToast('获取订单详情失败')
    router.back()
  }
}

// 获取物流信息
const loadLogisticsInfo = async (trackingNo) => {
  try {
    const res = await getLogisticsInfo(trackingNo)
    logistics.value = res
  } catch (error) {
    showToast('获取物流信息失败')
  }
}

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 复制物流单号
const onCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast('复制成功')
  } catch (error) {
    showToast('复制失败')
  }
}

// 初始化数据
onMounted(() => {
  loadOrderDetail()
})
</script>

<style scoped lang="scss">
.order-logistics {
  min-height: 100vh;
  background: #f5f5f5;
  
  .logistics-info {
    margin-top: 12px;
    
    .logistics-company,
    .tracking-number {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        color: #666;
        font-size: 14px;
      }
      
      .value {
        color: #333;
        font-size: 14px;
        margin-right: 10px;
      }
    }
  }
  
  .address-info {
    margin-top: 12px;
    
    .address-detail {
      display: flex;
      align-items: flex-start;
      
      .info {
        flex: 1;
        margin-left: 10px;
        
        .name-tel {
          margin-bottom: 5px;
          
          span {
            margin-right: 10px;
            font-size: 14px;
            color: #333;
          }
        }
        
        .address {
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
  
  .logistics-track {
    margin-top: 12px;
    
    .track-list {
      padding: 0 16px 16px;
      
      :deep(.van-step) {
        h3 {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }
        
        p {
          font-size: 12px;
          color: #999;
          margin: 0;
          
          &:last-child {
            margin-top: 4px;
          }
        }
        
        &.van-step--finish {
          h3, p {
            color: #666;
          }
        }
        
        &:first-child {
          h3, p {
            color: $primary-color;
          }
        }
      }
    }
  }
}
</style> 