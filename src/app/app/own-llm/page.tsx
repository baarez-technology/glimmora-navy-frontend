"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { ai, system } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";

function statusVariant(status: string): "online" | "offline" | "warning" | "neutral" {
  const s = (status || "").toLowerCase();
  if (s.includes("loaded") || s.includes("ready") || s.includes("ok") || s.includes("online") || s.includes("healthy"))
    return "online";
  if (s.includes("degrad") || s.includes("warn") || s.includes("pending")) return "warning";
  if (s.includes("offline") || s.includes("missing") || s.includes("error") || s.includes("fail"))
    return "offline";
  return "neutral";
}

export default function OwnLLMPage() {
  const user = useUserStore((s) => s.user);
  const isPrivileged = user?.role === "admin" || user?.role === "maintainer";
  const [modelInput, setModelInput] = useState("");
  const [sourcePath, setSourcePath] = useState("");

  const modelInfo = useApi(() => ai.modelInfo(), []);
  const modelStatus = useApi(() => system.modelStatus(), []);
  const { run: loadModel, loading: loadingModel, error: loadError, data: loadResult } =
    useMutation(system.modelLoad);

  const handleLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = modelInput.trim();
    if (!name) return;
    const result = await loadModel(name, sourcePath.trim() || undefined);
    if (result) {
      setModelInput("");
      setSourcePath("");
      modelInfo.refetch();
      modelStatus.refetch();
    }
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-cyan flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              OwnLLM -- Navy Domain Intelligence
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Offline Navy-Domain Language Model for Doctrine-Grounded Responses
            </p>
          </div>
        </div>
        {modelInfo.loading ? (
          <StatusBadge label="Loading..." variant="neutral" />
        ) : modelInfo.error ? (
          <StatusBadge label="Module Offline" variant="offline" />
        ) : (
          <StatusBadge
            label={`Module ${modelInfo.data?.status || "Unknown"}`}
            variant={statusVariant(modelInfo.data?.status || "")}
            pulse={!!modelInfo.data?.available}
          />
        )}
      </motion.div>

      {/* Model Overview */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {modelInfo.loading ? "..." : modelInfo.data?.provider || "--"}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Provider
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan truncate">
              {modelInfo.loading
                ? "..."
                : modelInfo.data?.model_in_use || modelInfo.data?.model_name || "--"}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Active Model
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {modelStatus.loading
                ? "..."
                : modelStatus.data?.models?.length ?? 0}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Registered Models
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {modelInfo.loading
                ? "..."
                : modelInfo.data?.available_models?.length ?? 0}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Available Variants
            </p>
          </GlassPanel>
        </div>
      </motion.div>

      {/* Registry */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Model Registry
            </h3>
            {modelStatus.data && (
              <span className="text-[10px] font-mono text-aegis-slate uppercase">
                {modelStatus.data.provider} &bull; {modelStatus.data.ai_status}
              </span>
            )}
          </div>

          {modelStatus.loading ? (
            <div className="flex items-center gap-2 text-xs text-aegis-mist">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Loading model registry...
            </div>
          ) : modelStatus.error ? (
            <p className="text-xs text-aegis-red">{modelStatus.error}</p>
          ) : !modelStatus.data || modelStatus.data.models.length === 0 ? (
            <p className="text-xs text-aegis-slate">No models registered.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Model", "Status", "Capabilities", "Active"].map((h) => (
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
                  {modelStatus.data.models.map((m) => {
                    const isActive = modelStatus.data?.active_model === m.model_name;
                    return (
                      <tr
                        key={m.model_name}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4 text-sm font-mono text-aegis-cloud">
                          {m.model_name}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge
                            label={m.status}
                            variant={statusVariant(m.status)}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {m.capabilities?.map((c) => (
                              <span
                                key={c}
                                className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-aegis-mist"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-heading text-aegis-green">
                              <CheckCircle2 className="w-3 h-3" /> ACTIVE
                            </span>
                          ) : (
                            <span className="text-[10px] text-aegis-slate font-mono">--</span>
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

      {/* Load Model Form (admin/maintainer only) */}
      {isPrivileged && (
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <div className="flex items-center gap-3 mb-5">
              <Download className="w-4 h-4 text-aegis-cyan" />
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Load Model
              </h3>
            </div>
            <form
              onSubmit={handleLoad}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
            >
              <div className="md:col-span-1">
                <label className="block text-[10px] font-heading text-aegis-slate uppercase tracking-wider mb-2">
                  Model Name
                </label>
                <input
                  type="text"
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  placeholder="llama3:8b-instruct"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-aegis-white placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/50"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-heading text-aegis-slate uppercase tracking-wider mb-2">
                  Source Path (optional)
                </label>
                <input
                  type="text"
                  value={sourcePath}
                  onChange={(e) => setSourcePath(e.target.value)}
                  placeholder="/models/local/file.gguf"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-aegis-white placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/50"
                />
              </div>
              <div className="md:col-span-1">
                <AegisButton
                  type="submit"
                  loading={loadingModel}
                  disabled={!modelInput.trim()}
                  icon={<Download className="w-4 h-4" />}
                >
                  Pull / Load
                </AegisButton>
              </div>
            </form>
            {loadError && (
              <div className="mt-4 flex items-center gap-2 text-xs text-aegis-red">
                <AlertTriangle className="w-3.5 h-3.5" /> {loadError}
              </div>
            )}
            {loadResult && (
              <div className="mt-4 flex items-center gap-2 text-xs text-aegis-green">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Model <span className="font-mono">{loadResult.model_name}</span> -{" "}
                {loadResult.status}
              </div>
            )}
          </GlassPanel>
        </motion.div>
      )}
    </motion.div>
  );
}
