<template>
  <div class="comment">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>评价管理</span>
        </div>
      </template>
      
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="goods.title" label="商品" />
        <el-table-column prop="user.nickname" label="用户" />
        <el-table-column prop="content" label="评价内容" show-overflow-tooltip />
        <el-table-column prop="rating" label="评分" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled />
          </template>
        </el-table-column>
        <el-table-column label="评价图片" width="150">
          <template #default="{ row }">
            <el-image
              v-if="row.images?.length"
              :src="row.images[0]"
              :preview-src-list="row.images"
              fit="cover"
              style="width: 50px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="评价时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="onReply(row)"
            >
              {{ row.reply ? '修改回复' : '回复' }}
            </el-button>
            <el-button
              link
              :type="row.status === 1 ? 'warning' : 'success'"
              @click="onToggleStatus(row)"
            >
              {{ row.status === 1 ? '隐藏' : '显示' }}
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
    
    <!-- 回复对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="回复评价"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="回复内容" prop="reply">
          <el-input
            v-model="form.reply"
            type="textarea"
            :rows="3"
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

// 表格数据
const loading = ref(false)
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const formRef = ref()
const form = ref({
  reply: ''
})
const currentComment = ref(null)

// 表单校验规则
const rules = {
  reply: [
    { required: true, message: '请输入回复内容', trigger: 'blur' }
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
    // TODO: 调用获取评价列表接口
    tableData.value = []
    total.value = 0
  } catch (error) {
    console.error('加载评价列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 回复评价
const onReply = (row) => {
  currentComment.value = row
  form.value.reply = row.reply || ''
  dialogVisible.value = true
}

// 切换状态
const onToggleStatus = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 1 ? '隐藏' : '显示'}该评价吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用更新评价状态接口
    ElMessage.success(`${row.status === 1 ? '隐藏' : '显示'}成功`)
    loadData()
  } catch {
    // 取消操作
  }
}

// 提交回复
const onSubmit = async (formEl) => {
  if (!formEl) return
  
  try {
    await formEl.validate()
    // TODO: 调用回复评价接口
    ElMessage.success('回复成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('表单校验失败:', error)
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
const formatDate = (date) => {
  return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : '-'
}
</script>

<style scoped lang="scss">
.comment {
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style> 