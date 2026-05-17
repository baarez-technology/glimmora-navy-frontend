"use client";

import { motion } from "framer-motion";
import { Shield, Loader2, AlertTriangle, Clock, Activity } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { ai, system } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";

function healthVariant(status: string): "online" | "offline" | "warning" {
  const s = (status || "").toLowerCase();
  if (s === "healthy" || s === "ok" || s === "online") return "online";
  if (s === "degraded" || s === "warning") return "warning";
  return "offline";
}

export default function SecurityPage() {
  const health = useApi(() => system.health(), []);
  const aiAudit = useApi(() => ai.auditLog({ page: 1, page_size: 25 }), []);

  const overrides = (aiAudit.data?.items ?? []).filter(
    (e) => e.overridden_by != null
  );
  const lowConfidence = (aiAudit.data?.items ?? []).filter(
    (e) => typeof e.confidence === "number" && e.confidence < 0.6
  );
  const services = health.data?.services ?? [];
  const overall = health.data?.overall || "unknown";

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
            <Shield className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Security, Governance & RBAC
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Air-Gapped Deployment, Audit Logs, Role-Based Access & Sovereignty Controls
            </p>
          </div>
        </div>
        {health.loading ? (
          <StatusBadge label="Checking..." variant="neutral" />
        ) : (
          <StatusBadge
            label={`Overall ${overall}`}
            variant={healthVariant(overall)}
            pulse
          />
        )}
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {health.loading ? "..." : services.length}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Services Monitored
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-amber">
              {aiAudit.loading ? "..." : overrides.length}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              AI Overrides (recent)
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-red">
              {aiAudit.loading ? "..." : lowConfidence.length}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Low-Confidence Events
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-green">
              {health.loading
                ? "..."
                : services.filter((s) => healthVariant(s.status) === "online").length}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Healthy Services
            </p>
          </GlassPanel>
        </div>
      </motion.div>

      {/* Health Matrix */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              System Health
            </h3>
            {health.data?.checked_at && (
              <span className="text-[10px] font-mono text-aegis-slate uppercase">
                checked {new Date(health.data.checked_at).toLocaleTimeString()}
              </span>
            )}
          </div>

          {health.loading ? (
            <div className="flex items-center gap-2 text-xs text-aegis-mist">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading service matrix...
            </div>
          ) : health.error ? (
            <p className="text-xs text-aegis-red">{health.error}</p>
          ) : services.length === 0 ? (
            <p className="text-xs text-aegis-slate">No services reported.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {services.map((svc) => (
                <div
                  key={svc.name}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-aegis-cyan shrink-0 mt-1.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-aegis-cloud font-heading font-semibold truncate">
                        {svc.name}
                      </span>
                      <StatusBadge label={svc.status} variant={healthVariant(svc.status)} />
                    </div>
                    <p className="text-[10px] text-aegis-slate font-mono mt-1">
                      {svc.latency_ms != null ? `${svc.latency_ms} ms` : "no latency"}
                    </p>
                    {svc.details && (
                      <p className="text-[10px] text-aegis-mist mt-1 break-words">
                        {svc.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {/* AI Security Events */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              AI Governance Events
            </h3>
          </div>

          {aiAudit.loading ? (
            <div className="flex items-center gap-2 text-xs text-aegis-mist">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading AI audit events...
            </div>
          ) : aiAudit.error ? (
            <p className="text-xs text-aegis-red">{aiAudit.error}</p>
          ) : !aiAudit.data || aiAudit.data.items.length === 0 ? (
            <p className="text-xs text-aegis-slate">No AI events recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[
                      "Timestamp",
                      "User",
                      "Interaction",
                      "Confidence",
                      "Doctrine",
                      "Severity",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {aiAudit.data.items.map((evt) => {
                    const low =
                      typeof evt.confidence === "number" && evt.confidence < 0.6;
                    const overridden = evt.overridden_by != null;
                    return (
                      <tr
                        key={evt.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4 text-xs font-mono text-aegis-slate">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {new Date(evt.timestamp).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-aegis-cloud font-mono">
                          {evt.user_id}
                        </td>
                        <td className="py-3 px-4 text-xs text-aegis-mist">
                          {evt.interaction_type}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-cyan">
                          {evt.confidence != null
                            ? `${Math.round(evt.confidence * 100)}%`
                            : "--"}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-slate">
                          {evt.doctrine_version_used || "--"}
                        </td>
                        <td className="py-3 px-4">
                          {overridden ? (
                            <StatusBadge label="OVERRIDDEN" variant="warning" />
                          ) : low ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-heading font-bold text-aegis-red">
                              <AlertTriangle className="w-3 h-3" /> LOW CONFIDENCE
                            </span>
                          ) : (
                            <StatusBadge label="NOMINAL" variant="online" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
