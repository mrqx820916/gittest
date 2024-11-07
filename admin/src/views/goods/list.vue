<template>
  <div class="goods-list">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="商品名称">
          <el-input
            v-model="searchForm.title"
            placeholder="请输入商品名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select
            v-model="searchForm.category"
            placeholder="请选择商品分类"
            clearable
          >
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 工具栏 -->
    <el-card class="toolbar-card">
      <template #header>
        <div class="card-header">
          <span>商品列表</span>
          <el-button type="primary" @click="onAdd">添加商品</el-button>
        </div>
      </template>
      
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.images[0]"
              :preview-src-list="row.images"
              fit="cover"
              style="width: 50px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名称" show-overflow-tooltip />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="100" />
        <el-table-column prop="category" label="分类" width="100">
          <template #default="{ row }">
            {{ getCategoryName(row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
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
              {{ row.status === 1 ? '下架' : '上架' }}
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
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加商品' : '编辑商品'"
      width="800px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="form.category">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number
            v-model="form.price"
            :precision="2"
            :step="0.1"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="原价" prop="originalPrice">
          <el-input-number
            v-model="form.originalPrice"
            :precision="2"
            :step="0.1"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="商品图片" prop="images">
          <el-upload
            v-model:file-list="fileList"
            action="/api/upload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述" prop="desc">
          <el-input
            v-model="form.desc"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="商品规格">
          <div v-for="(spec, index) in form.specs" :key="index" class="spec-item">
            <el-input
              v-model="spec.name"
              placeholder="规格名称"
              style="width: 200px"
            />
            <el-select
              v-model="spec.values"
              multiple
              filterable
              allow-create
              placeholder="规格值"
              style="width: 300px; margin-left: 10px"
            />
            <el-button
              type="danger"
              link
              @click="removeSpec(index)"
            >
              删除
            </el-button>
          </div>
          <el-button type="primary" link @click="addSpec">
            添加规格
          </el-button>
        </el-form-item>
        <el-form-item label="商品参数">
          <div v-for="(value, key) in form.params" :key="key" class="param-item">
            <el-input
              v-model="paramKeys[key]"
              placeholder="参数名"
              style="width: 200px"
              @change="updateParamKey(key)"
            />
            <el-input
              v-model="form.params[key]"
              placeholder="参数值"
              style="width: 300px; margin-left: 10px"
            />
            <el-button
              type="danger"
              link
              @click="removeParam(key)"
            >
              删除
            </el-button>
          </div>
          <el-button type="primary" link @click="addParam">
            添加参数
          </el-button>
        </el-form-item>
        <el-form-item label="商品详情" prop="detail">
          <!-- TODO: 富文本编辑器 -->
          <el-input
            v-model="form.detail"
            type="textarea"
            :rows="5"
          />
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
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = ref({
  title: '',
  category: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 分类数据
const categories = ref([])

// 对话框
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref()
const form = ref({
  title: '',
  category: '',
  price: 0,
  originalPrice: 0,
  desc: '',
  images: [],
  specs: [],
  params: {},
  detail: ''
})

// 图片上传
const fileList = ref([])
const previewVisible = ref(false)
const previewUrl = ref('')

// 参数名缓存
const paramKeys = ref({})

// 表单校验规则
const rules = {
  title: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品分类', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  images: [
    { required: true, message: '请上传商品图片', trigger: 'change' }
  ],
  desc: [
    { required: true, message: '请输入商品描述', trigger: 'blur' }
  ]
}

// 初始化数据
onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadData()
  ])
})

// 加载分类数据
const loadCategories = async () => {
  // TODO: 调用获取分类列表接口
  categories.value = []
}

// 加载表格数据
const loadData = async () => {
  loading.value = true
  try {
    // TODO: 调用获取商品列表接口
    tableData.value = []
    total.value = 0
  } catch (error) {
    console.error('加载商品列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const onSearch = () => {
  currentPage.value = 1
  loadData()
}

// 重置
const onReset = () => {
  searchForm.value = {
    title: '',
    category: ''
  }
  onSearch()
}

// 添加商品
const onAdd = () => {
  dialogType.value = 'add'
  form.value = {
    title: '',
    category: '',
    price: 0,
    originalPrice: 0,
    desc: '',
    images: [],
    specs: [],
    params: {},
    detail: ''
  }
  fileList.value = []
  paramKeys.value = {}
  dialogVisible.value = true
}

// 编辑商品
const onEdit = (row) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  fileList.value = row.images.map((url, index) => ({
    name: `image-${index}`,
    url
  }))
  paramKeys.value = { ...row.params }
  dialogVisible.value = true
}

// 切换商品状态
const onToggleStatus = async (row) => {
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
    // TODO: 调用更新商品状态接口
    ElMessage.success(`${row.status === 1 ? '下架' : '上架'}成功`)
    loadData()
  } catch {
    // 取消操作
  }
}

// 删除商品
const onDelete = async (row) => {
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
    // TODO: 调用删除商品接口
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
    // TODO: 调用添加/更新商品接口
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

const handleRemove = (file) => {
  const index = fileList.value.indexOf(file)
  if (index > -1) {
    fileList.value.splice(index, 1)
    form.value.images.splice(index, 1)
  }
}

const handleSuccess = (response, file) => {
  form.value.images.push(response.url)
}

// 规格相关方法
const addSpec = () => {
  form.value.specs.push({
    name: '',
    values: []
  })
}

const removeSpec = (index) => {
  form.value.specs.splice(index, 1)
}

// 参数相关方法
const addParam = () => {
  const key = `param${Object.keys(form.value.params).length}`
  form.value.params[key] = ''
  paramKeys.value[key] = ''
}

const removeParam = (key) => {
  delete form.value.params[key]
  delete paramKeys.value[key]
}

const updateParamKey = (oldKey) => {
  const newKey = paramKeys.value[oldKey]
  if (newKey && newKey !== oldKey) {
    form.value.params[newKey] = form.value.params[oldKey]
    delete form.value.params[oldKey]
  }
}

// 分页相关方法
const onSizeChange = () => {
  currentPage.value = 1
  loadData()
}

const onCurrentChange = () => {
  loadData()
}

// 工具方法
const getCategoryName = (categoryId) => {
  const category = categories.value.find(item => item.id === categoryId)
  return category ? category.name : '-'
}
</script>

<style scoped lang="scss">
.goods-list {
  .search-card {
    margin-bottom: 20px;
  }
  
  .toolbar-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
  
  .spec-item,
  .param-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style> 