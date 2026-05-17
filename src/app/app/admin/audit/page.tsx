"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Filter,
  Download,
  Shield,
  User,
  Clock,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { MetricCard } from "@/components/ui/metric-card";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { ai, system } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";

const PAGE_SIZE = 25;

type Tab = "system" | "ai";

function severityVariantFromResult(result: string): "neutral" | "warning" | "alert" {
  const r = (result || "").toLowerCase();
  if (r.includes("deny") || r.includes("fail") || r.includes("error")) return "alert";
  if (r.includes("warn") || r.includes("override")) return "warning";
  return "neutral";
}

export default function AuditPage() {
  const [tab, setTab] = useState<Tab>("system");
  const [sysPage, setSysPage] = useState(1);
  const [aiPage, setAiPage] = useState(1);

  const sysAudit = useApi(
    () => system.auditLog({ page: sysPage, page_size: PAGE_SIZE }),
    [sysPage]
  );
  const aiAudit = useApi(
    () => ai.auditLog({ page: aiPage, page_size: PAGE_SIZE }),
    [aiPage]
  );

  const activeData = tab === "system" ? sysAudit : aiAudit;
  const activePage = tab === "system" ? sysPage : aiPage;
  const setActivePage = tab === "system" ? setSysPage : setAiPage;
  const totalPages = Math.max(
    1,
    Math.ceil((activeData.data?.total ?? 0) / PAGE_SIZE)
  );

  const sysWarnings =
    sysAudit.data?.items.filter((e) =>
      severityVariantFromResult(e.result) !== "neutral"
    ).length ?? 0;
  const aiOverrides =
    aiAudit.data?.items.filter((e) => e.overridden_by != null).length ?? 0;
  const uniqueUsers = new Set(
    sysAudit.data?.items.map((e) => e.user_id).filter(Boolean) ?? []
  ).size;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-blue flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Audit Logs & Compliance
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Tamper-Evident Logging &bull; Full Traceability
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <AegisButton variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>
            Filter
          </AegisButton>
          <AegisButton variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
            Export
          </AegisButton>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="System Events"
          value={sysAudit.loading ? "..." : sysAudit.data?.total ?? 0}
          icon={FileText}
        />
        <MetricCard
          title="Unique Users"
          value={sysAudit.loading ? "..." : uniqueUsers}
          icon={User}
          accentColor="text-aegis-cyan"
        />
        <MetricCard
          title="AI Overrides"
          value={aiAudit.loading ? "..." : aiOverrides}
          icon={Shield}
          accentColor="text-aegis-green"
        />
        <MetricCard
          title="Warnings"
          value={sysAudit.loading ? "..." : sysWarnings}
          icon={AlertTriangle}
          accentColor="text-aegis-amber"
        />
      </div>

      {/* Tab selector */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="flex items-center gap-2 p-3" animated={false}>
          <span className="text-[10px] font-heading font-bold text-aegis-slate tracking-[0.1em] uppercase mr-3">
            Source:
          </span>
          {(["system", "ai"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-heading font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                tab === t
                  ? "bg-aegis-cyan/15 text-aegis-cyan border border-aegis-cyan/30"
                  : "text-aegis-mist hover:text-aegis-cloud hover:bg-white/[0.04]"
              }`}
            >
              {t === "system" ? "System Audit" : "AI Audit"}
            </button>
          ))}
        </GlassPanel>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          {activeData.loading ? (
            <div className="flex items-center gap-2 text-xs text-aegis-mist">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading audit log...
            </div>
          ) : activeData.error ? (
            <p className="text-xs text-aegis-red">{activeData.error}</p>
          ) : tab === "system" ? (
            <SystemAuditTable items={sysAudit.data?.items ?? []} />
          ) : (
            <AIAuditTable items={aiAudit.data?.items ?? []} />
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
            <span className="text-[10px] font-mono text-aegis-slate uppercase">
              Page {activePage} of {totalPages} &bull; {activeData.data?.total ?? 0} total
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage(Math.max(1, activePage - 1))}
                disabled={activePage <= 1 || activeData.loading}
                className="p-1.5 rounded-lg glass border border-white/[0.06] text-aegis-mist hover:text-aegis-cyan transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActivePage(Math.min(totalPages, activePage + 1))}
                disabled={activePage >= totalPages || activeData.loading}
                className="p-1.5 rounded-lg glass border border-white/[0.06] text-aegis-mist hover:text-aegis-cyan transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

function SystemAuditTable({
  items,
}: {
  items: import("@/lib/api/types").SystemAuditEntry[];
}) {
  if (items.length === 0) {
    return <p className="text-xs text-aegis-slate">No audit events.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {["Timestamp", "User", "Action", "Resource", "Result"].map((h) => (
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
          {items.map((evt) => (
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
                {evt.user_id || "SYSTEM"}
              </td>
              <td className="py-3 px-4 text-xs text-aegis-mist">{evt.action}</td>
              <td className="py-3 px-4 text-xs font-mono text-aegis-slate">
                {evt.resource}
              </td>
              <td className="py-3 px-4">
                <StatusBadge
                  label={evt.overridden ? "OVERRIDDEN" : evt.result.toUpperCase()}
                  variant={
                    evt.overridden
                      ? "warning"
                      : severityVariantFromResult(evt.result)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AIAuditTable({
  items,
}: {
  items: import("@/lib/api/types").AIAuditEntry[];
}) {
  if (items.length === 0) {
    return <p className="text-xs text-aegis-slate">No AI audit events.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {["Timestamp", "User", "Interaction", "Doctrine", "Confidence", "Override"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left py-3 px-4 text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((evt) => (
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
              <td className="py-3 px-4 text-xs font-mono text-aegis-slate">
                {evt.doctrine_version_used || "--"}
              </td>
              <td className="py-3 px-4 text-xs font-mono text-aegis-cyan">
                {evt.confidence != null ? `${Math.round(evt.confidence * 100)}%` : "--"}
              </td>
              <td className="py-3 px-4">
                {evt.overridden_by ? (
                  <StatusBadge label="OVERRIDDEN" variant="warning" />
                ) : (
                  <span className="text-[10px] text-aegis-slate font-mono">--</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
