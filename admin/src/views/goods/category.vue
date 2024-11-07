<template>
  <div class="category">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>分类列表</span>
          <el-button type="primary" @click="onAdd">添加分类</el-button>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="{ row }">
            <el-icon>
              <component :is="row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="onEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              link
              :type="row.status === 1 ? 'warning' : 'success'"
              @click="onToggleStatus(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button
              link
              type="danger"
              @click="onDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加分类' : '编辑分类'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select v-model="form.icon">
            <el-option
              v-for="icon in icons"
              :key="icon"
              :label="icon"
              :value="icon"
            >
              <el-icon>
                <component :is="icon" />
              </el-icon>
              <span style="margin-left: 10px">{{ icon }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit(formRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as ElementPlusIcons from '@element-plus/icons-vue'

// 可用图标列表
const icons = Object.keys(ElementPlusIcons)

// 表格数据
const loading = ref(false)
const tableData = ref([])

// 对话框
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref()
const form = ref({
  name: '',
  icon: '',
  sort: 0
})

// 表单校验规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ],
  icon: [
    { required: true, message: '请选择图标', trigger: 'change' }
  ]
}

// 初始化数据
onMounted(() => {
  loadData()
})

// 加载表格数据
const loadData = async () => {
  loading.value = true
  try {
    // TODO: 调用获取分类列表接口
    tableData.value = []
  } catch (error) {
    console.error('加载分类列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 添加分类
const onAdd = () => {
  dialogType.value = 'add'
  form.value = {
    name: '',
    icon: '',
    sort: 0
  }
  dialogVisible.value = true
}

// 编辑分类
const onEdit = (row) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

// 切换分类状态
const onToggleStatus = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 1 ? '禁用' : '启用'}该分类吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用更新分类状态接口
    ElMessage.success(`${row.status === 1 ? '禁用' : '启用'}成功`)
    loadData()
  } catch {
    // 取消操作
  }
}

// 删除分类
const onDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该分类吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用删除分类接口
    ElMessage.success('删除成功')
    loadData()
  } catch {
    // 取消删除
  }
}

// 提交表单
const onSubmit = async (formEl) => {
  if (!formEl) return
  
  try {
    await formEl.validate()
    // TODO: 调用添加/更新分类接口
    ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('表单校验失败:', error)
  }
}
</script>

<style scoped lang="scss">
.category {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 