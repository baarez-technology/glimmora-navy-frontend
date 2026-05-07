"use client";

import { motion } from "framer-motion";
import { FileText, Download, CheckCircle, AlertTriangle, BrainCircuit, Target, Clock, Pen } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { useParams } from "next/navigation";

const keyDecisions = [
  { time: "14:43", decision: "Altered course to port on detecting crossing contact", assessment: "Correct application of Rule 15", correct: true },
  { time: "14:38", decision: "Maintained speed through reduced visibility zone", assessment: "Should have reduced speed per Rule 6 - Safe Speed", correct: false },
  { time: "14:35", decision: "Completed watch handover checklist", assessment: "All items addressed, clear and concise", correct: true },
];

const competencyImpact = [
  { skill: "COLREGS Application", before: 78, after: 82 },
  { skill: "Situational Awareness", before: 80, after: 83 },
  { skill: "Bridge Team Communication", before: 75, after: 77 },
  { skill: "Safe Speed Judgment", before: 72, after: 70 },
];

export default function DebriefPage() {
  const params = useParams();

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-cyan flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">After-Action Review</h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">Session {params.id} &bull; AI-Generated Debrief</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AegisButton variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>Export PDF</AegisButton>
          <AegisButton size="sm" icon={<Pen className="w-4 h-4" />}>Sign Off</AegisButton>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-4 h-4 text-aegis-purple" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">Performance Summary</h3>
            <StatusBadge label="AI Generated" variant="active" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {[
              { label: "Overall Score", value: "87/100", color: "text-aegis-cyan" },
              { label: "Duration", value: "47 min", color: "text-aegis-cloud" },
              { label: "Errors Detected", value: "2", color: "text-aegis-amber" },
              { label: "AI Interventions", value: "4", color: "text-aegis-purple" },
            ].map((m) => (
              <div key={m.label}>
                <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">{m.label}</p>
                <p className={`font-mono text-2xl font-bold mt-1 ${m.color}`}>{m.value}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <p className="text-sm text-aegis-cloud leading-relaxed">
              LT Kumar demonstrated strong COLREGS knowledge during the Strait Transit scenario with dense traffic.
              Correct identification and response to crossing situations. However, speed management in reduced visibility
              conditions needs improvement. Watch handover procedures were executed cleanly. Recommend targeted
              remediation on Rule 6 (Safe Speed) with degraded visibility scenarios.
            </p>
            <p className="text-[9px] font-mono text-aegis-slate mt-3">
              Source: Approved Doctrine -- COLREGS 1972, Naval Bridge Procedures Manual Ch.4
            </p>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Key Decisions */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">Key Decision Analysis</h3>
          <div className="space-y-4">
            {keyDecisions.map((d, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${d.correct ? "bg-aegis-green/15" : "bg-aegis-amber/15"}`}>
                  {d.correct ? <CheckCircle className="w-4 h-4 text-aegis-green" /> : <AlertTriangle className="w-4 h-4 text-aegis-amber" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-mono text-aegis-slate">{d.time}</span>
                    <StatusBadge label={d.correct ? "CORRECT" : "NEEDS IMPROVEMENT"} variant={d.correct ? "online" : "warning"} />
                  </div>
                  <p className="text-sm font-semibold text-aegis-cloud">{d.decision}</p>
                  <p className="text-xs text-aegis-mist mt-1">{d.assessment}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>

      {/* Competency Impact */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">Competency Impact</h3>
          <div className="space-y-4">
            {competencyImpact.map((c) => {
              const diff = c.after - c.before;
              const isPositive = diff >= 0;
              return (
                <div key={c.skill}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-heading text-aegis-cloud">{c.skill}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-aegis-slate">{c.before}%</span>
                      <span className="text-xs text-aegis-mist">&rarr;</span>
                      <span className={`text-xs font-mono font-bold ${isPositive ? "text-aegis-green" : "text-aegis-red"}`}>{c.after}%</span>
                      <span className={`text-[10px] font-mono ${isPositive ? "text-aegis-green" : "text-aegis-red"}`}>({isPositive ? "+" : ""}{diff})</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.after}%` }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${isPositive ? "bg-gradient-to-r from-aegis-cyan to-aegis-green" : "bg-gradient-to-r from-aegis-amber to-aegis-red"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
