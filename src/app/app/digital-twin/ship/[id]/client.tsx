"use client";

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Anchor,
  Compass,
  Cpu,
  Gauge,
  Loader2,
  Network,
  Radio,
  Ship as ShipIcon,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { digitalTwin } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { getAccessToken, WS_BASE_URL } from "@/lib/api/client";
import type { LucideIcon } from "lucide-react";
import type { ShipTwinState, SystemGraph } from "@/lib/api/types";

type FaultPayload = {
  simulation_id?: string;
  type?: string;
  fault?: { system: string; fault_type: string; severity: number };
  affected_systems?: string[];
  estimated_restoration_minutes?: number;
  damage_control_actions?: string[];
  simulated_at?: string;
  [key: string]: unknown;
};

const SUBSYS_ICON: Record<string, LucideIcon> = {
  propulsion: Zap,
  power: Zap,
  navigation: Compass,
  weapons: Gauge,
  damage_control: Activity,
  communications: Radio,
};

function prettifyKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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

function readinessVariant(
  state: string | undefined
): "online" | "warning" | "offline" | "active" {
  const s = (state ?? "").toLowerCase();
  if (s.includes("ready") || s.includes("c1") || s.includes("normal")) return "online";
  if (s.includes("limited") || s.includes("c2") || s.includes("degraded")) return "warning";
  if (s.includes("c4") || s.includes("not") || s.includes("critical")) return "offline";
  return "active";
}

function summarizeSystem(value: Record<string, unknown>): string {
  for (const k of ["state", "summary", "detail", "details", "load", "value"]) {
    const v = value[k];
    if (typeof v === "string" || typeof v === "number") return String(v);
  }
  const entries = Object.entries(value).filter(
    ([k]) => k !== "status" && k !== "name"
  );
  if (!entries.length) return "--";
  return entries
    .slice(0, 3)
    .map(([k, v]) => {
      if (typeof v === "number") return `${prettifyKey(k)}: ${v}`;
      if (typeof v === "string") return `${prettifyKey(k)}: ${v}`;
      return prettifyKey(k);
    })
    .join(" • ");
}

function SystemsGraph({ graph }: { graph: SystemGraph }) {
  const positions = useMemo(() => {
    const cx = 400;
    const cy = 220;
    const r = Math.min(180, 60 + graph.nodes.length * 7);
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
      <svg viewBox="0 0 800 440" className="w-full h-[400px]">
        <defs>
          <marker
            id="ship-arrow"
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
              markerEnd="url(#ship-arrow)"
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
                stroke="rgba(14,165,233,0.8)"
                strokeWidth={1.5}
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

export default function ShipDetailClient({ shipId }: { shipId: string }) {
  const stateState = useApi(() => digitalTwin.state(shipId), [shipId]);
  const systemsState = useApi(() => digitalTwin.systems(shipId), [shipId]);

  // ----- WebSocket live telemetry -----
  const [liveState, setLiveState] = useState<ShipTwinState | null>(null);
  const [lastFault, setLastFault] = useState<FaultPayload | null>(null);
  const [wsStatus, setWsStatus] = useState<
    "connecting" | "connected" | "closed" | "error"
  >("connecting");

  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    const ws = new WebSocket(
      `${WS_BASE_URL}/api/digital-twin/ws/digital-twin/${shipId}`
    );
    Promise.resolve().then(() => {
      setWsStatus("connecting");
    });

    ws.onopen = () => {
      const token = getAccessToken();
      if (token) ws.send(token);
    };
    ws.onmessage = (ev) => {
      if (cancelled) return;
      let msg: { type?: string; data?: unknown; [key: string]: unknown };
      try {
        msg = JSON.parse(ev.data);
      } catch {
        return;
      }
      if (msg.type === "connected") {
        setWsStatus("connected");
      } else if (msg.type === "state_update" && msg.data) {
        setLiveState(msg.data as ShipTwinState);
      } else if (msg.type === "fault_simulation") {
        setLastFault(msg as FaultPayload);
      }
    };
    ws.onerror = () => setWsStatus("error");
    ws.onclose = () => setWsStatus("closed");

    interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "request_state" }));
      }
    }, 5000);

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
      try {
        ws.close();
      } catch {
        /* ignore */
      }
    };
  }, [shipId]);

  const currentState: ShipTwinState | null = liveState ?? stateState.data ?? null;

  // ----- Simulate fault form -----
  const simulateMutation = useMutation(
    (body: { system: string; fault_type: string; severity: number }) =>
      digitalTwin.simulate(shipId, body)
  );

  const systemOptions = useMemo(() => {
    if (systemsState.data?.nodes?.length) {
      return systemsState.data.nodes.map((n) => ({
        value: n.id,
        label: `${n.label} (${n.type})`,
      }));
    }
    if (currentState?.systems) {
      return Object.keys(currentState.systems).map((k) => ({
        value: k,
        label: prettifyKey(k),
      }));
    }
    return [];
  }, [systemsState.data, currentState]);

  const [formSystem, setFormSystem] = useState("");
  const [formFaultType, setFormFaultType] = useState("");
  const [formSeverity, setFormSeverity] = useState(0.5);

  useEffect(() => {
    if (!formSystem && systemOptions.length) {
      Promise.resolve().then(() => {
        setFormSystem(systemOptions[0].value);
      });
    }
  }, [systemOptions, formSystem]);

  const subsystems = useMemo(() => {
    const systems = currentState?.systems ?? {};
    return Object.entries(systems).map(([key, raw]) => {
      const value = (raw ?? {}) as Record<string, unknown>;
      const status =
        typeof value.status === "string"
          ? value.status
          : typeof value.state === "string"
          ? value.state
          : "Unknown";
      return {
        key,
        icon: SUBSYS_ICON[key] ?? Cpu,
        label: prettifyKey(key),
        status,
        variant: statusVariant(status),
        detail: summarizeSystem(value),
      };
    });
  }, [currentState]);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSystem || !formFaultType.trim()) return;
    const result = await simulateMutation.run({
      system: formSystem,
      fault_type: formFaultType.trim(),
      severity: formSeverity,
    });
    if (result) {
      setLastFault({
        type: "fault_simulation",
        simulation_id: result.simulation_id,
        fault: result.fault,
        affected_systems: result.affected_systems,
        estimated_restoration_minutes: result.estimated_restoration_minutes,
        damage_control_actions: result.damage_control_actions,
        simulated_at: result.simulated_at,
      });
    }
  };

  const readinessPct =
    currentState?.crew_readiness != null
      ? Math.round(currentState.crew_readiness * 100)
      : null;

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
            <ShipIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              {currentState?.name ?? `Ship Digital Twin: ${shipId}`}
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Ship-Class-Specific Model &bull; {shipId}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {wsStatus === "connected" ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-aegis-green/15 border border-aegis-green/30 text-[10px] font-heading font-bold tracking-[0.06em] uppercase text-aegis-green">
              <Wifi className="w-3 h-3" />
              Live
            </span>
          ) : wsStatus === "connecting" ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-aegis-cyan/15 border border-aegis-cyan/30 text-[10px] font-heading font-bold tracking-[0.06em] uppercase text-aegis-cyan">
              <Loader2 className="w-3 h-3 animate-spin" />
              Connecting
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-aegis-amber/15 border border-aegis-amber/30 text-[10px] font-heading font-bold tracking-[0.06em] uppercase text-aegis-amber">
              <WifiOff className="w-3 h-3" />
              Offline
            </span>
          )}
        </div>
      </motion.div>

      {/* Live telemetry summary */}
      <motion.div variants={fadeInUp}>
        {stateState.loading && !currentState ? (
          <GlassPanel animated={false}>
            <div className="flex items-center justify-center py-10 gap-3 text-aegis-mist">
              <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                Loading ship state...
              </span>
            </div>
          </GlassPanel>
        ) : stateState.error && !currentState ? (
          <GlassPanel animated={false}>
            <div className="flex items-center justify-center py-10 gap-3 text-aegis-red">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                {stateState.error}
              </span>
            </div>
          </GlassPanel>
        ) : currentState ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <GlassPanel className="p-4 text-center" animated={false}>
              <p className="font-mono text-2xl font-bold text-aegis-cyan">
                {currentState.speed_knots.toFixed(1)}
              </p>
              <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
                Speed (kn)
              </p>
            </GlassPanel>
            <GlassPanel className="p-4 text-center" animated={false}>
              <p className="font-mono text-2xl font-bold text-aegis-cyan">
                {Math.round(currentState.heading_deg)}°
              </p>
              <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
                Heading
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
                {currentState.readiness_state}
              </p>
              <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
                Readiness State
              </p>
            </GlassPanel>
          </div>
        ) : null}
      </motion.div>

      {/* Position / nav */}
      {currentState && (
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <div className="flex items-center gap-3 mb-4">
              <Anchor className="w-5 h-5 text-aegis-cyan" />
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Navigation
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                  Latitude
                </p>
                <p className="font-mono text-aegis-cloud mt-1">
                  {currentState.position.lat.toFixed(4)}°
                </p>
              </div>
              <div>
                <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                  Longitude
                </p>
                <p className="font-mono text-aegis-cloud mt-1">
                  {currentState.position.lon.toFixed(4)}°
                </p>
              </div>
              <div>
                <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                  Depth
                </p>
                <p className="font-mono text-aegis-cloud mt-1">
                  {currentState.depth_m.toFixed(1)} m
                </p>
              </div>
              <div>
                <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                  Last Update
                </p>
                <p className="font-mono text-aegis-cloud mt-1">
                  {new Date(currentState.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      )}

      {/* Subsystems */}
      <motion.div variants={fadeInUp}>
        <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
          Subsystem Status
        </h3>
        {subsystems.length === 0 ? (
          <GlassPanel animated={false}>
            <p className="text-xs text-aegis-mist py-6 text-center">
              No subsystem telemetry yet.
            </p>
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

      {/* Topology */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Network className="w-5 h-5 text-aegis-cyan" />
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Systems Topology
              </h3>
            </div>
            {systemsState.data && (
              <span className="text-[10px] font-mono text-aegis-slate">
                {systemsState.data.nodes.length} nodes • {systemsState.data.edges.length} links
              </span>
            )}
          </div>
          {systemsState.loading ? (
            <div className="flex items-center justify-center py-12 gap-3 text-aegis-mist">
              <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                Loading topology...
              </span>
            </div>
          ) : systemsState.error ? (
            <div className="flex items-center justify-center py-12 gap-3 text-aegis-red">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                {systemsState.error}
              </span>
            </div>
          ) : systemsState.data && systemsState.data.nodes.length ? (
            <SystemsGraph graph={systemsState.data} />
          ) : (
            <p className="text-xs text-aegis-mist text-center py-12">
              No topology available.
            </p>
          )}
        </GlassPanel>
      </motion.div>

      {/* Simulate fault */}
      <motion.div
        variants={fadeInUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <GlassPanel>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-aegis-amber" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Inject Training Fault
            </h3>
          </div>
          <form className="space-y-4" onSubmit={handleSimulate}>
            <div>
              <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1.5">
                System
              </label>
              <select
                value={formSystem}
                onChange={(e) => setFormSystem(e.target.value)}
                disabled={!systemOptions.length}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30 disabled:opacity-50"
              >
                {!systemOptions.length && <option value="">No systems loaded</option>}
                {systemOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1.5">
                Fault Type
              </label>
              <input
                type="text"
                value={formFaultType}
                onChange={(e) => setFormFaultType(e.target.value)}
                placeholder="e.g. bearing_overheat"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-aegis-cloud placeholder-aegis-slate/60 focus:outline-none focus:border-aegis-cyan/30"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                  Severity
                </label>
                <span className="font-mono text-xs text-aegis-cyan">
                  {formSeverity.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={formSeverity}
                onChange={(e) => setFormSeverity(Number(e.target.value))}
                className="w-full accent-aegis-cyan"
              />
            </div>
            {simulateMutation.error && (
              <div className="flex items-center gap-2 text-aegis-red text-[11px] font-heading tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                {simulateMutation.error}
              </div>
            )}
            <AegisButton
              type="submit"
              variant="primary"
              size="md"
              loading={simulateMutation.loading}
              disabled={!formSystem || !formFaultType.trim()}
            >
              Inject Fault
            </AegisButton>
          </form>
        </GlassPanel>

        <GlassPanel>
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Cascade & Damage Control
            </h3>
          </div>
          {!lastFault ? (
            <p className="text-xs text-aegis-mist py-6 text-center">
              No fault simulated yet. Inject a fault to see cascade effects and
              damage control actions, or wait for an instructor-led injection
              from the live WebSocket feed.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  label={`${lastFault.fault?.system ?? "system"} • ${
                    lastFault.fault?.fault_type ?? "fault"
                  }`}
                  variant="warning"
                  pulse
                />
                {lastFault.fault?.severity != null && (
                  <span className="text-[10px] font-mono text-aegis-amber">
                    severity {lastFault.fault.severity.toFixed(2)}
                  </span>
                )}
                {lastFault.estimated_restoration_minutes != null && (
                  <span className="text-[10px] font-mono text-aegis-mist">
                    ETA restore: {lastFault.estimated_restoration_minutes} min
                  </span>
                )}
              </div>
              {lastFault.affected_systems?.length ? (
                <div>
                  <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase mb-2">
                    Affected Systems
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {lastFault.affected_systems.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md border border-aegis-amber/30 bg-aegis-amber/10 text-[11px] font-mono text-aegis-amber"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {lastFault.damage_control_actions?.length ? (
                <div>
                  <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase mb-2">
                    Damage Control Actions
                  </p>
                  <ol className="space-y-2">
                    {lastFault.damage_control_actions.map((action, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                      >
                        <span className="font-mono text-[10px] text-aegis-cyan shrink-0 mt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-xs text-aegis-cloud leading-relaxed">
                          {action}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
              {lastFault.simulated_at && (
                <p className="text-[10px] font-mono text-aegis-slate">
                  Simulated at {new Date(lastFault.simulated_at).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
