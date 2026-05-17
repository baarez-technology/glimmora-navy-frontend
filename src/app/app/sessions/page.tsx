"use client";

import { motion } from "framer-motion";
import {
  Play,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
  Plus,
  Calendar,
  List,
  RefreshCw,
  Activity,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { MetricCard } from "@/components/ui/metric-card";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";
import { useMemo, useState } from "react";
import { sessions as sessionsApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { TrainingSession } from "@/lib/api/types";

type StatusFilter = "all" | "active" | "paused" | "completed" | "aborted";

const statusStyles: Record<
  TrainingSession["status"],
  { variant: "active" | "online" | "warning" | "neutral"; label: string }
> = {
  active: { variant: "active", label: "ACTIVE" },
  paused: { variant: "warning", label: "PAUSED" },
  completed: { variant: "online", label: "COMPLETED" },
  aborted: { variant: "neutral", label: "ABORTED" },
};

function shortId(id: string): string {
  return id.length > 10 ? `${id.slice(0, 8).toUpperCase()}` : id.toUpperCase();
}

function formatDuration(started: string | null, ended: string | null): string {
  if (!started) return "--";
  const start = new Date(started).getTime();
  const end = ended ? new Date(ended).getTime() : Date.now();
  const diffSec = Math.max(0, Math.floor((end - start) / 1000));
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  if (mins < 60) return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

function formatScore(score: Record<string, unknown> | null): string {
  if (!score) return "--";
  const numericKey = ["overall", "overall_score", "final", "final_score", "score"].find(
    (k) => typeof score[k] === "number"
  );
  if (numericKey) {
    const v = score[numericKey] as number;
    return Number.isFinite(v) ? `${Math.round(v)}` : "--";
  }
  const firstNumeric = Object.values(score).find((v) => typeof v === "number");
  return typeof firstNumeric === "number" ? `${Math.round(firstNumeric)}` : "--";
}

function LoadingPanel() {
  return (
    <GlassPanel animated={false}>
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-aegis-mist">
          <RefreshCw className="w-4 h-4 animate-spin text-aegis-cyan" />
          <span className="font-heading text-xs tracking-[0.1em] uppercase">Loading sessions...</span>
        </div>
      </div>
    </GlassPanel>
  );
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <GlassPanel animated={false}>
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-12 h-12 rounded-full bg-aegis-red/10 border border-aegis-red/30 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-aegis-red" />
        </div>
        <div className="text-center">
          <p className="font-heading text-sm font-semibold text-aegis-cloud tracking-wide">
            Failed to load sessions
          </p>
          <p className="text-xs text-aegis-mist mt-1 max-w-md">{message}</p>
        </div>
        <AegisButton size="sm" variant="secondary" icon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
          Retry
        </AegisButton>
      </div>
    </GlassPanel>
  );
}

export default function SessionsPage() {
  const user = useUserStore((s) => s.user);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  const isTrainee = user?.role === "trainee";

  const { data, loading, error, refetch } = useApi(
    () =>
      sessionsApi.list({
        trainee_id: isTrainee && user ? user.id : undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        page: 1,
        page_size: 100,
      }),
    [user?.id, user?.role, statusFilter]
  );

  const items = data?.items ?? [];

  const metrics = useMemo(() => {
    const active = items.filter((s) => s.status === "active").length;
    const completed = items.filter((s) => s.status === "completed").length;
    const paused = items.filter((s) => s.status === "paused").length;

    const completedWithDuration = items.filter(
      (s) => s.status === "completed" && s.started_at && s.ended_at
    );
    let avgDuration = "--";
    if (completedWithDuration.length > 0) {
      const total = completedWithDuration.reduce((sum, s) => {
        const start = new Date(s.started_at as string).getTime();
        const end = new Date(s.ended_at as string).getTime();
        return sum + (end - start);
      }, 0);
      const avgMin = Math.round(total / completedWithDuration.length / 60000);
      avgDuration = `${avgMin}m`;
    }
    return { active, completed, paused, avgDuration };
  }, [items]);

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Training Sessions</h1>
          <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
            Manage, Monitor & Review All Training Activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AegisButton
            variant="ghost"
            size="sm"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters((v) => !v)}
          >
            Filters
          </AegisButton>
          <div className="flex items-center glass rounded-lg p-0.5">
            <button className="p-2 rounded-md bg-aegis-cyan/15 text-aegis-cyan cursor-pointer">
              <List className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-md text-aegis-mist hover:text-aegis-cloud cursor-pointer">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
          <Link href="/app/sessions/new">
            <AegisButton size="sm" icon={<Plus className="w-4 h-4" />}>
              New Session
            </AegisButton>
          </Link>
        </div>
      </motion.div>

      {showFilters && (
        <motion.div variants={fadeInUp}>
          <GlassPanel animated={false} className="flex items-center gap-3 p-4">
            <span className="text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate">
              Status:
            </span>
            {(["all", "active", "paused", "completed", "aborted"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-heading font-bold tracking-[0.1em] uppercase transition-colors cursor-pointer ${
                  statusFilter === s
                    ? "bg-aegis-cyan/15 text-aegis-cyan border border-aegis-cyan/30"
                    : "bg-white/[0.04] text-aegis-mist border border-white/[0.04] hover:border-white/[0.08]"
                }`}
              >
                {s}
              </button>
            ))}
          </GlassPanel>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Active Now" value={String(metrics.active)} icon={Play} accentColor="text-aegis-green" />
        <MetricCard title="Completed" value={String(metrics.completed)} icon={CheckCircle} accentColor="text-aegis-cyan" />
        <MetricCard title="Avg Duration" value={metrics.avgDuration} icon={Clock} />
        <MetricCard title="Paused" value={String(metrics.paused)} icon={AlertTriangle} accentColor="text-aegis-amber" />
      </div>

      <motion.div variants={fadeInUp}>
        {loading ? (
          <LoadingPanel />
        ) : error ? (
          <ErrorPanel message={error} onRetry={refetch} />
        ) : items.length === 0 ? (
          <GlassPanel animated={false}>
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Activity className="w-5 h-5 text-aegis-slate" />
              </div>
              <p className="font-heading text-sm text-aegis-mist tracking-wide">No sessions found.</p>
              <Link href="/app/sessions/new">
                <AegisButton size="sm" icon={<Plus className="w-4 h-4" />}>
                  Launch Session
                </AegisButton>
              </Link>
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel animated={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Session", "Trainee ID", "Scenario", "Instructor", "Duration", "Score", "Status", ""].map((h) => (
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
                  {items.map((s) => {
                    const style = statusStyles[s.status] ?? statusStyles.aborted;
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4 text-xs font-mono font-bold text-aegis-cyan">{shortId(s.id)}</td>
                        <td className="py-3 px-4 text-sm text-aegis-cloud font-mono">{shortId(s.trainee_id)}</td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-aegis-cloud font-mono">{shortId(s.scenario_id)}</p>
                          <p className="text-[10px] text-aegis-slate">
                            {new Date(s.created_at).toLocaleString()}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-xs text-aegis-mist font-mono">
                          {s.instructor_id ? shortId(s.instructor_id) : "--"}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                          {formatDuration(s.started_at, s.ended_at)}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono font-bold text-aegis-cyan">
                          {formatScore(s.score)}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge label={style.label} variant={style.variant} pulse={s.status === "active"} />
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/app/sessions/${s.id}`}
                            className="text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors"
                          >
                            View &rarr;
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        )}
      </motion.div>
    </motion.div>
  );
}
