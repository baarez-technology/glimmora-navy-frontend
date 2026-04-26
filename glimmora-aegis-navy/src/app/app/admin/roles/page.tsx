"use client";

import { motion } from "framer-motion";
import { Lock, Plus, Edit, Users, Shield, Eye, Pen, CheckCircle } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const roles = [
  { name: "Trainee", users: 486, permissions: ["View training modules", "Execute sessions", "View own scores"], clearance: "RESTRICTED" },
  { name: "Instructor", users: 48, permissions: ["All trainee + author scenarios", "Manage sessions", "AI governance", "Debrief generation"], clearance: "CONFIDENTIAL" },
  { name: "Evaluator", users: 24, permissions: ["All instructor + certification authority", "Assessment grading", "Pass/fail decisions"], clearance: "CONFIDENTIAL" },
  { name: "Doctrine Manager", users: 8, permissions: ["Content ingestion", "Doctrine approval", "Source management"], clearance: "SECRET" },
  { name: "Fleet Training Command", users: 6, permissions: ["Enterprise dashboards", "Cross-base reporting", "Strategic planning"], clearance: "SECRET" },
  { name: "Admin", users: 12, permissions: ["Full system access", "RBAC config", "Audit logs", "Security controls"], clearance: "SECRET" },
  { name: "System Maintainer", users: 4, permissions: ["Deployment management", "Patching", "Model versioning", "Infrastructure"], clearance: "SECRET" },
];

const permissionMatrix = ["Training Modules", "Sessions", "AI Instructor", "Digital Twin", "Scenarios", "Analytics", "Certification", "Fleet", "Admin", "Audit"];

export default function RolesPage() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <Lock className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Role-Based Access Control</h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">Configure Roles, Permissions & Clearance Levels</p>
          </div>
        </div>
        <AegisButton size="sm" icon={<Plus className="w-4 h-4" />}>Create Role</AegisButton>
      </motion.div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <motion.div key={role.name} variants={fadeInUp}>
            <GlassPanel className="hover:border-aegis-cyan/15 transition-all" animated={false}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base font-bold text-aegis-white tracking-wide">{role.name}</h3>
                <button className="p-1.5 rounded-lg hover:bg-white/[0.04] text-aegis-mist cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5"><Users className="w-3 h-3 text-aegis-slate" /><span className="text-xs font-mono text-aegis-mist">{role.users} users</span></div>
                <StatusBadge label={role.clearance} variant="warning" />
              </div>
              <div className="space-y-1.5">
                {role.permissions.map((p) => (
                  <div key={p} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-aegis-green shrink-0" />
                    <span className="text-[11px] text-aegis-mist">{p}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {/* Permission Matrix */}
      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">Permission Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 px-3 text-[10px] font-heading font-bold text-aegis-slate tracking-wider uppercase">Module</th>
                  {roles.map((r) => (<th key={r.name} className="py-2 px-3 text-[10px] font-heading font-bold text-aegis-slate tracking-wider uppercase text-center">{r.name}</th>))}
                </tr>
              </thead>
              <tbody>
                {permissionMatrix.map((module) => (
                  <tr key={module} className="border-b border-white/[0.03]">
                    <td className="py-2 px-3 text-xs text-aegis-cloud">{module}</td>
                    {roles.map((r) => (
                      <td key={r.name} className="py-2 px-3 text-center">
                        {r.name === "Admin" || r.name === "System Maintainer" ? (
                          <Pen className="w-3 h-3 text-aegis-green mx-auto" />
                        ) : r.name === "Trainee" && ["Admin", "Audit", "Fleet"].includes(module) ? (
                          <span className="text-aegis-gunmetal">--</span>
                        ) : (
                          <Eye className="w-3 h-3 text-aegis-cyan mx-auto" />
                        )}
                      </td>
                    ))}
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
