"use client";

import { motion } from "framer-motion";
import { ClipboardCheck, Clock, CheckCircle, AlertTriangle, ChevronRight } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricCard } from "@/components/ui/metric-card";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";

const assessmentQueue = [
  { id: "EVAL-047", trainee: "LT J. Kumar", domain: "Bridge OOW Certification", type: "Final Assessment", dueDate: "Oct 25", status: "pending" },
  { id: "EVAL-048", trainee: "SLT R. Patel", domain: "CIC Warfare Qualification", type: "Progress Review", dueDate: "Oct 23", status: "pending" },
  { id: "EVAL-045", trainee: "CPO M. Singh", domain: "Engineering Fault Isolation", type: "Certification Assessment", dueDate: "Oct 20", status: "completed" },
  { id: "EVAL-044", trainee: "LT A. Desai", domain: "DC Leader Qualification", type: "Remediation Review", dueDate: "Oct 22", status: "pending" },
];

export default function EvaluatorPage() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Evaluator Dashboard</h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">Assessment Queue, Grading & Certification Authority</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Pending Reviews" value="3" icon={Clock} accentColor="text-aegis-amber" />
        <MetricCard title="Completed This Month" value="18" icon={CheckCircle} accentColor="text-aegis-green" />
        <MetricCard title="Pass Rate" value="87%" icon={ClipboardCheck} />
        <MetricCard title="Overdue" value="0" icon={AlertTriangle} accentColor="text-aegis-red" />
      </div>

      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">Assessment Queue</h3>
            <Link href="/app/evaluator/assessments" className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1 cursor-pointer">
              All Assessments <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {assessmentQueue.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                    <ClipboardCheck className="w-5 h-5 text-aegis-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-aegis-cloud">{a.trainee}</p>
                    <p className="text-xs text-aegis-mist mt-0.5">{a.domain} &bull; {a.type}</p>
                    <p className="text-[10px] font-mono text-aegis-slate mt-1">Due: {a.dueDate}</p>
                  </div>
                </div>
                <StatusBadge label={a.status === "completed" ? "GRADED" : "PENDING"} variant={a.status === "completed" ? "online" : "warning"} />
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
