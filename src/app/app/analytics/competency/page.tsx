"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";
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

export default function CompetencyPage() {
  const user = useUserStore((s) => s.user);
  const searchParams = useSearchParams();
  const queryUserId = searchParams.get("user_id");
  const canPickUser = !!user && INSTRUCTOR_ROLES.has(user.role);
  const targetId = canPickUser && queryUserId ? queryUserId : user?.id;

  const { data, loading, error } = useApi(
    () => (targetId ? analytics.trainee(targetId) : Promise.resolve(null)),
    [targetId],
    { skip: !targetId }
  );

  const totalDomains = data?.domains.length ?? 0;
  const overallPct = data ? pct(data.overall_score) : null;
  const weakest =
    data && data.domains.length > 0
      ? data.domains.reduce((min, d) =>
          d.average_score < min.average_score ? d : min
        )
      : null;
  const strongest =
    data && data.domains.length > 0
      ? data.domains.reduce((max, d) =>
          d.average_score > max.average_score ? d : max
        )
      : null;

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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-cyan flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Competency Tracking
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              {data
                ? `${data.rank} ${data.name} - Per-Domain Skill Breakdown`
                : "Multi-Domain Spider Charts, Gap Analysis & Remediation"}
            </p>
          </div>
        </div>
        <StatusBadge label="Module Active" variant="active" pulse />
      </motion.div>

      {/* Banners */}
      {!user && (
        <GlassPanel animated={false} className="p-4">
          <p className="text-sm text-aegis-mist">Sign in to view competency data.</p>
        </GlassPanel>
      )}
      {error && (
        <GlassPanel animated={false} className="p-4 border border-aegis-red/30">
          <p className="text-sm text-aegis-red">Failed to load: {error}</p>
        </GlassPanel>
      )}
      {loading && (
        <GlassPanel animated={false} className="p-4">
          <p className="text-sm text-aegis-mist">Loading competency data...</p>
        </GlassPanel>
      )}

      {/* Metrics */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric label="Domains Tracked" value={String(totalDomains || "--")} />
          <Metric
            label="Overall Score"
            value={overallPct === null ? "--" : `${overallPct}%`}
          />
          <Metric
            label="Strongest Domain"
            value={strongest ? `${pct(strongest.average_score)}%` : "--"}
            sub={strongest?.domain.replace(/_/g, " ")}
          />
          <Metric
            label="Weakest Domain"
            value={weakest ? `${pct(weakest.average_score)}%` : "--"}
            sub={weakest?.domain.replace(/_/g, " ")}
          />
        </div>
      </motion.div>

      {/* Per-domain breakdown cards */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Per-Domain Competency Breakdown
          </h3>
          {data && data.domains.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.domains.map((d) => {
                const score = pct(d.average_score);
                const skills = Object.entries(d.skill_breakdown);
                return (
                  <div
                    key={d.domain}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-aegis-cloud capitalize">
                          {d.domain.replace(/_/g, " ")}
                        </p>
                        <p className="text-[10px] font-mono text-aegis-slate mt-0.5">
                          {d.session_count} sessions
                        </p>
                      </div>
                      <span className="text-xl font-mono font-bold text-aegis-cyan">
                        {score}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.06] mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full rounded-full ${
                          score >= 85
                            ? "bg-gradient-to-r from-aegis-green to-aegis-cyan"
                            : score >= 75
                              ? "bg-gradient-to-r from-aegis-cyan to-aegis-blue"
                              : "bg-gradient-to-r from-aegis-amber to-aegis-orange"
                        }`}
                      />
                    </div>
                    {skills.length > 0 && (
                      <div className="space-y-1.5">
                        {skills.map(([skill, raw]) => {
                          const sPct = pct(Number(raw));
                          return (
                            <div key={skill} className="flex items-center gap-2">
                              <span className="text-[11px] text-aegis-mist flex-1 truncate capitalize">
                                {skill.replace(/_/g, " ")}
                              </span>
                              <div className="w-24 h-1.5 rounded-full bg-white/[0.06]">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-blue"
                                  style={{ width: `${sPct}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-aegis-cloud w-9 text-right">
                                {sPct}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
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
                      <span className="text-[10px] font-mono text-aegis-slate">
                        {d.last_assessed
                          ? new Date(d.last_assessed).toLocaleDateString()
                          : "--"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !loading ? (
            <p className="text-xs text-aegis-slate">
              {targetId ? "No competency data for this trainee yet." : "No user selected."}
            </p>
          ) : null}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}

function Metric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <GlassPanel className="p-4 text-center" animated={false}>
      <p className="font-mono text-2xl font-bold text-aegis-cyan">{value}</p>
      <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
        {label}
      </p>
      {sub && (
        <p className="text-[10px] font-mono text-aegis-mist mt-1 capitalize truncate">
          {sub}
        </p>
      )}
    </GlassPanel>
  );
}
