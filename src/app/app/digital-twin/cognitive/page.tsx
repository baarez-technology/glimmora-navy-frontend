"use client";

import {
  AlertTriangle,
  BrainCircuit,
  GitBranch,
  Loader2,
  Network,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { digitalTwin } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import type { SystemGraph } from "@/lib/api/types";

const NODE_TYPE_COLORS: Record<string, string> = {
  power: "border-aegis-gold/40 bg-aegis-gold/10 text-aegis-gold",
  propulsion: "border-aegis-blue/40 bg-aegis-blue/10 text-aegis-blue",
  navigation: "border-aegis-cyan/40 bg-aegis-cyan/10 text-aegis-cyan",
  weapons: "border-aegis-red/40 bg-aegis-red/10 text-aegis-red",
  damage_control: "border-aegis-orange/40 bg-aegis-orange/10 text-aegis-orange",
  communications: "border-aegis-green/40 bg-aegis-green/10 text-aegis-green",
  sensor: "border-aegis-purple/40 bg-aegis-purple/10 text-aegis-purple",
  control: "border-aegis-cyan/40 bg-aegis-cyan/10 text-aegis-cyan",
};

function nodeColor(type: string): string {
  return (
    NODE_TYPE_COLORS[type.toLowerCase()] ??
    "border-aegis-cyan/30 bg-aegis-cyan/5 text-aegis-cloud"
  );
}

function readinessVariant(
  state: string | undefined
): "online" | "warning" | "offline" | "active" {
  const s = (state ?? "").toLowerCase();
  if (s.includes("ready") || s.includes("c1") || s.includes("normal")) return "online";
  if (s.includes("limited") || s.includes("c2") || s.includes("degraded")) return "warning";
  if (s.includes("c4") || s.includes("not") || s.includes("critical")) return "offline";
  return "active";
}

function GraphLayout({ graph }: { graph: SystemGraph }) {
  // Distribute nodes evenly on a circle so the graph is readable regardless of
  // backend ordering. SVG view-box is 800x500.
  const positions = useMemo(() => {
    const cx = 400;
    const cy = 250;
    const r = Math.min(190, 60 + graph.nodes.length * 8);
    const map = new Map<string, { x: number; y: number }>();
    graph.nodes.forEach((node, i) => {
      const angle = (i / Math.max(1, graph.nodes.length)) * Math.PI * 2 - Math.PI / 2;
      map.set(node.id, {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      });
    });
    return map;
  }, [graph]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-white/[0.05] bg-white/[0.02]">
      <svg viewBox="0 0 800 500" className="w-full h-[460px]">
        <defs>
          <marker
            id="cog-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(14,165,233,0.6)" />
          </marker>
        </defs>
        {graph.edges.map((edge, idx) => {
          const from = positions.get(edge.from);
          const to = positions.get(edge.to);
          if (!from || !to) return null;
          return (
            <line
              key={`${edge.from}-${edge.to}-${idx}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(14,165,233,0.35)"
              strokeWidth={1.2}
              strokeDasharray={edge.type === "logical" ? "4 4" : undefined}
              markerEnd="url(#cog-arrow)"
            />
          );
        })}
        {graph.nodes.map((node) => {
          const pos = positions.get(node.id);
          if (!pos) return null;
          return (
            <g key={node.id} transform={`translate(${pos.x},${pos.y})`}>
              <circle
                r={22}
                className="fill-aegis-void/60"
                stroke="currentColor"
                strokeWidth={1.5}
                style={{
                  color: "rgba(14,165,233,0.8)",
                }}
              />
              <text
                textAnchor="middle"
                dy="0.35em"
                className="font-mono"
                fontSize="9"
                fill="rgba(226,232,240,0.9)"
              >
                {node.label.length > 10 ? node.label.slice(0, 9) + "…" : node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function CognitiveDigitalTwinPage() {
  const shipsState = useApi(() => digitalTwin.ships(), []);
  const [shipId, setShipId] = useState<string | null>(null);

  useEffect(() => {
    const data = shipsState.data;
    if (!shipId && data && data.length > 0) {
      Promise.resolve().then(() => {
        setShipId(data[0].ship_id);
      });
    }
  }, [shipsState.data, shipId]);

  const systemsState = useApi(
    () => (shipId ? digitalTwin.systems(shipId) : Promise.resolve(null)),
    [shipId],
    { skip: !shipId }
  );

  const stateState = useApi(
    () => (shipId ? digitalTwin.state(shipId) : Promise.resolve(null)),
    [shipId],
    { skip: !shipId }
  );

  const selectedShip = useMemo(
    () => shipsState.data?.find((s) => s.ship_id === shipId) ?? null,
    [shipsState.data, shipId]
  );

  const nodesByType = useMemo(() => {
    const groups: Record<string, { id: string; label: string }[]> = {};
    systemsState.data?.nodes.forEach((n) => {
      const key = n.type || "other";
      groups[key] = groups[key] ?? [];
      groups[key].push({ id: n.id, label: n.label });
    });
    return groups;
  }, [systemsState.data]);

  const readiness = stateState.data?.crew_readiness ?? null;
  const readinessPct = readiness != null ? Math.round(readiness * 100) : null;

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
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Cognitive Digital Twin
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Self-Learning Twin &bull; Governed Adaptation &bull; Telemetry Ingestion
            </p>
          </div>
        </div>
        {shipsState.loading ? (
          <span className="inline-flex items-center gap-2 text-[11px] font-heading text-aegis-mist tracking-wider">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-aegis-cyan" />
            Loading ships...
          </span>
        ) : shipsState.error ? (
          <StatusBadge label={shipsState.error} variant="alert" />
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
      </motion.div>

      {/* Metrics */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {systemsState.data ? systemsState.data.nodes.length : "--"}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              System Nodes
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {systemsState.data ? systemsState.data.edges.length : "--"}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Dependency Links
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan">
              {readinessPct != null ? `${readinessPct}%` : "--"}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Crew Readiness
            </p>
          </GlassPanel>
          <GlassPanel className="p-4 text-center" animated={false}>
            <p className="font-mono text-2xl font-bold text-aegis-cyan uppercase">
              {stateState.data?.readiness_state ?? "--"}
            </p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
              Readiness State
            </p>
          </GlassPanel>
        </div>
      </motion.div>

      {/* Dependency graph */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Network className="w-5 h-5 text-aegis-cyan" />
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Systems Dependency Graph
              </h3>
            </div>
            {selectedShip && (
              <span className="text-[10px] font-mono text-aegis-slate">
                {selectedShip.name} • {selectedShip.hull_number}
              </span>
            )}
          </div>

          {systemsState.loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-aegis-mist">
              <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                Loading topology...
              </span>
            </div>
          ) : systemsState.error ? (
            <div className="flex items-center justify-center py-16 gap-3 text-aegis-red">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                {systemsState.error}
              </span>
            </div>
          ) : systemsState.data && systemsState.data.nodes.length > 0 ? (
            <GraphLayout graph={systemsState.data} />
          ) : (
            <div className="text-center py-16 text-aegis-mist">
              <p className="font-heading text-xs tracking-[0.1em] uppercase">
                No topology available
              </p>
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {/* Node groupings + readiness */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-5 h-5 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Node Types
            </h3>
          </div>
          {Object.keys(nodesByType).length === 0 ? (
            <p className="text-xs text-aegis-mist">No node data.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(nodesByType).map(([type, nodes]) => (
                <div key={type}>
                  <p className="text-[10px] font-heading text-aegis-slate tracking-[0.1em] uppercase mb-2">
                    {type.replace(/_/g, " ")} &bull; {nodes.length}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {nodes.map((n) => (
                      <span
                        key={n.id}
                        className={`px-2.5 py-1 rounded-md border text-[11px] font-mono ${nodeColor(type)}`}
                      >
                        {n.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
            Cognitive Posture
          </h3>
          {stateState.loading ? (
            <div className="flex items-center gap-3 text-aegis-mist py-3">
              <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                Loading state...
              </span>
            </div>
          ) : stateState.error ? (
            <div className="flex items-center gap-3 text-aegis-red py-3">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                {stateState.error}
              </span>
            </div>
          ) : stateState.data ? (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                    Crew Readiness
                  </span>
                  <span className="font-mono text-xs text-aegis-cyan">
                    {readinessPct}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${readinessPct ?? 0}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-blue"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                  Readiness State
                </span>
                <StatusBadge
                  label={stateState.data.readiness_state}
                  variant={readinessVariant(stateState.data.readiness_state)}
                  pulse
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                  Last Sync
                </span>
                <span className="font-mono text-[11px] text-aegis-cloud">
                  {new Date(stateState.data.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-[11px] text-aegis-mist leading-relaxed pt-2 border-t border-white/[0.04]">
                Cognitive twin ingests crew readiness and live system telemetry to
                calibrate scenario fidelity. Adaptation gates remain governed by
                doctrine approval workflows.
              </div>
            </div>
          ) : (
            <p className="text-xs text-aegis-mist">Select a ship to view state.</p>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
