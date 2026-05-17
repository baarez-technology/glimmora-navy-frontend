"use client";

import { motion } from "framer-motion";
import {
  Users,
  Play,
  Target,
  BrainCircuit,
  Sparkles,
  Clock,
  AlertTriangle,
  Activity,
  ChevronRight,
  Plus,
  Loader2,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { RadarDisplay } from "@/components/ui/radar-display";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";
import { analytics, sessions, users } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { TrainingSession } from "@/lib/api/types";

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function durationSince(iso: string | null | undefined): string {
  if (!iso) return "--";
  const start = new Date(iso).getTime();
  if (Number.isNaN(start)) return "--";
  const diff = Date.now() - start;
  if (diff < 0) return "0m";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

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

export default function InstructorDashboard() {
  const user = useUserStore((s) => s.user);

  const mySessionsState = useApi(
    () =>
      user
        ? sessions.list({ instructor_id: user.id, page_size: 50 })
        : Promise.resolve(null),
    [user?.id],
    { skip: !user }
  );

  const traineesState = useApi(
    () => users.trainees({ page_size: 10 }),
    []
  );

  const fleetState = useApi(() => analytics.fleet(), []);

  const allSessions: TrainingSession[] = mySessionsState.data?.items ?? [];
  const activeSessions = allSessions.filter((s) => s.status === "active");
  const trainees = traineesState.data?.items ?? [];
  const fleet = fleetState.data;

  const headerSubtitle = user
    ? `${user.rank} ${user.name}${user.unit ? ` • ${user.unit}` : ""}`
    : "Instructor";

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
            Instructor Command Center
          </h1>
          <p className="font-heading text-sm text-aegis-mist tracking-wider mt-1">
            {headerSubtitle}
            {traineesState.data
              ? ` • ${traineesState.data.total} Trainees in Fleet`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/app/scenario-engine">
            <AegisButton
              variant="secondary"
              size="sm"
              icon={<Sparkles className="w-4 h-4" />}
            >
              New Scenario
            </AegisButton>
          </Link>
          <Link href="/app/sessions/new">
            <AegisButton size="sm" icon={<Plus className="w-4 h-4" />}>
              Launch Session
            </AegisButton>
          </Link>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="My Trainees"
          value={
            traineesState.loading
              ? "--"
              : traineesState.data
              ? String(traineesState.data.total)
              : "0"
          }
          subtitle={
            fleet ? `${fleet.active_sessions} active fleet-wide` : undefined
          }
          icon={Users}
        />
        <MetricCard
          title="Active Sessions"
          value={mySessionsState.loading ? "--" : String(activeSessions.length)}
          subtitle="Sessions I supervise"
          icon={Play}
          accentColor="text-aegis-green"
        />
        <MetricCard
          title="Avg Fleet Score"
          value={
            fleetState.loading
              ? "--"
              : fleet
              ? `${Math.round(fleet.average_fleet_score)}%`
              : "N/A"
          }
          icon={Target}
          accentColor="text-aegis-cyan"
        />
        <MetricCard
          title="Total Sessions"
          value={
            fleetState.loading
              ? "--"
              : fleet
              ? String(fleet.total_sessions)
              : "0"
          }
          subtitle={
            fleet ? `${fleet.certifications_this_month} certs this month` : undefined
          }
          icon={Clock}
          accentColor="text-aegis-amber"
        />
      </div>

      {/* Active Sessions + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Active Sessions */}
        <GlassPanel className="lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Live Sessions I&apos;m Supervising
            </h3>
            <StatusBadge
              label={`${activeSessions.length} ACTIVE`}
              variant={activeSessions.length ? "active" : "neutral"}
              pulse={activeSessions.length > 0}
            />
          </div>
          {mySessionsState.loading ? (
            <LoadingPanel label="Loading sessions" />
          ) : mySessionsState.error ? (
            <ErrorPanel
              message={mySessionsState.error}
              onRetry={mySessionsState.refetch}
            />
          ) : activeSessions.length === 0 ? (
            <EmptyHint text="No active sessions under your supervision." />
          ) : (
            <div className="space-y-4">
              {activeSessions.map((s) => (
                <Link key={s.id} href={`/app/sessions/${s.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-aegis-cyan/15 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-aegis-green/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-aegis-green" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-aegis-cyan">
                            {shortId(s.id)}
                          </span>
                          <StatusBadge label="LIVE" variant="active" pulse />
                        </div>
                        <p className="text-sm text-aegis-cloud mt-0.5">
                          Trainee {shortId(s.trainee_id)} &bull; Scenario{" "}
                          {shortId(s.scenario_id)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-aegis-purple font-heading">
                        {s.status.toUpperCase()}
                      </p>
                      <p className="text-[10px] font-mono text-aegis-slate mt-0.5">
                        {durationSince(s.started_at)}
                      </p>
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

        {/* Radar */}
        <GlassPanel className="lg:col-span-2 flex flex-col items-center justify-center">
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4 self-start">
            Training Activity
          </h3>
          <RadarDisplay size={200} />
        </GlassPanel>
      </div>

      {/* Trainees + Fleet Domain Performance + Recent Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trainees */}
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Trainees
            </h3>
            <Link
              href="/app/trainees"
              className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1"
            >
              All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {traineesState.loading ? (
            <LoadingPanel label="Loading trainees" />
          ) : traineesState.error ? (
            <ErrorPanel
              message={traineesState.error}
              onRetry={traineesState.refetch}
            />
          ) : trainees.length === 0 ? (
            <EmptyHint text="No trainees registered." />
          ) : (
            <div className="space-y-2.5">
              {trainees.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-aegis-cloud truncate">
                      {t.rank} {t.name}
                    </p>
                    <p className="text-[10px] text-aegis-slate truncate">
                      {t.unit || t.service_number}
                    </p>
                  </div>
                  <StatusBadge
                    label={t.is_active ? "ACTIVE" : "INACTIVE"}
                    variant={t.is_active ? "online" : "neutral"}
                  />
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        {/* Fleet Domain Performance */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-5">
            <BrainCircuit className="w-4 h-4 text-aegis-purple" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Fleet Domain Performance
            </h3>
          </div>
          {fleetState.loading ? (
            <LoadingPanel label="Loading fleet analytics" />
          ) : fleetState.error ? (
            <ErrorPanel
              message={fleetState.error}
              onRetry={fleetState.refetch}
            />
          ) : !fleet || Object.keys(fleet.domain_performance).length === 0 ? (
            <EmptyHint text="No domain performance data yet." />
          ) : (
            <div className="space-y-3">
              {Object.entries(fleet.domain_performance).map(
                ([domain, score]) => {
                  const s = Math.round(score);
                  const color =
                    s >= 85
                      ? "text-aegis-green"
                      : s >= 75
                      ? "text-aegis-cyan"
                      : "text-aegis-amber";
                  return (
                    <div key={domain}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-heading font-semibold text-aegis-cloud truncate">
                          {domain}
                        </span>
                        <span
                          className={`text-sm font-mono font-bold ${color}`}
                        >
                          {s}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${s}%` }}
                          transition={{
                            duration: 1,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-blue"
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </GlassPanel>

        {/* Recent Sessions */}
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Recent Sessions
          </h3>
          {mySessionsState.loading ? (
            <LoadingPanel label="Loading" />
          ) : mySessionsState.error ? (
            <ErrorPanel
              message={mySessionsState.error}
              onRetry={mySessionsState.refetch}
            />
          ) : allSessions.length === 0 ? (
            <EmptyHint text="No sessions under your supervision yet." />
          ) : (
            <div className="space-y-3">
              {allSessions.slice(0, 6).map((s) => (
                <Link key={s.id} href={`/app/sessions/${s.id}`}>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-aegis-cyan/15 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
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
                      />
                      <span className="text-[10px] font-mono text-aegis-slate">
                        {shortId(s.id)}
                      </span>
                    </div>
                    <p className="text-xs text-aegis-cloud">
                      Trainee {shortId(s.trainee_id)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link href="/app/sessions" className="block mt-4">
            <AegisButton variant="ghost" size="sm" className="w-full">
              Review All
            </AegisButton>
          </Link>
        </GlassPanel>
      </div>
    </motion.div>
  );
}
