"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { sessions as sessionsApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import type { TrainingSession } from "@/lib/api/types";

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function formatDate(iso?: string | null): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scoreFromSession(s: TrainingSession): number | null {
  const raw = s.score;
  if (!raw) return null;
  const candidate = (raw.overall ?? raw.total ?? raw.score) as unknown;
  if (typeof candidate === "number") return Math.round(candidate);
  return null;
}

function LoadingPanel() {
  return (
    <GlassPanel animated={false}>
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-aegis-mist">
          <RefreshCw className="w-4 h-4 animate-spin text-aegis-cyan" />
          <span className="font-heading text-xs tracking-[0.1em] uppercase">
            Loading assessments...
          </span>
        </div>
      </div>
    </GlassPanel>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <GlassPanel animated={false}>
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-12 h-12 rounded-full bg-aegis-red/10 border border-aegis-red/30 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-aegis-red" />
        </div>
        <div className="text-center">
          <p className="font-heading text-sm font-semibold text-aegis-cloud tracking-wide">
            Failed to load assessments
          </p>
          <p className="text-xs text-aegis-mist mt-1 max-w-md">{message}</p>
        </div>
        <AegisButton
          size="sm"
          variant="secondary"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={onRetry}
        >
          Retry
        </AegisButton>
      </div>
    </GlassPanel>
  );
}

export default function AssessmentsPage() {
  const { data, loading, error, refetch } = useApi(
    () => sessionsApi.list({ status: "completed", page_size: 50 }),
    []
  );

  const items: TrainingSession[] = data?.items ?? [];
  const totalCount = data?.total ?? items.length;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Assessment Management
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Completed Sessions Awaiting Evaluator Review
            </p>
          </div>
        </div>
        <StatusBadge label="Module Active" variant="active" pulse />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Completed Sessions", value: String(totalCount) },
            {
              label: "Showing",
              value: String(items.length),
            },
            {
              label: "Trainees",
              value: String(new Set(items.map((s) => s.trainee_id)).size),
            },
            {
              label: "With Score",
              value: String(items.filter((s) => s.score).length),
            },
          ].map((m) => (
            <GlassPanel key={m.label} className="p-4 text-center" animated={false}>
              <p className="font-mono text-2xl font-bold text-aegis-cyan">{m.value}</p>
              <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
                {m.label}
              </p>
            </GlassPanel>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        {loading ? (
          <LoadingPanel />
        ) : error ? (
          <ErrorPanel message={error} onRetry={refetch} />
        ) : items.length === 0 ? (
          <GlassPanel animated={false}>
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-aegis-slate" />
              </div>
              <p className="font-heading text-sm text-aegis-mist tracking-wide">
                No completed sessions awaiting assessment.
              </p>
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel animated={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Session", "Scenario", "Trainee", "Instructor", "Ended", "Score", ""].map(
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
                  {items.map((s) => {
                    const score = scoreFromSession(s);
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4 text-xs font-mono font-bold text-aegis-cyan">
                          {shortId(s.id)}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-cloud">
                          {shortId(s.scenario_id)}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                          {shortId(s.trainee_id)}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                          {s.instructor_id ? shortId(s.instructor_id) : "--"}
                        </td>
                        <td className="py-3 px-4 text-[10px] font-mono text-aegis-slate">
                          {formatDate(s.ended_at)}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono font-bold text-aegis-cyan">
                          {score !== null ? score : "--"}
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/app/evaluator/assessments/${s.id}`}
                            className="inline-flex items-center gap-1 text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors"
                          >
                            <Activity className="w-3 h-3" /> Review{" "}
                            <ChevronRight className="w-3 h-3" />
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
