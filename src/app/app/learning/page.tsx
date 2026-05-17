"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Play,
  AlertTriangle,
  Loader2,
  Target,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ModulePage } from "@/components/ui/module-page";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { fadeInUp } from "@/animations/variants";
import { scenarios, analytics, users } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { Scenario, TraineeAnalytics } from "@/lib/api/types";

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

export default function LearningPage() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();
  const isTrainee = user?.role === "trainee";

  const scenariosState = useApi(() => scenarios.list({ page_size: 100 }), []);
  const traineeState = useApi<TraineeAnalytics | null>(
    () => (user && isTrainee ? analytics.trainee(user.id) : Promise.resolve(null)),
    [user?.id, isTrainee],
    { skip: !user || !isTrainee }
  );
  const traineesListState = useApi(
    () => users.trainees({ page_size: 25 }),
    [],
    { skip: !user || isTrainee }
  );

  const { run: startScenario, loading: starting, error: startError } =
    useMutation(scenarios.start);

  const onStart = async (scenarioId: string) => {
    if (!user) return;
    const res = await startScenario(scenarioId, { trainee_id: user.id });
    if (res) router.push(`/app/sessions/${res.session_id}`);
  };

  const allScenarios: Scenario[] = scenariosState.data?.items ?? [];
  const overall = traineeState.data
    ? Math.round(traineeState.data.overall_score)
    : null;
  const sessionsCompleted = traineeState.data?.sessions_completed ?? null;
  const certs = traineeState.data?.certifications_earned ?? null;
  const learners = traineesListState.data?.items ?? [];

  const totalScenarios = scenariosState.data?.total ?? allScenarios.length;

  return (
    <ModulePage
      icon={GraduationCap}
      iconGradient="from-aegis-cyan to-aegis-blue"
      title="Learning Lifecycle Manager"
      subtitle="Guided Paths, Remediation & Competency Progression"
      metrics={[
        {
          label: isTrainee ? "Overall Score" : "Active Learners",
          value: isTrainee
            ? traineeState.loading
              ? "--"
              : overall !== null
              ? `${overall}%`
              : "N/A"
            : traineesListState.loading
            ? "--"
            : String(traineesListState.data?.total ?? learners.length),
        },
        {
          label: isTrainee ? "Sessions Completed" : "Available Scenarios",
          value: isTrainee
            ? traineeState.loading
              ? "--"
              : String(sessionsCompleted ?? 0)
            : scenariosState.loading
            ? "--"
            : String(totalScenarios),
        },
        {
          label: isTrainee ? "Certifications" : "Domains",
          value: isTrainee
            ? traineeState.loading
              ? "--"
              : String(certs ?? 0)
            : scenariosState.loading
            ? "--"
            : String(new Set(allScenarios.map((s) => s.domain)).size),
        },
        {
          label: "Scenarios Available",
          value: scenariosState.loading ? "--" : String(totalScenarios),
        },
      ]}
      capabilities={[
        "Guided learning paths aligned to qualification and competency milestones",
        "Explain-why behavior explanations for decisions and outcomes",
        "Adaptive quizzes and practice assessments across all domains",
        "Targeted remediation recommendations and suggested immersive exercises",
        "Context-sensitive help during approved learning modes",
        "Learning progression support across all modules and channels",
        "Multi-modal evidence from classroom, simulator, digital twin, AR/VR, and at-sea",
        "Continuous Learning Feedback Loop connecting all training subsystems",
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Scenarios */}
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
              <p className="text-xs text-aegis-slate py-3">
                No scenarios available yet.
              </p>
            ) : (
              <div className="space-y-3">
                {allScenarios.slice(0, 10).map((s) => (
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

        {/* Sidebar: competency or learners */}
        <motion.div variants={fadeInUp}>
          {isTrainee ? (
            <GlassPanel animated={false}>
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
                Your Competencies
              </h3>
              {traineeState.loading ? (
                <LoadingRow label="Loading competencies" />
              ) : traineeState.error ? (
                <ErrorRow
                  message={traineeState.error}
                  onRetry={traineeState.refetch}
                />
              ) : !traineeState.data || traineeState.data.domains.length === 0 ? (
                <p className="text-xs text-aegis-slate py-3">
                  No competency data yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {traineeState.data.domains.slice(0, 6).map((d) => (
                    <div key={d.domain}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-aegis-cloud truncate">
                          {d.domain}
                        </span>
                        <span className="text-xs font-mono font-bold text-aegis-cyan">
                          {Math.round(d.average_score)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-blue"
                          style={{ width: `${Math.round(d.average_score)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassPanel>
          ) : (
            <GlassPanel animated={false}>
              <div className="flex items-center gap-2 mb-5">
                <Users className="w-4 h-4 text-aegis-cyan" />
                <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                  Active Learners
                </h3>
              </div>
              {traineesListState.loading ? (
                <LoadingRow label="Loading learners" />
              ) : traineesListState.error ? (
                <ErrorRow
                  message={traineesListState.error}
                  onRetry={traineesListState.refetch}
                />
              ) : learners.length === 0 ? (
                <p className="text-xs text-aegis-slate py-3">No learners found.</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {learners.slice(0, 12).map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-aegis-cloud truncate">
                          {l.rank} {l.name}
                        </p>
                        <p className="text-[10px] font-mono text-aegis-slate">
                          {l.service_number}
                        </p>
                      </div>
                      <StatusBadge
                        label={l.is_active ? "ACTIVE" : "INACTIVE"}
                        variant={l.is_active ? "online" : "neutral"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </GlassPanel>
          )}
        </motion.div>
      </div>
    </ModulePage>
  );
}
