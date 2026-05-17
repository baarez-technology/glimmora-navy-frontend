"use client";

import { motion } from "framer-motion";
import {
  Glasses,
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

export default function ARVRModulesPage() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();

  const scenariosState = useApi(() => scenarios.list({ page_size: 50 }), []);
  const { run: startScenario, loading: starting, error: startError } =
    useMutation(scenarios.start);

  const onStart = async (scenarioId: string) => {
    if (!user) return;
    const res = await startScenario(scenarioId, { trainee_id: user.id });
    if (res) router.push(`/app/sessions/${res.session_id}`);
  };

  const allScenarios: Scenario[] = scenariosState.data?.items ?? [];

  const grouped = allScenarios.reduce<Record<string, Scenario[]>>((acc, s) => {
    const key = s.domain || "uncategorized";
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  const domainCount = Object.keys(grouped).length;
  const vrCount = allScenarios.filter((s) =>
    (s.tags ?? []).some((t) => t.toLowerCase() === "vr")
  ).length;
  const arCount = allScenarios.filter((s) =>
    (s.tags ?? []).some((t) => t.toLowerCase() === "ar")
  ).length;

  return (
    <ModulePage
      icon={Glasses}
      iconGradient="from-aegis-purple to-aegis-electric"
      title="AR/VR Training Modules"
      subtitle="Immersive Training Library for All Naval Domains"
      metrics={[
        {
          label: "VR Modules",
          value: scenariosState.loading ? "--" : String(vrCount),
        },
        {
          label: "AR Overlays",
          value: scenariosState.loading ? "--" : String(arCount),
        },
        {
          label: "Domains Covered",
          value: scenariosState.loading ? "--" : String(domainCount),
        },
        {
          label: "Total Scenarios",
          value: scenariosState.loading
            ? "--"
            : String(scenariosState.data?.total ?? allScenarios.length),
        },
      ]}
      capabilities={[
        "VR bridge familiarization and shiphandling in varied environments",
        "VR CIC/operations room replicating consoles, displays, and comms",
        "VR machinery space and engineering control room walk-throughs",
        "VR damage control scenarios (fires, flooding, explosions, structural damage)",
        "AR contextual overlays for equipment, controls, and component identification",
        "AR-guided maintenance and inspection with overlay-based component ID",
        "Instructor-led and self-paced immersive training paths",
        "Session tracking, usage analytics, and competency linkage",
      ]}
    >
      <motion.div variants={fadeInUp} className="space-y-4">
        {startError && (
          <p className="text-[10px] font-heading text-aegis-red tracking-wider uppercase">
            {startError}
          </p>
        )}
        {scenariosState.loading ? (
          <GlassPanel animated={false}>
            <LoadingRow label="Loading training modules" />
          </GlassPanel>
        ) : scenariosState.error ? (
          <GlassPanel animated={false}>
            <ErrorRow
              message={scenariosState.error}
              onRetry={scenariosState.refetch}
            />
          </GlassPanel>
        ) : Object.keys(grouped).length === 0 ? (
          <GlassPanel animated={false}>
            <p className="text-xs text-aegis-slate py-3">No modules available.</p>
          </GlassPanel>
        ) : (
          Object.entries(grouped).map(([domain, list]) => (
            <GlassPanel key={domain} animated={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                  {domain}
                </h3>
                <span className="text-[10px] font-mono text-aegis-slate">
                  {list.length} module{list.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {list.slice(0, 6).map((s) => (
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
                      <div className="flex items-center gap-2">
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
                      onClick={() => onStart(s.id)}
                    >
                      Start
                    </AegisButton>
                  </div>
                ))}
              </div>
            </GlassPanel>
          ))
        )}
      </motion.div>
    </ModulePage>
  );
}
