"use client";

import { motion } from "framer-motion";
import {
  User,
  Target,
  Activity,
  ChevronRight,
  FileText,
  RefreshCw,
  AlertTriangle,
  Award,
} from "lucide-react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import {
  users as usersApi,
  analytics as analyticsApi,
  certifications as certsApi,
  sessions as sessionsApi,
} from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import type {
  DomainScore,
  TrainingSession,
} from "@/lib/api/types";

function formatDate(iso?: string | null): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function scoreFromSession(s: TrainingSession): number | null {
  const raw = s.score;
  if (!raw) return null;
  const candidate = (raw.overall ?? raw.total ?? raw.score) as unknown;
  if (typeof candidate === "number") return Math.round(candidate);
  return null;
}

function sessionStatusVariant(
  status: TrainingSession["status"]
): "online" | "warning" | "active" | "neutral" {
  if (status === "completed") return "online";
  if (status === "active") return "active";
  if (status === "paused") return "warning";
  return "neutral";
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

interface Props {
  id: string;
}

export default function TraineeDetailClient({ id }: Props) {
  const userState = useApi(() => usersApi.get(id), [id]);
  const analyticsState = useApi(() => analyticsApi.trainee(id), [id]);
  const certsState = useApi(() => certsApi.forTrainee(id), [id]);
  const sessionsState = useApi(
    () => sessionsApi.list({ trainee_id: id, page_size: 20 }),
    [id]
  );

  const user = userState.data;
  const a = analyticsState.data;
  const certs = certsState.data ?? [];
  const sessionItems: TrainingSession[] = sessionsState.data?.items ?? [];

  const overallScore = a ? Math.round(a.overall_score) : null;
  const sessionsCompleted = a?.sessions_completed ?? null;
  const activeCerts = certs.filter((c) => !c.is_revoked).length;

  const domains: DomainScore[] = a?.domains ?? [];

  const displayName = user ? user.name : "Trainee";
  const displaySub = user
    ? `${user.unit || "Unassigned"} • ${user.rank} • ${
        user.cohort_id ? `Cohort ${shortId(user.cohort_id)}` : "No Cohort"
      }`
    : "Loading profile...";

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              {displayName}
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              {displaySub}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AegisButton
            variant="secondary"
            size="sm"
            icon={<FileText className="w-4 h-4" />}
          >
            Generate Report
          </AegisButton>
          <AegisButton size="sm" icon={<Target className="w-4 h-4" />}>
            Create Remediation Plan
          </AegisButton>
        </div>
      </motion.div>

      {userState.error && (
        <GlassPanel animated={false}>
          <InlineError message={userState.error} onRetry={userState.refetch} />
        </GlassPanel>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Overall Score",
            value: overallScore !== null ? `${overallScore}%` : "--",
            color: "text-aegis-cyan",
          },
          {
            label: "Total Sessions",
            value: sessionsCompleted !== null ? String(sessionsCompleted) : "--",
            color: "text-aegis-cloud",
          },
          {
            label: "Certifications",
            value: a ? String(a.certifications_earned) : String(activeCerts),
            color: "text-aegis-gold",
          },
          {
            label: "Status",
            value: user
              ? user.is_active
                ? "Active"
                : "Inactive"
              : "--",
            color: "text-aegis-amber",
          },
        ].map((s) => (
          <GlassPanel key={s.label} className="p-4 text-center" animated={false}>
            <p className={`font-mono text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              {s.label}
            </p>
          </GlassPanel>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competency Radar */}
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
              Cross-Domain Competency
            </h3>
            {analyticsState.loading ? (
              <InlineLoading label="Loading competencies" />
            ) : analyticsState.error ? (
              <InlineError
                message={analyticsState.error}
                onRetry={analyticsState.refetch}
              />
            ) : domains.length === 0 ? (
              <p className="text-xs text-aegis-slate py-3">
                No competency data yet.
              </p>
            ) : (
              <div className="space-y-4">
                {domains.map((c) => {
                  const score = Math.round(c.average_score);
                  const trendSign =
                    c.trend === "improving"
                      ? "+"
                      : c.trend === "declining"
                      ? "-"
                      : "~";
                  const trendColor =
                    c.trend === "improving"
                      ? "text-aegis-green"
                      : c.trend === "declining"
                      ? "text-aegis-red"
                      : "text-aegis-mist";
                  return (
                    <div key={c.domain}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-heading text-aegis-cloud">
                          {c.domain}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-mono ${trendColor}`}>
                            {trendSign} {c.trend}
                          </span>
                          <span className="text-sm font-mono font-bold text-aegis-cyan">
                            {score}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          className={`h-full rounded-full ${
                            score >= 80
                              ? "bg-gradient-to-r from-aegis-green to-aegis-cyan"
                              : score >= 70
                              ? "bg-gradient-to-r from-aegis-cyan to-aegis-blue"
                              : "bg-gradient-to-r from-aegis-amber to-aegis-orange"
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-aegis-slate">
                        {c.session_count} sessions
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassPanel>
        </motion.div>

        {/* Session History */}
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Session History
              </h3>
              <Link
                href="/app/sessions"
                className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1 cursor-pointer"
              >
                All Sessions <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {sessionsState.loading ? (
              <InlineLoading label="Loading sessions" />
            ) : sessionsState.error ? (
              <InlineError
                message={sessionsState.error}
                onRetry={sessionsState.refetch}
              />
            ) : sessionItems.length === 0 ? (
              <p className="text-xs text-aegis-slate py-3">
                No sessions recorded.
              </p>
            ) : (
              <div className="space-y-3">
                {sessionItems.slice(0, 8).map((s) => {
                  const score = scoreFromSession(s);
                  return (
                    <Link
                      key={s.id}
                      href={`/app/sessions/${s.id}`}
                      className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-aegis-cyan" />
                        <div>
                          <p className="text-sm text-aegis-cloud font-medium">
                            Scenario {shortId(s.scenario_id)}
                          </p>
                          <p className="text-[10px] font-mono text-aegis-slate">
                            {shortId(s.id)} &bull; {formatDate(s.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-bold text-aegis-cyan">
                          {score !== null ? score : "--"}
                        </span>
                        <StatusBadge
                          label={s.status.toUpperCase()}
                          variant={sessionStatusVariant(s.status)}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>

      {/* Certifications */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Certifications
          </h3>
          {certsState.loading ? (
            <InlineLoading label="Loading certifications" />
          ) : certsState.error ? (
            <InlineError message={certsState.error} onRetry={certsState.refetch} />
          ) : certs.length === 0 ? (
            <p className="text-xs text-aegis-slate py-3">No certifications issued.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {certs.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="w-10 h-10 rounded-xl bg-aegis-gold/10 border border-aegis-gold/30 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-aegis-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-heading font-semibold text-aegis-cloud truncate">
                        {c.cert_type}
                      </p>
                      <StatusBadge
                        label={c.is_revoked ? "REVOKED" : "VALID"}
                        variant={c.is_revoked ? "offline" : "online"}
                      />
                    </div>
                    <p className="text-[10px] text-aegis-mist mt-0.5">
                      {c.domain} &bull; {c.certificate_number}
                    </p>
                    <p className="text-[10px] font-mono text-aegis-slate mt-1">
                      Issued {formatDate(c.issued_at)}
                      {c.valid_until ? ` • Valid until ${formatDate(c.valid_until)}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
