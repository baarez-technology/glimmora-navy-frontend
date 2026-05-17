"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/ui/metric-card";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { certifications as certsApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function scoreLabel(score: Record<string, unknown> | null): string {
  if (!score) return "--";
  const candidate = (score.overall ?? score.total ?? score.score) as unknown;
  if (typeof candidate === "number") return `${Math.round(candidate)}`;
  return "--";
}

function InlineLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-6 text-aegis-mist">
      <RefreshCw className="w-4 h-4 animate-spin text-aegis-cyan" />
      <span className="text-xs font-heading tracking-wider uppercase">
        {label}&hellip;
      </span>
    </div>
  );
}

function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-4">
      <AlertTriangle className="w-4 h-4 text-aegis-red shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs text-aegis-cloud leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-[10px] font-heading text-aegis-cyan mt-2 tracking-wider uppercase cursor-pointer"
          >
            Retry &rarr;
          </button>
        )}
      </div>
    </div>
  );
}

export default function EvaluatorPage() {
  const pendingState = useApi(() => certsApi.pending(), []);

  const pending = pendingState.data ?? [];
  const pendingCount = pending.length;

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
              Evaluator Dashboard
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Assessment Queue, Grading &amp; Certification Authority
            </p>
          </div>
        </div>
        <Link href="/app/evaluator/assessments">
          <AegisButton
            variant="secondary"
            size="sm"
            icon={<ClipboardCheck className="w-4 h-4" />}
          >
            All Assessments
          </AegisButton>
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Certifications"
          value={pendingState.loading ? "--" : String(pendingCount)}
          icon={Clock}
          accentColor="text-aegis-amber"
        />
        <MetricCard
          title="Awaiting Review"
          value={pendingState.loading ? "--" : String(pendingCount)}
          icon={CheckCircle}
          accentColor="text-aegis-green"
        />
        <MetricCard title="Pass Rate" value="--" icon={ClipboardCheck} />
        <MetricCard
          title="Overdue"
          value="0"
          icon={AlertTriangle}
          accentColor="text-aegis-red"
        />
      </div>

      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Pending Certification Queue
            </h3>
            <Link
              href="/app/evaluator/assessments"
              className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1 cursor-pointer"
            >
              All Assessments <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {pendingState.loading ? (
            <InlineLoading label="Loading queue" />
          ) : pendingState.error ? (
            <InlineError
              message={pendingState.error}
              onRetry={pendingState.refetch}
            />
          ) : pending.length === 0 ? (
            <p className="text-xs text-aegis-slate py-6 text-center">
              No certifications pending review.
            </p>
          ) : (
            <div className="space-y-3">
              {pending.map((p) => (
                <Link
                  key={`${p.trainee_id}-${p.completed_session_id}`}
                  href={`/app/evaluator/assessments/${p.completed_session_id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                      <ClipboardCheck className="w-5 h-5 text-aegis-gold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-aegis-cloud">
                        {p.rank} {p.trainee_name}
                      </p>
                      <p className="text-xs text-aegis-mist mt-0.5">
                        {p.domain} &bull; Session {shortId(p.completed_session_id)}
                      </p>
                      <p className="text-[10px] font-mono text-aegis-slate mt-1">
                        Score: {scoreLabel(p.score)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge label="PENDING" variant="warning" />
                </Link>
              ))}
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
