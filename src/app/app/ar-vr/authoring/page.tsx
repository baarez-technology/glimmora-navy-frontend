"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Play,
  AlertTriangle,
  Loader2,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ModulePage } from "@/components/ui/module-page";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { fadeInUp } from "@/animations/variants";
import { scenarios } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { Scenario } from "@/lib/api/types";

function LoadingRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-6 text-aegis-mist">
      <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
      <span className="text-xs font-heading tracking-wider uppercase">
        {label}&hellip;
      </span>
    </div>
  );
}

function ErrorRow({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-start gap-3 py-4">
      <AlertTriangle className="w-4 h-4 text-aegis-red shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs text-aegis-cloud leading-relaxed">{message}</p>
        <button
          onClick={onRetry}
          className="text-[10px] font-heading text-aegis-cyan mt-2 tracking-wider uppercase cursor-pointer"
        >
          Retry &rarr;
        </button>
      </div>
    </div>
  );
}

export default function ARVRAuthoringPage() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();

  const scenariosState = useApi(
    () => scenarios.list({ page_size: 100 }),
    []
  );
  const { run: startScenario, loading: starting, error: startError } =
    useMutation(scenarios.start);

  const onStart = async (scenarioId: string) => {
    if (!user) return;
    const res = await startScenario(scenarioId, { trainee_id: user.id });
    if (res) router.push(`/app/sessions/${res.session_id}`);
  };

  const allScenarios: Scenario[] = scenariosState.data?.items ?? [];
  const vrScenarios = allScenarios.filter((s) =>
    (s.tags ?? []).some((t) => t.toLowerCase() === "vr")
  );
  const arScenarios = allScenarios.filter((s) =>
    (s.tags ?? []).some((t) => t.toLowerCase() === "ar")
  );
  const drafts = allScenarios.filter((s) => s.is_archived);

  return (
    <ModulePage
      icon={Sparkles}
      iconGradient="from-aegis-purple to-aegis-electric"
      title="AR/VR Instructor Authoring"
      subtitle="Create & Configure Immersive Scenarios, Overlays & Assessment Criteria"
      metrics={[
        {
          label: "Published VR Scenarios",
          value: scenariosState.loading ? "--" : String(vrScenarios.length),
        },
        {
          label: "AR Overlays",
          value: scenariosState.loading ? "--" : String(arScenarios.length),
        },
        {
          label: "Archived / Drafts",
          value: scenariosState.loading ? "--" : String(drafts.length),
        },
        {
          label: "Total Scenarios",
          value: scenariosState.loading
            ? "--"
            : String(scenariosState.data?.total ?? allScenarios.length),
        },
      ]}
      capabilities={[
        "Creation and configuration of immersive scenarios across all domains",
        "Guided versus unguided execution mode configuration",
        "Activation of hints, annotations, prompts, and overlays during sessions",
        "Scenario branching based on learner actions and AI-generated variations",
        "Role-based control over assessment visibility and feedback timing",
        "Session playback and review configuration for debrief purposes",
        "Synthetic Scenario Generation Engine controls for parameterized families",
        "Template library for rapid scenario creation and reuse",
      ]}
    >
      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              VR Scenarios
            </h3>
            {startError && (
              <span className="text-[10px] font-heading text-aegis-red tracking-wider uppercase">
                {startError}
              </span>
            )}
          </div>
          {scenariosState.loading ? (
            <LoadingRow label="Loading VR scenarios" />
          ) : scenariosState.error ? (
            <ErrorRow
              message={scenariosState.error}
              onRetry={scenariosState.refetch}
            />
          ) : vrScenarios.length === 0 ? (
            <p className="text-xs text-aegis-slate py-3">
              No scenarios tagged with &quot;vr&quot; yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vrScenarios.slice(0, 12).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-aegis-cyan/15 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-3.5 h-3.5 text-aegis-purple shrink-0" />
                      <p className="text-sm font-semibold text-aegis-cloud truncate">
                        {s.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge label={s.domain.toUpperCase()} variant="active" />
                      <StatusBadge
                        label={s.difficulty.toUpperCase()}
                        variant="neutral"
                      />
                      <span className="text-[10px] font-mono text-aegis-slate">
                        {s.estimated_duration_minutes}m
                      </span>
                    </div>
                  </div>
                  <AegisButton
                    size="sm"
                    icon={<Play className="w-3.5 h-3.5" />}
                    disabled={!user || starting}
                    loading={starting}
                    onClick={() => onStart(s.id)}
                  >
                    Start
                  </AegisButton>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </ModulePage>
  );
}
