"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  Filter,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { analytics } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";

const FLEET_ROLES = new Set(["fleet", "admin", "evaluator", "instructor", "doctrine"]);

function pct(score: number): number {
  // backend competency is 0..1 float — clamp + percentize for UI
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score * 100)));
}

function trendLabel(t: string): string {
  if (t === "improving" || t === "positive") return "+";
  if (t === "declining" || t === "negative") return "-";
  return "~";
}

export default function AnalyticsPage() {
  const user = useUserStore((s) => s.user);
  const useFleet = !!user && FLEET_ROLES.has(user.role);

  const fleetState = useApi(
    () => analytics.fleet(),
    [useFleet],
    { skip: !user || !useFleet }
  );

  const traineeState = useApi(
    () => (user ? analytics.trainee(user.id) : Promise.resolve(null)),
    [user?.id, useFleet],
    { skip: !user || useFleet }
  );

  const loading = useFleet ? fleetState.loading : traineeState.loading;
  const error = useFleet ? fleetState.error : traineeState.error;
  const fleet = fleetState.data;
  const trainee = traineeState.data;

  // KPI values
  const kpis = useFleet
    ? {
        avgScore: fleet ? pct(fleet.average_fleet_score) : null,
        sessions: fleet?.total_sessions ?? null,
        trainees: fleet?.total_trainees ?? null,
        active: fleet?.active_sessions ?? null,
        certs: fleet?.certifications_this_month ?? null,
      }
    : {
        avgScore: trainee ? pct(trainee.overall_score) : null,
        sessions: trainee?.sessions_completed ?? null,
        trainees: null,
        active: null,
        certs: trainee?.certifications_earned ?? null,
      };

  // Domain rows: trainee mode uses domains[] (with trend), fleet mode uses domain_performance map.
  type DomainRow = {
    domain: string;
    score: number;
    trend: string;
    sessions?: number;
  };
  const domainRows: DomainRow[] = useFleet
    ? fleet
      ? Object.entries(fleet.domain_performance).map(([domain, score]) => ({
          domain,
          score: pct(score),
          trend: "stable",
        }))
      : []
    : trainee
    ? trainee.domains.map((d) => ({
        domain: d.domain,
        score: pct(d.average_score),
        trend: d.trend,
        sessions: d.session_count,
      }))
    : [];

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
              Simulator Intelligence & Analytics
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              {useFleet
                ? "Cross-Domain Fleet Performance Evaluation"
                : "Personal Performance Evaluation"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AegisButton variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>
            Filters
          </AegisButton>
          <AegisButton variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
            Export PDF
          </AegisButton>
        </div>
      </motion.div>

      {/* Loading / Error banners */}
      {!user && (
        <GlassPanel animated={false} className="p-4">
          <p className="text-sm text-aegis-mist">Sign in to view analytics.</p>
        </GlassPanel>
      )}
      {error && (
        <GlassPanel animated={false} className="p-4 border border-aegis-red/30">
          <p className="text-sm text-aegis-red">Failed to load analytics: {error}</p>
        </GlassPanel>
      )}
      {loading && (
        <GlassPanel animated={false} className="p-4">
          <p className="text-sm text-aegis-mist">Loading analytics...</p>
        </GlassPanel>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          title={useFleet ? "Avg Fleet Score" : "Overall Score"}
          value={kpis.avgScore === null ? "--" : `${kpis.avgScore}%`}
          icon={CheckCircle}
          accentColor="text-aegis-green"
        />
        <MetricCard
          title={useFleet ? "Total Sessions" : "Sessions Completed"}
          value={kpis.sessions === null ? "--" : String(kpis.sessions)}
          icon={Clock}
          accentColor="text-aegis-cyan"
        />
        <MetricCard
          title={useFleet ? "Active Sessions" : "Domains Tracked"}
          value={
            useFleet
              ? kpis.active === null
                ? "--"
                : String(kpis.active)
              : String(domainRows.length || "--")
          }
          icon={AlertTriangle}
          accentColor="text-aegis-amber"
        />
        <MetricCard
          title={useFleet ? "Trainees" : "Certifications"}
          value={
            useFleet
              ? kpis.trainees === null
                ? "--"
                : String(kpis.trainees)
              : kpis.certs === null
              ? "--"
              : String(kpis.certs)
          }
          icon={Target}
          accentColor="text-aegis-red"
        />
        <MetricCard
          title={useFleet ? "Certs This Month" : "Trainee Rank"}
          value={
            useFleet
              ? kpis.certs === null
                ? "--"
                : String(kpis.certs)
              : trainee?.rank ?? "--"
          }
          icon={Users}
          accentColor="text-aegis-purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Domain */}
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-6">
            Performance by Domain
          </h3>
          <div className="space-y-4">
            {domainRows.length === 0 && !loading && (
              <p className="text-xs text-aegis-slate">No domain data available.</p>
            )}
            {domainRows.map((domain) => {
              const isPositive = domain.trend === "improving" || domain.trend === "positive";
              const isNegative = domain.trend === "declining" || domain.trend === "negative";
              return (
                <div key={domain.domain}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-heading font-semibold text-aegis-cloud tracking-wide capitalize">
                      {domain.domain.replace(/_/g, " ")}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-semibold ${
                          isPositive
                            ? "text-aegis-green"
                            : isNegative
                            ? "text-aegis-red"
                            : "text-aegis-mist"
                        }`}
                      >
                        {trendLabel(domain.trend)} {domain.trend}
                      </span>
                      <span className="text-sm font-mono font-bold text-aegis-cyan">
                        {domain.score}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${domain.score}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`h-full rounded-full ${
                        domain.score >= 85
                          ? "bg-gradient-to-r from-aegis-green to-aegis-cyan"
                          : domain.score >= 75
                            ? "bg-gradient-to-r from-aegis-cyan to-aegis-blue"
                            : "bg-gradient-to-r from-aegis-amber to-aegis-orange"
                      }`}
                    />
                  </div>
                  {domain.sessions !== undefined && (
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] font-mono text-aegis-slate">
                        {domain.sessions} sessions
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {/* Side Panel — summary */}
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-6">
            {useFleet ? "Fleet Summary" : "Profile Summary"}
          </h3>
          <div className="space-y-3">
            {useFleet && fleet && (
              <>
                <SummaryRow label="Total Trainees" value={String(fleet.total_trainees)} />
                <SummaryRow label="Total Sessions" value={String(fleet.total_sessions)} />
                <SummaryRow label="Active Sessions" value={String(fleet.active_sessions)} />
                <SummaryRow
                  label="Avg Fleet Score"
                  value={`${pct(fleet.average_fleet_score)}%`}
                />
                <SummaryRow
                  label="Certs This Month"
                  value={String(fleet.certifications_this_month)}
                />
              </>
            )}
            {!useFleet && trainee && (
              <>
                <SummaryRow label="Name" value={trainee.name} />
                <SummaryRow label="Rank" value={trainee.rank} />
                <SummaryRow
                  label="Overall Score"
                  value={`${pct(trainee.overall_score)}%`}
                />
                <SummaryRow
                  label="Sessions Completed"
                  value={String(trainee.sessions_completed)}
                />
                <SummaryRow
                  label="Certifications Earned"
                  value={String(trainee.certifications_earned)}
                />
              </>
            )}
            {(useFleet ? !fleet : !trainee) && !loading && (
              <p className="text-xs text-aegis-slate">No data.</p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <h4 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-aegis-cyan" />
              {useFleet ? "Fleet Status" : "Status"}
            </h4>
            <StatusBadge label="Live Analytics" variant="active" pulse />
          </div>
        </GlassPanel>
      </div>

      {/* Trainee Domain detail — only on trainee view */}
      {!useFleet && trainee && trainee.domains.length > 0 && (
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Domain Detail
              </h3>
              <span className="text-[10px] font-mono text-aegis-slate">
                {trainee.domains.length} domains
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Domain", "Score", "Sessions", "Trend", "Last Assessed"].map((h) => (
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
                  {trainee.domains.map((d) => (
                    <tr
                      key={d.domain}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-aegis-cloud font-medium capitalize">
                        {d.domain.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 px-4 text-sm font-mono font-bold text-aegis-cyan">
                        {pct(d.average_score)}%
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                        {d.session_count}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          label={d.trend.toUpperCase()}
                          variant={
                            d.trend === "improving"
                              ? "online"
                              : d.trend === "declining"
                              ? "warning"
                              : "neutral"
                          }
                        />
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                        {d.last_assessed
                          ? new Date(d.last_assessed).toLocaleDateString()
                          : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </motion.div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
        {label}
      </span>
      <span className="text-sm font-mono font-bold text-aegis-cyan">{value}</span>
    </div>
  );
}
