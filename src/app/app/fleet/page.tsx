"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  Loader2,
  MapPin,
  RefreshCw,
  Ship as ShipIcon,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { analytics, digitalTwin } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";

function statusVariant(status: string): "online" | "warning" | "offline" | "neutral" {
  const s = (status ?? "").toLowerCase();
  if (s.includes("ready") || s.includes("active") || s.includes("deployed")) return "online";
  if (s.includes("limited") || s.includes("maint") || s.includes("training") || s.includes("trial")) return "warning";
  if (s.includes("dock") || s.includes("offline") || s.includes("refit")) return "offline";
  return "neutral";
}

export default function FleetPage() {
  const fleetState = useApi(() => analytics.fleet(), []);
  const shipsState = useApi(() => digitalTwin.ships(), []);

  const fleetData = fleetState.data;
  const ships = shipsState.data ?? [];

  const fleetScore = useMemo(
    () => (fleetData ? fleetData.average_fleet_score.toFixed(1) : null),
    [fleetData]
  );

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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <ShipIcon className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Fleet Enterprise Dashboard
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Multi-Base Training Operations
            </p>
          </div>
        </div>
        {fleetState.loading ? (
          <span className="inline-flex items-center gap-2 text-[11px] font-heading text-aegis-mist tracking-wider">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-aegis-cyan" />
            Loading fleet KPIs...
          </span>
        ) : fleetState.error ? (
          <StatusBadge label="KPI ERROR" variant="alert" />
        ) : (
          <StatusBadge label="Fleet Online" variant="synced" pulse />
        )}
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Trainees"
          value={fleetData ? fleetData.total_trainees.toLocaleString() : "--"}
          subtitle={fleetState.loading ? "Loading..." : undefined}
          icon={Users}
        />
        <MetricCard
          title="Total Sessions"
          value={fleetData ? fleetData.total_sessions.toLocaleString() : "--"}
          subtitle={
            fleetState.loading
              ? "Loading..."
              : fleetData
              ? `${fleetData.active_sessions} active`
              : undefined
          }
          icon={RefreshCw}
          accentColor="text-aegis-purple"
        />
        <MetricCard
          title="Fleet Avg Score"
          value={fleetScore ?? "--"}
          subtitle={fleetState.error ?? undefined}
          icon={Target}
          accentColor="text-aegis-gold"
        />
        <MetricCard
          title="Certifications (Mo)"
          value={
            fleetData
              ? fleetData.certifications_this_month.toLocaleString()
              : "--"
          }
          icon={Award}
          accentColor="text-aegis-green"
        />
      </div>

      {/* Domain performance */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Domain Performance
            </h3>
          </div>
          {fleetState.loading ? (
            <div className="flex items-center justify-center py-8 gap-3 text-aegis-mist">
              <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                Loading domain performance...
              </span>
            </div>
          ) : fleetState.error ? (
            <div className="flex items-center justify-center py-8 gap-3 text-aegis-red">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                {fleetState.error}
              </span>
            </div>
          ) : fleetData && Object.keys(fleetData.domain_performance).length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(fleetData.domain_performance).map(([domain, score]) => (
                <div
                  key={domain}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading text-[11px] tracking-wider uppercase text-aegis-cloud">
                      {domain}
                    </span>
                    <span className="font-mono text-sm text-aegis-cyan">
                      {Number(score).toFixed(1)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, Math.max(0, Number(score)))}%`,
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-blue"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-aegis-mist text-center py-6">
              No domain performance data.
            </p>
          )}
        </GlassPanel>
      </motion.div>

      {/* Ship roster */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center gap-3 mb-4">
            <ShipIcon className="w-5 h-5 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Ship Roster
            </h3>
            {shipsState.data && (
              <span className="text-[10px] font-mono text-aegis-slate ml-auto">
                {shipsState.data.length} ships
              </span>
            )}
          </div>
          {shipsState.loading ? (
            <div className="flex items-center justify-center py-8 gap-3 text-aegis-mist">
              <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                Loading ship roster...
              </span>
            </div>
          ) : shipsState.error ? (
            <div className="flex items-center justify-center py-8 gap-3 text-aegis-red">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-heading text-xs tracking-[0.1em] uppercase">
                {shipsState.error}
              </span>
            </div>
          ) : !ships.length ? (
            <p className="text-xs text-aegis-mist text-center py-6">
              No ships registered.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ships.map((ship) => (
                <Link
                  key={ship.ship_id}
                  href={`/app/digital-twin/ship/${ship.ship_id}`}
                  className="block"
                >
                  <div className="glass-card rounded-xl p-4 hover:border-aegis-cyan/30 transition-colors h-full">
                    <div className="flex items-center justify-between mb-3">
                      <StatusBadge
                        label={ship.status.toUpperCase()}
                        variant={statusVariant(ship.status)}
                        pulse
                      />
                      <span className="text-[10px] font-mono text-aegis-slate">
                        {ship.hull_number}
                      </span>
                    </div>
                    <h4 className="font-heading text-sm font-bold text-aegis-white tracking-wide">
                      {ship.name}
                    </h4>
                    <p className="text-[10px] font-mono text-aegis-slate mt-0.5">
                      {ship.class}
                    </p>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <p className="font-mono text-sm font-bold text-aegis-cyan">
                          {ship.displacement_tonnes.toLocaleString()} t
                        </p>
                        <p className="text-[9px] font-heading text-aegis-slate tracking-wider uppercase">
                          Displacement
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-aegis-green">
                          {ship.home_port}
                        </p>
                        <p className="text-[9px] font-heading text-aegis-slate tracking-wider uppercase">
                          Home Port
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] font-mono text-aegis-mist mt-3">
                      Commissioned {ship.commissioned}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {/* Fleet map placeholder (preserved) */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="min-h-[320px] relative overflow-hidden" animated={false}>
          <div className="absolute inset-0 tactical-grid flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-10 h-10 text-aegis-cyan/30 mx-auto mb-3" />
              <p className="font-heading text-sm text-aegis-mist tracking-wider">
                Fleet Base Map
              </p>
              <p className="text-[10px] font-mono text-aegis-gunmetal mt-1">
                Mapbox GL / Deck.gl &bull; Base locations with status indicators
              </p>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
