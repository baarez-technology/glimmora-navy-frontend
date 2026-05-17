"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Award,
  Cpu,
  Database,
  HardDrive,
  Heart,
  Loader2,
  MemoryStick,
  Ship as ShipIcon,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/ui/metric-card";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { analytics, sessions, system } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { ApiError } from "@/lib/api/client";
import type {
  HealthMatrix,
  ServiceStatus,
  SystemMetrics,
} from "@/lib/api/types";

function healthVariant(
  status: ServiceStatus["status"] | string
): "online" | "warning" | "offline" | "neutral" {
  switch (status) {
    case "healthy":
      return "online";
    case "degraded":
      return "warning";
    case "offline":
      return "offline";
    default:
      return "neutral";
  }
}

function formatUptime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "--";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function FleetCommandPage() {
  const fleetState = useApi(() => analytics.fleet(), []);
  const sessionsState = useApi(
    () => sessions.list({ status: "active", page_size: 1 }),
    []
  );

  // Admin-only system endpoints. If 403, hide the section.
  const [systemForbidden, setSystemForbidden] = useState(false);

  const healthState = useApi<HealthMatrix | null>(
    async () => {
      try {
        return await system.health();
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          setSystemForbidden(true);
          return null;
        }
        throw err;
      }
    },
    []
  );

  const metricsState = useApi<SystemMetrics | null>(
    async () => {
      try {
        return await system.metrics();
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          setSystemForbidden(true);
          return null;
        }
        throw err;
      }
    },
    []
  );

  // If either succeeded once, we know we have access; keep showing the section.
  useEffect(() => {
    if (healthState.data || metricsState.data) {
      setSystemForbidden(false);
    }
  }, [healthState.data, metricsState.data]);

  const showSystemSection =
    !systemForbidden &&
    (healthState.loading ||
      metricsState.loading ||
      healthState.data ||
      metricsState.data ||
      // Show error states unless the error itself is a 403 that flipped systemForbidden.
      healthState.error ||
      metricsState.error);

  const fleet = fleetState.data;
  const liveSessions =
    sessionsState.data?.total ?? sessionsState.data?.items?.length ?? null;

  const overallHealth = healthState.data?.overall;
  const overallVariant: "online" | "warning" | "offline" | "active" = useMemo(() => {
    if (!overallHealth) return "active";
    const s = overallHealth.toLowerCase();
    if (s.includes("healthy") || s.includes("ok") || s.includes("nominal"))
      return "online";
    if (s.includes("degraded") || s.includes("warn")) return "warning";
    if (s.includes("down") || s.includes("offline") || s.includes("critical"))
      return "offline";
    return "active";
  }, [overallHealth]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <ShipIcon className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Fleet Training Command
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Strategic Readiness &bull; Cross-Base Planning &bull; All-Up Status
            </p>
          </div>
        </div>
        {overallHealth ? (
          <StatusBadge
            label={overallHealth.toUpperCase()}
            variant={overallVariant}
            pulse
          />
        ) : (
          <StatusBadge label="Command Active" variant="active" pulse />
        )}
      </motion.div>

      {/* Top KPIs */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Fleet Avg Score"
            value={
              fleet ? fleet.average_fleet_score.toFixed(1) : "--"
            }
            subtitle={fleetState.error ?? undefined}
            icon={Target}
            accentColor="text-aegis-gold"
          />
          <MetricCard
            title="Total Trainees"
            value={fleet ? fleet.total_trainees.toLocaleString() : "--"}
            icon={Users}
          />
          <MetricCard
            title="Active Sessions (Live)"
            value={
              sessionsState.loading
                ? "--"
                : liveSessions != null
                ? liveSessions.toLocaleString()
                : sessionsState.error
                ? "ERR"
                : "--"
            }
            subtitle={sessionsState.error ?? undefined}
            icon={Activity}
            accentColor="text-aegis-purple"
          />
          <MetricCard
            title="Certifications (Mo)"
            value={
              fleet ? fleet.certifications_this_month.toLocaleString() : "--"
            }
            icon={Award}
            accentColor="text-aegis-green"
          />
        </div>
      </motion.div>

      {/* Domain performance & active sessions context */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Cross-Base Domain Performance
            </h3>
          </div>
          {fleetState.loading ? (
            <div className="flex items-center justify-center py-8 gap-3 text-aegis-mist">
              <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                Loading fleet analytics...
              </span>
            </div>
          ) : fleetState.error ? (
            <div className="flex items-center justify-center py-8 gap-3 text-aegis-red">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                {fleetState.error}
              </span>
            </div>
          ) : fleet && Object.keys(fleet.domain_performance).length ? (
            <div className="space-y-3">
              {Object.entries(fleet.domain_performance).map(([domain, score]) => (
                <div key={domain}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-heading text-[11px] tracking-wider uppercase text-aegis-cloud">
                      {domain}
                    </span>
                    <span className="font-mono text-xs text-aegis-cyan">
                      {Number(score).toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, Math.max(0, Number(score)))}%`,
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-blue"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-aegis-mist text-center py-6">
              No domain performance data.
            </p>
          )}
        </GlassPanel>

        <GlassPanel>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Live Operations
            </h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-heading text-aegis-slate tracking-wider uppercase">
                Active Sessions
              </span>
              {sessionsState.loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-aegis-cyan" />
              ) : sessionsState.error ? (
                <span className="font-mono text-xs text-aegis-red">ERR</span>
              ) : (
                <span className="font-mono text-base text-aegis-cyan">
                  {liveSessions ?? 0}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-heading text-aegis-slate tracking-wider uppercase">
                Total Sessions
              </span>
              <span className="font-mono text-base text-aegis-cloud">
                {fleet ? fleet.total_sessions.toLocaleString() : "--"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-heading text-aegis-slate tracking-wider uppercase">
                Reported Active
              </span>
              <span className="font-mono text-base text-aegis-cloud">
                {fleet ? fleet.active_sessions.toLocaleString() : "--"}
              </span>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* System Health (admin only) */}
      {showSystemSection && (
        <motion.div variants={fadeInUp} className="space-y-6">
          <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassPanel className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-aegis-cyan" />
                <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                  System Health
                </h3>
                {healthState.data?.checked_at && (
                  <span className="text-[10px] font-mono text-aegis-slate ml-auto">
                    {new Date(healthState.data.checked_at).toLocaleTimeString()}
                  </span>
                )}
              </div>
              {healthState.loading ? (
                <div className="flex items-center justify-center py-8 gap-3 text-aegis-mist">
                  <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
                  <span className="font-heading text-xs tracking-[0.1em] uppercase">
                    Loading system health...
                  </span>
                </div>
              ) : healthState.error ? (
                <div className="flex items-center justify-center py-8 gap-3 text-aegis-red">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-heading text-xs tracking-[0.1em] uppercase">
                    {healthState.error}
                  </span>
                </div>
              ) : healthState.data?.services?.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {healthState.data.services.map((svc) => (
                    <div
                      key={svc.name}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading text-[11px] tracking-wider uppercase text-aegis-cloud truncate">
                          {svc.name}
                        </span>
                        <StatusBadge
                          label={svc.status.toUpperCase()}
                          variant={healthVariant(svc.status)}
                        />
                      </div>
                      <p className="text-[10px] font-mono text-aegis-slate">
                        {svc.latency_ms != null ? `${svc.latency_ms} ms` : "--"}
                      </p>
                      {svc.details && (
                        <p className="text-[10px] font-mono text-aegis-mist mt-1 break-words">
                          {svc.details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-aegis-mist text-center py-6">
                  No service health data.
                </p>
              )}
            </GlassPanel>

            <GlassPanel>
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-aegis-cyan" />
                <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                  System Metrics
                </h3>
              </div>
              {metricsState.loading ? (
                <div className="flex items-center justify-center py-8 gap-3 text-aegis-mist">
                  <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
                  <span className="font-heading text-xs tracking-[0.1em] uppercase">
                    Loading metrics...
                  </span>
                </div>
              ) : metricsState.error ? (
                <div className="flex items-center justify-center py-8 gap-3 text-aegis-red">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-heading text-xs tracking-[0.1em] uppercase">
                    {metricsState.error}
                  </span>
                </div>
              ) : metricsState.data ? (
                <div className="space-y-3">
                  <MetricRow
                    icon={Cpu}
                    label="CPU"
                    value={`${metricsState.data.cpu_percent.toFixed(1)}%`}
                    pct={metricsState.data.cpu_percent}
                  />
                  <MetricRow
                    icon={MemoryStick}
                    label="Memory"
                    value={`${metricsState.data.memory_percent.toFixed(1)}%`}
                    pct={metricsState.data.memory_percent}
                  />
                  <MetricRow
                    icon={HardDrive}
                    label="Disk"
                    value={`${metricsState.data.disk_percent.toFixed(1)}%`}
                    pct={metricsState.data.disk_percent}
                  />
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.04]">
                    <div>
                      <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                        Active Sessions
                      </p>
                      <p className="font-mono text-sm text-aegis-cloud">
                        {metricsState.data.active_sessions}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                        Total Users
                      </p>
                      <p className="font-mono text-sm text-aegis-cloud">
                        {metricsState.data.total_users}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                        DB Conns
                      </p>
                      <p className="font-mono text-sm text-aegis-cloud flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-aegis-cyan" />
                        {metricsState.data.db_connections}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                        Uptime
                      </p>
                      <p className="font-mono text-sm text-aegis-cloud">
                        {formatUptime(metricsState.data.uptime_seconds)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-aegis-mist text-center py-6">
                  No metrics available.
                </p>
              )}
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

function MetricRow({
  icon: Icon,
  label,
  value,
  pct,
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
  pct: number;
}) {
  const clamped = Math.min(100, Math.max(0, pct));
  const color =
    clamped > 85
      ? "from-aegis-red to-aegis-orange"
      : clamped > 70
      ? "from-aegis-amber to-aegis-gold"
      : "from-aegis-cyan to-aegis-blue";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="inline-flex items-center gap-1.5 font-heading text-[11px] tracking-wider uppercase text-aegis-cloud">
          <Icon className="w-3.5 h-3.5 text-aegis-cyan" />
          {label}
        </span>
        <span className="font-mono text-xs text-aegis-cyan">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}
