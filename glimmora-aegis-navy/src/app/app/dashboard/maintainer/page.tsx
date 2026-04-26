"use client";

import { motion } from "framer-motion";
import {
  Shield,
  FileText,
  Package,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Activity,
  HardDrive,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { MetricCard } from "@/components/ui/metric-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const patchQueue = [
  { id: "PATCH-2026.04-012", target: "OwnLLM runtime", version: "v2.4.2 -> v2.4.3", status: "pending", type: "security" },
  { id: "PATCH-2026.04-011", target: "AR/VR session service", version: "v1.8.0 -> v1.8.1", status: "staged", type: "bugfix" },
  { id: "PATCH-2026.04-010", target: "Digital Twin asset loader", version: "v3.1.4 -> v3.2.0", status: "approved", type: "feature" },
];

const rollbackPoints = [
  { id: "RB-2026.04.22-03", ts: "2026-04-22 14:02", reason: "Post-patch snapshot", size: "48.2 GB" },
  { id: "RB-2026.04.19-01", ts: "2026-04-19 09:11", reason: "Pre-upgrade (v2.4.1)", size: "47.8 GB" },
  { id: "RB-2026.04.15-02", ts: "2026-04-15 18:44", reason: "Scheduled weekly", size: "46.9 GB" },
];

const systemHealth = [
  { label: "Air-gap Integrity", value: "OK", variant: "online" as const },
  { label: "Audit Log Stream", value: "Writing", variant: "active" as const },
  { label: "Model Registry Sync", value: "Current", variant: "online" as const },
  { label: "Backup Job (nightly)", value: "Passed", variant: "online" as const },
];

const recentAudit = [
  { severity: "warning", text: "Failed login attempt x3 -- user INS-OPS-047", time: "12m ago" },
  { severity: "neutral", text: "Patch PATCH-2026.04-010 approval recorded", time: "1h ago" },
  { severity: "neutral", text: "Scheduled backup RB-2026.04.22-03 completed", time: "4h ago" },
  { severity: "alert", text: "RBAC change attempted from unauthorized role", time: "6h ago" },
];

const severityColor: Record<string, string> = {
  alert: "text-aegis-red",
  warning: "text-aegis-amber",
  neutral: "text-aegis-slate",
};

export default function MaintainerDashboard() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <HardDrive className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              System Maintainer Console
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Patches &bull; Rollbacks &bull; Audit Monitoring &bull; Air-Gap Integrity
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/app/admin/audit">
            <AegisButton variant="secondary" size="sm" icon={<FileText className="w-4 h-4" />}>
              Audit Logs
            </AegisButton>
          </Link>
          <Link href="/app/admin/security">
            <AegisButton size="sm" icon={<Shield className="w-4 h-4" />}>Security</AegisButton>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Pending Patches" value="3" subtitle="1 security" icon={Package} accentColor="text-aegis-amber" />
        <MetricCard title="Rollback Points" value="12" subtitle="Last: 4h ago" icon={RotateCcw} accentColor="text-aegis-cyan" />
        <MetricCard title="Audit Events (24h)" value="4,892" icon={FileText} accentColor="text-aegis-purple" />
        <MetricCard title="Policy Violations" value="0" icon={Shield} accentColor="text-aegis-green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Patch Queue
            </h3>
            <StatusBadge label="3 PENDING" variant="warning" />
          </div>
          <div className="space-y-3">
            {patchQueue.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-aegis-cyan" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-aegis-cyan">{p.id}</p>
                    <p className="text-sm text-aegis-cloud">{p.target}</p>
                    <p className="text-[10px] font-mono text-aegis-slate">{p.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    label={p.type.toUpperCase()}
                    variant={p.type === "security" ? "alert" : p.type === "bugfix" ? "warning" : "active"}
                  />
                  <StatusBadge
                    label={p.status.toUpperCase()}
                    variant={p.status === "approved" ? "online" : p.status === "staged" ? "active" : "warning"}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            System Health
          </h3>
          <div className="space-y-3">
            {systemHealth.map((h) => (
              <div key={h.label} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]">
                <span className="text-xs text-aegis-cloud">{h.label}</span>
                <StatusBadge label={h.value.toUpperCase()} variant={h.variant} pulse={h.variant === "active"} />
              </div>
            ))}
          </div>
          <div className="mt-5 pt-5 border-t border-white/[0.04] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-aegis-green" />
            <span className="text-[11px] text-aegis-mist">Air-gapped deployment verified</span>
          </div>
        </GlassPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Rollback Points
            </h3>
            <RotateCcw className="w-4 h-4 text-aegis-cyan" />
          </div>
          <div className="space-y-3">
            {rollbackPoints.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-xs font-mono font-bold text-aegis-cyan">{r.id}</p>
                  <p className="text-[10px] text-aegis-mist">{r.reason} &bull; {r.ts}</p>
                </div>
                <span className="text-[10px] font-mono text-aegis-slate">{r.size}</span>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Recent Audit Events
            </h3>
            <Link href="/app/admin/audit" className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentAudit.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-white/[0.02]">
                {a.severity === "alert" ? (
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${severityColor[a.severity]}`} />
                ) : (
                  <Activity className={`w-4 h-4 shrink-0 mt-0.5 ${severityColor[a.severity]}`} />
                )}
                <div className="flex-1">
                  <p className="text-xs text-aegis-cloud leading-relaxed">{a.text}</p>
                  <p className="text-[10px] font-mono text-aegis-slate mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </motion.div>
  );
}
