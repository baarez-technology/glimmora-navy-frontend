"use client";

import { motion } from "framer-motion";
import { Radar, Play, Settings, Sliders, Activity } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const emergentEvents = [
  { time: "14:23", event: "Leader-loss recovery observed -- swarm reassigned command to node #7", type: "emergent" },
  { time: "14:22", event: "Target reassignment cascade -- 4 entities re-tasked to secondary objective", type: "adaptation" },
  { time: "14:20", event: "Congestion detected at waypoint Alpha -- swarm auto-dispersed", type: "congestion" },
  { time: "14:18", event: "Communication degradation simulated -- mesh network reformation", type: "degradation" },
  { time: "14:15", event: "Formation shift: V-shape to line-abreast for area search", type: "formation" },
];

const typeColors: Record<string, string> = {
  emergent: "text-aegis-purple",
  adaptation: "text-aegis-cyan",
  congestion: "text-aegis-amber",
  degradation: "text-aegis-red",
  formation: "text-aegis-green",
};

export default function SwarmAIPage() {
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
            <Radar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Swarm AI & Emergent Behavior
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Coordinated Autonomous Entity Modeling
            </p>
          </div>
        </div>
        <AegisButton size="sm" icon={<Play className="w-4 h-4" />}>
          Launch Simulation
        </AegisButton>
      </motion.div>

      {/* 3D Swarm Visualization */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="min-h-[400px] relative overflow-hidden" animated={false}>
          <div className="absolute inset-0 tactical-grid-dense flex items-center justify-center">
            {/* Swarm particles */}
            <div className="relative w-80 h-80">
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i / 24) * Math.PI * 2;
                const radius = 80 + Math.random() * 60;
                const cx = Math.cos(angle) * radius + 160;
                const cy = Math.sin(angle) * radius + 160;
                return (
                  <motion.div
                    key={i}
                    animate={{
                      x: [cx - 3, cx + 3, cx - 3],
                      y: [cy - 2, cy + 4, cy - 2],
                    }}
                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() }}
                    className="absolute w-2.5 h-2.5 rounded-full bg-aegis-cyan shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                    style={{ left: 0, top: 0 }}
                  />
                );
              })}
              {/* Center command node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-aegis-purple shadow-[0_0_16px_rgba(124,77,255,0.5)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <span className="absolute top-[calc(50%-24px)] left-1/2 -translate-x-1/2 text-[9px] font-mono text-aegis-purple whitespace-nowrap">
                COMMAND NODE
              </span>
            </div>
          </div>

          <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2">
            <span className="text-[10px] font-heading font-bold text-aegis-cyan tracking-[0.08em]">
              24 ENTITIES &bull; V-FORMATION &bull; COORDINATED SEARCH
            </span>
          </div>
        </GlassPanel>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-5">
            <Sliders className="w-4 h-4 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Swarm Parameters
            </h3>
          </div>
          <div className="space-y-5">
            {[
              { label: "Entity Count", value: 24, max: 100 },
              { label: "Aggression", value: 35, max: 100 },
              { label: "Coordination Quality", value: 85, max: 100 },
              { label: "Stochasticity", value: 20, max: 100 },
              { label: "Communication Range", value: 70, max: 100 },
            ].map((param) => (
              <div key={param.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-aegis-cloud">{param.label}</span>
                  <span className="text-xs font-mono font-bold text-aegis-cyan">
                    {param.value}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-purple"
                    style={{ width: `${(param.value / param.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <AegisButton size="sm" className="flex-1">Apply</AegisButton>
              <AegisButton variant="ghost" size="sm" className="flex-1">Reset</AegisButton>
            </div>
          </div>
        </GlassPanel>

        {/* Emergent Behavior Log */}
        <GlassPanel className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-aegis-purple" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Emergent Behavior Log
            </h3>
          </div>
          <div className="space-y-4">
            {emergentEvents.map((evt, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[10px] font-mono text-aegis-slate shrink-0 mt-0.5 w-10">
                  {evt.time}
                </span>
                <div className="flex-1">
                  <p className={`text-sm leading-relaxed ${typeColors[evt.type]}`}>
                    {evt.event}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-white/[0.04] text-[9px] font-heading font-bold text-aegis-slate tracking-wider uppercase">
                    {evt.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </motion.div>
  );
}
