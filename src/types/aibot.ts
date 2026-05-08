// AI Bot 模块类型定义

// ========== Tenant 相关 ==========

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: "active" | "paused" | "disabled";
  description?: string;
  sync_status?: string;
  created_at: string;
  updated_at: string;
}

export interface TenantAPIKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  status: "active" | "revoked";
  expires_at?: string;
  created_at: string;
}

export interface TenantQueryParams {
  page?: number;
  pageSize?: number;
  customer_id?: string;
  status?: string;
}

export interface TenantForm {
  id?: string;
  customer_id: string;
  name: string;
  slug?: string;
  description?: string;
  status?: string;
  goclaw_server_id?: string;
  goclaw_tenant_id?: string;
}

// ========== Channel 相关 ==========

export type ChannelType = "qqbot" | "feishu" | "weixin";

export interface Channel {
  id: string;
  tenant_id: string;
  channel_type: ChannelType;
  name?: string;
  display_name?: string;
  status: "active" | "paused" | "disabled";
  icon?: string;
  config: ChannelConfig;
  webhook_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ChannelConfig {
  // QQ Bot 配置
  app_id?: string;
  app_secret?: string;
  token?: string;
  webhook_path?: string;
  use_sandbox?: boolean;
  // 飞书配置
  callback_type?: "websocket" | "webhook";
  encrypt_key?: string;
  verification_token?: string;
  // 企业微信配置
  corp_id?: string;
  corp_secret?: string;
  agent_id?: number;
  encoding_aes_key?: string;
  webhook_path?: string;
}

export interface ChannelForm {
  id?: string;
  tenant_id: string;
  channel_type: ChannelType;
  config: ChannelConfig;
  icon?: string;
}

// ========== Binding 相关 ==========

export interface BotBinding {
  id: string;
  tenant_id: string;
  agent_id: string;
  agent_name: string;
  priority: number;
  status: string;
}

export interface BindAgentForm {
  tenant_id: string;
  agent_id: string;
  priority?: number;
}

// ========== Provider 相关 ==========

export interface ProviderInfo {
  id: string;
  name: string;
  display_name: string;
  provider_type: string;
  enabled: boolean;
  models: string[];
}

export interface ProviderDetail {
  id: string;
  name: string;
  display_name: string;
  provider_type: string;
  api_base: string;
  enabled: boolean;
  models: ModelInfo[];
  created_at: string;
  updated_at: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  display_name: string;
}

export interface ProviderForm {
  id?: string;
  name: string;
  type: string;
  mode?: string;
  api_key?: string;
  base_url?: string;
  config?: Record<string, string>;
}

export interface ProviderUpdateForm {
  name?: string;
  api_key?: string;
  base_url?: string;
  config?: Record<string, string>;
  status?: string;
}

export interface ProviderVerifyForm {
  model?: string;
}

export interface ProviderQueryParams {
  page?: number;
  pageSize?: number;
}

// ========== Agent 相关 (与 GoClaw AgentData 完全对应) ==========

export interface Agent {
  id: string;
  tenant_id: string;
  agent_key: string;
  display_name?: string;
  frontmatter?: string;
  owner_id: string;
  provider: string;
  model: string;
  context_window: number;
  max_tool_iterations: number;
  workspace: string;
  restrict_to_workspace: boolean;
  agent_type: "open" | "predefined";
  is_default: boolean;
  status: "active" | "inactive" | "summoning" | "summon_failed";
  budget_monthly_cents?: number;
  tools_config?: Record<string, any>;
  subagents_config?: Record<string, any>;
  sandbox_config?: Record<string, any>;
  memory_config?: Record<string, any>;
  compaction_config?: Record<string, any>;
  context_pruning?: Record<string, any>;
  other_config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AgentQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface AgentForm {
  id?: string;
  tenant_id?: string;
  provider?: string;
  model?: string;
  agent_key?: string;
  display_name?: string;
  frontmatter?: string;
  agent_type?: "open" | "predefined";
  context_window?: number;
  max_tool_iterations?: number;
  status?: "active" | "inactive";
  tools_config?: Record<string, any>;
  memory_config?: Record<string, any>;
  other_config?: Record<string, any>;
  self_evolve?: boolean;
  agent_description?: string;
  prompt_mode?: "full" | "task" | "minimal" | "none";
}

// ========== GoClawServer 相关 ==========

export interface GoClawServer {
  id: string;
  name: string;
  base_url: string;
  // api_key removed — was confusing gateway_token
  status: "active" | "inactive" | "maintaining";
  load: number;
  tenant_count: number;
  is_default: boolean;
  gateway_token?: string;
  // Health monitoring (computed)
  health_status?: "healthy" | "unhealthy" | "unknown";
  last_health_check?: string;
  response_time_ms?: number;
  consec_errors?: number;
  priority?: number;
  max_load?: number;
  region?: string;
  created_at: string;
  updated_at: string;
}

export interface GoClawServerQueryParams {
  page?: number;
  pageSize?: number;
  status?: string;
}

export interface GoClawServerForm {
  id?: string;
  name: string;
  base_url: string;
  api_key?: string;
  is_default?: boolean;
}

export interface UnifiedUser {
  id: string;
  tenant_id: string;
  user_name?: string;
  phone?: string;
  email?: string;
  channel_users?: Record<string, string>;
  status: "active" | "disabled";
  created_at: string;
  updated_at: string;
}

export interface UnifiedUserForm {
  tenant_id: string;
  user_name?: string;
  phone?: string;
  email?: string;
}

export interface ChannelUser {
  id: string;
  tenant_id: string;
  channel_type: string;
  channel_user_id: string;
  display_name?: string;
  status: string;
  unified_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ChannelUserForm {
  tenant_id: string;
  channel_type: string;
  channel_user_id: string;
  display_name?: string;
  unified_user_id?: string;
}

export interface ChannelUserBinding {
  unified_user_id: string;
}

// ========== 请求类型 ==========

export interface AssociateProviderRequest {
  provider_id: string;
  api_key: string;
}

// ========== AgentTemplate 相关 ==========

export interface AgentTemplate {
  id: string;
  name: string;
  display_name: string;
  emoji: string;
  system_prompt: string;
  frontmatter?: string;
  agent_type?: "open" | "predefined";
  is_default: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ========== Migration 相关 ==========

export type MigrationState =
  | "validating"
  | "creating_on_target"
  | "switching"
  | "verifying"
  | "cleaning_up"
  | "rolling_back"
  | "completed"
  | "completed_dirty"
  | "failed";

export interface Migration {
  id: string;
  tenant_id: string;
  source_server_id: string;
  target_server_id: string;
  state: MigrationState;
  error_message?: string;
  source_tenant_goclaw_id?: string;
  target_tenant_goclaw_id?: string;
  provider_map?: Record<string, string>;
  agent_map?: Record<string, string>;
  started_at: string;
  completed_at?: string;
  initiated_by: string;
  created_at: string;
  updated_at: string;
}

export interface MigrationQueryParams {
  page?: number;
  pageSize?: number;
  state?: MigrationState;
}

// ========== Skills 相关 ==========

export interface SkillData {
  id: string;
  name: string;
  description?: string;
  version?: string;
  agent_id?: string;
  user_id?: string;
  status?: string;
  config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SkillGrantData {
  skill_id: string;
  agent_id?: string;
  user_id?: string;
  created_at: string;
}

export interface RuntimeData {
  name: string;
  version: string;
  path: string;
}

// ========== MCP 相关 ==========

export interface MCPServerData {
  id: string;
  name: string;
  type: string;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  config?: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MCPToolData {
  name: string;
  description?: string;
  input_schema?: Record<string, any>;
}

export interface MCPGrantData {
  server_id: string;
  agent_id?: string;
  user_id?: string;
  created_at: string;
}

export interface MCPCredentialsData {
  server_id: string;
  user_id: string;
  credentials?: Record<string, any>;
  updated_at: string;
}

// ========== Tool Config 相关 ==========

export interface BuiltinToolData {
  name: string;
  description?: string;
  input_schema?: Record<string, any>;
  enabled: boolean;
  config?: Record<string, any>;
}

// ========== MCP Client 相关 ==========

export interface MCPClient {
  id: string;
  name: string;
  client_id: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface MCPClientForm {
  name: string;
  description: string;
  status?: string;
}

export interface MCPClientCreateResponse {
  client: MCPClient;
  token: string;
}