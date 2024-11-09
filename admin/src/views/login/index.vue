<template>
  <div class="login-container">
    <el-form
      ref="formRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">美团优选管理后台</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="用户名"
          type="text"
          tabindex="1"
          auto-complete="off"
        >
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          :type="passwordVisible ? 'text' : 'password'"
          placeholder="密码"
          tabindex="2"
          auto-complete="off"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
          <template #suffix>
            <el-icon 
              class="cursor-pointer"
              @click="passwordVisible = !passwordVisible"
            >
              <View v-if="passwordVisible" />
              <Hide v-else />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.prevent="handleLogin"
      >
        登录
      </el-button>

      <!-- 测试账号提示 -->
      <div class="tips">
        <p>测试账号：</p>
        <p>用户名：admin</p>
        <p>密码：admin123</p>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'

const router = useRouter()

// 表单引用
const formRef = ref(null)

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

// 状态控制
const loading = ref(false)
const passwordVisible = ref(false)

// 登录处理
const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    loading.value = true
    await formRef.value.validate()
    
    // 开发环境下的简单登录验证
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      localStorage.setItem('admin-token', 'admin-token')
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .login-form {
    width: 520px;
    max-width: 100%;
    padding: 35px;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .title-container {
      position: relative;
      
      .title {
        font-size: 26px;
        color: #333;
        margin: 0 auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .tips {
      margin-top: 20px;
      padding: 15px;
      background: #f7f8fa;
      border-radius: 4px;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
  }
}
</style> 