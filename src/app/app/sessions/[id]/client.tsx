"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  BrainCircuit,
  Target,
  Play,
  Pause,
  MessageSquare,
  FileText,
  RotateCcw,
  AlertTriangle,
  RefreshCw,
  Zap,
  X,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";
import { useMemo, useState } from "react";
import { sessions as sessionsApi, scenarios as scenariosApi } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { TelemetryEntry, TrainingSession } from "@/lib/api/types";

const typeColors: Record<string, string> = {
  action: "text-aegis-cyan",
  ai: "text-aegis-purple",
  scenario: "text-aegis-amber",
  system: "text-aegis-mist",
  injected: "text-aegis-amber",
  error: "text-aegis-red",
  success: "text-aegis-green",
};

const statusToBadge: Record<
  TrainingSession["status"],
  { variant: "active" | "online" | "warning" | "neutral"; label: string }
> = {
  active: { variant: "active", label: "ACTIVE" },
  paused: { variant: "warning", label: "PAUSED" },
  completed: { variant: "online", label: "COMPLETED" },
  aborted: { variant: "neutral", label: "ABORTED" },
};

function shortId(id: string | null | undefined): string {
  if (!id) return "--";
  return id.length > 10 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return iso;
  }
}

function formatDuration(started: string | null, ended: string | null): string {
  if (!started) return "--";
  const start = new Date(started).getTime();
  const end = ended ? new Date(ended).getTime() : Date.now();
  const diffSec = Math.max(0, Math.floor((end - start) / 1000));
  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  const s = diffSec % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatScore(score: Record<string, unknown> | null): string {
  if (!score) return "--";
  const numericKey = ["overall", "overall_score", "final", "final_score", "score"].find(
    (k) => typeof score[k] === "number"
  );
  if (numericKey) {
    const v = score[numericKey] as number;
    return `${Math.round(v)}/100`;
  }
  return "--";
}

function eventDescription(entry: TelemetryEntry): string {
  const data = entry.data ?? entry.payload;
  if (!data) return entry.event_type;
  if (typeof data === "object") {
    const desc = (data as Record<string, unknown>).description ?? (data as Record<string, unknown>).message;
    if (typeof desc === "string") return desc;
  }
  try {
    return JSON.stringify(data);
  } catch {
    return entry.event_type;
  }
}

function eventTypeBucket(eventType: string): string {
  const t = eventType.toLowerCase();
  if (t.includes("inject")) return "injected";
  if (t.includes("ai") || t.includes("hint") || t.includes("assess")) return "ai";
  if (t.includes("error") || t.includes("fail")) return "error";
  if (t.includes("complete") || t.includes("success")) return "success";
  if (t.includes("start") || t.includes("end") || t.includes("system")) return "system";
  if (t.includes("scenario") || t.includes("contact") || t.includes("event")) return "scenario";
  return "action";
}

function LoadingPanel() {
  return (
    <GlassPanel animated={false}>
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-aegis-mist">
          <RefreshCw className="w-4 h-4 animate-spin text-aegis-cyan" />
          <span className="font-heading text-xs tracking-[0.1em] uppercase">Loading session...</span>
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
        <p className="font-heading text-sm font-semibold text-aegis-cloud tracking-wide">Failed to load session</p>
        <p className="text-xs text-aegis-mist max-w-md text-center">{message}</p>
        <AegisButton size="sm" variant="secondary" icon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
          Retry
        </AegisButton>
      </div>
    </GlassPanel>
  );
}

interface InjectModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
  onSubmit: (eventType: string, payload: Record<string, unknown>) => Promise<void>;
}

function InjectModal({ open, onClose, loading, error, onSubmit }: InjectModalProps) {
  const [eventType, setEventType] = useState("scenario_event");
  const [payloadText, setPayloadText] = useState('{"description": ""}');
  const [parseError, setParseError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit() {
    let parsed: Record<string, unknown> = {};
    try {
      parsed = payloadText.trim() ? JSON.parse(payloadText) : {};
      setParseError(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
      return;
    }
    await onSubmit(eventType, parsed);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-aegis-void/60 backdrop-blur-sm p-6">
      <div className="w-full max-w-lg glass-card rounded-xl p-6 border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-sm font-bold tracking-[0.08em] uppercase text-aegis-white">
            Inject Event
          </h3>
          <button onClick={onClose} className="text-aegis-mist hover:text-aegis-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1">
              Event Type
            </label>
            <input
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
            />
          </div>
          <div>
            <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1">
              Payload (JSON)
            </label>
            <textarea
              value={payloadText}
              onChange={(e) => setPayloadText(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
            />
          </div>
          {(parseError || error) && (
            <p className="text-xs text-aegis-red">{parseError ?? error}</p>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 mt-5">
          <AegisButton variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </AegisButton>
          <AegisButton size="sm" icon={<Zap className="w-4 h-4" />} onClick={handleSubmit} loading={loading}>
            Inject
          </AegisButton>
        </div>
      </div>
    </div>
  );
}

interface Props {
  sessionId: string;
}

export default function SessionDetailClient({ sessionId }: Props) {
  const user = useUserStore((s) => s.user);
  const canControl = user?.role === "instructor" || user?.role === "evaluator" || user?.role === "admin";

  const sessionQ = useApi(() => sessionsApi.get(sessionId), [sessionId]);
  const session = sessionQ.data;

  const scenarioQ = useApi(
    () => scenariosApi.get(session!.scenario_id),
    [session?.scenario_id],
    { skip: !session?.scenario_id }
  );

  const pauseM = useMutation(sessionsApi.pause);
  const resumeM = useMutation(sessionsApi.resume);
  const endM = useMutation(sessionsApi.end);
  const injectM = useMutation(sessionsApi.inject);

  const [injectOpen, setInjectOpen] = useState(false);

  const timeline = useMemo(() => {
    if (!session) return [];
    return [...session.telemetry_log]
      .reverse()
      .slice(0, 50)
      .map((entry, i) => ({
        key: `${entry.timestamp}-${i}`,
        time: formatTime(entry.timestamp),
        text: eventDescription(entry),
        type: eventTypeBucket(entry.event_type),
        rawType: entry.event_type,
      }));
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

  const badge = statusToBadge[session.status] ?? statusToBadge.aborted;

  async function handlePause() {
    await pauseM.run(session!.id);
    sessionQ.refetch();
  }

  async function handleResume() {
    await resumeM.run(session!.id);
    sessionQ.refetch();
  }

  async function handleEnd() {
    await endM.run(session!.id, {});
    sessionQ.refetch();
  }

  async function handleInject(eventType: string, payload: Record<string, unknown>) {
    const res = await injectM.run(session!.id, { event_type: eventType, payload });
    if (res !== null) {
      setInjectOpen(false);
      sessionQ.refetch();
    }
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-green to-aegis-cyan flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
                Session {shortId(session.id)}
              </h1>
              <StatusBadge label={badge.label} variant={badge.variant} pulse={session.status === "active"} />
            </div>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              {scenarioQ.loading
                ? "Loading scenario..."
                : scenarioQ.data
                  ? `${scenarioQ.data.domain} • ${scenarioQ.data.title}`
                  : scenarioQ.error
                    ? "Scenario unavailable"
                    : "—"}
            </p>
          </div>
        </div>
        {canControl && (session.status === "active" || session.status === "paused") && (
          <div className="flex items-center gap-3">
            {session.status === "active" && (
              <AegisButton
                variant="secondary"
                size="sm"
                icon={<Pause className="w-4 h-4" />}
                onClick={handlePause}
                loading={pauseM.loading}
              >
                Pause
              </AegisButton>
            )}
            {session.status === "paused" && (
              <AegisButton
                variant="secondary"
                size="sm"
                icon={<Play className="w-4 h-4" />}
                onClick={handleResume}
                loading={resumeM.loading}
              >
                Resume
              </AegisButton>
            )}
            <AegisButton
              variant="ghost"
              size="sm"
              icon={<Zap className="w-4 h-4" />}
              onClick={() => setInjectOpen(true)}
            >
              Inject Event
            </AegisButton>
            <AegisButton
              variant="danger"
              size="sm"
              icon={<X className="w-4 h-4" />}
              onClick={handleEnd}
              loading={endM.loading}
            >
              End Session
            </AegisButton>
          </div>
        )}
      </motion.div>

      {(pauseM.error || resumeM.error || endM.error) && (
        <motion.div variants={fadeInUp}>
          <GlassPanel animated={false} className="border-aegis-red/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-aegis-red shrink-0 mt-0.5" />
              <p className="text-xs text-aegis-mist">{pauseM.error ?? resumeM.error ?? endM.error}</p>
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {/* Session Info Bar */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="flex flex-wrap items-center gap-8 p-4" animated={false}>
          {[
            { label: "Trainee", value: shortId(session.trainee_id) },
            { label: "Instructor", value: shortId(session.instructor_id) },
            { label: "Duration", value: formatDuration(session.started_at, session.ended_at), icon: Clock },
            {
              label: "Doctrine",
              value: scenarioQ.data?.doctrine_version ?? "--",
              icon: BrainCircuit,
            },
            { label: "Events", value: String(session.telemetry_log.length) },
            { label: "Score", value: formatScore(session.score), icon: Target },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">{item.label}</p>
              <p className="text-sm font-heading font-semibold text-aegis-cloud mt-0.5">{item.value}</p>
            </div>
          ))}
        </GlassPanel>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Viewport */}
        <div className="lg:col-span-2">
          <motion.div variants={fadeInUp}>
            <GlassPanel className="min-h-[400px] relative overflow-hidden" animated={false}>
              <div className="absolute inset-0 tactical-grid-dense flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-aegis-cyan/20 mx-auto mb-3" />
                  <p className="font-heading text-sm text-aegis-mist">Live Training Interface</p>
                  <p className="text-[10px] font-mono text-aegis-gunmetal mt-1">
                    Bridge simulator feed / Digital twin viewport
                  </p>
                </div>
              </div>
              <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2">
                <span
                  className={`text-[10px] font-heading font-bold tracking-[0.08em] flex items-center gap-2 ${
                    session.status === "active" ? "text-aegis-green" : "text-aegis-mist"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      session.status === "active" ? "bg-aegis-green animate-pulse" : "bg-aegis-mist"
                    }`}
                  />
                  {badge.label}
                </span>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 glass rounded-xl px-4 py-2.5">
                {canControl && session.status === "active" && (
                  <button
                    className="w-10 h-10 rounded-full bg-aegis-red/20 border border-aegis-red/40 flex items-center justify-center text-aegis-red cursor-pointer"
                    onClick={handlePause}
                  >
                    <Pause className="w-5 h-5" />
                  </button>
                )}
                {canControl && session.status === "paused" && (
                  <button
                    className="w-10 h-10 rounded-full bg-aegis-green/20 border border-aegis-green/40 flex items-center justify-center text-aegis-green cursor-pointer"
                    onClick={handleResume}
                  >
                    <Play className="w-5 h-5" />
                  </button>
                )}
                <span className="text-xs font-mono text-aegis-cyan">
                  {formatDuration(session.started_at, session.ended_at)}
                </span>
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        {/* Event Timeline */}
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Session Timeline
              </h3>
              <button
                onClick={sessionQ.refetch}
                className="text-aegis-slate hover:text-aegis-cyan transition-colors cursor-pointer"
                aria-label="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            {timeline.length === 0 ? (
              <p className="text-xs text-aegis-slate text-center py-6">No telemetry events yet.</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {timeline.map((evt) => (
                  <div key={evt.key} className="flex items-start gap-3">
                    <span className="text-[10px] font-mono text-aegis-slate shrink-0 mt-0.5 w-16">{evt.time}</span>
                    <div className="w-2 h-2 rounded-full bg-aegis-gunmetal shrink-0 mt-1.5" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-mono uppercase tracking-wider text-aegis-slate">
                        {evt.rawType}
                      </p>
                      <p className={`text-xs leading-relaxed ${typeColors[evt.type] ?? "text-aegis-cloud"}`}>
                        {evt.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
        <Link href={`/app/sessions/${session.id}/debrief`}>
          <AegisButton variant="secondary" size="sm" icon={<FileText className="w-4 h-4" />}>
            Generate Debrief
          </AegisButton>
        </Link>
        <Link href={`/app/sessions/${session.id}/replay`}>
          <AegisButton variant="secondary" size="sm" icon={<RotateCcw className="w-4 h-4" />}>
            Session Replay
          </AegisButton>
        </Link>
        {session.instructor_notes && (
          <AegisButton variant="ghost" size="sm" icon={<MessageSquare className="w-4 h-4" />}>
            Instructor Notes
          </AegisButton>
        )}
      </motion.div>

      <InjectModal
        open={injectOpen}
        onClose={() => setInjectOpen(false)}
        loading={injectM.loading}
        error={injectM.error}
        onSubmit={handleInject}
      />
    </motion.div>
  );
}
