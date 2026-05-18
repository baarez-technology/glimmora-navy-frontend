import { api } from "./client";
import type {
  AIAuditEntry,
  AIModelInfo,
  AssessResponse,
  BackendUser,
  CertVerification,
  Certification,
  ChatMessage,
  ChatResponse,
  CohortAnalytics,
  DoctrineDoc,
  DoctrineGrounding,
  DocumentationTopic,
  DomainWeakness,
  FleetAnalytics,
  HealthMatrix,
  LoginResponse,
  Paginated,
  PendingCertification,
  PredictiveAnalytics,
  RefreshResponse,
  Scenario,
  Ship,
  ShipTwinState,
  SystemAuditEntry,
  SystemGraph,
  SystemMetrics,
  T2VJob,
  TraineeAnalytics,
  TrainingSession,
  UserAnalytics,
  UUID,
} from "./types";

// ============================================================ AUTH
export const auth = {
  login: (service_number: string, password: string) =>
    api.post<LoginResponse>(
      "/api/auth/login",
      { service_number, password },
      { skipAuth: true }
    ),
  refresh: (refresh_token: string) =>
    api.post<RefreshResponse>(
      "/api/auth/refresh",
      { refresh_token },
      { skipAuth: true }
    ),
  logout: () => api.post<null>("/api/auth/logout"),
  me: () => api.get<BackendUser>("/api/auth/me"),
};

// ============================================================ USERS
export const users = {
  rolesSummary: () => api.get<Record<string, number>>("/api/users/roles/summary"),
  list: (params: { page?: number; page_size?: number; role?: string } = {}) =>
    api.get<Paginated<BackendUser>>("/api/users", { query: params }),
  trainees: (params: { page?: number; page_size?: number } = {}) =>
    api.get<Paginated<BackendUser>>("/api/users/trainees", { query: params }),
  get: (user_id: UUID) => api.get<BackendUser>(`/api/users/${user_id}`),
  create: (body: {
    service_number: string;
    name: string;
    rank: string;
    unit: string;
    role: string;
    password: string;
    classification_clearance?: string;
    cohort_id?: UUID | null;
  }) => api.post<BackendUser>("/api/users", body),
  update: (user_id: UUID, body: Partial<BackendUser> & { password?: string }) =>
    api.patch<BackendUser>(`/api/users/${user_id}`, body),
  deactivate: (user_id: UUID) =>
    api.del<{ id: string; is_active: boolean }>(`/api/users/${user_id}`),
  analytics: (user_id: UUID) =>
    api.get<UserAnalytics>(`/api/users/${user_id}/analytics`),
};

// ============================================================ DIGITAL TWIN
export const digitalTwin = {
  ships: () => api.get<Ship[]>("/api/digital-twin/ships"),
  state: (ship_id: string) =>
    api.get<ShipTwinState>(`/api/digital-twin/${ship_id}`),
  systems: (ship_id: string) =>
    api.get<SystemGraph>(`/api/digital-twin/${ship_id}/systems`),
  simulate: (
    ship_id: string,
    body: { system: string; fault_type: string; severity: number }
  ) =>
    api.post<{
      ship_id: string;
      simulation_id: string;
      fault: { system: string; fault_type: string; severity: number };
      affected_systems: string[];
      estimated_restoration_minutes: number;
      damage_control_actions: string[];
      simulated_at: string;
    }>(`/api/digital-twin/${ship_id}/simulate`, body),
};

// ============================================================ DOCTRINE
export const doctrine = {
  list: (params: { domain?: string; active_only?: boolean } = {}) =>
    api.get<DoctrineDoc[]>("/api/doctrine", { query: params }),
  create: (body: {
    title: string;
    domain: string;
    version: string;
    content_text?: string;
    file_ref?: string;
  }) => api.post<DoctrineDoc>("/api/doctrine", body),
  approve: (doc_id: UUID) =>
    api.put<DoctrineDoc>(`/api/doctrine/${doc_id}/approve`),
  rebuildIndex: (body: { domain?: string; force?: boolean } = {}) =>
    api.post<{
      total_processed: number;
      embedded: number;
      failed: number;
      domain: string;
    }>("/api/doctrine/rebuild-index", body),
  aiGroundings: () =>
    api.get<DoctrineGrounding[]>("/api/doctrine/ai-groundings"),
};

// ============================================================ SCENARIOS
export const scenarios = {
  list: (params: {
    page?: number;
    page_size?: number;
    domain?: string;
    difficulty?: string;
  } = {}) =>
    api.get<{ items: Scenario[]; total: number; page: number; page_size: number }>(
      "/api/scenarios",
      { query: params }
    ),
  get: (scenario_id: UUID) => api.get<Scenario>(`/api/scenarios/${scenario_id}`),
  create: (body: {
    title: string;
    domain: string;
    difficulty: string;
    doctrine_version: string;
    definition?: Record<string, unknown>;
    estimated_duration_minutes?: number;
    tags?: string[];
  }) => api.post<Scenario>("/api/scenarios", body),
  update: (scenario_id: UUID, body: Partial<Scenario>) =>
    api.put<Scenario>(`/api/scenarios/${scenario_id}`, body),
  archive: (scenario_id: UUID) =>
    api.del<{ id: string; is_archived: boolean }>(`/api/scenarios/${scenario_id}`),
  start: (
    scenario_id: UUID,
    body: { trainee_id: UUID; instructor_id?: UUID }
  ) =>
    api.post<{
      session_id: UUID;
      scenario_id: UUID;
      trainee_id: UUID;
      status: string;
      started_at: string;
    }>(`/api/scenarios/${scenario_id}/start`, body),
  variants: (scenario_id: UUID) =>
    api.get<Scenario[]>(`/api/scenarios/${scenario_id}/variants`),
  generate: (body: {
    domain: string;
    difficulty: string;
    description: string;
    doctrine_version?: string;
    duration_minutes?: number;
  }) => api.post<Scenario>("/api/scenarios/generate", body),
};

// ============================================================ SESSIONS
export const sessions = {
  create: (body: { scenario_id: UUID; trainee_id: UUID; instructor_id?: UUID }) =>
    api.post<TrainingSession>("/api/sessions", body),
  list: (params: {
    trainee_id?: UUID;
    instructor_id?: UUID;
    status?: string;
    page?: number;
    page_size?: number;
  } = {}) =>
    api.get<{ items: TrainingSession[]; total: number; page: number; page_size: number }>(
      "/api/sessions",
      { query: params }
    ),
  get: (session_id: UUID) =>
    api.get<TrainingSession>(`/api/sessions/${session_id}`),
  pause: (session_id: UUID) =>
    api.patch<{ id: UUID; status: string }>(`/api/sessions/${session_id}/pause`),
  end: (session_id: UUID, body: { instructor_notes?: string; final_score?: Record<string, unknown> } = {}) =>
    api.patch<TrainingSession>(`/api/sessions/${session_id}/end`, body),
  telemetry: (session_id: UUID) =>
    api.get<{ session_id: UUID; telemetry_log: unknown[]; entry_count: number }>(
      `/api/sessions/${session_id}/telemetry`
    ),
  replay: (session_id: UUID) =>
    api.get<{
      session_id: UUID;
      replay_ref: string | null;
      telemetry_log: unknown[];
      started_at: string | null;
      ended_at: string | null;
      duration_seconds: number | null;
    }>(`/api/sessions/${session_id}/replay`),
  inject: (
    session_id: UUID,
    body: { event_type: string; payload: Record<string, unknown> }
  ) => api.post<unknown>(`/api/sessions/${session_id}/inject`, body),
};

// ============================================================ ANALYTICS
export const analytics = {
  trainee: (user_id: UUID) =>
    api.get<TraineeAnalytics>(`/api/analytics/trainee/${user_id}`),
  cohort: (cohort_id: UUID) =>
    api.get<CohortAnalytics>(`/api/analytics/cohort/${cohort_id}`),
  fleet: () => api.get<FleetAnalytics>("/api/analytics/fleet"),
  predictive: (user_id: UUID) =>
    api.get<PredictiveAnalytics>(`/api/analytics/predictive/${user_id}`),
  domain: (domain: string) =>
    api.get<DomainWeakness>(`/api/analytics/domain/${domain}`),
  report: (body: {
    report_type: string;
    target_id?: UUID;
    domain?: string;
    date_from?: string;
    date_to?: string;
    include_recommendations?: boolean;
  }) => api.post<Record<string, unknown>>("/api/analytics/report", body),
};

// ============================================================ CERTIFICATIONS
export const certifications = {
  forTrainee: (user_id: UUID) =>
    api.get<Certification[]>(`/api/certifications/trainee/${user_id}`),
  pending: () =>
    api.get<PendingCertification[]>("/api/certifications/pending"),
  issue: (body: {
    user_id: UUID;
    cert_type: string;
    domain: string;
    valid_until?: string;
    evidence_session_ids?: string[];
  }) => api.post<Certification>("/api/certifications/issue", body),
  verify: (cert_id: UUID) =>
    api.get<CertVerification>(`/api/certifications/${cert_id}/verify`),
  revoke: (cert_id: UUID, reason: string) =>
    api.put<Certification>(`/api/certifications/${cert_id}/revoke`, { reason }),
};

// ============================================================ AI
export const ai = {
  chat: (body: {
    messages: ChatMessage[];
    model?: string;
    session_id?: UUID;
    context?: string;
  }) => api.post<ChatResponse>("/api/ai/chat", body),
  assess: (body: {
    session_id: UUID;
    trainee_action: string;
    expected_action: string;
    context?: string;
    doctrine_version?: string;
  }) => api.post<AssessResponse>("/api/ai/assess", body),
  remediate: (body: {
    user_id: UUID;
    domain: string;
    weakness_description: string;
    session_id?: UUID;
  }) =>
    api.post<{
      plan: string;
      recommended_scenarios: string[];
      estimated_improvement_sessions: number;
      interaction_id: UUID;
    }>("/api/ai/remediate", body),
  hint: (body: {
    session_id: UUID;
    current_situation: string;
    trainee_query?: string;
  }) =>
    api.post<{ hint: string; doctrine_reference: string; interaction_id: UUID }>(
      "/api/ai/scenario-hint",
      body
    ),
  auditLog: (params: { page?: number; page_size?: number; interaction_type?: string } = {}) =>
    api.get<{ items: AIAuditEntry[]; total: number; page: number; page_size: number }>(
      "/api/ai/audit-log",
      { query: params }
    ),
  override: (body: { interaction_id: UUID; reason: string; corrected_response: string }) =>
    api.post<{ interaction_id: UUID; overridden_by: UUID; reason: string }>(
      "/api/ai/override",
      body
    ),
  modelInfo: () => api.get<AIModelInfo>("/api/ai/model-info"),
};

// ============================================================ TEXT-TO-VIDEO
// Note: /t2v/* endpoints do NOT use the GenericResponse envelope.
export const t2v = {
  generate: (body: { question: string; domain?: "navy" }) =>
    api.post<{ success: boolean; job_id: string; message: string }>(
      "/api/t2v/generate",
      body,
      { raw: true }
    ),
  status: (job_id: string) =>
    api.get<T2VJob & { success: boolean }>(`/api/t2v/status/${job_id}`, {
      raw: true,
    }),
  jobs: () => api.get<Record<string, T2VJob>>("/api/t2v/jobs", { raw: true }),
  modules: (domain: "navy" = "navy") =>
    api.get<{ domain: string; modules: unknown[]; total_validated?: number; pipeline_version?: string }>(
      `/api/t2v/training-modules/${domain}`,
      { raw: true }
    ),
  videoUrl: (domain: "navy", session_id: string) =>
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
    }/api/t2v/video/${domain}/${session_id}`,
};

// ============================================================ DOCUMENTATION
export const documentation = {
  list: (params: { domain?: string; active_only?: boolean } = {}) =>
    api.get<DocumentationTopic[]>("/api/documentation", { query: params }),
  get: (topic_id: UUID) =>
    api.get<DocumentationTopic>(`/api/documentation/${topic_id}`),
  create: (body: {
    title: string;
    domain: string;
    description?: string;
    content_markdown?: string;
    example_interactive?: string;
  }) => api.post<DocumentationTopic>("/api/documentation", body),
  update: (
    topic_id: UUID,
    body: Partial<{
      title: string;
      domain: string;
      description: string;
      content_markdown: string;
      example_interactive: string;
      is_active: boolean;
    }>
  ) => api.put<DocumentationTopic>(`/api/documentation/${topic_id}`, body),
  delete: (topic_id: UUID) =>
    api.del<{ id: string }>(`/api/documentation/${topic_id}`),
};

// ============================================================ SYSTEM
export const system = {
  health: () => api.get<HealthMatrix>("/api/system/health"),
  auditLog: (params: { page?: number; page_size?: number } = {}) =>
    api.get<{ items: SystemAuditEntry[]; total: number; page: number; page_size: number }>(
      "/api/system/audit-log",
      { query: params }
    ),
  metrics: () => api.get<SystemMetrics>("/api/system/metrics"),
  modelLoad: (model_name: string, source_path?: string) =>
    api.post<{ model_name: string; status: string }>("/api/system/model/load", {
      model_name,
      source_path,
      
    }),
  modelStatus: () =>
    api.get<{
      provider: string;
      ai_status: string;
      active_model: string;
      models: { model_name: string; status: string; capabilities: string[] }[];
    }>("/api/system/model/status"),
  backup: (body: { include_telemetry?: boolean; include_doctrine?: boolean; destination?: string } = {}) =>
    api.post<{
      backup_id: string;
      status: string;
      initiated_at: string;
    }>("/api/system/backup", body),
};

// ============================================================ NOTIFICATIONS
export const notifications = {
  list: () => api.get<any[]>("/api/notifications"),
  read: (notification_id: UUID) =>
    api.patch<boolean>(`/api/notifications/${notification_id}/read`),
  readAll: () => api.post<boolean>("/api/notifications/read-all"),
};
