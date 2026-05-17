"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { analytics, sessions as sessionsApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { TrainingSession } from "@/lib/api/types";

function pct(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v * 100)));
}

// Extract a 0..100 score from a TrainingSession.score blob.
function extractScore(s: TrainingSession): number | null {
  if (!s.score || typeof s.score !== "object") return null;
  const raw = s.score as Record<string, unknown>;
  const candidates = ["overall", "overall_score", "score", "final_score", "total"];
  for (const k of candidates) {
    const v = raw[k];
    if (typeof v === "number" && Number.isFinite(v)) {
      return v <= 1 ? pct(v) : Math.round(v);
    }
  }
  // Fallback: average all numeric values
  const nums = Object.values(raw).filter(
    (v): v is number => typeof v === "number" && Number.isFinite(v)
  );
  if (nums.length === 0) return null;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return avg <= 1 ? pct(avg) : Math.round(avg);
}

export default function PerformancePage() {
  const user = useUserStore((s) => s.user);

  const traineeState = useApi(
    () => (user ? analytics.trainee(user.id) : Promise.resolve(null)),
    [user?.id],
    { skip: !user }
  );

  const sessionsState = useApi(
    () =>
      user
        ? sessionsApi.list({
            trainee_id: user.id,
            status: "completed",
            page_size: 50,
          })
        : Promise.resolve(null),
    [user?.id],
    { skip: !user }
  );

  const trainee = traineeState.data;
  const sessionsList = sessionsState.data?.items ?? [];
  const loading = traineeState.loading || sessionsState.loading;
  const error = traineeState.error || sessionsState.error;

  // Build trend chart points from sessions, sorted by ended_at ascending.
  const chartData = sessionsList
    .filter((s) => s.ended_at)
    .map((s) => ({
      session: s.id.slice(0, 6),
      ended_at: s.ended_at as string,
      score: extractScore(s),
    }))
    .filter((p): p is { session: string; ended_at: string; score: number } => p.score !== null)
    .sort((a, b) => new Date(a.ended_at).getTime() - new Date(b.ended_at).getTime())
    .map((p, i) => ({
      label: `#${i + 1}`,
      date: new Date(p.ended_at).toLocaleDateString(),
      score: p.score,
    }));

  const totalSessions = sessionsState.data?.total ?? sessionsList.length;
  const avgScore =
    chartData.length > 0
      ? Math.round(chartData.reduce((a, b) => a + b.score, 0) / chartData.length)
      : null;
  const bestScore =
    chartData.length > 0 ? Math.max(...chartData.map((p) => p.score)) : null;
  const latest = chartData.length > 0 ? chartData[chartData.length - 1].score : null;

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
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Performance Analytics
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Deep-Dive Dashboards, Time-Series Trends & Cohort Benchmarking
            </p>
          </div>
        </div>
        <StatusBadge label="Module Active" variant="active" pulse />
      </motion.div>

      {/* Banners */}
      {!user && (
        <GlassPanel animated={false} className="p-4">
          <p className="text-sm text-aegis-mist">Sign in to view performance.</p>
        </GlassPanel>
      )}
      {error && (
        <GlassPanel animated={false} className="p-4 border border-aegis-red/30">
          <p className="text-sm text-aegis-red">Failed to load: {error}</p>
        </GlassPanel>
      )}
      {loading && (
        <GlassPanel animated={false} className="p-4">
          <p className="text-sm text-aegis-mist">Loading performance data...</p>
        </GlassPanel>
      )}

      {/* Metrics */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric label="Sessions Completed" value={String(totalSessions || "--")} />
          <Metric
            label="Overall Score"
            value={trainee ? `${pct(trainee.overall_score)}%` : "--"}
          />
          <Metric
            label="Average per Session"
            value={avgScore === null ? "--" : `${avgScore}%`}
          />
          <Metric label="Best Score" value={bestScore === null ? "--" : `${bestScore}%`} />
        </div>
      </motion.div>

      {/* Trend chart */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Session-Over-Session Score Trend
            </h3>
            <span className="text-[10px] font-mono text-aegis-slate">
              {chartData.length} completed sessions
              {latest !== null && ` - latest ${latest}%`}
            </span>
          </div>
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 8, right: 16, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="label"
                    stroke="rgba(180,200,220,0.5)"
                    tick={{ fontSize: 10, fontFamily: "monospace" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="rgba(180,200,220,0.5)"
                    tick={{ fontSize: 10, fontFamily: "monospace" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15,23,42,0.92)",
                      border: "1px solid rgba(14,165,233,0.3)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#0ea5e9" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : !loading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-aegis-slate">
                  No completed sessions with scoring data yet.
                </p>
              </div>
            ) : null}
          </div>
        </GlassPanel>
      </motion.div>

      {/* Session detail table */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Completed Sessions
            </h3>
            <span className="text-[10px] font-mono text-aegis-slate">
              {sessionsList.length} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Session", "Scenario", "Started", "Ended", "Score", "Status"].map(
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
                {sessionsList.map((s) => {
                  const score = extractScore(s);
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4 text-xs font-mono text-aegis-cyan">
                        {s.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                        {s.scenario_id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                        {s.started_at
                          ? new Date(s.started_at).toLocaleString()
                          : "--"}
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                        {s.ended_at ? new Date(s.ended_at).toLocaleString() : "--"}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono font-bold text-aegis-cyan">
                        {score === null ? "--" : `${score}%`}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          label={s.status.toUpperCase()}
                          variant={
                            s.status === "completed"
                              ? "online"
                              : s.status === "active"
                                ? "active"
                                : s.status === "aborted"
                                  ? "alert"
                                  : "warning"
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
                {sessionsList.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-aegis-slate">
                      No sessions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <GlassPanel className="p-4 text-center" animated={false}>
      <p className="font-mono text-2xl font-bold text-aegis-cyan">{value}</p>
      <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
        {label}
      </p>
    </GlassPanel>
  );
}
