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
  Radio,
  Gauge,
  Anchor,
  ChevronRight,
  Loader2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { digitalTwin } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import type { LucideIcon } from "lucide-react";

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

const SUBSYSTEM_META: Record<
  string,
  { icon: LucideIcon; label: string }
> = {
  propulsion: { icon: Zap, label: "Propulsion" },
  power: { icon: Zap, label: "Power Gen" },
  navigation: { icon: Anchor, label: "Navigation" },
  weapons: { icon: Gauge, label: "Weapons" },
  damage_control: { icon: Droplets, label: "Damage Control" },
  communications: { icon: Radio, label: "Comms" },
};

const FALLBACK_SUB_ICON: LucideIcon = Cpu;

function prettifyKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusVariant(
  status: string | undefined
): "online" | "warning" | "offline" | "neutral" {
  const s = (status ?? "").toString().toLowerCase();
  if (
    s.includes("operational") ||
    s.includes("online") ||
    s.includes("nominal") ||
    s.includes("ready") ||
    s.includes("ok") ||
    s.includes("active")
  )
    return "online";
  if (
    s.includes("degraded") ||
    s.includes("warning") ||
    s.includes("partial") ||
    s.includes("limited")
  )
    return "warning";
  if (
    s.includes("offline") ||
    s.includes("fault") ||
    s.includes("critical") ||
    s.includes("down") ||
    s.includes("fail")
  )
    return "offline";
  return "neutral";
}

function summarizeSystem(value: Record<string, unknown>): string {
  // Try the most informative values.
  for (const k of ["state", "summary", "detail", "details", "load", "value"]) {
    const v = value[k];
    if (typeof v === "string" || typeof v === "number") return String(v);
  }
  // Otherwise summarize numeric metrics inline.
  const entries = Object.entries(value).filter(
    ([k]) => k !== "status" && k !== "name"
  );
  if (!entries.length) return "--";
  return entries
    .slice(0, 2)
    .map(([k, v]) => {
      if (typeof v === "number") return `${prettifyKey(k)}: ${v}`;
      if (typeof v === "string") return `${prettifyKey(k)}: ${v}`;
      return `${prettifyKey(k)}`;
    })
    .join(" • ");
}

export default function DigitalTwinPage() {
  const shipsState = useApi(() => digitalTwin.ships(), []);
  const [shipId, setShipId] = useState<string | null>(null);

  useEffect(() => {
    if (!shipId && shipsState.data?.length) {
      setShipId(shipsState.data[0].ship_id);
    }
  }, [shipsState.data, shipId]);

  const stateState = useApi(
    () => (shipId ? digitalTwin.state(shipId) : Promise.resolve(null)),
    [shipId],
    { skip: !shipId }
  );

  const systemsState = useApi(
    () => (shipId ? digitalTwin.systems(shipId) : Promise.resolve(null)),
    [shipId],
    { skip: !shipId }
  );

  const selectedShip = useMemo(
    () => shipsState.data?.find((s) => s.ship_id === shipId) ?? null,
    [shipsState.data, shipId]
  );

  const subsystems = useMemo(() => {
    const systems = stateState.data?.systems ?? {};
    return Object.entries(systems).map(([key, raw]) => {
      const value = (raw ?? {}) as Record<string, unknown>;
      const meta = SUBSYSTEM_META[key];
      const status =
        typeof value.status === "string"
          ? value.status
          : typeof value.state === "string"
          ? value.state
          : "Unknown";
      return {
        key,
        icon: meta?.icon ?? FALLBACK_SUB_ICON,
        label: meta?.label ?? prettifyKey(key),
        status,
        variant: statusVariant(status),
        detail: summarizeSystem(value),
      };
    });
  }, [stateState.data]);

  const subtitle = selectedShip
    ? `${selectedShip.class} • ${selectedShip.hull_number} • ${selectedShip.home_port}`
    : "Interactive Ship Model";

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
              {selectedShip ? (
                <>
                  Interactive Ship Model &bull; {selectedShip.name}
                </>
              ) : (
                "Interactive Ship Model"
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {shipsState.loading ? (
            <span className="inline-flex items-center gap-2 text-[11px] font-heading text-aegis-mist tracking-wider">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-aegis-cyan" />
              Loading ships...
            </span>
          ) : shipsState.error ? (
            <span className="inline-flex items-center gap-2 text-[11px] font-heading text-aegis-red tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              {shipsState.error}
            </span>
          ) : (
            <select
              value={shipId ?? ""}
              onChange={(e) => setShipId(e.target.value || null)}
              disabled={!shipsState.data?.length}
              className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30 cursor-pointer disabled:opacity-50"
            >
              {!shipsState.data?.length && <option value="">No ships</option>}
              {shipsState.data?.map((ship) => (
                <option key={ship.ship_id} value={ship.ship_id}>
                  {ship.name} ({ship.hull_number})
                </option>
              ))}
            </select>
          )}
          {shipId && (
            <Link
              href={`/app/digital-twin/ship/${shipId}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-aegis-cyan/15 text-aegis-cyan border border-aegis-cyan/30 text-[11px] font-heading font-semibold tracking-wider hover:bg-aegis-cyan/25 transition-colors"
            >
              View detailed twin
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
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
              <p className="text-[10px] font-mono text-aegis-slate mt-3">
                {selectedShip
                  ? subtitle
                  : shipsState.loading
                  ? "Loading fleet..."
                  : "Select a ship"}
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

          {/* Live state overlay */}
          {stateState.data && (
            <div className="absolute top-4 right-4 glass rounded-xl p-3 w-56">
              <h4 className="text-[10px] font-heading font-bold text-aegis-slate tracking-[0.1em] uppercase mb-2">
                Live State
              </h4>
              <div className="space-y-1.5 text-[11px] font-mono text-aegis-cloud">
                <div className="flex justify-between">
                  <span className="text-aegis-slate">Speed</span>
                  <span>{stateState.data.speed_knots?.toFixed(1)} kn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aegis-slate">Heading</span>
                  <span>{Math.round(stateState.data.heading_deg)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aegis-slate">Depth</span>
                  <span>{stateState.data.depth_m?.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aegis-slate">Readiness</span>
                  <span className="text-aegis-cyan">
                    {Math.round(stateState.data.crew_readiness * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-aegis-slate">State</span>
                  <span className="uppercase tracking-wider">
                    {stateState.data.readiness_state}
                  </span>
                </div>
              </div>
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {/* Subsystem Status Cards */}
      <motion.div variants={fadeInUp}>
        <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
          Subsystem Status
        </h3>
        {stateState.loading ? (
          <GlassPanel animated={false}>
            <div className="flex items-center justify-center py-10 gap-3 text-aegis-mist">
              <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                Loading subsystem state...
              </span>
            </div>
          </GlassPanel>
        ) : stateState.error ? (
          <GlassPanel animated={false}>
            <div className="flex items-center justify-center py-10 gap-3 text-aegis-red">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                {stateState.error}
              </span>
            </div>
          </GlassPanel>
        ) : subsystems.length === 0 ? (
          <GlassPanel animated={false}>
            <div className="text-center py-10 text-aegis-mist">
              <p className="font-heading text-xs tracking-[0.1em] uppercase">
                No subsystem telemetry available
              </p>
            </div>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subsystems.map((sys) => (
              <GlassPanel key={sys.key} className="p-4 text-center">
                <sys.icon className="w-6 h-6 text-aegis-cyan mx-auto mb-2" />
                <p className="text-xs font-heading font-bold text-aegis-white tracking-wide mb-1">
                  {sys.label}
                </p>
                <StatusBadge label={sys.status} variant={sys.variant} />
                <p className="text-[10px] font-mono text-aegis-slate mt-2 break-words">
                  {sys.detail}
                </p>
              </GlassPanel>
            ))}
          </div>
        )}
      </motion.div>

      {/* Detail Panel */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Gauge className="w-5 h-5 text-aegis-cyan" />
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Ship Particulars
              </h3>
            </div>
            {shipId && (
              <Link
                href={`/app/digital-twin/ship/${shipId}`}
                className="text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors flex items-center gap-1 cursor-pointer"
              >
                Full Detail <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
          {systemsState.loading ? (
            <div className="flex items-center justify-center py-6 gap-3 text-aegis-mist">
              <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                Loading systems graph...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                  Configuration
                </span>
                <p className="text-sm text-aegis-cloud mt-1">
                  {selectedShip ? selectedShip.class : "--"}
                </p>
                <p className="text-xs text-aegis-mist mt-0.5">
                  {selectedShip
                    ? `Commissioned ${selectedShip.commissioned} • ${selectedShip.displacement_tonnes.toLocaleString()} t`
                    : "--"}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                  Current State
                </span>
                <p className="text-sm text-aegis-green mt-1 font-semibold">
                  {stateState.data
                    ? `${stateState.data.speed_knots.toFixed(1)} kn • ${stateState.data.readiness_state}`
                    : "--"}
                </p>
                <p className="text-xs text-aegis-mist mt-0.5">
                  {stateState.data
                    ? `Position ${stateState.data.position.lat.toFixed(2)}°, ${stateState.data.position.lon.toFixed(2)}°`
                    : "--"}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                  Systems Topology
                </span>
                <p className="text-sm text-aegis-amber mt-1">
                  {systemsState.data
                    ? `${systemsState.data.nodes.length} nodes • ${systemsState.data.edges.length} links`
                    : systemsState.error
                    ? systemsState.error
                    : "--"}
                </p>
                <p className="text-xs text-aegis-mist mt-0.5">
                  Dependency graph available in detailed twin
                </p>
              </div>
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
