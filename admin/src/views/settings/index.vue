<template>
  <div class="settings">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <!-- 基本设置 -->
        <el-divider>基本设置</el-divider>
        <el-form-item label="系统名称" prop="siteName">
          <el-input v-model="form.siteName" />
        </el-form-item>
        <el-form-item label="系统Logo" prop="logo">
          <el-upload
            v-model:file-list="logoList"
            action="/api/upload"
            list-type="picture-card"
            :limit="1"
            :on-success="handleLogoSuccess"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        
        <!-- 配送设置 -->
        <el-divider>配送设置</el-divider>
        <el-form-item label="起送金额" prop="minAmount">
          <el-input-number
            v-model="form.minAmount"
            :precision="2"
            :step="10"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="配送费" prop="deliveryFee">
          <el-input-number
            v-model="form.deliveryFee"
            :precision="2"
            :step="1"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="免配送费金额" prop="freeDeliveryAmount">
          <el-input-number
            v-model="form.freeDeliveryAmount"
            :precision="2"
            :step="10"
            :min="0"
          />
        </el-form-item>
        
        <!-- 支付设置 -->
        <el-divider>支付设置</el-divider>
        <el-form-item label="支付方式">
          <el-checkbox-group v-model="form.paymentMethods">
            <el-checkbox label="wechat">微信支付</el-checkbox>
            <el-checkbox label="alipay">支付宝</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          v-if="form.paymentMethods.includes('wechat')"
          label="微信支付配置"
        >
          <el-input v-model="form.wechatAppId" placeholder="AppID" />
          <el-input
            v-model="form.wechatSecret"
            type="password"
            placeholder="Secret"
            style="margin-top: 10px"
          />
        </el-form-item>
        <el-form-item
          v-if="form.paymentMethods.includes('alipay')"
          label="支付宝配置"
        >
          <el-input v-model="form.alipayAppId" placeholder="AppID" />
          <el-input
            v-model="form.alipayPrivateKey"
            type="textarea"
            placeholder="私钥"
            :rows="4"
            style="margin-top: 10px"
          />
        </el-form-item>
        
        <!-- 短信设置 -->
        <el-divider>短信设置</el-divider>
        <el-form-item label="短信服务商">
          <el-radio-group v-model="form.smsProvider">
            <el-radio label="aliyun">阿里云</el-radio>
            <el-radio label="tencent">腾讯云</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="AccessKey" prop="smsAccessKey">
          <el-input v-model="form.smsAccessKey" />
        </el-form-item>
        <el-form-item label="SecretKey" prop="smsSecretKey">
          <el-input v-model="form.smsSecretKey" type="password" />
        </el-form-item>
        <el-form-item label="短信签名" prop="smsSignName">
          <el-input v-model="form.smsSignName" />
        </el-form-item>
        <el-form-item label="模板ID" prop="smsTemplateId">
          <el-input v-model="form.smsTemplateId" />
        </el-form-item>
        
        <!-- 存储设置 -->
        <el-divider>存储设置</el-divider>
        <el-form-item label="存储方式">
          <el-radio-group v-model="form.storage">
            <el-radio label="local">本地存储</el-radio>
            <el-radio label="oss">阿里云OSS</el-radio>
            <el-radio label="cos">腾讯云COS</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="form.storage === 'oss'">
          <el-form-item label="AccessKey" prop="ossAccessKey">
            <el-input v-model="form.ossAccessKey" />
          </el-form-item>
          <el-form-item label="SecretKey" prop="ossSecretKey">
            <el-input v-model="form.ossSecretKey" type="password" />
          </el-form-item>
          <el-form-item label="Bucket" prop="ossBucket">
            <el-input v-model="form.ossBucket" />
          </el-form-item>
          <el-form-item label="Region" prop="ossRegion">
            <el-input v-model="form.ossRegion" />
          </el-form-item>
        </template>
        <template v-if="form.storage === 'cos'">
          <el-form-item label="SecretId" prop="cosSecretId">
            <el-input v-model="form.cosSecretId" />
          </el-form-item>
          <el-form-item label="SecretKey" prop="cosSecretKey">
            <el-input v-model="form.cosSecretKey" type="password" />
          </el-form-item>
          <el-form-item label="Bucket" prop="cosBucket">
            <el-input v-model="form.cosBucket" />
          </el-form-item>
          <el-form-item label="Region" prop="cosRegion">
            <el-input v-model="form.cosRegion" />
          </el-form-item>
        </template>
        
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formRef)">
            保存设置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const formRef = ref()
const logoList = ref([])

// 表单数据
const form = ref({
  siteName: '',
  logo: '',
  minAmount: 0,
  deliveryFee: 0,
  freeDeliveryAmount: 0,
  paymentMethods: [],
  wechatAppId: '',
  wechatSecret: '',
  alipayAppId: '',
  alipayPrivateKey: '',
  smsProvider: 'aliyun',
  smsAccessKey: '',
  smsSecretKey: '',
  smsSignName: '',
  smsTemplateId: '',
  storage: 'local',
  ossAccessKey: '',
  ossSecretKey: '',
  ossBucket: '',
  ossRegion: '',
  cosSecretId: '',
  cosSecretKey: '',
  cosBucket: '',
  cosRegion: ''
})

// 表单校验规则
const rules = {
  siteName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' }
  ],
  logo: [
    { required: true, message: '请上传系统Logo', trigger: 'change' }
  ],
  minAmount: [
    { required: true, message: '请输入起送金额', trigger: 'blur' }
  ],
  deliveryFee: [
    { required: true, message: '请输入配送费', trigger: 'blur' }
  ],
  smsAccessKey: [
    { required: true, message: '请输入AccessKey', trigger: 'blur' }
  ],
  smsSecretKey: [
    { required: true, message: '请输入SecretKey', trigger: 'blur' }
  ],
  smsSignName: [
    { required: true, message: '请输入短信签名', trigger: 'blur' }
  ],
  smsTemplateId: [
    { required: true, message: '请输入模板ID', trigger: 'blur' }
  ]
}

// 初始化数据
onMounted(async () => {
  await loadSettings()
})

// 加载设置
const loadSettings = async () => {
  try {
    // TODO: 调用获取设置接口
    const settings = {
      siteName: '美团优选',
      logo: 'https://example.com/logo.png',
      minAmount: 20,
      deliveryFee: 5,
      freeDeliveryAmount: 50,
      paymentMethods: ['wechat', 'alipay'],
      smsProvider: 'aliyun',
      storage: 'local'
    }
    
    form.value = {
      ...form.value,
      ...settings
    }
    
    if (settings.logo) {
      logoList.value = [
        {
          name: 'logo',
          url: settings.logo
        }
      ]
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
}

// Logo上传成功
const handleLogoSuccess = (response) => {
  form.value.logo = response.url
}

// 提交表单
const onSubmit = async (formEl) => {
  if (!formEl) return
  
  try {
    await formEl.validate()
    // TODO: 调用保存设置接口
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('表单校验失败:', error)
  }
}
</script>

<style scoped lang="scss">
.settings {
  .el-divider {
    margin: 24px 0;
  }
  
  .el-input {
    width: 300px;
  }
}
</style> 