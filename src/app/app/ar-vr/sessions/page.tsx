"use client";

import { motion } from "framer-motion";
import { Glasses, Filter, Clock } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { MetricCard } from "@/components/ui/metric-card";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const vrSessions = [
  { id: "VR-BRG-012", type: "VR", domain: "Bridge Familiarization", trainee: "LT J. Kumar", status: "active", score: "--", duration: "22m" },
  { id: "VR-DC-008", type: "VR", domain: "DC Fire Scenario", trainee: "CPO T. Khan", status: "active", score: "--", duration: "15m" },
  { id: "AR-ENG-004", type: "AR", domain: "Engine Maintenance Overlay", trainee: "CPO M. Singh", status: "completed", score: "92", duration: "34m" },
  { id: "VR-CIC-019", type: "VR", domain: "CIC Synthetic Battlespace", trainee: "SLT R. Patel", status: "completed", score: "78", duration: "48m" },
  { id: "VR-USV-003", type: "VR", domain: "USV Control Station", trainee: "SLT K. Nair", status: "completed", score: "95", duration: "28m" },
];

export default function ARVRSessionsPage() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-electric flex items-center justify-center">
            <Glasses className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">AR/VR Sessions</h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">Active & Past Immersive Training Sessions</p>
          </div>
        </div>
        <AegisButton variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>Filter</AegisButton>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Active VR Sessions" value="2" icon={Glasses} accentColor="text-aegis-purple" />
        <MetricCard title="Completed Today" value="3" icon={Clock} accentColor="text-aegis-green" />
        <MetricCard title="Avg Score" value="88%" icon={Glasses} />
        <MetricCard title="Total Modules Used" value="48" icon={Glasses} accentColor="text-aegis-cyan" />
      </div>

      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Session", "Type", "Domain", "Trainee", "Duration", "Score", "Status"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vrSessions.map((s) => (
                  <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-xs font-mono font-bold text-aegis-cyan">{s.id}</td>
                    <td className="py-3 px-4"><StatusBadge label={s.type} variant={s.type === "VR" ? "active" : "online"} /></td>
                    <td className="py-3 px-4 text-sm text-aegis-cloud">{s.domain}</td>
                    <td className="py-3 px-4 text-xs text-aegis-mist">{s.trainee}</td>
                    <td className="py-3 px-4 text-xs font-mono text-aegis-mist">{s.duration}</td>
                    <td className="py-3 px-4 text-sm font-mono font-bold text-aegis-cyan">{s.score}</td>
                    <td className="py-3 px-4"><StatusBadge label={s.status.toUpperCase()} variant={s.status === "active" ? "active" : "online"} pulse={s.status === "active"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
