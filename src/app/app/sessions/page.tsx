"use client";

import { motion } from "framer-motion";
import { Play, Clock, CheckCircle, AlertTriangle, Filter, Plus, Calendar, List } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { MetricCard } from "@/components/ui/metric-card";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";

const sessions = [
  { id: "BRM-047", trainee: "LT J. Kumar", domain: "Bridge Navigation", scenario: "Strait Transit - Dense Traffic", status: "active" as const, score: "--", duration: "47m", instructor: "CDR A. Sharma", date: "2024-10-21 14:00" },
  { id: "CIC-012", trainee: "SLT R. Patel", domain: "CIC Warfare - AAW", scenario: "Multi-Axis Threat", status: "active" as const, score: "--", duration: "23m", instructor: "CDR A. Sharma", date: "2024-10-21 14:10" },
  { id: "ENG-089", trainee: "CPO M. Singh", domain: "Engineering", scenario: "GT Fault Isolation", status: "completed" as const, score: "94", duration: "52m", instructor: "LT CDR B. Rao", date: "2024-10-21 13:00" },
  { id: "DC-034", trainee: "LT A. Desai", domain: "Damage Control", scenario: "Progressive Flooding", status: "remediation" as const, score: "68", duration: "28m", instructor: "CDR A. Sharma", date: "2024-10-21 12:30" },
  { id: "UAV-007", trainee: "SLT K. Nair", domain: "Unmanned Systems", scenario: "USV Patrol Mission", status: "completed" as const, score: "91", duration: "41m", instructor: "LT CDR P. Das", date: "2024-10-21 11:00" },
  { id: "BRM-046", trainee: "LT S. Reddy", domain: "Bridge Navigation", scenario: "COLREGS - Head On", status: "completed" as const, score: "85", duration: "35m", instructor: "CDR A. Sharma", date: "2024-10-20 16:00" },
  { id: "WAR-018", trainee: "SLT V. Menon", domain: "CIC Warfare - ASW", scenario: "Submarine Hunt", status: "completed" as const, score: "73", duration: "60m", instructor: "CDR R. Iyer", date: "2024-10-20 14:00" },
  { id: "DC-033", trainee: "CPO T. Khan", domain: "Damage Control", scenario: "Engine Room Fire", status: "scheduled" as const, score: "--", duration: "--", instructor: "CDR A. Sharma", date: "2024-10-22 09:00" },
];

const statusStyles: Record<string, { variant: "active" | "online" | "warning" | "neutral"; label: string }> = {
  active: { variant: "active", label: "ACTIVE" },
  completed: { variant: "online", label: "COMPLETED" },
  remediation: { variant: "warning", label: "REMEDIATION" },
  scheduled: { variant: "neutral", label: "SCHEDULED" },
};

export default function SessionsPage() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Training Sessions</h1>
          <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">Manage, Monitor & Review All Training Activities</p>
        </div>
        <div className="flex items-center gap-3">
          <AegisButton variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>Filters</AegisButton>
          <div className="flex items-center glass rounded-lg p-0.5">
            <button className="p-2 rounded-md bg-aegis-cyan/15 text-aegis-cyan cursor-pointer"><List className="w-4 h-4" /></button>
            <button className="p-2 rounded-md text-aegis-mist hover:text-aegis-cloud cursor-pointer"><Calendar className="w-4 h-4" /></button>
          </div>
          <Link href="/app/sessions/new">
            <AegisButton size="sm" icon={<Plus className="w-4 h-4" />}>New Session</AegisButton>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Active Now" value="2" icon={Play} accentColor="text-aegis-green" />
        <MetricCard title="Completed Today" value="5" icon={CheckCircle} accentColor="text-aegis-cyan" />
        <MetricCard title="Avg Duration" value="41m" icon={Clock} />
        <MetricCard title="Requiring Remediation" value="1" icon={AlertTriangle} accentColor="text-aegis-amber" />
      </div>

      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Session", "Trainee", "Domain / Scenario", "Instructor", "Duration", "Score", "Status", ""].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-xs font-mono font-bold text-aegis-cyan">{s.id}</td>
                    <td className="py-3 px-4 text-sm text-aegis-cloud">{s.trainee}</td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-aegis-cloud">{s.domain}</p>
                      <p className="text-[10px] text-aegis-slate">{s.scenario}</p>
                    </td>
                    <td className="py-3 px-4 text-xs text-aegis-mist">{s.instructor}</td>
                    <td className="py-3 px-4 text-xs font-mono text-aegis-mist">{s.duration}</td>
                    <td className="py-3 px-4 text-sm font-mono font-bold text-aegis-cyan">{s.score}</td>
                    <td className="py-3 px-4"><StatusBadge label={statusStyles[s.status].label} variant={statusStyles[s.status].variant} pulse={s.status === "active"} /></td>
                    <td className="py-3 px-4">
                      <Link href={`/app/sessions/${s.id}`} className="text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors">
                        View &rarr;
                      </Link>
                    </td>
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
