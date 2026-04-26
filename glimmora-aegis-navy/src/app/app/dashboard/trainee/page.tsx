"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Play,
  Target,
  Award,
  Clock,
  BookOpen,
  ChevronRight,
  Compass,
  Crosshair,
  Wrench,
  Flame,
  Anchor,
  Bot,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";

const myCompetencies = [
  { icon: Compass, domain: "Bridge & Navigation", score: 82, status: "On Track" },
  { icon: Crosshair, domain: "CIC & Warfare", score: 74, status: "Needs Focus" },
  { icon: Wrench, domain: "Engineering", score: 68, status: "Remediation" },
  { icon: Flame, domain: "Damage Control", score: 71, status: "Needs Focus" },
  { icon: Anchor, domain: "Small Boats", score: 86, status: "On Track" },
  { icon: Bot, domain: "Unmanned Systems", score: 90, status: "Excellent" },
];

const upcomingSessions = [
  { id: "BRM-048", domain: "Bridge Navigation", scenario: "COLREGS -- Crossing", time: "Today 15:00", type: "Scheduled" },
  { id: "DC-035", domain: "Damage Control", scenario: "Engine Room Fire", time: "Tomorrow 09:00", type: "Remediation" },
  { id: "CIC-014", domain: "CIC Warfare", scenario: "Multi-Axis Threat AAW", time: "Oct 24, 14:00", type: "Scheduled" },
];

const recentScores = [
  { id: "BRM-047", domain: "Bridge Nav", score: 87, date: "Today", trend: "up" as const },
  { id: "CIC-012", domain: "CIC Warfare", score: 72, date: "Oct 19", trend: "down" as const },
  { id: "ENG-034", domain: "Engineering", score: 68, date: "Oct 17", trend: "down" as const },
  { id: "UAV-003", domain: "Unmanned", score: 91, date: "Oct 15", trend: "up" as const },
  { id: "BRM-045", domain: "Bridge Nav", score: 79, date: "Oct 12", trend: "up" as const },
];

const learningPath = [
  { milestone: "Bridge OOW Certification", progress: 75, total: 12, completed: 9 },
  { milestone: "CIC Warfare Officer", progress: 40, total: 10, completed: 4 },
  { milestone: "DC Leader Qualification", progress: 20, total: 8, completed: 2 },
];

const aiRecommendations = [
  { text: "Practice Rule 6 (Safe Speed) scenarios in reduced visibility", domain: "Bridge", priority: "high" },
  { text: "Review ASW target motion analysis before next CIC session", domain: "CIC", priority: "medium" },
  { text: "Complete Engineering fault isolation remediation exercise", domain: "Engineering", priority: "high" },
];

export default function TraineeDashboard() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
            My Training Dashboard
          </h1>
          <p className="font-heading text-sm text-aegis-mist tracking-wider mt-1">
            Welcome back, LT Jayesh Kumar &bull; Cohort 2024-B &bull; INS Vikrant
          </p>
        </div>
        <Link href="/app/sessions/new">
          <AegisButton size="sm" icon={<Play className="w-4 h-4" />}>Start Training</AegisButton>
        </Link>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Overall Score" value="78%" trend={{ value: 2.1, direction: "up" }} icon={Target} />
        <MetricCard title="Sessions Completed" value="40" subtitle="This month: 8" icon={Play} accentColor="text-aegis-green" />
        <MetricCard title="Certifications" value="2 / 6" subtitle="1 in progress" icon={Award} accentColor="text-aegis-gold" />
        <MetricCard title="Next Session" value="15:00" subtitle="Bridge Nav -- COLREGS" icon={Clock} accentColor="text-aegis-purple" />
      </div>

      {/* Competency Overview + Upcoming Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Competencies */}
        <GlassPanel className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              My Competency Scores
            </h3>
            <Link href="/app/profile" className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1 cursor-pointer">
              Full Profile <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCompetencies.map((c) => {
              const color = c.score >= 85 ? "text-aegis-green" : c.score >= 75 ? "text-aegis-cyan" : "text-aegis-amber";
              const barColor = c.score >= 85 ? "from-aegis-green to-aegis-cyan" : c.score >= 75 ? "from-aegis-cyan to-aegis-blue" : "from-aegis-amber to-aegis-orange";
              return (
                <div key={c.domain} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                    <c.icon className="w-4 h-4 text-aegis-cyan" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-heading font-semibold text-aegis-cloud truncate">{c.domain}</span>
                      <span className={`text-sm font-mono font-bold ${color}`}>{c.score}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.score}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {/* Upcoming Sessions */}
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Upcoming Sessions
          </h3>
          <div className="space-y-3">
            {upcomingSessions.map((s) => (
              <div key={s.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-aegis-slate">{s.id}</span>
                  <StatusBadge
                    label={s.type === "Remediation" ? "REMEDIATION" : "SCHEDULED"}
                    variant={s.type === "Remediation" ? "warning" : "neutral"}
                  />
                </div>
                <p className="text-sm font-semibold text-aegis-cloud">{s.domain}</p>
                <p className="text-[10px] text-aegis-mist mt-0.5">{s.scenario}</p>
                <div className="flex items-center gap-1.5 mt-2 text-aegis-cyan">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-mono">{s.time}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/app/sessions" className="block mt-4">
            <AegisButton variant="ghost" size="sm" className="w-full">View All Sessions</AegisButton>
          </Link>
        </GlassPanel>
      </div>

      {/* Learning Path + AI Recommendations + Recent Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Path */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-4 h-4 text-aegis-gold" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              My Learning Path
            </h3>
          </div>
          <div className="space-y-4">
            {learningPath.map((lp) => (
              <div key={lp.milestone}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-heading font-semibold text-aegis-cloud">{lp.milestone}</span>
                  <span className="text-[10px] font-mono text-aegis-mist">{lp.completed}/{lp.total}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lp.progress}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-aegis-gold to-aegis-amber"
                  />
                </div>
                <span className="text-[10px] font-mono text-aegis-slate">{lp.progress}% complete</span>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* AI Recommendations */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-5">
            <BrainCircuit className="w-4 h-4 text-aegis-purple" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              AI Recommendations
            </h3>
          </div>
          <div className="space-y-3">
            {aiRecommendations.map((rec, i) => (
              <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2 mb-1.5">
                  <StatusBadge label={rec.domain} variant="active" />
                  <StatusBadge
                    label={rec.priority.toUpperCase()}
                    variant={rec.priority === "high" ? "alert" : "warning"}
                  />
                </div>
                <p className="text-xs text-aegis-cloud leading-relaxed">{rec.text}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Recent Scores */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Recent Scores
            </h3>
          </div>
          <div className="space-y-3">
            {recentScores.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-xs font-semibold text-aegis-cloud">{s.domain}</p>
                  <p className="text-[10px] font-mono text-aegis-slate">{s.id} &bull; {s.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-aegis-cyan">{s.score}</span>
                  <TrendingUp className={`w-3 h-3 ${s.trend === "up" ? "text-aegis-green" : "text-aegis-red rotate-180"}`} />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </motion.div>
  );
}
