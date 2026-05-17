"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  FileText,
  Lock,
  Database,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";
import { system, users } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";

const adminModules = [
  {
    icon: Lock,
    label: "Role-Based Access Control",
    href: "/app/admin/roles",
    desc: "Configure roles, permissions, and access policies",
  },
  {
    icon: Shield,
    label: "Security & Governance",
    href: "/app/admin/security",
    desc: "Air-gapped deployment, sovereignty controls",
  },
  {
    icon: FileText,
    label: "Audit Logs",
    href: "/app/admin/audit",
    desc: "Tamper-evident logging, compliance reports",
  },
  {
    icon: Database,
    label: "Content Ingestion",
    href: "/app/admin/content",
    desc: "Doctrine, manuals, and training material pipeline",
  },
];

function healthVariant(status: string): "online" | "offline" | "warning" {
  const s = (status || "").toLowerCase();
  if (s === "healthy" || s === "ok" || s === "online") return "online";
  if (s === "degraded" || s === "warning") return "warning";
  return "offline";
}

export default function AdminPage() {
  const rolesSummary = useApi(() => users.rolesSummary(), []);
  const metrics = useApi(() => system.metrics(), []);
  const health = useApi(() => system.health(), []);

  const totals = useMemo(() => {
    const counts = rolesSummary.data ?? {};
    const totalUsers = Object.values(counts).reduce(
      (acc, n) => acc + (Number(n) || 0),
      0
    );
    const rolesConfigured = Object.keys(counts).length;
    return { totalUsers, rolesConfigured };
  }, [rolesSummary.data]);

  const moduleCounts: Record<string, string> = {
    "/app/admin/roles": rolesSummary.loading
      ? "loading..."
      : `${totals.rolesConfigured} roles`,
    "/app/admin/security": health.loading
      ? "loading..."
      : `${health.data?.services?.length ?? 0} services tracked`,
    "/app/admin/audit": metrics.loading
      ? "loading..."
      : `${metrics.data?.active_sessions ?? 0} active sessions`,
    "/app/admin/content": "doctrine + scenarios",
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
            Administration
          </h1>
          <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
            System Configuration, Security & Governance
          </p>
        </div>
        {health.loading ? (
          <StatusBadge label="Checking..." variant="neutral" />
        ) : health.error ? (
          <StatusBadge label="Health Unknown" variant="offline" />
        ) : (
          <StatusBadge
            label={`Overall ${health.data?.overall || "unknown"}`}
            variant={healthVariant(health.data?.overall || "")}
            pulse
          />
        )}
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Active Users"
          value={
            rolesSummary.loading
              ? "..."
              : metrics.data?.total_users ?? totals.totalUsers
          }
          icon={Users}
        />
        <MetricCard
          title="Roles Configured"
          value={rolesSummary.loading ? "..." : totals.rolesConfigured}
          icon={Lock}
          accentColor="text-aegis-gold"
        />
        <MetricCard
          title="Active Sessions"
          value={metrics.loading ? "..." : metrics.data?.active_sessions ?? 0}
          icon={FileText}
          accentColor="text-aegis-purple"
        />
        <MetricCard
          title="CPU Load"
          value={
            metrics.loading
              ? "..."
              : `${Math.round(metrics.data?.cpu_percent ?? 0)}%`
          }
          icon={Shield}
          accentColor="text-aegis-green"
        />
      </div>

      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              System Health Matrix
            </h3>
            {health.data?.checked_at && (
              <span className="text-[10px] font-mono text-aegis-slate uppercase">
                checked {new Date(health.data.checked_at).toLocaleTimeString()}
              </span>
            )}
          </div>
          {health.loading ? (
            <div className="flex items-center gap-2 text-xs text-aegis-mist">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading health...
            </div>
          ) : health.error ? (
            <p className="text-xs text-aegis-red">{health.error}</p>
          ) : !health.data || health.data.services.length === 0 ? (
            <p className="text-xs text-aegis-slate">No services reported.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {health.data.services.map((svc) => (
                <div
                  key={svc.name}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-heading font-bold text-aegis-cloud">
                      {svc.name}
                    </span>
                    <StatusBadge label={svc.status} variant={healthVariant(svc.status)} />
                  </div>
                  <p className="text-[10px] text-aegis-slate font-mono">
                    {svc.latency_ms != null ? `${svc.latency_ms} ms` : "--"}
                  </p>
                  {svc.details && (
                    <p className="text-[10px] text-aegis-mist mt-1 truncate">
                      {svc.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminModules.map((mod) => (
          <motion.div key={mod.label} variants={fadeInUp}>
            <Link href={mod.href}>
              <GlassPanel
                className="hover:border-aegis-cyan/15 transition-all cursor-pointer group"
                animated={false}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aegis-gold/20 to-aegis-amber/10 border border-aegis-gold/20 flex items-center justify-center shrink-0">
                      <mod.icon className="w-5 h-5 text-aegis-gold" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-aegis-white tracking-wide mb-1">
                        {mod.label}
                      </h3>
                      <p className="text-xs text-aegis-mist">{mod.desc}</p>
                      <p className="text-[10px] font-mono text-aegis-slate mt-2">
                        {moduleCounts[mod.href]}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-aegis-gunmetal group-hover:text-aegis-cyan transition-colors" />
                </div>
              </GlassPanel>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
