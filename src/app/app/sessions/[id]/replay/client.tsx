"use client";

import { motion } from "framer-motion";
import {
  RotateCcw,
  Play,
  SkipBack,
  SkipForward,
  Maximize2,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { useMemo } from "react";
import { sessions as sessionsApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import type { TelemetryEntry } from "@/lib/api/types";

const markerColors: Record<string, string> = {
  system: "bg-aegis-mist",
  action: "bg-aegis-cyan",
  scenario: "bg-aegis-amber",
  ai: "bg-aegis-purple",
  error: "bg-aegis-red",
  success: "bg-aegis-green",
  injected: "bg-aegis-amber",
};

function shortId(id: string | null | undefined): string {
  if (!id) return "--";
  return id.length > 10 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
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

function eventDescription(entry: TelemetryEntry): string {
  const data = entry.data ?? entry.payload;
  if (data && typeof data === "object") {
    const desc = (data as Record<string, unknown>).description ?? (data as Record<string, unknown>).message;
    if (typeof desc === "string") return desc;
  }
  return entry.event_type.replace(/_/g, " ");
}

function relativeTime(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatDurationSec(totalSec: number | null): string {
  if (totalSec === null || !Number.isFinite(totalSec)) return "--:--";
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function LoadingPanel() {
  return (
    <GlassPanel animated={false}>
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-aegis-mist">
          <RefreshCw className="w-4 h-4 animate-spin text-aegis-cyan" />
          <span className="font-heading text-xs tracking-[0.1em] uppercase">Loading replay...</span>
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
        <p className="font-heading text-sm font-semibold text-aegis-cloud">Failed to load replay</p>
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

export default function ReplayClient({ sessionId }: Props) {
  const replayQ = useApi(() => sessionsApi.replay(sessionId), [sessionId]);
  const replay = replayQ.data;

  const startEpoch = useMemo(() => {
    if (!replay?.started_at) return null;
    return new Date(replay.started_at).getTime();
  }, [replay]);

  const timelineMarkers = useMemo(() => {
    if (!replay || !startEpoch) return [];
    const log = (replay.telemetry_log as TelemetryEntry[]) ?? [];
    return log.map((e, i) => {
      const epoch = new Date(e.timestamp).getTime();
      const offset = Math.max(0, epoch - startEpoch);
      return {
        key: `${e.timestamp}-${i}`,
        time: relativeTime(offset),
        label: eventDescription(e),
        type: eventTypeBucket(e.event_type),
        offsetMs: offset,
      };
    });
  }, [replay, startEpoch]);

  const totalDurationMs = useMemo(() => {
    if (!replay) return null;
    if (replay.duration_seconds && Number.isFinite(replay.duration_seconds)) {
      return replay.duration_seconds * 1000;
    }
    if (replay.started_at && replay.ended_at) {
      return new Date(replay.ended_at).getTime() - new Date(replay.started_at).getTime();
    }
    return null;
  }, [replay]);

  if (replayQ.loading) {
    return (
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        <LoadingPanel />
      </motion.div>
    );
  }

  if (replayQ.error) {
    return (
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        <ErrorPanel message={replayQ.error} onRetry={replayQ.refetch} />
      </motion.div>
    );
  }

  if (!replay) return null;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Session Replay</h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Session {shortId(replay.session_id)} &bull; {timelineMarkers.length} events &bull;{" "}
              {formatDurationSec(replay.duration_seconds)} duration
            </p>
          </div>
        </div>
        <StatusBadge label={replay.replay_ref ? "Replay Available" : "Telemetry Only"} variant="active" />
      </motion.div>

      {/* Replay Viewport */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="min-h-[450px] relative overflow-hidden" animated={false}>
          <div className="absolute inset-0 tactical-grid-dense flex items-center justify-center">
            <div className="text-center">
              <RotateCcw className="w-12 h-12 text-aegis-cyan/20 mx-auto mb-3" />
              <p className="font-heading text-sm text-aegis-mist">Session Replay Viewport</p>
              <p className="text-[10px] font-mono text-aegis-gunmetal mt-1">
                {replay.replay_ref ? `Replay artifact: ${replay.replay_ref}` : "Timeline reconstruction from telemetry"}
              </p>
            </div>
          </div>

          <button className="absolute top-4 right-4 p-2 glass rounded-lg text-aegis-mist hover:text-aegis-cyan transition-colors cursor-pointer">
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Playback Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            {/* Timeline bar */}
            <div className="mb-3 relative h-1.5">
              <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                <div className="h-full w-0 rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-blue" />
              </div>
              {/* Markers */}
              {timelineMarkers.map((m) => {
                const pos = totalDurationMs ? (m.offsetMs / totalDurationMs) * 100 : 0;
                return (
                  <div key={m.key} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${Math.min(100, pos)}%` }}>
                    <div className={`w-2 h-2 rounded-full ${markerColors[m.type] ?? "bg-aegis-mist"} shadow-sm`} />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between glass rounded-xl px-4 py-2.5">
              <span className="text-xs font-mono text-aegis-cyan">00:00</span>
              <div className="flex items-center gap-3">
                <button className="text-aegis-mist hover:text-aegis-cyan cursor-pointer">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-aegis-cyan/20 border border-aegis-cyan/40 flex items-center justify-center text-aegis-cyan cursor-pointer">
                  <Play className="w-5 h-5" />
                </button>
                <button className="text-aegis-mist hover:text-aegis-cyan cursor-pointer">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-aegis-mist">
                  {formatDurationSec(replay.duration_seconds)}
                </span>
                <span className="text-[10px] font-heading text-aegis-slate">Speed: 1x</span>
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Event Markers Legend */}
      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
            Timeline Events
          </h3>
          {timelineMarkers.length === 0 ? (
            <p className="text-xs text-aegis-slate text-center py-6">No telemetry events recorded.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
              {timelineMarkers.map((m) => (
                <div
                  key={m.key}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer"
                >
                  <div className={`w-3 h-3 rounded-full ${markerColors[m.type] ?? "bg-aegis-mist"} shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-aegis-slate">{m.time}</span>
                    <p className="text-xs text-aegis-cloud truncate">{m.label}</p>
                  </div>
                  <ChevronRight className="w-3 h-3 text-aegis-gunmetal shrink-0" />
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
