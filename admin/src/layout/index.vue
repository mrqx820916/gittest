<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <div class="logo">美团优选管理后台</div>
      <el-menu
        :default-active="route.path"
        class="menu"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        
        <el-menu-item index="/goods">
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        
        <el-menu-item index="/order">
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        
        <el-menu-item index="/user">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主要内容区 -->
    <el-container>
      <el-header>
        <div class="header-left">
          <el-icon 
            class="collapse-btn"
            @click="isCollapse = !isCollapse"
          >
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb>
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              管理员 <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Odometer,
  Goods,
  List,
  User,
  Fold,
  Expand,
  ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)

const logout = () => {
  localStorage.removeItem('admin-token')
  router.push('/login')
}
</script>

<style scoped lang="scss">
.layout {
  height: 100vh;
  
  .el-aside {
    background: #304156;
    
    .logo {
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      border-bottom: 1px solid #1f2d3d;
    }
    
    .menu {
      border-right: none;
      background: #304156;
      
      :deep(.el-menu-item) {
        color: #bfcbd9;
        
        &:hover {
          color: #fff;
          background: #263445;
        }
        
        &.is-active {
          color: #409eff;
          background: #263445;
        }
      }
    }
  }
  
  .el-header {
    background: #fff;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    
    .header-left {
      display: flex;
      align-items: center;
      
      .collapse-btn {
        margin-right: 20px;
        font-size: 20px;
        cursor: pointer;
      }
    }
    
    .header-right {
      .user-info {
        cursor: pointer;
        color: #666;
        
        .el-icon {
          margin-left: 5px;
        }
      }
    }
  }
  
  .el-main {
    background: #f0f2f5;
    padding: 20px;
  }
}
</style> 