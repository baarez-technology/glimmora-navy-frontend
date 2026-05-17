"use client";

import { motion } from "framer-motion";
import { Cpu, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { analytics } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";

const INSTRUCTOR_ROLES = new Set(["instructor", "evaluator", "admin", "fleet", "doctrine"]);

function pct(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v * 100)));
}

export default function PredictiveEnginePage() {
  const user = useUserStore((s) => s.user);
  const searchParams = useSearchParams();
  const queryUserId = searchParams.get("user_id");
  const canPickUser = !!user && INSTRUCTOR_ROLES.has(user.role);
  const targetId = canPickUser && queryUserId ? queryUserId : user?.id;

  const predictiveState = useApi(
    () => (targetId ? analytics.predictive(targetId) : Promise.resolve(null)),
    [targetId],
    { skip: !targetId }
  );

  // Find the weakest predicted domain to enrich with domain-level analytics.
  const weakestDomain =
    predictiveState.data && predictiveState.data.predictions.length > 0
      ? predictiveState.data.predictions.reduce((min, p) =>
          p.current_score < min.current_score ? p : min
        ).domain
      : null;

  const domainState = useApi(
    () =>
      weakestDomain ? analytics.domain(weakestDomain) : Promise.resolve(null),
    [weakestDomain],
    { skip: !weakestDomain }
  );

  const loading = predictiveState.loading;
  const error = predictiveState.error;
  const predictions = predictiveState.data?.predictions ?? [];

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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-green to-aegis-cyan flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Predictive Decision Intelligence Engine
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              30/90-Day Trajectories, Confidence Bands & Targeted Recommendations
            </p>
          </div>
        </div>
        <StatusBadge label="Module Active" variant="active" pulse />
      </motion.div>

      {/* Banners */}
      {!user && (
        <GlassPanel animated={false} className="p-4">
          <p className="text-sm text-aegis-mist">Sign in to view predictions.</p>
        </GlassPanel>
      )}
      {error && (
        <GlassPanel animated={false} className="p-4 border border-aegis-red/30">
          <p className="text-sm text-aegis-red">Failed to load: {error}</p>
        </GlassPanel>
      )}
      {loading && (
        <GlassPanel animated={false} className="p-4">
          <p className="text-sm text-aegis-mist">Loading predictions...</p>
        </GlassPanel>
      )}
      {predictiveState.data?.note && (
        <GlassPanel animated={false} className="p-4 border border-aegis-amber/20">
          <p className="text-xs text-aegis-amber">{predictiveState.data.note}</p>
        </GlassPanel>
      )}

      {/* Metrics */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric label="Predictions Active" value={String(predictions.length || "--")} />
          <Metric
            label="Avg Confidence"
            value={
              predictions.length > 0
                ? `${Math.round(
                    (predictions.reduce((a, p) => a + p.confidence, 0) /
                      predictions.length) *
                      100
                  )}%`
                : "--"
            }
          />
          <Metric
            label="Positive Trajectories"
            value={String(
              predictions.filter((p) => p.trajectory === "positive").length || "--"
            )}
          />
          <Metric
            label="Weakest Focus"
            value={
              weakestDomain
                ? weakestDomain.replace(/_/g, " ")
                : "--"
            }
          />
        </div>
      </motion.div>

      {/* Trajectory cards */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Trajectory by Domain
          </h3>
          {predictions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {predictions.map((p) => {
                const cur = pct(p.current_score);
                const d30 = pct(p.predicted_score_30d);
                const d90 = pct(p.predicted_score_90d);
                const TrajIcon =
                  p.trajectory === "positive"
                    ? TrendingUp
                    : p.trajectory === "negative"
                      ? TrendingDown
                      : Minus;
                const trajColor =
                  p.trajectory === "positive"
                    ? "text-aegis-green"
                    : p.trajectory === "negative"
                      ? "text-aegis-red"
                      : "text-aegis-mist";
                return (
                  <div
                    key={p.domain}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-semibold text-aegis-cloud capitalize">
                          {p.domain.replace(/_/g, " ")}
                        </p>
                        <p className="text-[10px] font-mono text-aegis-slate">
                          confidence {Math.round(p.confidence * 100)}%
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 ${trajColor}`}>
                        <TrajIcon className="w-4 h-4" />
                        <span className="text-[10px] font-heading font-bold uppercase tracking-wider">
                          {p.trajectory}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <Stat label="Now" value={`${cur}%`} />
                      <Stat label="30 Days" value={`${d30}%`} accent={d30 >= cur} />
                      <Stat label="90 Days" value={`${d90}%`} accent={d90 >= cur} />
                    </div>

                    {p.recommendations.length > 0 && (
                      <div>
                        <p className="text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate mb-2">
                          Recommendations
                        </p>
                        <ul className="space-y-1.5">
                          {p.recommendations.map((rec, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-[11px] text-aegis-cloud"
                            >
                              <span className="w-1 h-1 rounded-full bg-aegis-cyan mt-1.5 shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : !loading ? (
            <p className="text-xs text-aegis-slate">
              No predictions available for this trainee yet.
            </p>
          ) : null}
        </GlassPanel>
      </motion.div>

      {/* Weakest domain enrichment */}
      {weakestDomain && (
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
              Weakest Domain Focus -{" "}
              <span className="capitalize">{weakestDomain.replace(/_/g, " ")}</span>
            </h3>
            {domainState.loading && (
              <p className="text-xs text-aegis-mist">Loading domain data...</p>
            )}
            {domainState.error && (
              <p className="text-xs text-aegis-red">{domainState.error}</p>
            )}
            {domainState.data && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[10px] font-heading text-aegis-slate uppercase tracking-wider">
                    Fleet Avg
                  </p>
                  <p className="font-mono text-2xl font-bold text-aegis-cyan mt-1">
                    {pct(domainState.data.average_score)}%
                  </p>
                  <p className="text-[10px] font-mono text-aegis-slate mt-1">
                    across {domainState.data.trainee_count} trainees
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] md:col-span-2">
                  <p className="text-[10px] font-heading text-aegis-slate uppercase tracking-wider mb-2">
                    Weakest Skills
                  </p>
                  <ul className="space-y-1.5">
                    {domainState.data.weakest_skills.map((s) => (
                      <li
                        key={s.skill}
                        className="flex items-center gap-3 text-[11px]"
                      >
                        <span className="text-aegis-cloud flex-1 capitalize">
                          {s.skill.replace(/_/g, " ")}
                        </span>
                        <div className="w-32 h-1.5 rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-aegis-amber to-aegis-orange"
                            style={{ width: `${pct(s.average_score)}%` }}
                          />
                        </div>
                        <span className="text-aegis-cloud font-mono w-9 text-right">
                          {pct(s.average_score)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-aegis-mist mt-3">
                    <span className="font-heading uppercase text-aegis-slate text-[10px] mr-2">
                      Focus:
                    </span>
                    {domainState.data.recommended_focus}
                  </p>
                </div>
              </div>
            )}
          </GlassPanel>
        </motion.div>
      )}
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <GlassPanel className="p-4 text-center" animated={false}>
      <p className="font-mono text-2xl font-bold text-aegis-cyan capitalize truncate">
        {value}
      </p>
      <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
        {label}
      </p>
    </GlassPanel>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="text-center p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
      <p className="text-[9px] font-heading text-aegis-slate uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`font-mono text-lg font-bold mt-0.5 ${
          accent === undefined
            ? "text-aegis-cyan"
            : accent
              ? "text-aegis-green"
              : "text-aegis-amber"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
