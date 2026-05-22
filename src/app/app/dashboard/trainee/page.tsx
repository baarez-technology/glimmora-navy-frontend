"use client";

import { motion } from "framer-motion";
import {
  Play,
  Target,
  Award,
  Clock,
  ChevronRight,
  Compass,
  Crosshair,
  Wrench,
  Flame,
  Anchor,
  Bot,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  Loader2,
  BookOpen,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";
import { analytics, sessions, documentation } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type {
  DocumentationTopic,
  DomainScore,
  PredictiveAnalytics,
  PredictiveTrend,
  TraineeAnalytics,
  TrainingSession,
} from "@/lib/api/types";

// ---------- helpers ----------
const DOMAIN_ICON: Record<string, LucideIcon> = {
  bridge: Compass,
  navigation: Compass,
  "bridge & navigation": Compass,
  cic: Crosshair,
  warfare: Crosshair,
  "cic & warfare": Crosshair,
  engineering: Wrench,
  "damage control": Flame,
  dc: Flame,
  "small boats": Anchor,
  "unmanned systems": Bot,
  unmanned: Bot,
};

function iconForDomain(domain: string): LucideIcon {
  const key = domain.trim().toLowerCase();
  return DOMAIN_ICON[key] ?? Target;
}

function competencyStatus(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 75) return "On Track";
  if (score >= 65) return "Needs Focus";
  return "Remediation";
}

function colorsForScore(score: number) {
  const text =
    score >= 85
      ? "text-aegis-green"
      : score >= 75
      ? "text-aegis-cyan"
      : "text-aegis-amber";
  const bar =
    score >= 85
      ? "from-aegis-green to-aegis-cyan"
      : score >= 75
      ? "from-aegis-cyan to-aegis-blue"
      : "from-aegis-amber to-aegis-orange";
  return { text, bar };
}

function formatTime(iso?: string | null): string {
  if (!iso) return "TBD";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso?: string | null): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
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

// ---------- small UI primitives ----------
function LoadingPanel({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-6 text-aegis-mist">
      <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
      <span className="text-xs font-heading tracking-wider uppercase">
        {label}&hellip;
      </span>
    </div>
  );
}

function ErrorPanel({
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

function EmptyHint({ text }: { text: string }) {
  return <p className="text-xs text-aegis-slate py-3">{text}</p>;
}

// ---------- page ----------
export default function TraineeDashboard() {
  const user = useUserStore((s) => s.user);

  const analyticsState = useApi<TraineeAnalytics | null>(
    () => (user ? analytics.trainee(user.id) : Promise.resolve(null)),
    [user?.id],
    { skip: !user }
  );

  const activeSessionsState = useApi(
    () =>
      user
        ? sessions.list({
            trainee_id: user.id,
            status: "active",
            page_size: 5,
          })
        : Promise.resolve(null),
    [user?.id],
    { skip: !user }
  );

  const recentSessionsState = useApi(
    () =>
      user
        ? sessions.list({ trainee_id: user.id, page_size: 5 })
        : Promise.resolve(null),
    [user?.id],
    { skip: !user }
  );

  const predictiveState = useApi<PredictiveAnalytics | null>(
    () => (user ? analytics.predictive(user.id) : Promise.resolve(null)),
    [user?.id],
    { skip: !user }
  );

  // --- Study Manual Progress (same logic as /app/documentation) ---
  const topicsData = useApi(() => documentation.list(), []);
  const allSessionsData = useApi(
    () => (user ? sessions.list({ trainee_id: user.id, page_size: 1000 }) : Promise.resolve(null)),
    [user?.id],
    { skip: !user }
  );

  const STUDY_DOMAINS: { key: string; label: string; Icon: LucideIcon }[] = [
    { key: "bridge",           label: "Bridge & Navigation",   Icon: Compass },
    { key: "cic",              label: "CIC & Warfare",         Icon: Crosshair },
    { key: "engineering",      label: "Engineering",           Icon: Wrench },
    { key: "damage_control",   label: "Damage Control",        Icon: Flame },
    { key: "small_boats",      label: "Small Boats",           Icon: Anchor },
    { key: "unmanned_systems", label: "Unmanned Systems",      Icon: Bot },
  ];

  function getTopicProgress(topic: DocumentationTopic, userId?: string): "completed" | "in_progress" | "not_started" {
    const items = allSessionsData.data?.items || [];
    const topicSessions = items.filter(
      (s) =>
        s.trainee_id === userId &&
        (s.instructor_notes?.includes(`(Topic ID: ${topic.id})`) ||
          s.instructor_notes?.includes(`study manual for "${topic.title}"`) ||
          s.instructor_notes?.includes(topic.title))
    );
    if (topicSessions.length === 0) return "not_started";
    if (topicSessions.some((s) => s.status === "completed")) return "completed";
    return "in_progress";
  }

  const studyDomains = STUDY_DOMAINS.map(({ key, label, Icon }) => {
    const domainTopics = (topicsData.data || []).filter((t) => t.domain === key);
    const completed  = domainTopics.filter((t) => getTopicProgress(t, user?.id) === "completed").length;
    const inProgress = domainTopics.filter((t) => getTopicProgress(t, user?.id) === "in_progress").length;
    const total      = domainTopics.length;
    const pct        = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { key, label, Icon, completed, inProgress, total, pct };
  });

  const a = analyticsState.data;
  const activeSessionsData = activeSessionsState.data;
  const recentSessionsData = recentSessionsState.data;
  const predictive = predictiveState.data;

  const overallScore = a ? Math.round(a.overall_score) : null;
  const sessionsCompleted = a?.sessions_completed ?? null;
  const certifications = a?.certifications_earned ?? null;
  const nextSession = activeSessionsData?.items?.[0];

  const competencies: DomainScore[] = a?.domains ?? [];
  const upcomingSessions: TrainingSession[] = activeSessionsData?.items ?? [];
  const recentSessions: TrainingSession[] = recentSessionsData?.items ?? [];

  const recommendations: { domain: string; text: string; priority: string }[] =
    [];
  if (predictive?.predictions) {
    for (const p of predictive.predictions as PredictiveTrend[]) {
      const priority =
        p.trajectory === "negative"
          ? "high"
          : p.current_score < 75
          ? "medium"
          : "low";
      for (const rec of p.recommendations ?? []) {
        recommendations.push({ domain: p.domain, text: rec, priority });
      }
    }
  }

  const headerSubtitle = user
    ? `Welcome back, ${user.rank} ${user.name}${
        user.unit ? ` • ${user.unit}` : ""
      }`
    : "Welcome back";

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
            My Training Dashboard
          </h1>
          <p className="font-heading text-sm text-aegis-mist tracking-wider mt-1">
            {headerSubtitle}
          </p>
        </div>
        <Link href="/app/sessions/new">
          <AegisButton size="sm" icon={<Play className="w-4 h-4" />}>
            Start Training
          </AegisButton>
        </Link>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Score"
          value={
            analyticsState.loading
              ? "--"
              : overallScore !== null
              ? `${overallScore}%`
              : "N/A"
          }
          icon={Target}
        />
        <MetricCard
          title="Sessions Completed"
          value={
            analyticsState.loading
              ? "--"
              : sessionsCompleted !== null
              ? String(sessionsCompleted)
              : "0"
          }
          icon={Play}
          accentColor="text-aegis-green"
        />
        <MetricCard
          title="Certifications"
          value={
            analyticsState.loading
              ? "--"
              : certifications !== null
              ? String(certifications)
              : "0"
          }
          icon={Award}
          accentColor="text-aegis-gold"
        />
        <MetricCard
          title="Next Session"
          value={
            activeSessionsState.loading
              ? "--"
              : nextSession
              ? formatTime(nextSession.started_at ?? nextSession.created_at)
              : "None"
          }
          subtitle={
            nextSession ? `Session ${shortId(nextSession.id)}` : "No active session"
          }
          icon={Clock}
          accentColor="text-aegis-purple"
        />
      </div>

      {/* Competency Overview + Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Competencies */}
        <GlassPanel className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              My Competency Scores
            </h3>
            <Link
              href="/app/profile"
              className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1 cursor-pointer"
            >
              Full Profile <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {analyticsState.loading && !analyticsState.data ? (
            <LoadingPanel label="Loading competencies" />
          ) : analyticsState.error ? (
            <ErrorPanel
              message={analyticsState.error}
              onRetry={analyticsState.refetch}
            />
          ) : competencies.length === 0 ? (
            <EmptyHint text="No competency data yet. Complete a training session to populate your scorecard." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competencies.map((c) => {
                const Icon = iconForDomain(c.domain);
                const score = Math.round(c.average_score);
                const { text: color, bar: barColor } = colorsForScore(score);
                return (
                  <div
                    key={c.domain}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-aegis-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-heading font-semibold text-aegis-cloud truncate">
                          {c.domain}
                        </span>
                        <span
                          className={`text-sm font-mono font-bold ${color}`}
                        >
                          {score}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{
                            duration: 1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-heading text-aegis-slate">
                          {competencyStatus(score)}
                        </span>
                        <span className="text-[10px] font-mono text-aegis-slate">
                          {c.session_count} sessions
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassPanel>

        {/* Upcoming Sessions */}
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Upcoming Sessions
          </h3>
          {activeSessionsState.loading && !activeSessionsState.data ? (
            <LoadingPanel label="Loading sessions" />
          ) : activeSessionsState.error ? (
            <ErrorPanel
              message={activeSessionsState.error}
              onRetry={activeSessionsState.refetch}
            />
          ) : upcomingSessions.length === 0 ? (
            <EmptyHint text="No active sessions scheduled." />
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((s) => (
                <Link key={s.id} href={`/app/sessions/${s.id}`}>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-aegis-cyan/15 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-aegis-slate">
                        {shortId(s.id)}
                      </span>
                      <StatusBadge label="ACTIVE" variant="active" pulse />
                    </div>
                    <p className="text-sm font-semibold text-aegis-cloud">
                      Scenario {shortId(s.scenario_id)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-aegis-cyan">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-mono">
                        {formatTime(s.started_at ?? s.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link href="/app/sessions" className="block mt-4">
            <AegisButton variant="ghost" size="sm" className="w-full">
              View All Sessions
            </AegisButton>
          </Link>
        </GlassPanel>
      </div>

      {/* Study Manual Progress */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-aegis-cyan" />
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Study Manual Progress
              </h3>
            </div>
            <Link
              href="/app/documentation"
              className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1 cursor-pointer"
            >
              Open Manuals <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {(topicsData.loading && !topicsData.data) || (allSessionsData.loading && !allSessionsData.data) ? (
            <LoadingPanel label="Loading study progress" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {studyDomains.map(({ key, label, Icon, completed, inProgress, total, pct }) => {
                const barColor =
                  pct === 100
                    ? "from-aegis-green to-aegis-cyan"
                    : pct >= 50
                    ? "from-aegis-cyan to-aegis-blue"
                    : "from-aegis-amber to-aegis-orange";
                const textColor =
                  pct === 100 ? "text-aegis-green" : pct >= 50 ? "text-aegis-cyan" : "text-aegis-amber";

                return (
                  <Link key={key} href="/app/documentation">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-aegis-cyan/20 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-aegis-cyan" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-heading font-semibold text-aegis-cloud truncate">
                            {label}
                          </p>
                          <p className="text-[10px] font-mono text-aegis-slate">
                            {completed}/{total} completed
                          </p>
                        </div>
                        {pct === 100 && (
                          <CheckCircle2 className="w-4 h-4 text-aegis-green shrink-0" />
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                          className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-1.5">
                        <span className={`text-[10px] font-mono font-bold ${textColor}`}>
                          {pct}%
                        </span>
                        {inProgress > 0 && (
                          <span className="text-[10px] font-heading text-aegis-amber">
                            {inProgress} in progress
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {/* AI Recommendations + Recent Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-5">
            <BrainCircuit className="w-4 h-4 text-aegis-purple" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              AI Recommendations
            </h3>
          </div>
          {predictiveState.loading && !predictiveState.data ? (
            <LoadingPanel label="Generating recommendations" />
          ) : predictiveState.error ? (
            <ErrorPanel
              message={predictiveState.error}
              onRetry={predictiveState.refetch}
            />
          ) : recommendations.length === 0 ? (
            <EmptyHint text="No predictive recommendations available yet." />
          ) : (
            <div className="space-y-3">
              {recommendations.slice(0, 6).map((rec, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <StatusBadge label={rec.domain} variant="active" />
                    <StatusBadge
                      label={rec.priority.toUpperCase()}
                      variant={rec.priority === "high" ? "alert" : "warning"}
                    />
                  </div>
                  <p className="text-xs text-aegis-cloud leading-relaxed">
                    {rec.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        {/* Recent Sessions */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Recent Sessions
            </h3>
          </div>
          {recentSessionsState.loading && !recentSessionsState.data ? (
            <LoadingPanel label="Loading recent sessions" />
          ) : recentSessionsState.error ? (
            <ErrorPanel
              message={recentSessionsState.error}
              onRetry={recentSessionsState.refetch}
            />
          ) : recentSessions.length === 0 ? (
            <EmptyHint text="No recent training sessions on record." />
          ) : (
            <div className="space-y-3">
              {recentSessions.map((s) => {
                const score = scoreFromSession(s);
                return (
                  <Link key={s.id} href={`/app/sessions/${s.id}`}>
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <div>
                        <p className="text-xs font-semibold text-aegis-cloud">
                          {shortId(s.id)}
                        </p>
                        <p className="text-[10px] font-mono text-aegis-slate">
                          {formatDate(s.ended_at ?? s.started_at ?? s.created_at)}{" "}
                          &bull; {s.status}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold text-aegis-cyan">
                          {score !== null ? score : "--"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </GlassPanel>
      </div>
    </motion.div>
  );
}
