"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Play,
  AlertTriangle,
  Loader2,
  Target,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModulePage } from "@/components/ui/module-page";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { fadeInUp } from "@/animations/variants";
import { scenarios, sessions, analytics } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { Scenario, TrainingSession } from "@/lib/api/types";

const DOMAIN = "unmanned_systems";

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function formatDate(iso?: string | null): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

function EmptyRow({ text }: { text: string }) {
  return <p className="text-xs text-aegis-slate py-3">{text}</p>;
}

export default function UnmannedSystemsPage() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();

  const scenariosState = useApi(
    () => scenarios.list({ domain: DOMAIN, page_size: 50 }),
    []
  );
  const sessionsState = useApi(
    () =>
      user
        ? sessions.list({ trainee_id: user.id, page_size: 10 })
        : Promise.resolve(null),
    [user?.id],
    { skip: !user }
  );
  const weakState = useApi(() => analytics.domain(DOMAIN), [], {
    skip: !user || user.role === "trainee",
  });

  const { run: startScenario, loading: starting, error: startError } =
    useMutation(scenarios.start);

  const onStart = async (scenarioId: string) => {
    if (!user) return;
    const res = await startScenario(scenarioId, { trainee_id: user.id });
    if (res) router.push(`/app/sessions/${res.session_id}`);
  };

  const allScenarios: Scenario[] = scenariosState.data?.items ?? [];
  const domainSessions: TrainingSession[] = (sessionsState.data?.items ?? []).filter(
    (s) => allScenarios.some((sc) => sc.id === s.scenario_id)
  );
  const activeCount = domainSessions.filter((s) => s.status === "active").length;
  const avgScore = weakState.data
    ? `${Math.round(weakState.data.average_score)}%`
    : scenariosState.loading
    ? "--"
    : "N/A";
  const traineeCount = weakState.data?.trainee_count;

  return (
    <ModulePage
      icon={Bot}
      iconGradient="from-aegis-purple to-aegis-blue"
      title="Unmanned & Autonomous Maritime Systems"
      subtitle="USV, UUV & UAV Control, Swarm Supervision & MUM-T Training"
      metrics={[
        { label: "Active Sessions", value: scenariosState.loading || sessionsState.loading ? "--" : String(activeCount) },
        { label: "Trainees Enrolled", value: traineeCount !== undefined ? String(traineeCount) : weakState.loading ? "--" : "N/A" },
        { label: "Avg Score", value: avgScore },
        {
          label: "Scenarios Available",
          value: scenariosState.loading
            ? "--"
            : String(scenariosState.data?.total ?? allScenarios.length),
        },
      ]}
      capabilities={[
        "Control station procedures and workflows for training-only use",
        "Payload and sensor operations via digital twins and synthetic environments",
        "Link loss, contingency, and recovery logic",
        "Mission workflow from planning and briefing to execution and debrief",
        "Simulated swarm and manned-unmanned teaming (MUM-T) concepts",
        "Human-in-the-loop supervision training logic",
        "Exception handling, contingency awareness, and mission discipline",
        "Autonomous mission supervisor training using governed multi-agent constructs",
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <GlassPanel animated={false}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Available Scenarios
              </h3>
              {startError && (
                <span className="text-[10px] font-heading text-aegis-red tracking-wider uppercase">
                  {startError}
                </span>
              )}
            </div>
            {scenariosState.loading ? (
              <LoadingRow label="Loading scenarios" />
            ) : scenariosState.error ? (
              <ErrorRow
                message={scenariosState.error}
                onRetry={scenariosState.refetch}
              />
            ) : allScenarios.length === 0 ? (
              <EmptyRow text="No scenarios available for this domain yet." />
            ) : (
              <div className="space-y-3">
                {allScenarios.slice(0, 8).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-aegis-cyan/15 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-3.5 h-3.5 text-aegis-cyan shrink-0" />
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
                          {s.estimated_duration_minutes} min
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

        <motion.div variants={fadeInUp} className="space-y-6">
          <GlassPanel animated={false}>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
              Domain Weakness
            </h3>
            {!user || user.role === "trainee" ? (
              <EmptyRow text="Sign in as instructor or higher to view domain analytics." />
            ) : weakState.loading ? (
              <LoadingRow label="Loading analytics" />
            ) : weakState.error ? (
              <ErrorRow message={weakState.error} onRetry={weakState.refetch} />
            ) : !weakState.data ? (
              <EmptyRow text="No analytics available yet." />
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-aegis-cloud leading-relaxed">
                  {weakState.data.recommended_focus}
                </p>
                <div className="space-y-2">
                  {weakState.data.weakest_skills.slice(0, 5).map((s) => (
                    <div
                      key={s.skill}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-aegis-cloud truncate">{s.skill}</span>
                      <span className="font-mono font-bold text-aegis-amber">
                        {Math.round(s.average_score)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassPanel>

          <GlassPanel animated={false}>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
              Your Recent Sessions
            </h3>
            {!user ? (
              <EmptyRow text="Sign in to see your sessions." />
            ) : sessionsState.loading ? (
              <LoadingRow label="Loading sessions" />
            ) : sessionsState.error ? (
              <ErrorRow
                message={sessionsState.error}
                onRetry={sessionsState.refetch}
              />
            ) : domainSessions.length === 0 ? (
              <EmptyRow text="No sessions in this domain yet." />
            ) : (
              <div className="space-y-2">
                {domainSessions.slice(0, 5).map((s) => (
                  <Link key={s.id} href={`/app/sessions/${s.id}`}>
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <div className="min-w-0">
                        <p className="text-xs font-mono font-bold text-aegis-cyan">
                          {shortId(s.id)}
                        </p>
                        <p className="text-[10px] font-mono text-aegis-slate flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(s.started_at ?? s.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          label={s.status.toUpperCase()}
                          variant={
                            s.status === "active"
                              ? "active"
                              : s.status === "completed"
                              ? "online"
                              : s.status === "paused"
                              ? "warning"
                              : "neutral"
                          }
                          pulse={s.status === "active"}
                        />
                        <ChevronRight className="w-3 h-3 text-aegis-slate" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>
    </ModulePage>
  );
}
