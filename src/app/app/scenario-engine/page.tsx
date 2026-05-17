"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Play,
  CheckCircle,
  Edit,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { scenarios as scenariosApi } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";

const DOMAIN_OPTIONS = [
  { value: "bridge", label: "Bridge Navigation" },
  { value: "cic", label: "CIC & Warfare" },
  { value: "engineering", label: "Engineering" },
  { value: "damage_control", label: "Damage Control" },
  { value: "boats", label: "Small Boats" },
  { value: "unmanned", label: "Unmanned Systems" },
];

const DIFFICULTY_OPTIONS = [
  { value: "basic", label: "Basic" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

function shortId(id: string): string {
  return id.length > 10 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-8 gap-3 text-aegis-mist">
      <RefreshCw className="w-4 h-4 animate-spin text-aegis-cyan" />
      <span className="font-heading text-xs tracking-[0.1em] uppercase">{label}</span>
    </div>
  );
}

function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="w-10 h-10 rounded-full bg-aegis-red/10 border border-aegis-red/30 flex items-center justify-center">
        <AlertTriangle className="w-4 h-4 text-aegis-red" />
      </div>
      <p className="text-xs text-aegis-mist text-center max-w-md">{message}</p>
      <AegisButton size="sm" variant="secondary" icon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
        Retry
      </AegisButton>
    </div>
  );
}

export default function ScenarioEnginePage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  const [domain, setDomain] = useState("bridge");
  const [difficulty, setDifficulty] = useState("advanced");
  const [description, setDescription] = useState("");
  const [doctrineVersion, setDoctrineVersion] = useState("v1.0");
  const [duration, setDuration] = useState(45);

  const [filterDomain, setFilterDomain] = useState<string>("");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("");

  const scenariosQ = useApi(
    () =>
      scenariosApi.list({
        page: 1,
        page_size: 50,
        domain: filterDomain || undefined,
        difficulty: filterDifficulty || undefined,
      }),
    [filterDomain, filterDifficulty]
  );

  const generateM = useMutation(scenariosApi.generate);
  const startM = useMutation(scenariosApi.start);

  async function handleGenerate() {
    if (!description.trim()) return;
    const res = await generateM.run({
      domain,
      difficulty,
      description,
      doctrine_version: doctrineVersion,
      duration_minutes: duration,
    });
    if (res) {
      setDescription("");
      scenariosQ.refetch();
    }
  }

  async function handleStart(scenarioId: string) {
    if (!user) return;
    const res = await startM.run(scenarioId, {
      trainee_id: user.id,
      instructor_id: user.role !== "trainee" ? user.id : undefined,
    });
    if (res) {
      router.push(`/app/sessions/${res.session_id}`);
    }
  }

  const items = scenariosQ.data?.items ?? [];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Synthetic Scenario Generation Engine
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Doctrine-Bounded Exercise Creation
            </p>
          </div>
        </div>
        <AegisButton
          size="sm"
          icon={<Sparkles className="w-4 h-4" />}
          onClick={handleGenerate}
          loading={generateM.loading}
          disabled={!description.trim()}
        >
          Generate New
        </AegisButton>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Builder Panel (Left 40%) */}
        <GlassPanel className="lg:col-span-2">
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            AI Scenario Generator
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1">
                Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
              >
                {DOMAIN_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
              >
                {DIFFICULTY_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1">
                Doctrine Version
              </label>
              <input
                value={doctrineVersion}
                onChange={(e) => setDoctrineVersion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
              />
            </div>
            <div>
              <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={5}
                max={240}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 45)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
              />
            </div>
            <div>
              <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="e.g. Strait transit with dense traffic and reduced visibility, multi-axis surface threat..."
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/30"
              />
            </div>
            {generateM.error && (
              <div className="flex items-start gap-2 text-xs text-aegis-red">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{generateM.error}</span>
              </div>
            )}
            <div className="pt-2 space-y-2">
              <AegisButton
                className="w-full"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={handleGenerate}
                loading={generateM.loading}
                disabled={!description.trim()}
              >
                Generate Scenario
              </AegisButton>
            </div>
          </div>
        </GlassPanel>

        {/* Preview Panel (Right 60%) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filter row */}
          <div className="flex items-center gap-2">
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
            >
              <option value="">All domains</option>
              {DOMAIN_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
            >
              <option value="">All difficulty</option>
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <button
              onClick={scenariosQ.refetch}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-aegis-mist hover:text-aegis-cyan cursor-pointer"
              aria-label="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Generated Scenarios Library */}
          <GlassPanel>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
              Scenario Library
            </h3>
            {scenariosQ.loading ? (
              <LoadingBlock label="Loading scenarios..." />
            ) : scenariosQ.error ? (
              <ErrorBlock message={scenariosQ.error} onRetry={scenariosQ.refetch} />
            ) : items.length === 0 ? (
              <p className="text-center text-xs text-aegis-mist py-6">No scenarios match these filters.</p>
            ) : (
              <div className="space-y-3">
                {items.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-aegis-gold" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-aegis-slate">{shortId(scenario.id)}</span>
                          <StatusBadge
                            label={scenario.is_archived ? "ARCHIVED" : "ACTIVE"}
                            variant={scenario.is_archived ? "neutral" : "online"}
                          />
                        </div>
                        <p className="text-sm font-semibold text-aegis-cloud mt-0.5 truncate">
                          {scenario.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-mono text-aegis-mist uppercase">
                            {scenario.domain}
                          </span>
                          <span className="text-[10px] font-heading text-aegis-amber tracking-wider uppercase">
                            {scenario.difficulty}
                          </span>
                          <span className="text-[10px] font-mono text-aegis-slate">
                            ~{scenario.estimated_duration_minutes}m
                          </span>
                          <span className="text-[10px] font-mono text-aegis-slate">
                            doctrine {scenario.doctrine_version}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <AegisButton
                        size="sm"
                        variant="secondary"
                        icon={<Play className="w-3.5 h-3.5" />}
                        onClick={() => handleStart(scenario.id)}
                        loading={startM.loading}
                        disabled={!user || scenario.is_archived}
                      >
                        Start
                      </AegisButton>
                      <button className="p-2 rounded-lg hover:bg-white/[0.04] text-aegis-mist transition-colors cursor-pointer">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {startM.error && (
              <div className="mt-4 flex items-start gap-2 text-xs text-aegis-red">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{startM.error}</span>
              </div>
            )}
          </GlassPanel>

          {/* Approval Workflow (static visual) */}
          <GlassPanel>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
              Approval Workflow
            </h3>
            <div className="flex items-center gap-4">
              {[
                { label: "Generated", complete: true },
                { label: "SME Review", complete: true },
                { label: "Instructor Approval", complete: false },
                { label: "Published", complete: false },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.complete ? "bg-aegis-cyan/20 text-aegis-cyan" : "bg-white/[0.04] text-aegis-slate"
                    }`}
                  >
                    {step.complete ? <CheckCircle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-xs font-heading tracking-wide ${
                      step.complete ? "text-aegis-cloud" : "text-aegis-slate"
                    }`}
                  >
                    {step.label}
                  </span>
                  {i < 3 && (
                    <div className={`w-8 h-px ${step.complete ? "bg-aegis-cyan/30" : "bg-white/[0.06]"}`} />
                  )}
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </motion.div>
  );
}
