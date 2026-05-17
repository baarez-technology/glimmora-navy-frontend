"use client";

import { motion } from "framer-motion";
import {
  Database,
  CheckCircle2,
  Edit,
  RefreshCw,
  AlertTriangle,
  Loader2,
  FileText,
  Layers,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { doctrine, scenarios } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";

export default function ContentIngestionPage() {
  const user = useUserStore((s) => s.user);
  const isAdmin = user?.role === "admin";

  const doctrineList = useApi(() => doctrine.list({ active_only: false }), []);
  const scenarioList = useApi(() => scenarios.list({ page_size: 50 }), []);

  const approveMut = useMutation(doctrine.approve);
  const rebuildMut = useMutation(doctrine.rebuildIndex);

  const docs = doctrineList.data ?? [];
  const approvedCount = docs.filter((d) => d.is_active).length;
  const pendingCount = docs.filter((d) => !d.is_active).length;

  const handleApprove = async (id: string) => {
    const res = await approveMut.run(id);
    if (res) doctrineList.refetch();
  };

  const handleRebuild = async (domainName?: string) => {
    const res = await rebuildMut.run({ domain: domainName, force: false });
    if (res) doctrineList.refetch();
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Content Ingestion & Validation
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Doctrine, Technical Manuals & Training Material Pipeline
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AegisButton
            variant="secondary"
            size="sm"
            icon={
              rebuildMut.loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )
            }
            disabled={!isAdmin || rebuildMut.loading}
            onClick={() => handleRebuild(undefined)}
          >
            Rebuild Index
          </AegisButton>
          <StatusBadge label="Module Active" variant="active" pulse />
        </div>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {doctrineList.loading ? "..." : docs.length}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Doctrine Docs
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-green">
              {doctrineList.loading ? "..." : approvedCount}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Approved
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-amber">
              {doctrineList.loading ? "..." : pendingCount}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Pending Review
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {scenarioList.loading ? "..." : scenarioList.data?.total ?? 0}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Scenarios
            </p>
          </GlassPanel>
        </div>
      </motion.div>

      {(approveMut.error || rebuildMut.error) && (
        <motion.div variants={fadeInUp}>
          <GlassPanel className="border border-aegis-red/30" animated={false}>
            <div className="flex items-center gap-2 text-xs text-aegis-red">
              <AlertTriangle className="w-3.5 h-3.5" />
              {approveMut.error || rebuildMut.error}
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {/* Doctrine Table */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-aegis-cyan" />
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Doctrine Documents
              </h3>
            </div>
          </div>

          {doctrineList.loading ? (
            <div className="flex items-center gap-2 text-xs text-aegis-mist">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading doctrine library...
            </div>
          ) : doctrineList.error ? (
            <p className="text-xs text-aegis-red">{doctrineList.error}</p>
          ) : docs.length === 0 ? (
            <p className="text-xs text-aegis-slate">No doctrine documents on record.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Title", "Domain", "Version", "Status", "Updated", "Actions"].map((h) => (
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
                  {docs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-aegis-cloud">{doc.title}</td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-cyan uppercase">
                        {doc.domain}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-slate">
                        v{doc.version}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          label={doc.is_active ? "APPROVED" : "PENDING"}
                          variant={doc.is_active ? "online" : "warning"}
                        />
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-slate">
                        {doc.updated_at
                          ? new Date(doc.updated_at).toLocaleDateString()
                          : "--"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {!doc.is_active && isAdmin && (
                            <button
                              onClick={() => handleApprove(doc.id)}
                              disabled={approveMut.loading}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-heading font-bold text-aegis-green border border-aegis-green/30 hover:bg-aegis-green/10 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                          )}
                          <button
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-heading text-aegis-mist border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleRebuild(doc.domain)}
                              disabled={rebuildMut.loading}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-heading text-aegis-cyan border border-aegis-cyan/30 hover:bg-aegis-cyan/10 transition-colors disabled:opacity-50"
                            >
                              <RefreshCw className="w-3 h-3" /> Rebuild
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {/* Scenarios */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center gap-2 mb-5">
            <Layers className="w-4 h-4 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Scenario Library
            </h3>
          </div>

          {scenarioList.loading ? (
            <div className="flex items-center gap-2 text-xs text-aegis-mist">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading scenarios...
            </div>
          ) : scenarioList.error ? (
            <p className="text-xs text-aegis-red">{scenarioList.error}</p>
          ) : !scenarioList.data || scenarioList.data.items.length === 0 ? (
            <p className="text-xs text-aegis-slate">No scenarios available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Title", "Domain", "Difficulty", "Doctrine", "Tags", "Status"].map(
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
                  {scenarioList.data.items.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-aegis-cloud">{s.title}</td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-cyan uppercase">
                        {s.domain}
                      </td>
                      <td className="py-3 px-4 text-xs text-aegis-mist">{s.difficulty}</td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-slate">
                        {s.doctrine_version}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(s.tags ?? []).slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-aegis-mist"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          label={s.is_archived ? "ARCHIVED" : "ACTIVE"}
                          variant={s.is_archived ? "neutral" : "online"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
