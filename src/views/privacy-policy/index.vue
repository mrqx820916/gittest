<template>
  <div class="privacy-policy">
    <van-nav-bar
      title="隐私政策"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 更新时间 -->
    <div class="update-time">
      更新时间：2024年1月1日
    </div>
    
    <!-- 政策内容 -->
    <div class="policy-content">
      <div class="section">
        <h3>1. 信息收集</h3>
        <p>我们收集的信息包括但不限于：</p>
        <ul>
          <li>账号信息：手机号、昵称、头像等</li>
          <li>设备信息：设备型号、操作系统、唯一设备标识符等</li>
          <li>位置信息：GPS位置、WLAN接入点等</li>
          <li>订单信息：收货地址、支付信息、购物记录等</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>2. 信息使用</h3>
        <p>我们使用收集的信息用于：</p>
        <ul>
          <li>提供、维护和改进我们的服务</li>
          <li>处理您的订单和支付</li>
          <li>向您推送个性化内容和广告</li>
          <li>预防和打击欺诈等违法行为</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>3. 信息共享</h3>
        <p>我们不会向第三方出售您的个人信息。但在以下情况下，我们可能会共享您的信息：</p>
        <ul>
          <li>获得您的明确同意</li>
          <li>与我们的关联公司共享</li>
          <li>与合作伙伴共享必要信息以提供服务</li>
          <li>应法律法规要求或行政执法需要</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>4. 信息安全</h3>
        <p>我们采取多种安全措施保护您的个人信息：</p>
        <ul>
          <li>使用加密技术传输和存储数据</li>
          <li>严格控制数据访问权限</li>
          <li>定期进行安全评估和审计</li>
          <li>制定完善的数据安全应急预案</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>5. 您的权利</h3>
        <p>您对个人信息享有以下权利：</p>
        <ul>
          <li>访问和查看个人信息</li>
          <li>更正或更新个人信息</li>
          <li>删除个人信息</li>
          <li>撤回同意授权</li>
          <li>注销账号</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>6. Cookie 使用</h3>
        <p>我们使用 Cookie 和类似技术：</p>
        <ul>
          <li>记住您的登录状态和偏好设置</li>
          <li>分析网站使用情况</li>
          <li>提供个性化的服务和内容</li>
          <li>优化用户体验</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>7. 未成年人保护</h3>
        <p>我们高度重视未成年人的个人信息保护：</p>
        <ul>
          <li>建议未成年人在监护人指导下使用我们的服务</li>
          <li>未成年人的信息收集和使用需经监护人同意</li>
          <li>发现误收集未成年人信息时会及时删除</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>8. 政策更新</h3>
        <p>我们可能会不时更新本隐私政策：</p>
        <ul>
          <li>更新后会在App内显著位置通知您</li>
          <li>继续使用我们的服务即表示您同意更新后的政策</li>
          <li>重大变更会请求重新获取您的同意</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>9. 联系我们</h3>
        <p>如您对本隐私政策有任何疑问或建议，可通过以下方式联系我们：</p>
        <ul>
          <li>客服电话：400-123-4567</li>
          <li>电子邮箱：privacy@meituan.com</li>
          <li>在线客服：工作日 9:00-18:00</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回上一页
const onClickLeft = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.privacy-policy {
  min-height: 100vh;
  background: #fff;
  
  .update-time {
    padding: 12px 16px;
    font-size: 14px;
    color: #999;
    border-bottom: 1px solid #eee;
  }
  
  .policy-content {
    padding: 16px;
    
    .section {
      margin-bottom: 24px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      h3 {
        margin: 0 0 12px;
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      
      p {
        margin: 0 0 8px;
        font-size: 14px;
        color: #666;
        line-height: 1.6;
      }
      
      ul {
        margin: 0;
        padding-left: 20px;
        
        li {
          margin-bottom: 8px;
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
</style> 