"use client";

import { motion } from "framer-motion";
import { Activity, Clock, BrainCircuit, Target, Play, Pause, MessageSquare, ChevronRight, FileText, RotateCcw } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";
import { useParams } from "next/navigation";

const events = [
  { time: "14:47", event: "Trainee altered course to 045°", type: "action" },
  { time: "14:45", event: "AI Hint: Consider Rule 15 - Crossing situation", type: "ai" },
  { time: "14:43", event: "Contact detected bearing 120° - CPA 0.3nm", type: "scenario" },
  { time: "14:40", event: "Watch handover completed", type: "action" },
  { time: "14:38", event: "Visibility reduced to 2nm", type: "scenario" },
  { time: "14:35", event: "Session started - Scenario BRM-STR-047", type: "system" },
];

const typeColors: Record<string, string> = {
  action: "text-aegis-cyan",
  ai: "text-aegis-purple",
  scenario: "text-aegis-amber",
  system: "text-aegis-mist",
};

export default function SessionDetailPage() {
  const params = useParams();

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-green to-aegis-cyan flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Session {params.id}</h1>
              <StatusBadge label="ACTIVE" variant="active" pulse />
            </div>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">Bridge Navigation &bull; Strait Transit - Dense Traffic</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AegisButton variant="danger" size="sm" icon={<Pause className="w-4 h-4" />}>End Session</AegisButton>
        </div>
      </motion.div>

      {/* Session Info Bar */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="flex flex-wrap items-center gap-8 p-4" animated={false}>
          {[
            { label: "Trainee", value: "LT J. Kumar" },
            { label: "Instructor", value: "CDR A. Sharma" },
            { label: "Duration", value: "47 min", icon: Clock },
            { label: "AI Mode", value: "Guided Questioning", icon: BrainCircuit },
            { label: "AI Confidence", value: "82%" },
            { label: "Domain Score", value: "87/100", icon: Target },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">{item.label}</p>
              <p className="text-sm font-heading font-semibold text-aegis-cloud mt-0.5">{item.value}</p>
            </div>
          ))}
        </GlassPanel>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Training Viewport Placeholder */}
        <div className="lg:col-span-2">
          <motion.div variants={fadeInUp}>
            <GlassPanel className="min-h-[400px] relative overflow-hidden" animated={false}>
              <div className="absolute inset-0 tactical-grid-dense flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-12 h-12 text-aegis-cyan/20 mx-auto mb-3" />
                  <p className="font-heading text-sm text-aegis-mist">Live Training Interface</p>
                  <p className="text-[10px] font-mono text-aegis-gunmetal mt-1">Bridge simulator feed / Digital twin viewport</p>
                </div>
              </div>
              <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2">
                <span className="text-[10px] font-heading font-bold text-aegis-green tracking-[0.08em] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-aegis-green animate-pulse" /> LIVE SESSION
                </span>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 glass rounded-xl px-4 py-2.5">
                <button className="w-10 h-10 rounded-full bg-aegis-red/20 border border-aegis-red/40 flex items-center justify-center text-aegis-red cursor-pointer">
                  <Pause className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono text-aegis-cyan">00:47:12</span>
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        {/* Event Timeline */}
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">Session Timeline</h3>
            <div className="space-y-4">
              {events.map((evt, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[10px] font-mono text-aegis-slate shrink-0 mt-0.5 w-10">{evt.time}</span>
                  <div className="w-2 h-2 rounded-full bg-aegis-gunmetal shrink-0 mt-1.5" />
                  <p className={`text-xs leading-relaxed ${typeColors[evt.type]}`}>{evt.event}</p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
        <Link href={`/app/sessions/${params.id}/debrief`}>
          <AegisButton variant="secondary" size="sm" icon={<FileText className="w-4 h-4" />}>Generate Debrief</AegisButton>
        </Link>
        <Link href={`/app/sessions/${params.id}/replay`}>
          <AegisButton variant="secondary" size="sm" icon={<RotateCcw className="w-4 h-4" />}>Session Replay</AegisButton>
        </Link>
        <AegisButton variant="ghost" size="sm" icon={<MessageSquare className="w-4 h-4" />}>Instructor Notes</AegisButton>
      </motion.div>
    </motion.div>
  );
}
