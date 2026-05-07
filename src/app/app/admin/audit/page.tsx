"use client";

import { motion } from "framer-motion";
import { FileText, Filter, Download, Shield, User, Clock, AlertTriangle } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { MetricCard } from "@/components/ui/metric-card";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const auditEvents = [
  { time: "14:47:12", user: "CDR A. Sharma", action: "Started training session BRM-047", module: "Sessions", severity: "info" },
  { time: "14:45:03", user: "SYSTEM", action: "AI Instructor intervention -- hint issued", module: "AI Instructor", severity: "info" },
  { time: "14:30:18", user: "LT CDR B. Rao", action: "Approved scenario SCN-2024-149", module: "Scenario Engine", severity: "info" },
  { time: "14:15:44", user: "ADMIN", action: "Updated RBAC -- Evaluator role permissions modified", module: "Admin", severity: "warning" },
  { time: "13:55:22", user: "SYSTEM", action: "Cognitive twin model v2.4.1 deployed", module: "Digital Twin", severity: "info" },
  { time: "13:40:10", user: "CPO M. Singh", action: "Completed certification assessment ENG-FAULT-ISOL", module: "Certification", severity: "info" },
  { time: "12:20:05", user: "SYSTEM", action: "Content ingestion -- 3 new doctrine documents validated", module: "Content", severity: "info" },
  { time: "11:08:33", user: "CDR R. Iyer", action: "Rejected scenario SCN-2024-151 -- doctrine boundary issue", module: "Scenario Engine", severity: "warning" },
];

const severityBadge: Record<string, "neutral" | "warning" | "alert"> = { info: "neutral", warning: "warning", critical: "alert" };

export default function AuditPage() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-blue flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Audit Logs & Compliance</h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">Tamper-Evident Logging &bull; Full Traceability</p>
          </div>
        </div>
        <div className="flex gap-3">
          <AegisButton variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>Filter</AegisButton>
          <AegisButton variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>Export</AegisButton>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Events (24h)" value="4,892" icon={FileText} />
        <MetricCard title="Unique Users" value="127" icon={User} accentColor="text-aegis-cyan" />
        <MetricCard title="Policy Violations" value="0" icon={Shield} accentColor="text-aegis-green" />
        <MetricCard title="Warnings" value="3" icon={AlertTriangle} accentColor="text-aegis-amber" />
      </div>

      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Timestamp", "User", "Action", "Module", "Severity"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditEvents.map((evt, i) => (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-xs font-mono text-aegis-slate flex items-center gap-1.5"><Clock className="w-3 h-3" />{evt.time}</td>
                    <td className="py-3 px-4 text-sm text-aegis-cloud">{evt.user}</td>
                    <td className="py-3 px-4 text-xs text-aegis-mist">{evt.action}</td>
                    <td className="py-3 px-4 text-xs font-mono text-aegis-slate">{evt.module}</td>
                    <td className="py-3 px-4"><StatusBadge label={evt.severity.toUpperCase()} variant={severityBadge[evt.severity] || "neutral"} /></td>
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
