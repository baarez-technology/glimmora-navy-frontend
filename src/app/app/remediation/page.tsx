"use client";

import { motion } from "framer-motion";
import { Target, Plus, CheckCircle, Clock, AlertTriangle, ChevronRight } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { MetricCard } from "@/components/ui/metric-card";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const plans = [
  { trainee: "SLT R. Patel", weakness: "CIC Track Classification (Cluttered Env.)", exercises: 4, completed: 1, status: "active", priority: "high" },
  { trainee: "LT A. Desai", weakness: "DC Boundary Control Procedures", exercises: 3, completed: 0, status: "active", priority: "high" },
  { trainee: "LT J. Kumar", weakness: "Safe Speed Judgment (Reduced Vis)", exercises: 2, completed: 0, status: "new", priority: "medium" },
  { trainee: "SLT V. Menon", weakness: "ASW Target Motion Analysis", exercises: 5, completed: 3, status: "active", priority: "medium" },
  { trainee: "CPO T. Khan", weakness: "Engine Room Fire -- Initial Response", exercises: 3, completed: 3, status: "completed", priority: "low" },
];

export default function RemediationPage() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-amber to-aegis-orange flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Targeted Remediation Plans</h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">AI-Recommended & Instructor-Assigned Training Interventions</p>
          </div>
        </div>
        <AegisButton size="sm" icon={<Plus className="w-4 h-4" />}>Create Plan</AegisButton>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Active Plans" value="4" icon={Target} accentColor="text-aegis-amber" />
        <MetricCard title="Exercises Pending" value="11" icon={Clock} />
        <MetricCard title="Completed This Month" value="7" icon={CheckCircle} accentColor="text-aegis-green" />
        <MetricCard title="AI Recommended" value="3" icon={AlertTriangle} accentColor="text-aegis-purple" />
      </div>

      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.trainee + plan.weakness} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${plan.priority === "high" ? "bg-aegis-red/15" : plan.priority === "medium" ? "bg-aegis-amber/15" : "bg-aegis-green/15"}`}>
                    <Target className={`w-5 h-5 ${plan.priority === "high" ? "text-aegis-red" : plan.priority === "medium" ? "text-aegis-amber" : "text-aegis-green"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-aegis-cloud">{plan.trainee}</p>
                    <p className="text-xs text-aegis-mist mt-0.5">{plan.weakness}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-mono text-aegis-slate">{plan.completed}/{plan.exercises} exercises</span>
                      <div className="w-24 h-1.5 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-green" style={{ width: `${(plan.completed / plan.exercises) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge label={plan.status.toUpperCase()} variant={plan.status === "completed" ? "online" : plan.status === "active" ? "active" : "warning"} />
                  <ChevronRight className="w-4 h-4 text-aegis-gunmetal" />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
