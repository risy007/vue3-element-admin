import request from "@/utils/request";
import type { PageResult } from "@/types";
import type {
  Tenant,
  TenantQueryParams,
  TenantForm,
  Channel,
  ChannelForm,
  BotBinding,
  BindAgentForm,
  Agent,
  AgentQueryParams,
  AgentForm,
  ProviderInfo,
  ProviderDetail,
  ProviderForm,
  ProviderUpdateForm,
  ProviderVerifyForm,
  GoClawServer,
  GoClawServerQueryParams,
  GoClawServerForm,
  Migration,
  MigrationQueryParams,
  AgentTemplate,
  UnifiedUser,
  UnifiedUserForm,
  ChannelUser,
  ChannelUserForm,
  ChannelUserBinding,
  MCPClient,
  MCPClientForm,
  MCPClientCreateResponse,
} from "@/types/aibot";

const AIBOT_BASE_URL = "/api/v1/aibot";

const AIBotAPI = {
  // ========== Tenant API ==========

  /** 获取 Tenant 分页列表 */
  getTenantPage(params: TenantQueryParams) {
    return request<any, PageResult<Tenant>>({
      url: `${AIBOT_BASE_URL}/tenants`,
      method: "get",
      params,
    });
  },

  /** 获取 Tenant 详情 */
  getTenant(id: string) {
    return request<any, Tenant>({
      url: `${AIBOT_BASE_URL}/tenants/${id}`,
      method: "get",
    });
  },

  /** 创建 Tenant */
  createTenant(data: TenantForm) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants`,
      method: "post",
      data,
    });
  },

  /** 认领 Tenant（从 GoClaw 同步已有租户及其配置数据） */
  claimTenant(data: TenantForm) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/claim`,
      method: "post",
      data,
    });
  },

  /** 更新 Tenant */
  updateTenant(id: string, data: TenantForm) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${id}`,
      method: "put",
      data,
    });
  },

  /** 删除 Tenant */
  deleteTenant(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${id}`,
      method: "delete",
    });
  },

  /** 暂停 Tenant */
  pauseTenant(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${id}/pause`,
      method: "post",
    });
  },

  /** 恢复 Tenant */
  resumeTenant(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${id}/resume`,
      method: "post",
    });
  },

  /** 启用 Tenant */
  enableTenant(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${id}/enable`,
      method: "post",
    });
  },

  /** 禁用 Tenant */
  disableTenant(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${id}/disable`,
      method: "post",
    });
  },

  // ========== Channel API ==========

  /** 获取 Tenant 的渠道列表 */
  getChannels(tenantId: string) {
    return request<any, { list: Channel[]; total: number }>({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/channels`,
      method: "get",
    });
  },

  /** 创建 QQ Bot 渠道 */
  createQQBotChannel(tenantId: string, data: ChannelForm) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/channels/qqbot`,
      method: "post",
      data,
    });
  },

  /** 创建飞书渠道 */
  createFeishuChannel(tenantId: string, data: ChannelForm) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/channels/feishu`,
      method: "post",
      data,
    });
  },

  /** 创建企业微信渠道 */
  createWeixinChannel(tenantId: string, data: ChannelForm) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/channels/weixin`,
      method: "post",
      data,
    });
  },

  /** 更新渠道 */
  updateChannel(channelId: string, data: Partial<ChannelForm>) {
    return request({
      url: `${AIBOT_BASE_URL}/channels/${channelId}`,
      method: "put",
      data,
    });
  },

  /** 删除渠道 */
  deleteChannel(channelId: string) {
    return request({
      url: `${AIBOT_BASE_URL}/channels/${channelId}`,
      method: "delete",
    });
  },

  /** 验证渠道配置 */
  validateChannel(channelId: string) {
    return request({
      url: `${AIBOT_BASE_URL}/channels/${channelId}/validate`,
      method: "post",
    });
  },

  // ========== Binding API (Tenant-based) ==========

  /** 获取 Tenant 的绑定列表 */
  getBindings(tenantId: string) {
    return request<any, BotBinding[]>({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/bindings`,
      method: "get",
    });
  },

  /** 绑定 Agent */
  bindAgent(data: BindAgentForm) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${data.tenant_id}/bindings`,
      method: "post",
      data,
    });
  },

  /** 解绑 Agent */
  unbindAgent(tenantId: string, agentId: string) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/bindings/${agentId}`,
      method: "delete",
    });
  },

  /** 获取 Tenant 绑定的 Agent 列表 */
  getTenantAgents(tenantId: string) {
    return request<any, { data: BotBinding[] }>({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/bindings`,
      method: "get",
    });
  },

  // ========== Agent API ==========

  /** 获取 Agent 分页列表 */
  getAgentPage(params: AgentQueryParams) {
    return request<any, PageResult<Agent>>({
      url: `${AIBOT_BASE_URL}/agents`,
      method: "get",
      params,
    });
  },

  /** 获取 Agent 详情 */
  getAgent(id: string) {
    return request<any, Agent>({
      url: `${AIBOT_BASE_URL}/agents/${id}`,
      method: "get",
    });
  },

  /** 创建 Agent */
  createAgent(data: AgentForm) {
    return request({
      url: `${AIBOT_BASE_URL}/agents`,
      method: "post",
      data,
    });
  },

  /** 更新 Agent */
  updateAgent(id: string, data: Partial<AgentForm> & { tenant_id: string }) {
    return request({
      url: `${AIBOT_BASE_URL}/agents/${id}?tenant_id=${data.tenant_id}`,
      method: "put",
      data,
    });
  },

  /** 删除 Agent */
  deleteAgent(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/agents/${id}`,
      method: "delete",
    });
  },

  /** 获取 Provider 列表（包含模型） */
  getProviders(params?: { tenant_id?: string; server_id?: string }) {
    return request<any, ProviderInfo[]>({
      url: `${AIBOT_BASE_URL}/providers`,
      method: "get",
      params,
    });
  },

  /** 获取 Provider 详情 */
  getProvider(id: string) {
    return request<any, ProviderDetail>({
      url: `${AIBOT_BASE_URL}/providers/${id}`,
      method: "get",
    });
  },

  /** 创建 Provider */
  createProvider(data: ProviderForm) {
    return request<any, ProviderDetail>({
      url: `${AIBOT_BASE_URL}/providers`,
      method: "post",
      data,
    });
  },

  /** 获取 Provider 的模型列表 */
  getProviderModels(providerId: string, params?: { tenant_id?: string; server_id?: string }) {
    return request<any, { models: string[] }>({
      url: `${AIBOT_BASE_URL}/providers/${providerId}/models`,
      method: "get",
      params,
    });
  },

  /** 预验证 Provider（不实际创建，只验证连接并获取模型列表） */
  preVerifyProvider(data: { type: string; base_url: string; api_key: string }) {
    return request<any, { models: string[]; provider_id: string }>({
      url: `${AIBOT_BASE_URL}/providers/pre-verify`,
      method: "post",
      data,
    });
  },

  /** 更新 Provider */
  updateProvider(id: string, data: ProviderUpdateForm) {
    return request({
      url: `${AIBOT_BASE_URL}/providers/${id}`,
      method: "put",
      data,
    });
  },

  /** 删除 Provider */
  deleteProvider(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/providers/${id}`,
      method: "delete",
    });
  },

  /** 验证 Provider */
  verifyProvider(id: string, data: ProviderVerifyForm, params?: { tenant_id?: string; server_id?: string }) {
    return request({
      url: `${AIBOT_BASE_URL}/providers/${id}/verify`,
      method: "post",
      data,
      params,
    });
  },

  // ========== AgentTemplate API ==========

  /** 获取 Agent 模板列表 */
  getAgentTemplates() {
    return request<any, AgentTemplate[]>({
      url: `${AIBOT_BASE_URL}/agent-templates`,
      method: "get",
    });
  },

  /** 获取 Agent 模板详情 */
  getAgentTemplate(id: string) {
    return request<any, AgentTemplate>({
      url: `${AIBOT_BASE_URL}/agent-templates/${id}`,
      method: "get",
    });
  },

  // ========== Tenant 迁移 API ==========

  /** 迁移 Tenant 到目标服务器 */
  migrateTenant(tenantId: string, targetServerId: string) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/migrate`,
      method: "post",
      data: {
        target_server_id: targetServerId,
      },
    });
  },

  // ========== Migration 管理 API ==========

  /** 获取迁移列表 */
  getMigrationPage(params: MigrationQueryParams) {
    return request<any, PageResult<Migration>>({
      url: `${AIBOT_BASE_URL}/migrations`,
      method: "get",
      params,
    });
  },

  /** 获取迁移详情 */
  getMigration(id: string) {
    return request<any, Migration>({
      url: `${AIBOT_BASE_URL}/migrations/${id}`,
      method: "get",
    });
  },

  /** 取消迁移 */
  cancelMigration(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/migrations/${id}/cancel`,
      method: "post",
    });
  },

  // ========== API Key 管理 ==========

  /** 轮换租户 API Key */
  rotateTenantAPIKey(tenantId: string) {
    return request<any, { api_key: string }>({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/api-key/rotate`,
      method: "post",
    });
  },

  /** 从 GoClaw 同步 Providers */
  syncProvidersFromGoClaw(tenantId: string) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/sync-providers`,
      method: "post",
    });
  },

  /** 从 GoClaw 同步 Agents */
  syncAgentsFromGoClaw(tenantId: string) {
    return request({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/sync-agents`,
      method: "post",
    });
  },

  /** 获取租户 API Key 列表 */
  getTenantAPIKeys(tenantId: string) {
    return request<any, TenantAPIKey[]>({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/api-keys`,
      method: "get",
    });
  },

  /** 获取租户下的 UnifiedUser 列表 */
  getUnifiedUsers(tenantId: string) {
    return request<any, UnifiedUser[]>({
      url: `${AIBOT_BASE_URL}/unified-users`,
      method: "get",
      params: { tenant_id: tenantId },
    });
  },

  /** 创建 UnifiedUser */
  createUnifiedUser(data: UnifiedUserForm) {
    return request<any, UnifiedUser>({
      url: `${AIBOT_BASE_URL}/unified-users`,
      method: "post",
      data,
    });
  },

  /** 更新 UnifiedUser */
  updateUnifiedUser(id: string, data: Partial<UnifiedUserForm> & { status?: string }) {
    return request({
      url: `${AIBOT_BASE_URL}/unified-users/${id}`,
      method: "put",
      data,
    });
  },

  /** 更新 UnifiedUser 状态 */
  updateUnifiedUserStatus(id: string, status: string) {
    return request({
      url: `${AIBOT_BASE_URL}/unified-users/${id}/status`,
      method: "put",
      data: { status },
    });
  },

  /** 删除 UnifiedUser */
  deleteUnifiedUser(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/unified-users/${id}`,
      method: "delete",
    });
  },

  // ========== Channel User API ==========

  /** 获取渠道用户分页列表 */
  getChannelUsers(params: { page?: number; pageSize?: number; tenant_id?: string }) {
    return request<any, PageResult<ChannelUser>>({
      url: `${AIBOT_BASE_URL}/channel-users`,
      method: "get",
      params,
    });
  },

  /** 获取未绑定的渠道用户 */
  getUnboundChannelUsers(tenantId: string) {
    return request<any, ChannelUser[]>({
      url: `${AIBOT_BASE_URL}/channel-users/unbound`,
      method: "get",
      params: { tenant_id: tenantId },
    });
  },

  /** 创建渠道用户 */
  createChannelUser(data: ChannelUserForm) {
    return request<any, ChannelUser>({
      url: `${AIBOT_BASE_URL}/channel-users`,
      method: "post",
      data,
    });
  },

  /** 更新渠道用户显示名称 */
  updateChannelUserDisplayName(id: string, displayName: string) {
    return request({
      url: `${AIBOT_BASE_URL}/channel-users/${id}`,
      method: "put",
      data: { display_name: displayName },
    });
  },

  /** 删除渠道用户 */
  deleteChannelUser(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/channel-users/${id}`,
      method: "delete",
    });
  },

  /** 更新渠道用户状态 */
  updateChannelUserStatus(id: string, status: string) {
    return request({
      url: `${AIBOT_BASE_URL}/channel-users/${id}/status`,
      method: "put",
      data: { status },
    });
  },

  /** 绑定渠道用户到统一用户 */
  bindChannelUser(channelUserId: string, unifiedUserId: string) {
    return request({
      url: `${AIBOT_BASE_URL}/channel-users/${channelUserId}/bind`,
      method: "post",
      data: { unified_user_id: unifiedUserId },
    });
  },

  /** 解绑渠道用户 */
  unbindChannelUser(channelUserId: string) {
    return request({
      url: `${AIBOT_BASE_URL}/channel-users/${channelUserId}/unbind`,
      method: "post",
    });
  },

  /** 创建租户 API Key */
  createTenantAPIKey(tenantId: string, data: { name: string; scopes: string[]; expires_in?: number }) {
    return request<any, TenantAPIKey>({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/api-keys`,
      method: "post",
      data,
    });
  },

  /** 撤销租户 API Key */
  revokeTenantAPIKey(tenantId: string, keyId: string) {
    return request<any, any>({
      url: `${AIBOT_BASE_URL}/tenants/${tenantId}/api-keys/${keyId}/revoke`,
      method: "post",
    });
  },

  // ========== GoClawServer API ==========

  /** 获取 GoClawServer 分页列表 */
  getGoClawServerPage(params: GoClawServerQueryParams) {
    return request<any, PageResult<GoClawServer>>({
      url: `${AIBOT_BASE_URL}/goclaw-servers`,
      method: "get",
      params,
    });
  },

  /** 获取 GoClawServer 详情 */
  getGoClawServer(id: string) {
    return request<any, GoClawServer>({
      url: `${AIBOT_BASE_URL}/goclaw-servers/${id}`,
      method: "get",
    });
  },

  /** 创建 GoClawServer */
  createGoClawServer(data: {
    name: string;
    base_url: string;
    is_default?: boolean;
    gateway_token?: string;
    encryption_key?: string;
    postgres_dsn?: string;
    auto_upgrade?: boolean;
    owner_ids?: string;
  }) {
    return request({
      url: `${AIBOT_BASE_URL}/goclaw-servers`,
      method: "post",
      data: {
        name: data.name,
        base_url: data.base_url,
        is_default: data.is_default,
        gateway_token: data.gateway_token,
        encryption_key: data.encryption_key,
        postgres_dsn: data.postgres_dsn,
        auto_upgrade: data.auto_upgrade,
        owner_ids: data.owner_ids,
      },
    });
  },

  /** 更新 GoClawServer */
  updateGoClawServer(id: string, data: {
    name: string;
    base_url: string;
    is_default?: boolean;
    gateway_token?: string;
    encryption_key?: string;
    postgres_dsn?: string;
    auto_upgrade?: boolean;
    owner_ids?: string;
  }) {
    return request({
      url: `${AIBOT_BASE_URL}/goclaw-servers/${id}`,
      method: "put",
      data: {
        name: data.name,
        base_url: data.base_url,
        is_default: data.is_default,
        gateway_token: data.gateway_token,
        encryption_key: data.encryption_key,
        postgres_dsn: data.postgres_dsn,
        auto_upgrade: data.auto_upgrade,
        owner_ids: data.owner_ids,
      },
    });
  },

  /** 删除 GoClawServer */
  deleteGoClawServer(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/goclaw-servers/${id}`,
      method: "delete",
    });
  },

  /** 健康检查 GoClawServer */
  healthCheckGoClawServer(id: string) {
    return request<any, { status: string; latency_ms: number }>({
      url: `${AIBOT_BASE_URL}/goclaw-servers/${id}/health`,
      method: "post",
    });
  },

  // ========== MCP Client API ==========

  getMCPClientPage(params: { page?: number; pageSize?: number }) {
    return request<any, PageResult<MCPClient>>({
      url: `${AIBOT_BASE_URL}/mcp-clients`,
      method: "get",
      params,
    });
  },

  getMCPClient(id: string) {
    return request<any, MCPClient>({
      url: `${AIBOT_BASE_URL}/mcp-clients/${id}`,
      method: "get",
    });
  },

  createMCPClient(data: MCPClientForm) {
    return request<any, MCPClientCreateResponse>({
      url: `${AIBOT_BASE_URL}/mcp-clients`,
      method: "post",
      data,
    });
  },

  updateMCPClient(id: string, data: Partial<MCPClientForm>) {
    return request({
      url: `${AIBOT_BASE_URL}/mcp-clients/${id}`,
      method: "put",
      data,
    });
  },

  deleteMCPClient(id: string) {
    return request({
      url: `${AIBOT_BASE_URL}/mcp-clients/${id}`,
      method: "delete",
    });
  },
};

export default AIBotAPI;

// ========== GoClaw Server 详情子路由 ==========

export function getGoClawServerTenants(serverId: string) {
  return request<any, PageResult<any>>({
    url: `${AIBOT_BASE_URL}/goclaw-servers/${serverId}/tenants`,
    method: "get",
  });
}

export function checkGoClawTenant(serverId: string, customerId: string) {
  return request<any, { exists: boolean; tenant?: any }>({
    url: `${AIBOT_BASE_URL}/goclaw-servers/${serverId}/check-tenant`,
    method: "get",
    params: { customer_id: customerId },
  });
}

export function getGoClawServerAgents(serverId: string) {
  return request<any, PageResult<any>>({
    url: `${AIBOT_BASE_URL}/goclaw-servers/${serverId}/agents`,
    method: "get",
  });
}

export function getGoClawServerProviders(serverId: string) {
  return request<any, PageResult<any>>({
    url: `${AIBOT_BASE_URL}/goclaw-servers/${serverId}/providers`,
    method: "get",
  });
}

// ========== 集群管理 ==========

export function registerClusterNode(data: any) {
  return request({ url: `${AIBOT_BASE_URL}/cluster/nodes/register`, method: "post", data });
}

export function clusterNodeHeartbeat(nodeId: string, data: any) {
  return request({ url: `${AIBOT_BASE_URL}/cluster/nodes/${nodeId}/heartbeat`, method: "post", data });
}

export function drainClusterNode(nodeId: string) {
  return request({ url: `${AIBOT_BASE_URL}/cluster/nodes/${nodeId}/drain`, method: "post" });
}

export function unregisterClusterNode(nodeId: string) {
  return request({ url: `${AIBOT_BASE_URL}/cluster/nodes/${nodeId}`, method: "delete" });
}

export function getClusterNodes() {
  return request<any, any[]>({ url: `${AIBOT_BASE_URL}/cluster/nodes`, method: "get" });
}

export function getClusterMetrics() {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/cluster/metrics`, method: "get" });
}

export function setTenantQuota(data: any) {
  return request({ url: `${AIBOT_BASE_URL}/cluster/quotas`, method: "post", data });
}

export function getTenantQuota(tenantId: string) {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/cluster/quotas/${tenantId}`, method: "get" });
}

export function checkTenantQuota(data: any) {
  return request({ url: `${AIBOT_BASE_URL}/cluster/quotas/check`, method: "post", data });
}

// ========== Teams ==========

export function getTeamEvents(teamId: string, params?: { tenant_id: string }) {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/teams/${teamId}/events`, method: "get", params });
}

// ========== Skills ==========

export function getSkills(params?: { tenant_id: string }) {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/skills`, method: "get", params });
}

export function getSkill(id: string, params?: { tenant_id: string }) {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/skills/${id}`, method: "get", params });
}

export function updateSkill(id: string, data: any, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/skills/${id}`, method: "put", data, params });
}

export function deleteSkill(id: string, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/skills/${id}`, method: "delete", params });
}

export function toggleSkill(id: string, data: { enabled: boolean }, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/skills/${id}/toggle`, method: "post", data, params });
}

export function getSkillVersions(id: string, params?: { tenant_id: string }) {
  return request<any, any[]>({ url: `${AIBOT_BASE_URL}/skills/${id}/versions`, method: "get", params });
}

export function getSkillFiles(id: string, params?: { tenant_id: string }) {
  return request<any, any[]>({ url: `${AIBOT_BASE_URL}/skills/${id}/files`, method: "get", params });
}

export function getSkillFile(id: string, path: string, params?: { tenant_id: string }) {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/skills/${id}/files/${encodeURIComponent(path)}`, method: "get", params });
}

export function grantSkillToAgent(id: string, data: { agent_id: string }, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/skills/${id}/grants/agent`, method: "post", data, params });
}

export function revokeSkillFromAgent(id: string, agentId: string, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/skills/${id}/grants/agent/${agentId}`, method: "delete", params });
}

export function setSkillTenantConfig(id: string, data: any, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/skills/${id}/tenant-config`, method: "put", data, params });
}

export function deleteSkillTenantConfig(id: string, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/skills/${id}/tenant-config`, method: "delete", params });
}

export function rescanSkillDeps(params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/skills/deps/rescan`, method: "post", params });
}

export function installSkillDeps(params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/skills/deps/install`, method: "post", params });
}

export function getSkillRuntimes(params?: { tenant_id: string }) {
  return request<any, any[]>({ url: `${AIBOT_BASE_URL}/skills/runtimes`, method: "get", params });
}

// ========== MCP ==========

export function getMCPServers(params?: { tenant_id: string }) {
  return request<any, any[]>({ url: `${AIBOT_BASE_URL}/mcp/servers`, method: "get", params });
}

export function createMCPServer(data: any, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/mcp/servers`, method: "post", data, params });
}

export function getMCPServer(id: string, params?: { tenant_id: string }) {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/mcp/servers/${id}`, method: "get", params });
}

export function updateMCPServer(id: string, data: any, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/mcp/servers/${id}`, method: "put", data, params });
}

export function deleteMCPServer(id: string, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/mcp/servers/${id}`, method: "delete", params });
}

export function testMCPConnection(data: any, params?: { tenant_id: string }) {
  return request<any, { success: boolean; error?: string }>({ url: `${AIBOT_BASE_URL}/mcp/servers/test`, method: "post", data, params });
}

export function getMCPServerTools(id: string, params?: { tenant_id: string }) {
  return request<any, any[]>({ url: `${AIBOT_BASE_URL}/mcp/servers/${id}/tools`, method: "get", params });
}

export function getMCPServerGrants(id: string, params?: { tenant_id: string }) {
  return request<any, any[]>({ url: `${AIBOT_BASE_URL}/mcp/servers/${id}/grants`, method: "get", params });
}

export function grantMCPToAgent(id: string, data: { agent_id: string; tool_allow?: string[]; tool_deny?: string[] }, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/mcp/servers/${id}/grants/agent`, method: "post", data, params });
}

export function revokeMCPFromAgent(id: string, agentId: string, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/mcp/servers/${id}/grants/agent/${agentId}`, method: "delete", params });
}

export function setMCPCredentials(id: string, data: any, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/mcp/servers/${id}/credentials`, method: "put", data, params });
}

export function getMCPCredentials(id: string, params?: { tenant_id: string }) {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/mcp/servers/${id}/credentials`, method: "get", params });
}

export function deleteMCPCredentials(id: string, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/mcp/servers/${id}/credentials`, method: "delete", params });
}

// ========== Tool Config ==========

export function getBuiltinTools(params?: { tenant_id: string }) {
  return request<any, any[]>({ url: `${AIBOT_BASE_URL}/tools/builtin`, method: "get", params });
}

export function getBuiltinTool(name: string, params?: { tenant_id: string }) {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/tools/builtin/${encodeURIComponent(name)}`, method: "get", params });
}

export function updateBuiltinTool(name: string, data: any, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/tools/builtin/${encodeURIComponent(name)}`, method: "put", data, params });
}

export function setBuiltinToolTenantConfig(name: string, data: any, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/tools/builtin/${encodeURIComponent(name)}/tenant-config`, method: "put", data, params });
}

export function deleteBuiltinToolTenantConfig(name: string, params?: { tenant_id: string }) {
  return request({ url: `${AIBOT_BASE_URL}/tools/builtin/${encodeURIComponent(name)}/tenant-config`, method: "delete", params });
}

// ========== Sessions ==========

export function getSessions(params?: { tenant_id: string; page?: number; pageSize?: number }) {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/sessions`, method: "get", params });
}

export function getSession(id: string, params?: { tenant_id: string }) {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/sessions/${id}`, method: "get", params });
}

// ========== Overview ==========

export function getAibotOverview() {
  return request<any, any>({ url: `${AIBOT_BASE_URL}/overview`, method: "get" });
}

// ========== Cron Jobs ==========

export function getCronJobs() {
  return request<any, any[]>({ url: `${AIBOT_BASE_URL}/cron-jobs`, method: "get" });
}
