"use client";

import { motion } from "framer-motion";
import {
  Swords,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Settings,
  Download,
  Ship,
  Plane,
  Radio,
  Target,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const blueForce = [
  { type: "Frigate", name: "INS Chennai", status: "Active", icon: Ship },
  { type: "Destroyer", name: "INS Kolkata", status: "Active", icon: Ship },
  { type: "UAV x4", name: "Drone Flight Alpha", status: "Airborne", icon: Plane },
  { type: "USV x2", name: "Recon Team", status: "Deployed", icon: Radio },
];

const redForce = [
  { type: "Corvette x3", name: "Red Surface Group", status: "Hostile", icon: Ship },
  { type: "UAV Swarm x12", name: "Red Swarm Alpha", status: "Inbound", icon: Plane },
  { type: "Submarine", name: "Red Sub", status: "Submerged", icon: Target },
  { type: "UUV x3", name: "Red UUV Pack", status: "Active", icon: Radio },
];

const battleEvents = [
  { time: "T+00:12", event: "Blue UAV flight detects Red surface group bearing 045", severity: "info" },
  { time: "T+00:15", event: "Red swarm launched -- 12 UAVs, heading 225", severity: "danger" },
  { time: "T+00:18", event: "INS Chennai classifies Red sub -- torpedo warning", severity: "danger" },
  { time: "T+00:20", event: "Blue CIWS engaged -- 4 Red UAVs neutralized", severity: "success" },
  { time: "T+00:22", event: "Red corvette group altering course -- evasive maneuver", severity: "info" },
  { time: "T+00:25", event: "Blue USV sensor mesh detects UUV pack bearing 180", severity: "warning" },
];

const severityColors: Record<string, string> = {
  info: "text-aegis-cyan",
  danger: "text-aegis-red",
  success: "text-aegis-green",
  warning: "text-aegis-amber",
};

export default function WarfareSimPage() {
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-red to-aegis-orange flex items-center justify-center">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Autonomous Multi-Agent Warfare Simulation
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Training-Safe Synthetic Battlespace &bull; Instructor Governed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AegisButton variant="secondary" size="sm" icon={<Settings className="w-4 h-4" />}>
            Configure
          </AegisButton>
          <AegisButton size="sm" icon={<Play className="w-4 h-4" />}>
            New Scenario
          </AegisButton>
        </div>
      </motion.div>

      {/* Tactical Map */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="min-h-[480px] relative overflow-hidden" animated={false}>
          {/* Ocean grid background */}
          <div className="absolute inset-0 tactical-grid-dense bg-gradient-to-b from-aegis-abyss to-aegis-deep-navy">
            {/* Blue force markers */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-[40%] left-[35%] w-4 h-4 rounded-sm bg-[#2979ff] border-2 border-[#2979ff] shadow-[0_0_12px_rgba(41,121,255,0.5)] rotate-45"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute top-[45%] left-[32%] w-4 h-4 rounded-sm bg-[#2979ff] border-2 border-[#2979ff] shadow-[0_0_12px_rgba(41,121,255,0.5)] rotate-45"
            />

            {/* Red force markers */}
            <motion.div
              animate={{ x: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-[25%] left-[65%] w-4 h-4 rounded-full bg-[#ff1744] border-2 border-[#ff1744] shadow-[0_0_12px_rgba(255,23,68,0.5)]"
            />
            <motion.div
              animate={{ x: [2, -2, 2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-[30%] left-[60%] w-4 h-4 rounded-full bg-[#ff1744] border-2 border-[#ff1744] shadow-[0_0_12px_rgba(255,23,68,0.5)]"
            />
            <motion.div
              animate={{ x: [-1, 1, -1], y: [1, -1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-[35%] left-[62%] w-4 h-4 rounded-full bg-[#ff1744] border-2 border-[#ff1744] shadow-[0_0_12px_rgba(255,23,68,0.5)]"
            />

            {/* Swarm cluster */}
            <div className="absolute top-[20%] left-[70%]">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [Math.random() * 10 - 5, Math.random() * 10 - 5],
                    y: [Math.random() * 10 - 5, Math.random() * 10 - 5],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#ff1744]/70"
                  style={{
                    top: `${Math.random() * 40 - 20}px`,
                    left: `${Math.random() * 60 - 30}px`,
                  }}
                />
              ))}
              <span className="absolute -top-5 left-0 text-[8px] font-mono text-aegis-red whitespace-nowrap">
                RED SWARM x12
              </span>
            </div>

            {/* Sensor coverage circle */}
            <div className="absolute top-[40%] left-[35%] w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2979ff]/15 bg-[#2979ff]/[0.03]" />

            {/* Neutral shipping */}
            <div className="absolute top-[60%] left-[50%] w-3 h-3 rounded-sm bg-[#e8edf5]/50 border border-[#e8edf5]/30 rotate-45" />
            <span className="absolute top-[63%] left-[52%] text-[7px] font-mono text-aegis-slate whitespace-nowrap">
              MV PACIFIC TRADER
            </span>

            {/* Center label */}
            <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2">
              <span className="text-[10px] font-heading font-bold text-aegis-gold tracking-[0.08em]">
                SCENARIO: MULTI-AXIS THREAT - SWARM DEFENSE
              </span>
            </div>

            {/* Legend */}
            <div className="absolute bottom-16 left-4 glass rounded-lg px-3 py-2 space-y-1.5">
              {[
                { color: "bg-[#2979ff]", label: "Blue Force", shape: "rotate-45 rounded-sm" },
                { color: "bg-[#ff1744]", label: "Red Force", shape: "rounded-full" },
                { color: "bg-[#e8edf5]/50", label: "Neutral", shape: "rotate-45 rounded-sm" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${item.color} ${item.shape}`} />
                  <span className="text-[9px] font-mono text-aegis-mist">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 glass rounded-xl px-4 py-2.5">
            <button className="text-aegis-mist hover:text-aegis-cyan transition-colors cursor-pointer">
              <SkipBack className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full bg-aegis-cyan/20 border border-aegis-cyan/40 flex items-center justify-center text-aegis-cyan hover:bg-aegis-cyan/30 transition-colors cursor-pointer">
              <Pause className="w-5 h-5" />
            </button>
            <button className="text-aegis-mist hover:text-aegis-cyan transition-colors cursor-pointer">
              <SkipForward className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-white/[0.06]" />
            <span className="text-xs font-mono text-aegis-cyan">T+00:25</span>
            <div className="w-px h-6 bg-white/[0.06]" />
            <span className="text-[10px] font-heading text-aegis-mist">Speed: 2x</span>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Blue Force */}
        <GlassPanel animated={false}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-[#2979ff]" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-[#2979ff]">
              Blue Force Composition
            </h3>
          </div>
          <div className="space-y-3">
            {blueForce.map((unit) => (
              <div key={unit.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#2979ff]/[0.05] border border-[#2979ff]/10">
                <div className="flex items-center gap-2.5">
                  <unit.icon className="w-4 h-4 text-[#2979ff]" />
                  <div>
                    <p className="text-xs font-semibold text-aegis-cloud">{unit.name}</p>
                    <p className="text-[10px] text-aegis-slate font-mono">{unit.type}</p>
                  </div>
                </div>
                <StatusBadge label={unit.status} variant="active" />
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Red Force */}
        <GlassPanel animated={false}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-aegis-red" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-red">
              Red Force Composition
            </h3>
          </div>
          <div className="space-y-3">
            {redForce.map((unit) => (
              <div key={unit.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-aegis-red/[0.05] border border-aegis-red/10">
                <div className="flex items-center gap-2.5">
                  <unit.icon className="w-4 h-4 text-aegis-red" />
                  <div>
                    <p className="text-xs font-semibold text-aegis-cloud">{unit.name}</p>
                    <p className="text-[10px] text-aegis-slate font-mono">{unit.type}</p>
                  </div>
                </div>
                <StatusBadge label={unit.status} variant="alert" />
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Battle Events */}
        <GlassPanel animated={false}>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-aegis-amber" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Battle Event Log
            </h3>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {battleEvents.map((evt, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[10px] font-mono text-aegis-slate shrink-0 mt-0.5 w-14">
                  {evt.time}
                </span>
                <p className={`text-xs leading-relaxed ${severityColors[evt.severity]}`}>
                  {evt.event}
                </p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </motion.div>
  );
}
