"use client";

import { motion } from "framer-motion";
import { RotateCcw, Play, Pause, SkipBack, SkipForward, Maximize2, ChevronRight } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { useParams } from "next/navigation";

const timelineMarkers = [
  { time: "00:00", label: "Session Start", type: "system" },
  { time: "05:12", label: "Watch Handover", type: "action" },
  { time: "08:30", label: "Visibility Reduced", type: "scenario" },
  { time: "12:15", label: "Contact Detected", type: "scenario" },
  { time: "12:45", label: "AI Hint Issued", type: "ai" },
  { time: "14:20", label: "Course Alteration", type: "action" },
  { time: "18:00", label: "Speed Error Flagged", type: "error" },
  { time: "35:00", label: "CPA Passed Safely", type: "success" },
  { time: "47:12", label: "Session End", type: "system" },
];

const markerColors: Record<string, string> = {
  system: "bg-aegis-mist",
  action: "bg-aegis-cyan",
  scenario: "bg-aegis-amber",
  ai: "bg-aegis-purple",
  error: "bg-aegis-red",
  success: "bg-aegis-green",
};

export default function ReplayPage() {
  const params = useParams();

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center">
            <RotateCcw className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Session Replay</h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">Session {params.id} &bull; Timeline Scrubbing &bull; Full Playback</p>
          </div>
        </div>
        <StatusBadge label="Replay Mode" variant="active" />
      </motion.div>

      {/* Replay Viewport */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="min-h-[450px] relative overflow-hidden" animated={false}>
          <div className="absolute inset-0 tactical-grid-dense flex items-center justify-center">
            <div className="text-center">
              <RotateCcw className="w-12 h-12 text-aegis-cyan/20 mx-auto mb-3" />
              <p className="font-heading text-sm text-aegis-mist">Session Replay Viewport</p>
              <p className="text-[10px] font-mono text-aegis-gunmetal mt-1">3D reconstruction of training session with event overlays</p>
            </div>
          </div>

          <button className="absolute top-4 right-4 p-2 glass rounded-lg text-aegis-mist hover:text-aegis-cyan transition-colors cursor-pointer">
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Playback Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            {/* Timeline bar */}
            <div className="mb-3 relative">
              <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-blue" />
              </div>
              {/* Markers */}
              {timelineMarkers.map((m, i) => {
                const pos = (i / (timelineMarkers.length - 1)) * 100;
                return (
                  <div key={i} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${pos}%` }}>
                    <div className={`w-2 h-2 rounded-full ${markerColors[m.type]} shadow-sm`} />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between glass rounded-xl px-4 py-2.5">
              <span className="text-xs font-mono text-aegis-cyan">18:00</span>
              <div className="flex items-center gap-3">
                <button className="text-aegis-mist hover:text-aegis-cyan cursor-pointer"><SkipBack className="w-4 h-4" /></button>
                <button className="w-10 h-10 rounded-full bg-aegis-cyan/20 border border-aegis-cyan/40 flex items-center justify-center text-aegis-cyan cursor-pointer">
                  <Play className="w-5 h-5" />
                </button>
                <button className="text-aegis-mist hover:text-aegis-cyan cursor-pointer"><SkipForward className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-aegis-mist">47:12</span>
                <span className="text-[10px] font-heading text-aegis-slate">Speed: 1x</span>
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Event Markers Legend */}
      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">Timeline Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {timelineMarkers.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer">
                <div className={`w-3 h-3 rounded-full ${markerColors[m.type]} shrink-0`} />
                <div>
                  <span className="text-[10px] font-mono text-aegis-slate">{m.time}</span>
                  <p className="text-xs text-aegis-cloud">{m.label}</p>
                </div>
                <ChevronRight className="w-3 h-3 text-aegis-gunmetal ml-auto" />
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
