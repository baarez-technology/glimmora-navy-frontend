"use client";

import { motion } from "framer-motion";
import { Ship, MapPin, Users, Target, RefreshCw } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const bases = [
  { name: "INS Dronacharya", location: "Kochi", trainees: 120, readiness: 94, status: "online" as const, sessions: 12 },
  { name: "INS Shivaji", location: "Lonavala", trainees: 89, readiness: 87, status: "online" as const, sessions: 8 },
  { name: "INS Valsura", location: "Jamnagar", trainees: 204, readiness: 91, status: "online" as const, sessions: 15 },
  { name: "INS Vikrant", location: "At Sea", trainees: 67, readiness: 96, status: "online" as const, sessions: 6 },
  { name: "INS Chilka", location: "Odisha", trainees: 156, readiness: 83, status: "warning" as const, sessions: 10 },
];

export default function FleetPage() {
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
            <Ship className="w-6 h-6 text-aegis-void" />
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
        <StatusBadge label="All Bases Synced" variant="synced" pulse />
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Trainees" value="636" trend={{ value: 4.2, direction: "up" }} icon={Users} />
        <MetricCard title="Active Bases" value="5" subtitle="All connected" icon={MapPin} accentColor="text-aegis-green" />
        <MetricCard title="Fleet Readiness" value="90.2%" trend={{ value: 1.1, direction: "up" }} icon={Target} accentColor="text-aegis-gold" />
        <MetricCard title="Active Sessions" value="51" subtitle="Across all bases" icon={RefreshCw} accentColor="text-aegis-purple" />
      </div>

      {/* Map Placeholder */}
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

            {/* Mock base pins */}
            {[
              { name: "Kochi", top: "50%", left: "35%", status: "online" },
              { name: "Lonavala", top: "35%", left: "30%", status: "online" },
              { name: "Jamnagar", top: "30%", left: "22%", status: "online" },
              { name: "At Sea", top: "55%", left: "50%", status: "online" },
              { name: "Odisha", top: "40%", left: "48%", status: "warning" },
            ].map((base) => (
              <div key={base.name} className="absolute" style={{ top: base.top, left: base.left }}>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`w-3 h-3 rounded-full ${base.status === "online" ? "bg-aegis-green shadow-[0_0_8px_rgba(0,230,118,0.5)]" : "bg-aegis-amber shadow-[0_0_8px_rgba(255,171,64,0.5)]"}`}
                />
                <span className="absolute -top-4 left-4 text-[8px] font-mono text-aegis-mist whitespace-nowrap">
                  {base.name}
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>

      {/* Base Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {bases.map((base) => (
          <motion.div key={base.name} variants={fadeInUp}>
            <GlassPanel className="text-center hover:border-aegis-cyan/15 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <StatusBadge label={base.status === "online" ? "ONLINE" : "DEGRADED"} variant={base.status} pulse />
                <span className="text-[10px] font-mono text-aegis-slate">{base.sessions} sessions</span>
              </div>
              <h4 className="font-heading text-sm font-bold text-aegis-white tracking-wide mb-0.5">
                {base.name}
              </h4>
              <p className="text-[10px] font-mono text-aegis-slate mb-3">{base.location}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-mono text-lg font-bold text-aegis-cyan">{base.trainees}</p>
                  <p className="text-[9px] font-heading text-aegis-slate tracking-wider uppercase">Trainees</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold text-aegis-green">{base.readiness}%</p>
                  <p className="text-[9px] font-heading text-aegis-slate tracking-wider uppercase">Readiness</p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
