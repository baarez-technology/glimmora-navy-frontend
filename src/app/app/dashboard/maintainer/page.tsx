"use client";

import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle,
  AlertTriangle,
  BrainCircuit,
  MemoryStick,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { MetricCard } from "@/components/ui/metric-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { system, ai } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";

function formatUptime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "--";
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function statusVariant(
  status: string
): "online" | "warning" | "offline" | "neutral" {
  const s = status.toLowerCase();
  if (s === "healthy" || s === "ok" || s === "available") return "online";
  if (s === "degraded" || s === "warning") return "warning";
  if (s === "offline" || s === "unavailable" || s === "error") return "offline";
  return "neutral";
}

function LoadingPanel({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-6 text-aegis-mist">
      <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
      <span className="text-xs font-heading tracking-wider uppercase">
        {label}&hellip;
      </span>
    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-4">
      <AlertTriangle className="w-4 h-4 text-aegis-red shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs text-aegis-cloud leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-[10px] font-heading text-aegis-cyan mt-2 tracking-wider uppercase cursor-pointer"
          >
            Retry &rarr;
          </button>
        )}
      </div>
    </div>
  );
}

function UsageBar({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Cpu;
}) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  const color =
    pct >= 85
      ? "from-aegis-red to-aegis-amber"
      : pct >= 65
      ? "from-aegis-amber to-aegis-orange"
      : "from-aegis-cyan to-aegis-blue";
  const textColor =
    pct >= 85
      ? "text-aegis-red"
      : pct >= 65
      ? "text-aegis-amber"
      : "text-aegis-cyan";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-aegis-mist" />
          <span className="text-xs font-heading font-semibold text-aegis-cloud">
            {label}
          </span>
        </div>
        <span className={`text-sm font-mono font-bold ${textColor}`}>
          {pct}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}

export default function MaintainerDashboard() {
  const metricsState = useApi(() => system.metrics(), []);
  const healthState = useApi(() => system.health(), []);
  const modelState = useApi(() => ai.modelInfo(), []);

  const metrics = metricsState.data;
  const health = healthState.data;
  const model = modelState.data;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <HardDrive className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              System Maintainer Console
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              System Metrics &bull; Service Health &bull; AI Model Status
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/app/admin/audit">
            <AegisButton
              variant="secondary"
              size="sm"
              icon={<FileText className="w-4 h-4" />}
            >
              Audit Logs
            </AegisButton>
          </Link>
          <Link href="/app/admin/security">
            <AegisButton size="sm" icon={<Shield className="w-4 h-4" />}>
              Security
            </AegisButton>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Active Sessions"
          value={
            metricsState.loading
              ? "--"
              : metrics
              ? String(metrics.active_sessions)
              : "0"
          }
          icon={Activity}
          accentColor="text-aegis-cyan"
        />
        <MetricCard
          title="Total Users"
          value={
            metricsState.loading
              ? "--"
              : metrics
              ? String(metrics.total_users)
              : "0"
          }
          icon={Shield}
          accentColor="text-aegis-green"
        />
        <MetricCard
          title="DB Connections"
          value={
            metricsState.loading
              ? "--"
              : metrics
              ? String(metrics.db_connections)
              : "0"
          }
          icon={HardDrive}
          accentColor="text-aegis-purple"
        />
        <MetricCard
          title="Uptime"
          value={
            metricsState.loading
              ? "--"
              : metrics
              ? formatUptime(metrics.uptime_seconds)
              : "--"
          }
          icon={Activity}
          accentColor="text-aegis-amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Resource Usage */}
        <GlassPanel className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              System Resource Usage
            </h3>
            {metrics && (
              <span className="text-[10px] font-mono text-aegis-slate">
                Sampled {new Date(metrics.collected_at).toLocaleTimeString()}
              </span>
            )}
          </div>
          {metricsState.loading ? (
            <LoadingPanel label="Reading metrics" />
          ) : metricsState.error ? (
            <ErrorPanel
              message={metricsState.error}
              onRetry={metricsState.refetch}
            />
          ) : !metrics ? (
            <p className="text-xs text-aegis-slate py-3">
              No metrics reported.
            </p>
          ) : (
            <div className="space-y-5">
              <UsageBar label="CPU" value={metrics.cpu_percent} icon={Cpu} />
              <UsageBar
                label="Memory"
                value={metrics.memory_percent}
                icon={MemoryStick}
              />
              <UsageBar
                label="Disk"
                value={metrics.disk_percent}
                icon={HardDrive}
              />
            </div>
          )}
        </GlassPanel>

        {/* Service Health */}
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Service Health
            </h3>
            {health && (
              <StatusBadge
                label={health.overall.toUpperCase()}
                variant={statusVariant(health.overall)}
                pulse={statusVariant(health.overall) === "online"}
              />
            )}
          </div>
          {healthState.loading ? (
            <LoadingPanel label="Checking services" />
          ) : healthState.error ? (
            <ErrorPanel
              message={healthState.error}
              onRetry={healthState.refetch}
            />
          ) : !health || health.services.length === 0 ? (
            <p className="text-xs text-aegis-slate py-3">
              No services reporting.
            </p>
          ) : (
            <div className="space-y-3">
              {health.services.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-aegis-cloud truncate">
                      {s.name}
                    </p>
                    {s.latency_ms !== null && s.latency_ms !== undefined && (
                      <p className="text-[10px] font-mono text-aegis-slate">
                        {s.latency_ms}ms
                      </p>
                    )}
                  </div>
                  <StatusBadge
                    label={s.status.toUpperCase()}
                    variant={statusVariant(s.status)}
                    pulse={statusVariant(s.status) === "online"}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="mt-5 pt-5 border-t border-white/[0.04] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-aegis-green" />
            <span className="text-[11px] text-aegis-mist">
              Air-gapped deployment verified
            </span>
          </div>
        </GlassPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Model Info */}
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-aegis-purple" />
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                AI Model
              </h3>
            </div>
            {model && (
              <StatusBadge
                label={model.available ? "AVAILABLE" : "UNAVAILABLE"}
                variant={model.available ? "online" : "offline"}
                pulse={model.available}
              />
            )}
          </div>
          {modelState.loading ? (
            <LoadingPanel label="Querying model" />
          ) : modelState.error ? (
            <ErrorPanel
              message={modelState.error}
              onRetry={modelState.refetch}
            />
          ) : !model ? (
            <p className="text-xs text-aegis-slate py-3">No model reported.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]">
                <span className="text-xs text-aegis-mist">Active Model</span>
                <span className="text-xs font-mono font-bold text-aegis-cyan">
                  {model.model_in_use || model.model_name}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]">
                <span className="text-xs text-aegis-mist">Provider</span>
                <span className="text-xs font-mono text-aegis-cloud">
                  {model.provider}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]">
                <span className="text-xs text-aegis-mist">Status</span>
                <StatusBadge
                  label={model.status.toUpperCase()}
                  variant={statusVariant(model.status)}
                />
              </div>
              {model.available_models?.length > 0 && (
                <div>
                  <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase mb-2 px-3">
                    Available Models
                  </p>
                  <div className="flex flex-wrap gap-2 px-3">
                    {model.available_models.map((m) => (
                      <span
                        key={m}
                        className="text-[10px] font-mono px-2 py-1 rounded bg-white/[0.04] text-aegis-cloud"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassPanel>

        {/* Health Check Summary */}
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Health Check
            </h3>
            {health && (
              <span className="text-[10px] font-mono text-aegis-slate">
                {new Date(health.checked_at).toLocaleTimeString()}
              </span>
            )}
          </div>
          {healthState.loading ? (
            <LoadingPanel />
          ) : healthState.error ? (
            <ErrorPanel
              message={healthState.error}
              onRetry={healthState.refetch}
            />
          ) : !health ? (
            <p className="text-xs text-aegis-slate py-3">No health data.</p>
          ) : (
            <div className="space-y-3">
              {health.services.map((s) => (
                <div
                  key={s.name}
                  className="flex items-start gap-3 py-2 px-3 rounded-lg bg-white/[0.02]"
                >
                  {statusVariant(s.status) === "online" ? (
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-aegis-green" />
                  ) : statusVariant(s.status) === "warning" ? (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-aegis-amber" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-aegis-red" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-aegis-cloud leading-relaxed">
                      {s.name}
                    </p>
                    {s.details && (
                      <p className="text-[10px] text-aegis-slate mt-0.5">
                        {s.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
    </motion.div>
  );
}
