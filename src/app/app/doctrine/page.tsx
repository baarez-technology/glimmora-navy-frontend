"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Cpu,
  FileText,
  Filter,
  Loader2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { doctrine } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { DoctrineDoc } from "@/lib/api/types";

type Tab = "library" | "groundings";

const MANAGE_ROLES = new Set(["doctrine", "fleet", "admin"]);

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "--";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "--";
  }
}

export default function DoctrinePage() {
  const user = useUserStore((s) => s.user);
  const canManage = !!user && MANAGE_ROLES.has(user.role);

  const [tab, setTab] = useState<Tab>("library");
  const [domainFilter, setDomainFilter] = useState<string>("");
  const [activeOnly, setActiveOnly] = useState<boolean>(false);

  const listState = useApi(
    () =>
      doctrine.list({
        domain: domainFilter || undefined,
        active_only: activeOnly || undefined,
      }),
    [domainFilter, activeOnly]
  );

  const groundingsState = useApi(
    () => doctrine.aiGroundings(),
    [tab],
    { skip: tab !== "groundings" }
  );

  const createMutation = useMutation(doctrine.create);
  const approveMutation = useMutation(doctrine.approve);
  const rebuildMutation = useMutation(doctrine.rebuildIndex);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    domain: "",
    version: "",
    content_text: "",
    file_ref: "",
  });

  const domains = useMemo(() => {
    const set = new Set<string>();
    listState.data?.forEach((d) => set.add(d.domain));
    return Array.from(set).sort();
  }, [listState.data]);

  const totalDocs = listState.data?.length ?? 0;
  const activeCount = listState.data?.filter((d) => d.is_active).length ?? 0;
  const pendingCount =
    listState.data?.filter((d) => !d.approved_by).length ?? 0;
  const embeddedCount =
    listState.data?.filter((d) => !!d.embedded_at).length ?? 0;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.domain.trim() || !form.version.trim()) return;
    const res = await createMutation.run({
      title: form.title.trim(),
      domain: form.domain.trim(),
      version: form.version.trim(),
      content_text: form.content_text.trim() || undefined,
      file_ref: form.file_ref.trim() || undefined,
    });
    if (res) {
      setForm({ title: "", domain: "", version: "", content_text: "", file_ref: "" });
      setShowCreate(false);
      listState.refetch();
    }
  };

  const handleApprove = async (doc: DoctrineDoc) => {
    const res = await approveMutation.run(doc.id);
    if (res) listState.refetch();
  };

  const handleRebuild = async () => {
    const res = await rebuildMutation.run({
      domain: domainFilter || undefined,
      force: false,
    });
    if (res) listState.refetch();
  };

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
            <BookOpen className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Doctrine Management
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Document Library, Version Control & AI Grounding
            </p>
          </div>
        </div>
        <StatusBadge label="Module Active" variant="active" pulse />
      </motion.div>

      {/* Metrics */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {listState.loading ? "--" : totalDocs}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Documents
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {listState.loading ? "--" : activeCount}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Active
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {listState.loading ? "--" : pendingCount}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Pending Approval
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {listState.loading ? "--" : embeddedCount}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Embedded
            </p>
          </GlassPanel>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 glass rounded-xl p-1.5">
          <button
            onClick={() => setTab("library")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-heading font-semibold tracking-wider transition-all cursor-pointer ${
              tab === "library"
                ? "bg-aegis-cyan/15 text-aegis-cyan"
                : "text-aegis-mist hover:text-aegis-cloud hover:bg-white/[0.04]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Library
          </button>
          <button
            onClick={() => setTab("groundings")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-heading font-semibold tracking-wider transition-all cursor-pointer ${
              tab === "groundings"
                ? "bg-aegis-cyan/15 text-aegis-cyan"
                : "text-aegis-mist hover:text-aegis-cloud hover:bg-white/[0.04]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            AI Groundings
          </button>
        </div>

        {tab === "library" && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-aegis-slate" />
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30 cursor-pointer"
              >
                <option value="">All Domains</option>
                {domains.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer text-[11px] font-heading text-aegis-cloud tracking-wider">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="accent-aegis-cyan"
              />
              Active only
            </label>
            {canManage && (
              <>
                <AegisButton
                  variant="secondary"
                  size="sm"
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                  loading={rebuildMutation.loading}
                  onClick={handleRebuild}
                >
                  Rebuild Index
                </AegisButton>
                <AegisButton
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setShowCreate((v) => !v)}
                >
                  {showCreate ? "Cancel" : "Add Doctrine"}
                </AegisButton>
              </>
            )}
          </div>
        )}
      </motion.div>

      {rebuildMutation.error && (
        <div className="flex items-center gap-2 text-aegis-red text-[11px] font-heading tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" />
          {rebuildMutation.error}
        </div>
      )}
      {rebuildMutation.data && (
        <div className="text-[11px] font-heading text-aegis-green tracking-wider">
          Rebuilt index: {rebuildMutation.data.embedded} embedded /{" "}
          {rebuildMutation.data.total_processed} processed
          {rebuildMutation.data.failed
            ? ` (${rebuildMutation.data.failed} failed)`
            : ""}
        </div>
      )}

      {/* Create form */}
      {tab === "library" && canManage && showCreate && (
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
              New Doctrine Document
            </h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleCreate}>
              <div>
                <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1.5">
                  Domain
                </label>
                <input
                  type="text"
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1.5">
                  Version
                </label>
                <input
                  type="text"
                  value={form.version}
                  onChange={(e) => setForm({ ...form, version: e.target.value })}
                  placeholder="e.g. 2025.1"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1.5">
                  File Reference (optional)
                </label>
                <input
                  type="text"
                  value={form.file_ref}
                  onChange={(e) => setForm({ ...form, file_ref: e.target.value })}
                  placeholder="s3://bucket/key.pdf"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1.5">
                  Content Text (optional)
                </label>
                <textarea
                  value={form.content_text}
                  onChange={(e) => setForm({ ...form, content_text: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-body text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
                />
              </div>
              {createMutation.error && (
                <div className="md:col-span-2 flex items-center gap-2 text-aegis-red text-[11px] font-heading tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {createMutation.error}
                </div>
              )}
              <div className="md:col-span-2 flex items-center gap-3">
                <AegisButton
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={createMutation.loading}
                >
                  Create
                </AegisButton>
                <AegisButton
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </AegisButton>
              </div>
            </form>
          </GlassPanel>
        </motion.div>
      )}

      {/* Content */}
      {tab === "library" ? (
        <motion.div variants={fadeInUp}>
          {listState.loading ? (
            <GlassPanel animated={false}>
              <div className="flex items-center justify-center py-12 gap-3 text-aegis-mist">
                <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
                <span className="font-heading text-xs tracking-[0.1em] uppercase">
                  Loading doctrine...
                </span>
              </div>
            </GlassPanel>
          ) : listState.error ? (
            <GlassPanel animated={false}>
              <div className="flex items-center justify-center py-12 gap-3 text-aegis-red">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-heading text-xs tracking-[0.1em] uppercase">
                  {listState.error}
                </span>
              </div>
            </GlassPanel>
          ) : !listState.data?.length ? (
            <GlassPanel animated={false}>
              <p className="text-center py-10 text-aegis-mist text-xs font-heading tracking-wider">
                No doctrine documents match the current filters.
              </p>
            </GlassPanel>
          ) : (
            <GlassPanel className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/[0.05]">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                        Title
                      </th>
                      <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                        Domain
                      </th>
                      <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                        Version
                      </th>
                      <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                        Embedded
                      </th>
                      <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                        Updated
                      </th>
                      {canManage && (
                        <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {listState.data.map((doc) => (
                      <tr
                        key={doc.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 text-sm text-aegis-cloud">
                          {doc.title}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-mono text-aegis-mist uppercase">
                          {doc.domain}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-mono text-aegis-cloud">
                          {doc.version}
                        </td>
                        <td className="px-4 py-3">
                          {doc.is_active ? (
                            doc.approved_by ? (
                              <StatusBadge label="APPROVED" variant="online" />
                            ) : (
                              <StatusBadge label="PENDING" variant="warning" />
                            )
                          ) : (
                            <StatusBadge label="INACTIVE" variant="neutral" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-mono text-aegis-mist">
                          {doc.embedded_at ? formatDate(doc.embedded_at) : "--"}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-mono text-aegis-mist">
                          {formatDate(doc.updated_at)}
                        </td>
                        {canManage && (
                          <td className="px-4 py-3">
                            {doc.approved_by ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-heading text-aegis-green tracking-wider">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approved
                              </span>
                            ) : (
                              <AegisButton
                                variant="secondary"
                                size="sm"
                                loading={approveMutation.loading}
                                onClick={() => handleApprove(doc)}
                              >
                                Approve
                              </AegisButton>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassPanel>
          )}
          {approveMutation.error && (
            <div className="mt-3 flex items-center gap-2 text-aegis-red text-[11px] font-heading tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              {approveMutation.error}
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div variants={fadeInUp}>
          {groundingsState.loading ? (
            <GlassPanel animated={false}>
              <div className="flex items-center justify-center py-12 gap-3 text-aegis-mist">
                <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
                <span className="font-heading text-xs tracking-[0.1em] uppercase">
                  Loading AI groundings...
                </span>
              </div>
            </GlassPanel>
          ) : groundingsState.error ? (
            <GlassPanel animated={false}>
              <div className="flex items-center justify-center py-12 gap-3 text-aegis-red">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-heading text-xs tracking-[0.1em] uppercase">
                  {groundingsState.error}
                </span>
              </div>
            </GlassPanel>
          ) : !groundingsState.data?.length ? (
            <GlassPanel animated={false}>
              <p className="text-center py-10 text-aegis-mist text-xs font-heading tracking-wider">
                No AI grounding usage recorded yet.
              </p>
            </GlassPanel>
          ) : (
            <GlassPanel className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/[0.05]">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                        Document
                      </th>
                      <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                        Domain
                      </th>
                      <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                        Version
                      </th>
                      <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                        Usage Count
                      </th>
                      <th className="px-4 py-3 text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                        Last Used
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groundingsState.data.map((g) => (
                      <tr
                        key={g.document_id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 text-sm text-aegis-cloud">
                          {g.title}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-mono text-aegis-mist uppercase">
                          {g.domain}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-mono text-aegis-cloud">
                          {g.version}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-mono text-aegis-cyan">
                          {g.usage_count}
                        </td>
                        <td className="px-4 py-3 text-[11px] font-mono text-aegis-mist">
                          {g.last_used
                            ? new Date(g.last_used).toLocaleString()
                            : "--"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassPanel>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
