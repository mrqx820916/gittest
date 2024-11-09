<template>
  <div class="layout">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="left-header">
        <div class="collapse-btn" @click="toggleCollapse">
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </div>
        <div class="logo">管理系统</div>
      </div>
      <div class="user-info">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 侧边栏 -->
    <div class="main-container">
      <div class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          :collapse="isCollapse"
        >
          <el-menu-item index="/dashboard">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/user/list">用户列表</el-menu-item>
            <el-menu-item index="/user/role">角色管理</el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-operation"></i>
              <span>系统设置</span>
            </template>
            <el-menu-item index="/system/config">系统配置</el-menu-item>
            <el-menu-item index="/system/log">操作日志</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>

      <!-- 主内容区 -->
      <div class="main-content">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item, index) in breadcrumbs" 
                             :key="index">{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 路由视图 -->
        <div class="content-container">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      username: 'Admin',
      isCollapse: false,
      breadcrumbs: []
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'logout') {
        // 处理退出登录
        this.$confirm('确认退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 清除登录状态
          localStorage.removeItem('token')
          this.$router.push('/login')
        })
      } else if (command === 'profile') {
        // 跳转到个人信息页
        this.$router.push('/profile')
      }
    },
    updateBreadcrumbs() {
      // 根据路由更新面包屑
      const matched = this.$route.matched.slice(1)
      this.breadcrumbs = matched.map(item => item.meta.title || item.name)
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  watch: {
    $route: {
      handler() {
        this.updateBreadcrumbs()
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.left-header {
  display: flex;
  align-items: center;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
  padding: 0 10px;
}

.collapse-btn:hover {
  background-color: rgba(0,0,0,.025);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #304156;
}

.user-info {
  cursor: pointer;
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  height: 100%;
  background-color: #304156;
  transition: width 0.3s;
}

.sidebar.collapse {
  width: 64px;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}

.content-container {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}

.el-menu-vertical {
  border-right: none;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

.el-dropdown-link {
  color: #606266;
  cursor: pointer;
}
</style> 