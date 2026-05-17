"use client";

import { motion } from "framer-motion";
import { Glasses, Filter, Clock, Loader2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { MetricCard } from "@/components/ui/metric-card";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { sessions } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import type { TrainingSession } from "@/lib/api/types";

function shortId(id: string): string {
  return id.length > 10 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function formatDuration(started: string | null, ended: string | null): string {
  if (!started) return "--";
  const start = new Date(started).getTime();
  const end = ended ? new Date(ended).getTime() : Date.now();
  const diff = Math.max(0, Math.floor((end - start) / 1000));
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

function formatScore(score: Record<string, unknown> | null): string {
  if (!score) return "--";
  const key = ["overall", "overall_score", "final", "final_score", "score"].find(
    (k) => typeof score[k] === "number"
  );
  if (key) {
    const v = score[key] as number;
    return Number.isFinite(v) ? `${Math.round(v)}` : "--";
  }
  const first = Object.values(score).find((v) => typeof v === "number");
  return typeof first === "number" ? `${Math.round(first)}` : "--";
}

export default function ARVRSessionsPage() {
  const activeState = useApi(
    () => sessions.list({ status: "active", page_size: 50 }),
    []
  );
  const completedState = useApi(
    () => sessions.list({ status: "completed", page_size: 50 }),
    []
  );

  const activeSessions: TrainingSession[] = activeState.data?.items ?? [];
  const completedSessions: TrainingSession[] = completedState.data?.items ?? [];
  const allRows = [...activeSessions, ...completedSessions];

  const completedToday = completedSessions.filter((s) => {
    if (!s.ended_at) return false;
    const ended = new Date(s.ended_at);
    const today = new Date();
    return (
      ended.getFullYear() === today.getFullYear() &&
      ended.getMonth() === today.getMonth() &&
      ended.getDate() === today.getDate()
    );
  }).length;

  const scoreNumbers = completedSessions
    .map((s) => {
      const f = formatScore(s.score);
      const n = Number(f);
      return Number.isFinite(n) ? n : null;
    })
    .filter((n): n is number => n !== null);
  const avgScore =
    scoreNumbers.length > 0
      ? Math.round(scoreNumbers.reduce((a, b) => a + b, 0) / scoreNumbers.length)
      : null;

  const loading = activeState.loading || completedState.loading;
  const error = activeState.error || completedState.error;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-electric flex items-center justify-center">
            <Glasses className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              AR/VR Sessions
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Active & Past Immersive Training Sessions
            </p>
          </div>
        </div>
        <AegisButton variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>
          Filter
        </AegisButton>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Active VR Sessions"
          value={activeState.loading ? "--" : String(activeSessions.length)}
          icon={Glasses}
          accentColor="text-aegis-purple"
        />
        <MetricCard
          title="Completed Today"
          value={completedState.loading ? "--" : String(completedToday)}
          icon={Clock}
          accentColor="text-aegis-green"
        />
        <MetricCard
          title="Avg Score"
          value={
            completedState.loading
              ? "--"
              : avgScore !== null
              ? `${avgScore}%`
              : "N/A"
          }
          icon={Glasses}
        />
        <MetricCard
          title="Total Sessions"
          value={loading ? "--" : String(allRows.length)}
          icon={Glasses}
          accentColor="text-aegis-cyan"
        />
      </div>

      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-aegis-mist">
                <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
                <span className="font-heading text-xs tracking-[0.1em] uppercase">
                  Loading sessions...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <AlertTriangle className="w-5 h-5 text-aegis-red" />
              <p className="text-xs text-aegis-cloud">{error}</p>
              <AegisButton
                size="sm"
                variant="secondary"
                onClick={() => {
                  activeState.refetch();
                  completedState.refetch();
                }}
              >
                Retry
              </AegisButton>
            </div>
          ) : allRows.length === 0 ? (
            <p className="text-xs text-aegis-slate py-10 text-center">
              No sessions on record.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {[
                      "Session",
                      "Scenario",
                      "Trainee",
                      "Duration",
                      "Score",
                      "Status",
                    ].map((h) => (
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
                  {allRows.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4 text-xs font-mono font-bold text-aegis-cyan">
                        <Link href={`/app/sessions/${s.id}`}>{shortId(s.id)}</Link>
                      </td>
                      <td className="py-3 px-4 text-xs text-aegis-cloud font-mono">
                        {shortId(s.scenario_id)}
                      </td>
                      <td className="py-3 px-4 text-xs text-aegis-mist font-mono">
                        {shortId(s.trainee_id)}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                        {formatDuration(s.started_at, s.ended_at)}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono font-bold text-aegis-cyan">
                        {formatScore(s.score)}
                      </td>
                      <td className="py-3 px-4">
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
