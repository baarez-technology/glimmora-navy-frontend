"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  BrainCircuit,
  Pen,
  RefreshCw,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { useMemo } from "react";
import { sessions as sessionsApi, scenarios as scenariosApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import type { TelemetryEntry } from "@/lib/api/types";

function shortId(id: string | null | undefined): string {
  if (!id) return "--";
  return id.length > 10 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function formatDuration(started: string | null, ended: string | null): string {
  if (!started) return "--";
  const start = new Date(started).getTime();
  const end = ended ? new Date(ended).getTime() : Date.now();
  const min = Math.max(0, Math.round((end - start) / 60000));
  return `${min} min`;
}

function eventDescription(entry: TelemetryEntry): string {
  const data = entry.data ?? entry.payload;
  if (data && typeof data === "object") {
    const desc =
      (data as Record<string, unknown>).description ?? (data as Record<string, unknown>).message;
    if (typeof desc === "string") return desc;
  }
  return entry.event_type;
}

function LoadingPanel() {
  return (
    <GlassPanel animated={false}>
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-aegis-mist">
          <RefreshCw className="w-4 h-4 animate-spin text-aegis-cyan" />
          <span className="font-heading text-xs tracking-[0.1em] uppercase">Loading debrief...</span>
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
        <p className="font-heading text-sm font-semibold text-aegis-cloud">Failed to load debrief</p>
        <p className="text-xs text-aegis-mist max-w-md text-center">{message}</p>
        <AegisButton size="sm" variant="secondary" icon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
          Retry
        </AegisButton>
      </div>
    </GlassPanel>
  );
}

interface Props {
  sessionId: string;
}

export default function DebriefClient({ sessionId }: Props) {
  const sessionQ = useApi(() => sessionsApi.get(sessionId), [sessionId]);
  const session = sessionQ.data;

  const scenarioQ = useApi(
    () => scenariosApi.get(session!.scenario_id),
    [session?.scenario_id],
    { skip: !session?.scenario_id }
  );

  const decisions = useMemo(() => {
    if (!session) return [];
    return session.telemetry_log
      .filter((e) => {
        const t = e.event_type.toLowerCase();
        return t.includes("decision") || t.includes("action") || t.includes("assess") || t.includes("error");
      })
      .slice(0, 8)
      .map((e, i) => {
        const t = e.event_type.toLowerCase();
        const correct = !t.includes("error") && !t.includes("fail");
        const data = e.data ?? e.payload ?? {};
        const assessment =
          (data as Record<string, unknown>).feedback ??
          (data as Record<string, unknown>).assessment ??
          (data as Record<string, unknown>).rationale;
        return {
          key: `${e.timestamp}-${i}`,
          time: formatTime(e.timestamp),
          decision: eventDescription(e),
          assessment: typeof assessment === "string" ? assessment : `Event type: ${e.event_type}`,
          correct,
        };
      });
  }, [session]);

  const competencies = useMemo(() => {
    if (!session?.score) return [];
    const entries = Object.entries(session.score).filter(([, v]) => typeof v === "number");
    return entries.map(([skill, v]) => {
      const after = Math.round(v as number);
      return { skill, before: Math.max(0, after - 5), after };
    });
  }, [session]);

  if (sessionQ.loading) {
    return (
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        <LoadingPanel />
      </motion.div>
    );
  }

  if (sessionQ.error) {
    return (
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        <ErrorPanel message={sessionQ.error} onRetry={sessionQ.refetch} />
      </motion.div>
    );
  }

  if (!session) return null;

  const overallScore = (() => {
    if (!session.score) return "--";
    const numericKey = ["overall", "overall_score", "final", "final_score", "score"].find(
      (k) => typeof session.score![k] === "number"
    );
    if (numericKey) return `${Math.round(session.score![numericKey] as number)}/100`;
    return "--";
  })();

  const errorsDetected = session.telemetry_log.filter((e) =>
    e.event_type.toLowerCase().includes("error")
  ).length;
  const aiInterventions = session.telemetry_log.filter((e) => {
    const t = e.event_type.toLowerCase();
    return t.includes("ai") || t.includes("hint");
  }).length;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-cyan flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">After-Action Review</h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Session {shortId(session.id)} &bull; AI-Generated Debrief
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AegisButton variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
            Export PDF
          </AegisButton>
          <AegisButton size="sm" icon={<Pen className="w-4 h-4" />}>
            Sign Off
          </AegisButton>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-4 h-4 text-aegis-purple" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Performance Summary
            </h3>
            <StatusBadge label="AI Generated" variant="active" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {[
              { label: "Overall Score", value: overallScore, color: "text-aegis-cyan" },
              { label: "Duration", value: formatDuration(session.started_at, session.ended_at), color: "text-aegis-cloud" },
              { label: "Errors Detected", value: String(errorsDetected), color: "text-aegis-amber" },
              { label: "AI Interventions", value: String(aiInterventions), color: "text-aegis-purple" },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">{m.label}</p>
                <p className={`font-mono text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            {session.instructor_notes ? (
              <p className="text-sm text-aegis-cloud leading-relaxed whitespace-pre-wrap">
                {session.instructor_notes}
              </p>
            ) : (
              <p className="text-sm text-aegis-mist leading-relaxed">
                No instructor notes recorded for this session.
              </p>
            )}
            <p className="text-[9px] font-mono text-aegis-slate mt-3">
              Source: {scenarioQ.data ? `Doctrine ${scenarioQ.data.doctrine_version}` : "Approved Doctrine Library"}
            </p>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Key Decisions */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Key Decision Analysis
          </h3>
          {decisions.length === 0 ? (
            <p className="text-xs text-aegis-slate text-center py-6">No decision-level telemetry available.</p>
          ) : (
            <div className="space-y-4">
              {decisions.map((d) => (
                <div
                  key={d.key}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      d.correct ? "bg-aegis-green/15" : "bg-aegis-amber/15"
                    }`}
                  >
                    {d.correct ? (
                      <CheckCircle className="w-4 h-4 text-aegis-green" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-aegis-amber" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-mono text-aegis-slate">{d.time}</span>
                      <StatusBadge
                        label={d.correct ? "CORRECT" : "NEEDS IMPROVEMENT"}
                        variant={d.correct ? "online" : "warning"}
                      />
                    </div>
                    <p className="text-sm font-semibold text-aegis-cloud">{d.decision}</p>
                    <p className="text-xs text-aegis-mist mt-1">{d.assessment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {/* Competency Impact */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Competency Impact
          </h3>
          {competencies.length === 0 ? (
            <p className="text-xs text-aegis-slate text-center py-6">No competency scores available for this session.</p>
          ) : (
            <div className="space-y-4">
              {competencies.map((c) => {
                const diff = c.after - c.before;
                const isPositive = diff >= 0;
                return (
                  <div key={c.skill}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-heading text-aegis-cloud capitalize">{c.skill.replace(/_/g, " ")}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-aegis-slate">{c.before}%</span>
                        <span className="text-xs text-aegis-mist">&rarr;</span>
                        <span
                          className={`text-xs font-mono font-bold ${
                            isPositive ? "text-aegis-green" : "text-aegis-red"
                          }`}
                        >
                          {c.after}%
                        </span>
                        <span className={`text-[10px] font-mono ${isPositive ? "text-aegis-green" : "text-aegis-red"}`}>
                          ({isPositive ? "+" : ""}
                          {diff})
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.after}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full rounded-full ${
                          isPositive
                            ? "bg-gradient-to-r from-aegis-cyan to-aegis-green"
                            : "bg-gradient-to-r from-aegis-amber to-aegis-red"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
