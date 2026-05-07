"use client";

import { motion } from "framer-motion";
import {
  Users,
  Play,
  Target,
  Ship,
  BrainCircuit,
  Sparkles,
  Clock,
  AlertTriangle,
  Activity,
  ChevronRight,
  Plus,
  Compass,
  Crosshair,
  Wrench,
  Flame,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { RadarDisplay } from "@/components/ui/radar-display";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";

const myTrainees = [
  { name: "LT J. Kumar", domain: "Bridge Nav", lastScore: 87, status: "active", trend: "+3%" },
  { name: "SLT R. Patel", domain: "CIC Warfare", lastScore: 72, status: "remediation", trend: "-1%" },
  { name: "LT A. Desai", domain: "Damage Control", lastScore: 68, status: "remediation", trend: "+4%" },
  { name: "SLT K. Nair", domain: "Unmanned", lastScore: 91, status: "on-track", trend: "+6%" },
  { name: "CPO T. Khan", domain: "Engineering", lastScore: 85, status: "on-track", trend: "+2%" },
];

const activeSessions = [
  { id: "BRM-047", trainee: "LT J. Kumar", domain: "Bridge Navigation", aiMode: "Guided Questioning", duration: "47m" },
  { id: "CIC-012", trainee: "SLT R. Patel", domain: "CIC Warfare - AAW", aiMode: "Hinting", duration: "23m" },
];

const aiAlerts = [
  { type: "warning", text: "SLT Patel -- repeated track misclassification in cluttered environment", action: "View Session" },
  { type: "info", text: "LT Kumar ready for advanced COLREGS with degraded visibility", action: "Generate Scenario" },
  { type: "success", text: "CPO Khan -- Engineering fault isolation score exceeds benchmark", action: "Approve Certification" },
];

const pendingApprovals = [
  { type: "Scenario", item: "SCN-2024-150: Multi-Hit DC Swarm Attack", status: "Pending Review" },
  { type: "Certification", item: "CPO M. Singh -- Eng Fault Isolation", status: "Ready for Sign-off" },
  { type: "Remediation", item: "SLT Patel -- CIC Track Classification Plan", status: "AI Generated" },
];

const alertColors: Record<string, string> = { warning: "text-aegis-amber", info: "text-aegis-purple", success: "text-aegis-green" };
const alertIcons: Record<string, typeof AlertTriangle> = { warning: AlertTriangle, info: BrainCircuit, success: Target };

export default function InstructorDashboard() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
            Instructor Command Center
          </h1>
          <p className="font-heading text-sm text-aegis-mist tracking-wider mt-1">
            CDR Arjun Sharma &bull; INS Dronacharya &bull; 24 Trainees Assigned
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/app/scenario-engine">
            <AegisButton variant="secondary" size="sm" icon={<Sparkles className="w-4 h-4" />}>New Scenario</AegisButton>
          </Link>
          <Link href="/app/sessions/new">
            <AegisButton size="sm" icon={<Plus className="w-4 h-4" />}>Launch Session</AegisButton>
          </Link>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="My Trainees" value="24" subtitle="5 in active session" icon={Users} />
        <MetricCard title="Active Sessions" value="2" subtitle="AI monitoring both" icon={Play} accentColor="text-aegis-green" />
        <MetricCard title="Avg Trainee Score" value="78%" trend={{ value: 2.1, direction: "up" }} icon={Target} accentColor="text-aegis-cyan" />
        <MetricCard title="Pending Approvals" value="3" subtitle="Scenario, cert, remediation" icon={Clock} accentColor="text-aegis-amber" />
      </div>

      {/* Active Sessions + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Active Sessions */}
        <GlassPanel className="lg:col-span-3">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Live Sessions I&apos;m Supervising
            </h3>
            <StatusBadge label="2 ACTIVE" variant="active" pulse />
          </div>
          <div className="space-y-4">
            {activeSessions.map((s) => (
              <Link key={s.id} href={`/app/sessions/${s.id}`}>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-aegis-cyan/15 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-aegis-green/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-aegis-green" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-aegis-cyan">{s.id}</span>
                        <StatusBadge label="LIVE" variant="active" pulse />
                      </div>
                      <p className="text-sm text-aegis-cloud mt-0.5">{s.trainee} &bull; {s.domain}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-aegis-purple font-heading">{s.aiMode}</p>
                    <p className="text-[10px] font-mono text-aegis-slate mt-0.5">{s.duration}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/app/sessions" className="block mt-4">
            <AegisButton variant="ghost" size="sm" className="w-full">View All Sessions</AegisButton>
          </Link>
        </GlassPanel>

        {/* Radar */}
        <GlassPanel className="lg:col-span-2 flex flex-col items-center justify-center">
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4 self-start">
            Training Activity
          </h3>
          <RadarDisplay size={200} />
        </GlassPanel>
      </div>

      {/* My Trainees + AI Alerts + Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Trainees */}
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">My Trainees</h3>
            <Link href="/app/trainees" className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1">
              All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {myTrainees.map((t) => (
              <div key={t.name} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer">
                <div>
                  <p className="text-xs font-semibold text-aegis-cloud">{t.name}</p>
                  <p className="text-[10px] text-aegis-slate">{t.domain}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono ${t.trend.startsWith("+") ? "text-aegis-green" : "text-aegis-red"}`}>{t.trend}</span>
                  <span className="text-sm font-mono font-bold text-aegis-cyan">{t.lastScore}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* AI Alerts */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-5">
            <BrainCircuit className="w-4 h-4 text-aegis-purple" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">AI Instructor Alerts</h3>
          </div>
          <div className="space-y-3">
            {aiAlerts.map((alert, i) => {
              const Icon = alertIcons[alert.type];
              return (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-start gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${alertColors[alert.type]}`} />
                    <div>
                      <p className="text-xs text-aegis-cloud leading-relaxed">{alert.text}</p>
                      <button className="text-[10px] font-heading text-aegis-cyan mt-1.5 cursor-pointer tracking-wider uppercase">
                        {alert.action} &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {/* Pending Approvals */}
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Pending Approvals
          </h3>
          <div className="space-y-3">
            {pendingApprovals.map((p, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge label={p.type.toUpperCase()} variant="active" />
                  <StatusBadge label={p.status.toUpperCase()} variant="warning" />
                </div>
                <p className="text-xs text-aegis-cloud">{p.item}</p>
              </div>
            ))}
          </div>
          <Link href="/app/scenario-engine" className="block mt-4">
            <AegisButton variant="ghost" size="sm" className="w-full">Review All</AegisButton>
          </Link>
        </GlassPanel>
      </div>
    </motion.div>
  );
}
