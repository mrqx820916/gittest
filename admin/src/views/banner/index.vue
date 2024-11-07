<template>
  <div class="banner">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>轮播图列表</span>
          <el-button type="primary" @click="onAdd">添加轮播图</el-button>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="图片" width="200">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              :preview-src-list="[row.image]"
              fit="cover"
              style="width: 150px; height: 80px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="url" label="跳转链接" show-overflow-tooltip />
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
      :title="dialogType === 'add' ? '添加轮播图' : '编辑轮播图'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="图片" prop="image">
          <el-upload
            v-model:file-list="fileList"
            action="/api/upload"
            list-type="picture-card"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接" prop="url">
          <el-input v-model="form.url" />
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
    
    <!-- 图片预览 -->
    <el-dialog v-model="previewVisible">
      <img w-full :src="previewUrl" alt="Preview Image">
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 表格数据
const loading = ref(false)
const tableData = ref([])

// 对话框
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref()
const form = ref({
  image: '',
  url: '',
  sort: 0
})

// 图片上传
const fileList = ref([])
const previewVisible = ref(false)
const previewUrl = ref('')

// 表单校验规则
const rules = {
  image: [
    { required: true, message: '请上传图片', trigger: 'change' }
  ],
  url: [
    { required: true, message: '请输入跳转链接', trigger: 'blur' }
  ]
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // TODO: 调用获取轮播图列表接口
    tableData.value = []
  } catch (error) {
    console.error('加载轮播图列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 添加轮播图
const onAdd = () => {
  dialogType.value = 'add'
  form.value = {
    image: '',
    url: '',
    sort: 0
  }
  fileList.value = []
  dialogVisible.value = true
}

// 编辑轮播图
const onEdit = (row) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  fileList.value = [
    {
      name: 'image',
      url: row.image
    }
  ]
  dialogVisible.value = true
}

// 切换状态
const onToggleStatus = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 1 ? '禁用' : '启用'}该轮播图吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用更新轮播图状态接口
    ElMessage.success(`${row.status === 1 ? '禁用' : '启用'}成功`)
    loadData()
  } catch {
    // 取消操作
  }
}

// 删除轮播图
const onDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该轮播图吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用删除轮播图接口
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
    // TODO: 调用添加/更新轮播图接口
    ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('表单校验失败:', error)
  }
}

// 图片上传相关方法
const handlePictureCardPreview = (file) => {
  previewUrl.value = file.url
  previewVisible.value = true
}

const handleRemove = () => {
  form.value.image = ''
}

const handleSuccess = (response, file) => {
  form.value.image = response.url
}
</script>

<style scoped lang="scss">
.banner {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 