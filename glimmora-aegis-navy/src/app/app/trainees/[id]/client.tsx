"use client";

import { motion } from "framer-motion";
import { User, Target, Award, Clock, Activity, ChevronRight, FileText } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const competencies = [
  { domain: "Bridge Navigation", score: 82, sessions: 14, trend: "+3%" },
  { domain: "CIC Warfare", score: 74, sessions: 8, trend: "+2%" },
  { domain: "Engineering", score: 68, sessions: 5, trend: "-1%" },
  { domain: "Damage Control", score: 71, sessions: 6, trend: "+4%" },
  { domain: "Small Boats", score: 86, sessions: 3, trend: "+5%" },
  { domain: "Unmanned Systems", score: 90, sessions: 4, trend: "+6%" },
];

const sessionHistory = [
  { id: "BRM-047", domain: "Bridge Nav", score: 87, date: "Oct 21", status: "completed" },
  { id: "CIC-012", domain: "CIC Warfare", score: 72, date: "Oct 19", status: "remediation" },
  { id: "BRM-045", domain: "Bridge Nav", score: 79, date: "Oct 17", status: "completed" },
  { id: "ENG-034", domain: "Engineering", score: 68, date: "Oct 15", status: "completed" },
  { id: "UAV-003", domain: "Unmanned", score: 91, date: "Oct 12", status: "completed" },
];

export default function TraineeDetailPage() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">LT Jayesh Kumar</h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">INS Vikrant &bull; Bridge Watchkeeper &bull; Cohort 2024-B</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AegisButton variant="secondary" size="sm" icon={<FileText className="w-4 h-4" />}>Generate Report</AegisButton>
          <AegisButton size="sm" icon={<Target className="w-4 h-4" />}>Create Remediation Plan</AegisButton>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Overall Score", value: "78%", color: "text-aegis-cyan" },
          { label: "Total Sessions", value: "40", color: "text-aegis-cloud" },
          { label: "Certifications", value: "2/6", color: "text-aegis-gold" },
          { label: "Remediation Plans", value: "1 Active", color: "text-aegis-amber" },
        ].map((s) => (
          <GlassPanel key={s.label} className="p-4 text-center" animated={false}>
            <p className={`font-mono text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">{s.label}</p>
          </GlassPanel>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competency Radar */}
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">Cross-Domain Competency</h3>
            <div className="space-y-4">
              {competencies.map((c) => (
                <div key={c.domain}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-heading text-aegis-cloud">{c.domain}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono ${c.trend.startsWith("+") ? "text-aegis-green" : "text-aegis-red"}`}>{c.trend}</span>
                      <span className="text-sm font-mono font-bold text-aegis-cyan">{c.score}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.score}%` }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${c.score >= 80 ? "bg-gradient-to-r from-aegis-green to-aegis-cyan" : c.score >= 70 ? "bg-gradient-to-r from-aegis-cyan to-aegis-blue" : "bg-gradient-to-r from-aegis-amber to-aegis-orange"}`}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-aegis-slate">{c.sessions} sessions</span>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Session History */}
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">Session History</h3>
              <button className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1 cursor-pointer">All Sessions <ChevronRight className="w-3 h-3" /></button>
            </div>
            <div className="space-y-3">
              {sessionHistory.map((s) => (
                <div key={s.id} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-aegis-cyan" />
                    <div>
                      <p className="text-sm text-aegis-cloud font-medium">{s.domain}</p>
                      <p className="text-[10px] font-mono text-aegis-slate">{s.id} &bull; {s.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-bold text-aegis-cyan">{s.score}</span>
                    <StatusBadge label={s.status === "completed" ? "PASS" : "REMEDIATION"} variant={s.status === "completed" ? "online" : "warning"} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </motion.div>
  );
}
