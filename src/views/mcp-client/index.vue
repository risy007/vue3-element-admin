<template>
  <div class="app-container">
    <div class="header-banner">
      <div class="search-area">
        <el-input v-model="searchKeyword" placeholder="搜索客户端名称..." clearable class="search-input" @keyup.enter="handleSearch">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="状态" clearable class="filter-select" @change="handleSearch">
          <el-option label="全部" value="" />
          <el-option label="活跃" value="active" />
          <el-option label="已禁用" value="disabled" />
        </el-select>
        <el-button type="primary" @click="openCreateDrawer">创建新客户端</el-button>
      </div>
      <div class="stats-area">
        <div class="stat-item" v-for="s in stats" :key="s.value" @click="filterStatus = s.value; handleSearch()">
          <span class="stat-count" :class="s.class">{{ s.count }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <div v-loading="loading" class="card-grid">
      <div
        v-for="item in filteredClients"
        :key="item.id"
        class="card"
        :class="{ 'is-inactive': item.status === 'disabled' }"
      >
        <div class="card-header" :class="'card-header--' + item.status">
          <div class="card-icon">
            <el-icon :size="20"><Connection /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-name">{{ item.name }}</div>
            <div class="card-client-id">{{ item.client_id }}</div>
          </div>
          <el-tag :type="statusType(item.status)" size="small" effect="dark">{{ statusText(item.status) }}</el-tag>
        </div>

        <div class="card-body">
          <div class="card-body-row" v-if="item.description">
            <span class="body-label">描述</span>
            <span class="body-value">{{ item.description }}</span>
          </div>
          <div class="card-body-row">
            <span class="body-label">创建时间</span>
            <span class="body-value">{{ formatTime(item.created_at) }}</span>
          </div>
        </div>

        <div class="card-footer">
          <el-button size="small" @click="openEditDrawer(item)">编辑</el-button>
          <el-button
            v-if="item.status === 'active'"
            type="warning"
            size="small"
            @click="handleToggleStatus(item)"
          >禁用</el-button>
          <el-button
            v-if="item.status === 'disabled'"
            type="success"
            size="small"
            @click="handleToggleStatus(item)"
          >启用</el-button>
          <el-button type="danger" size="small" @click="handleDelete(item)">删除</el-button>
        </div>
      </div>
    </div>

    <el-pagination
      v-if="total > 0"
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next"
      class="pagination"
      @size-change="loadData"
      @current-change="loadData"
    />

    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑客户端' : '创建新客户端'"
      size="50%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" class="drawer-form">
        <el-form-item label="客户端名称" prop="name">
          <el-input v-model="formData.name" placeholder="输入客户端名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <el-drawer
      v-model="tokenDrawerVisible"
      title="Token 已生成"
      size="500px"
      :close-on-click-modal="false"
      :show-close="false"
      destroy-on-close
    >
      <el-alert type="warning" :closable="false" class="token-alert">
        <template #title>请妥善保管此 Token，系统不会再次显示</template>
      </el-alert>

      <div class="token-display">
        <el-input :model-value="generatedToken" readonly class="token-input" />
        <el-button type="primary" @click="copyToken">复制</el-button>
      </div>

      <template #footer>
        <el-button type="primary" @click="tokenDrawerVisible = false">我已安全保存 Token</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Connection } from "@element-plus/icons-vue";
import AIBotAPI from "@/api/aibot";
import type { MCPClient, MCPClientForm } from "@/types/aibot";

defineOptions({ name: "MCPClientManage" });

const loading = ref(false);
const clients = ref<MCPClient[]>([]);
const searchKeyword = ref("");
const filterStatus = ref("");
const pageNum = ref(1);
const pageSize = ref(20);
const total = ref(0);

const drawerVisible = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);
const formRef = ref();
const editingId = ref("");

const formData = reactive<MCPClientForm>({
  name: "",
  description: "",
});

const formRules = {
  name: [{ required: true, message: "请输入客户端名称", trigger: "blur" }],
};

const tokenDrawerVisible = ref(false);
const generatedToken = ref("");

const stats = computed(() => {
  const c = clients.value;
  return [
    { label: "活跃", value: "active", count: c.filter(i => i.status === "active").length, class: "stat-success" },
    { label: "已禁用", value: "disabled", count: c.filter(i => i.status === "disabled").length, class: "stat-info" },
    { label: "总计", value: "", count: c.length, class: "stat-total" },
  ];
});

const filteredClients = computed(() => {
  if (!searchKeyword.value && !filterStatus.value) return clients.value;
  return clients.value.filter((c) => {
    const kw = searchKeyword.value.toLowerCase();
    const matchKw = !kw || c.name?.toLowerCase().includes(kw) || c.client_id?.toLowerCase().includes(kw);
    const matchStatus = !filterStatus.value || c.status === filterStatus.value;
    return matchKw && matchStatus;
  });
});

function statusText(s: string) {
  const m: Record<string, string> = { active: "活跃", disabled: "已禁用" };
  return m[s] || s;
}

function statusType(s: string) {
  const m: Record<string, string> = { active: "success", disabled: "info" };
  return (m[s] || "info") as any;
}

function formatTime(t?: string) {
  if (!t) return "-";
  return new Date(t).toLocaleString("zh-CN");
}

async function loadData() {
  try {
    loading.value = true;
    const res = await AIBotAPI.getMCPClientPage({ page: pageNum.value, pageSize: pageSize.value });
    clients.value = res?.data || [];
    total.value = res?.page?.total || clients.value.length;
  } catch (e: any) {
    ElMessage.error(e.message || "加载失败");
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  pageNum.value = 1;
  loadData();
}

function resetForm() {
  formData.name = "";
  formData.description = "";
  formData.status = undefined;
}

function openCreateDrawer() {
  isEdit.value = false;
  editingId.value = "";
  resetForm();
  drawerVisible.value = true;
}

function openEditDrawer(item: MCPClient) {
  isEdit.value = true;
  editingId.value = item.id;
  formData.name = item.name;
  formData.description = item.description || "";
  drawerVisible.value = true;
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitLoading.value = true;

    if (isEdit.value) {
      await AIBotAPI.updateMCPClient(editingId.value, {
        name: formData.name,
        description: formData.description,
      });
      ElMessage.success("更新成功");
      drawerVisible.value = false;
      loadData();
    } else {
      const res = await AIBotAPI.createMCPClient({
        name: formData.name,
        description: formData.description,
      });
      drawerVisible.value = false;
      if (res?.token) {
        generatedToken.value = res.token;
        tokenDrawerVisible.value = true;
      }
      loadData();
    }
  } catch {
  } finally {
    submitLoading.value = false;
  }
}

function copyToken() {
  navigator.clipboard.writeText(generatedToken.value);
  ElMessage.success("已复制 Token");
}

async function handleToggleStatus(item: MCPClient) {
  const newStatus = item.status === "active" ? "disabled" : "active";
  const action = newStatus === "disabled" ? "禁用" : "启用";
  try {
    await ElMessageBox.confirm(`${action}「${item.name}」？`, `${action}确认`, {
      type: newStatus === "disabled" ? "warning" : "info",
    });
    await AIBotAPI.updateMCPClient(item.id, { status: newStatus });
    ElMessage.success(`已${action}`);
    loadData();
  } catch {
  }
}

async function handleDelete(item: MCPClient) {
  try {
    await ElMessageBox.confirm(`删除客户端「${item.name}」？删除后无法恢复`, "警告", { type: "error" });
    await AIBotAPI.deleteMCPClient(item.id);
    ElMessage.success("已删除");
    loadData();
  } catch {
  }
}

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.app-container { padding: 20px; }

.header-banner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; background: #fff; border: 1px solid #e4e7ed;
  border-radius: 4px; margin-bottom: 16px;
}
.search-area { display: flex; align-items: center; gap: 8px; }
.search-input { width: 240px; }
.filter-select { width: 120px; }

.stats-area {
  display: flex; gap: 20px;
}
.stat-item {
  display: flex; align-items: center; gap: 6px;
  cursor: pointer; padding: 4px 12px; border-radius: 4px; transition: background 0.2s;
  &:hover { background: #f5f7fa; }
}
.stat-count { font-size: 20px; font-weight: 600; }
.stat-label { font-size: 12px; color: #909399; }
.stat-success { color: #67c23a; }
.stat-info { color: #909399; }
.stat-total { color: #409eff; }

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: default;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &.is-inactive {
    opacity: 0.6;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  color: #fff;

  &--active { background: #67c23a; }
  &--disabled { background: #909399; }
}

.card-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.25);
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-name {
  font-size: 15px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-client-id {
  font-size: 11px;
  opacity: 0.85;
  margin-top: 2px;
  font-family: monospace;
}

.card-body {
  font-size: 13px;
  color: #606266;
  padding: 12px 16px;
}

.card-body-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  align-items: center;
}

.body-label {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.body-value {
  font-size: 13px;
  color: #303133;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 65%;
}

.card-footer {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
  flex-wrap: wrap;
}

.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }

.drawer-form { padding: 20px 10px; }
.drawer-footer { display: flex; justify-content: flex-end; gap: 12px; width: 100%; }

.token-alert { margin-bottom: 16px; }
.token-display { display: flex; gap: 8px; margin-bottom: 16px; }
.token-input { font-family: monospace; }
</style>
