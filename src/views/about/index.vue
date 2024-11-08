<template>
  <div class="about">
    <van-nav-bar
      title="关于我们"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- Logo -->
    <div class="logo-box">
      <van-image
        width="80"
        height="80"
        :src="require('@/assets/logo.png')"
      />
      <div class="app-name">美团优选</div>
      <div class="version">v{{ version }}</div>
    </div>
    
    <!-- 功能列表 -->
    <van-cell-group inset class="feature-list">
      <van-cell title="版本更新" is-link @click="checkUpdate">
        <template #right-icon>
          <van-tag type="primary" size="small" v-if="hasUpdate">有新版本</van-tag>
        </template>
      </van-cell>
      <van-cell title="用户协议" is-link to="/agreement" />
      <van-cell title="隐私政策" is-link to="/privacy-policy" />
      <van-cell title="意见反馈" is-link to="/feedback" />
      <van-cell title="客服电话" is-link @click="onCallService">
        <template #value>
          <span class="service-phone">400-123-4567</span>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 公司信息 -->
    <div class="company-info">
      <div class="info-item">
        <div class="label">公司名称</div>
        <div class="value">美团优选科技有限公司</div>
      </div>
      <div class="info-item">
        <div class="label">公司地址</div>
        <div class="value">北京市朝阳区望京东路6号</div>
      </div>
      <div class="info-item">
        <div class="label">联系电话</div>
        <div class="value">010-12345678</div>
      </div>
      <div class="info-item">
        <div class="label">电子邮箱</div>
        <div class="value">support@meituan.com</div>
      </div>
    </div>
    
    <!-- 版权信息 -->
    <div class="copyright">
      <p>Copyright © 2024 美团优选</p>
      <p>All Rights Reserved</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { checkUpdate } from '@/api/app'

const router = useRouter()
const version = ref('1.0.0')
const hasUpdate = ref(false)

// 返回上一页
const onClickLeft = () => {
  router.back()
}

// 检查更新
const checkAppUpdate = async () => {
  try {
    const res = await checkUpdate(version.value)
    hasUpdate.value = res.hasUpdate
    if (res.hasUpdate) {
      showDialog({
        title: '发现新版本',
        message: res.updateInfo,
        confirmButtonText: '立即更新',
        cancelButtonText: '暂不更新',
        showCancelButton: true
      }).then(() => {
        // 执行更新操作
        window.location.href = res.downloadUrl
      }).catch(() => {
        // 取消更新
      })
    } else {
      showToast('已是最新版本')
    }
  } catch (error) {
    showToast('检查更新失败')
  }
}

// 拨打客服电话
const onCallService = () => {
  showDialog({
    title: '提示',
    message: '是否拨打客服电话：400-123-4567？',
    showCancelButton: true
  }).then(() => {
    window.location.href = 'tel:400-123-4567'
  })
}

// 初始化数据
checkAppUpdate()
</script>

<style scoped lang="scss">
.about {
  min-height: 100vh;
  background: #f5f5f5;
  
  .logo-box {
    padding: 40px 0;
    text-align: center;
    background: #fff;
    
    .app-name {
      margin-top: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
    
    .version {
      margin-top: 8px;
      font-size: 14px;
      color: #999;
    }
  }
  
  .feature-list {
    margin-top: 12px;
    
    .service-phone {
      color: $primary-color;
    }
  }
  
  .company-info {
    margin-top: 12px;
    padding: 20px;
    background: #fff;
    
    .info-item {
      margin-bottom: 15px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        font-size: 14px;
        color: #666;
        margin-bottom: 5px;
      }
      
      .value {
        font-size: 14px;
        color: #333;
      }
    }
  }
  
  .copyright {
    margin-top: 30px;
    padding: 20px;
    text-align: center;
    
    p {
      margin: 0;
      font-size: 12px;
      color: #999;
      line-height: 1.8;
    }
  }
}
</style> 