<template>
  <div class="goods">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="商品名称">
          <el-input v-model="searchForm.keyword" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类">
            <el-option
              v-for="item in categories"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" @click="handleAdd">添加商品</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 商品列表 -->
    <el-card class="list-card">
      <el-table
        v-loading="loading"
        :data="goodsList"
        border
        style="width: 100%"
      >
        <el-table-column prop="title" label="商品名称" min-width="200" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="120" />
        <el-table-column prop="sales" label="销量" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button 
              type="primary" 
              link 
              @click="handleStatus(row)"
            >
              {{ row.status === 1 ? '下架' : '上架' }}
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 搜索表单
const searchForm = ref({
  keyword: '',
  category: ''
})

// 分类列表
const categories = ref([])

// 商品列表
const goodsList = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 搜索
const handleSearch = () => {
  page.value = 1
  loadData()
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    keyword: '',
    category: ''
  }
  handleSearch()
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // TODO: 调用获取商品列表 API
    // 模拟数据
    goodsList.value = [
      {
        id: 1,
        title: '测试商品1',
        price: 19.9,
        stock: 100,
        sales: 50,
        status: 1
      },
      {
        id: 2,
        title: '测试商品2',
        price: 29.9,
        stock: 200,
        sales: 30,
        status: 0
      }
    ]
    total.value = 100
  } catch (error) {
    console.error('加载商品列表失败:', error)
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val) => {
  page.value = val
  loadData()
}

// 添加商品
const handleAdd = () => {
  ElMessage.info('开发中...')
}

// 编辑商品
const handleEdit = (row) => {
  ElMessage.info('开发中...')
}

// 修改状态
const handleStatus = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 1 ? '下架' : '上架'}该商品吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.success('操作成功')
    loadData()
  } catch {
    // 取消操作
  }
}

// 删除商品
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该商品吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // 取消删除
  }
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.goods {
  .search-card {
    margin-bottom: 20px;
  }
  
  .list-card {
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style> 