<template>
  <div class="dashboard">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>欢迎使用美团优选管理后台</span>
          <el-button type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </template>
      <div class="card-content">
        <p>当前登录用户：admin</p>
        <p>登录时间：{{ new Date().toLocaleString() }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    localStorage.removeItem('admin-token')
    ElMessage.success('退出成功')
    router.push('/login')
  } catch {
    // 取消退出
  }
}
</script>

<style scoped lang="scss">
.dashboard {
  padding: 20px;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-content {
    font-size: 14px;
    line-height: 1.8;
    color: #666;
  }
}
</style> 