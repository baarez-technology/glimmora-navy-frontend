"use client";

import { motion } from "framer-motion";
import {
  Box,
  Layers,
  Eye,
  Grid3x3,
  Cpu,
  Zap,
  Droplets,
  Wind,
  Radio,
  ThermometerSun,
  Gauge,
  Anchor,
  ChevronRight,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const viewModes = [
  { icon: Eye, label: "Solid", active: true },
  { icon: Grid3x3, label: "Wireframe", active: false },
  { icon: Layers, label: "X-Ray", active: false },
  { icon: Cpu, label: "Systems", active: false },
];

const systemLayers = [
  { label: "Hull & Structure", enabled: true, color: "bg-aegis-cyan" },
  { label: "Propulsion", enabled: true, color: "bg-aegis-blue" },
  { label: "Electrical", enabled: false, color: "bg-aegis-gold" },
  { label: "Fuel & Piping", enabled: false, color: "bg-aegis-orange" },
  { label: "Firefighting", enabled: true, color: "bg-aegis-red" },
  { label: "Communications", enabled: false, color: "bg-aegis-green" },
];

const subsystems = [
  { icon: Zap, label: "Propulsion", status: "Operational", value: "2x GT Running", variant: "online" as const },
  { icon: Zap, label: "Power Gen", status: "Operational", value: "4x DG Online", variant: "online" as const },
  { icon: Droplets, label: "Fuel", status: "85%", value: "1,240 tonnes", variant: "online" as const },
  { icon: ThermometerSun, label: "HVAC", status: "Operational", value: "All zones nominal", variant: "online" as const },
  { icon: Wind, label: "Ventilation", status: "Warning", value: "Zone 3 degraded", variant: "warning" as const },
  { icon: Radio, label: "Comms", status: "Operational", value: "All circuits active", variant: "online" as const },
];

export default function DigitalTwinPage() {
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center">
            <Box className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              3D Digital Twin
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Interactive Ship Model &bull; INS Vikrant (IAC-1)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30">
            <option>INS Vikrant (IAC-1)</option>
            <option>INS Chennai (P-65)</option>
            <option>INS Kalvari (S-50)</option>
          </select>
        </div>
      </motion.div>

      {/* 3D Viewport Placeholder */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="min-h-[500px] relative overflow-hidden" animated={false}>
          {/* 3D Scene placeholder */}
          <div className="absolute inset-0 tactical-grid-dense flex items-center justify-center">
            <div className="text-center">
              {/* Ship wireframe representation */}
              <motion.div
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative w-64 h-32 mx-auto mb-8"
                style={{ perspective: "800px" }}
              >
                <div className="absolute inset-0 border-2 border-aegis-cyan/30 rounded-[40%] transform skewX(-5deg)" />
                <div className="absolute inset-4 border border-aegis-cyan/20 rounded-[35%] transform skewX(-3deg)" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-aegis-cyan glow-pulse" />

                {/* Floating labels */}
                {[
                  { label: "Bridge", top: "-20px", left: "60%" },
                  { label: "CIC", top: "20px", left: "45%" },
                  { label: "Engine Room", top: "50%", left: "20%" },
                  { label: "DC Central", top: "70%", left: "55%" },
                ].map((point) => (
                  <div
                    key={point.label}
                    className="absolute text-[9px] font-mono text-aegis-cyan/60 whitespace-nowrap"
                    style={{ top: point.top, left: point.left }}
                  >
                    <span className="inline-block w-1 h-1 rounded-full bg-aegis-cyan mr-1 animate-pulse" />
                    {point.label}
                  </div>
                ))}
              </motion.div>

              <p className="font-heading text-sm text-aegis-mist tracking-wider">
                3D Digital Twin Viewport
              </p>
              <p className="text-[10px] font-mono text-aegis-slate mt-1">
                Three.js + React Three Fiber | Rotate &bull; Zoom &bull; Pan
              </p>
            </div>
          </div>

          {/* View mode toolbar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 glass rounded-xl p-1.5">
            {viewModes.map((mode) => (
              <button
                key={mode.label}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-heading font-semibold tracking-wider transition-all cursor-pointer ${
                  mode.active
                    ? "bg-aegis-cyan/15 text-aegis-cyan"
                    : "text-aegis-mist hover:text-aegis-cloud hover:bg-white/[0.04]"
                }`}
              >
                <mode.icon className="w-3.5 h-3.5" />
                {mode.label}
              </button>
            ))}
          </div>

          {/* Layer toggles (left panel) */}
          <div className="absolute top-4 left-4 glass rounded-xl p-3 w-48">
            <h4 className="text-[10px] font-heading font-bold text-aegis-slate tracking-[0.1em] uppercase mb-3">
              System Layers
            </h4>
            <div className="space-y-2">
              {systemLayers.map((layer) => (
                <label key={layer.label} className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-3 h-3 rounded-sm border ${layer.enabled ? layer.color + " border-transparent" : "border-aegis-gunmetal"}`} />
                  <span className={`text-[11px] ${layer.enabled ? "text-aegis-cloud" : "text-aegis-slate"}`}>
                    {layer.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Subsystem Status Cards */}
      <motion.div variants={fadeInUp}>
        <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
          Subsystem Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {subsystems.map((sys) => (
            <GlassPanel key={sys.label} className="p-4 text-center">
              <sys.icon className="w-6 h-6 text-aegis-cyan mx-auto mb-2" />
              <p className="text-xs font-heading font-bold text-aegis-white tracking-wide mb-1">
                {sys.label}
              </p>
              <StatusBadge label={sys.status} variant={sys.variant} />
              <p className="text-[10px] font-mono text-aegis-slate mt-2">
                {sys.value}
              </p>
            </GlassPanel>
          ))}
        </div>
      </motion.div>

      {/* Detail Panel */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Gauge className="w-5 h-5 text-aegis-cyan" />
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Selected: Main Propulsion System
              </h3>
            </div>
            <button className="text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors flex items-center gap-1 cursor-pointer">
              Full Detail <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                Configuration
              </span>
              <p className="text-sm text-aegis-cloud mt-1">
                COGAG - 4x Gas Turbines
              </p>
              <p className="text-xs text-aegis-mist mt-0.5">
                2x GE LM2500 (Boost) + 2x RR Spey (Cruise)
              </p>
            </div>
            <div>
              <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                Current State
              </span>
              <p className="text-sm text-aegis-green mt-1 font-semibold">
                2x GT Running - 18 knots
              </p>
              <p className="text-xs text-aegis-mist mt-0.5">
                Fuel consumption: 2.4 t/hr
              </p>
            </div>
            <div>
              <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                Training Faults Available
              </span>
              <p className="text-sm text-aegis-amber mt-1">12 injectable faults</p>
              <p className="text-xs text-aegis-mist mt-0.5">
                Oil pressure, bearing temp, control valve, etc.
              </p>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
