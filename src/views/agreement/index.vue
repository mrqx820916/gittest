<template>
  <div class="agreement">
    <van-nav-bar
      title="用户协议"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 更新时间 -->
    <div class="update-time">
      更新时间：2024年1月1日
    </div>
    
    <!-- 协议内容 -->
    <div class="agreement-content">
      <div class="section">
        <h3>1. 协议的范围</h3>
        <p>欢迎使用美团优选！在使用我们的服务前，请您仔细阅读本协议。本协议是您与美团优选之间关于使用我们服务的法律协议。</p>
        <ul>
          <li>本协议适用于美团优选提供的所有服务</li>
          <li>使用服务即表示您同意本协议的全部条款</li>
          <li>我们保留随时修改本协议的权利</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>2. 账号注册</h3>
        <p>您在注册和使用账号时需要遵守以下规则：</p>
        <ul>
          <li>提供真实、准确、完整的个人信息</li>
          <li>妥善保管账号和密码，对账号行为负责</li>
          <li>不得转让、出售或允许他人使用您的账号</li>
          <li>遵守相关法律法规和平台规则</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>3. 用户行为规范</h3>
        <p>使用我们的服务时，您必须遵守以下行为规范：</p>
        <ul>
          <li>遵守法律法规和社会公德</li>
          <li>不得发布违法、违规或侵权内容</li>
          <li>不得从事任何损害平台或其他用户的行为</li>
          <li>不得利用平台从事商业活动</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>4. 商品和服务</h3>
        <p>关于平台提供的商品和服务：</p>
        <ul>
          <li>我们会尽力确保商品信息的准确性</li>
          <li>实际商品以收到的实物为准</li>
          <li>价格和库存可能会随时变动</li>
          <li>部分商品可能存在地区限制</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>5. 订单和支付</h3>
        <p>订单和支付相关规则：</p>
        <ul>
          <li>下单即表示您同意支付相应费用</li>
          <li>订单提交后需在规定时间内完成支付</li>
          <li>支持多种支付方式</li>
          <li>特殊情况下我们可能会取消订单</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>6. 配送服务</h3>
        <p>关于商品配送：</p>
        <ul>
          <li>配送范围和时间以实际显示为准</li>
          <li>可能因天气等因素影响配送时间</li>
          <li>请确保收货地址和联系方式准确</li>
          <li>签收前请检查商品完整性</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>7. 售后服务</h3>
        <p>商品售后服务规则：</p>
        <ul>
          <li>支持无理由退货（部分商品除外）</li>
          <li>质量问题可申请退款或换货</li>
          <li>退换货需保持商品完整性</li>
          <li>部分商品可能有特殊售后政策</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>8. 知识产权</h3>
        <p>关于平台的知识产权：</p>
        <ul>
          <li>平台内容受知识产权法保护</li>
          <li>未经许可不得复制或使用</li>
          <li>用户上传内容需确保拥有相应权利</li>
          <li>违规内容将被删除</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>9. 免责声明</h3>
        <p>以下情况我们不承担责任：</p>
        <ul>
          <li>因不可抗力导致的服务中断</li>
          <li>用户自身原因造成的损失</li>
          <li>第三方造成的损失</li>
          <li>法律法规规定的其他情况</li>
        </ul>
      </div>
      
      <div class="section">
        <h3>10. 协议终止</h3>
        <p>协议终止的情形：</p>
        <ul>
          <li>用户主动注销账号</li>
          <li>违反协议被终止服务</li>
          <li>平台停止运营</li>
          <li>其他法定终止情形</li>
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
.agreement {
  min-height: 100vh;
  background: #fff;
  
  .update-time {
    padding: 12px 16px;
    font-size: 14px;
    color: #999;
    border-bottom: 1px solid #eee;
  }
  
  .agreement-content {
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