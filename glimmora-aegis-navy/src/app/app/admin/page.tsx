"use client";

import { motion } from "framer-motion";
import { Shield, Users, FileText, Lock, Database, Settings, ChevronRight } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MetricCard } from "@/components/ui/metric-card";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";

const adminModules = [
  { icon: Lock, label: "Role-Based Access Control", href: "/app/admin/roles", desc: "Configure roles, permissions, and access policies", count: "14 roles" },
  { icon: Shield, label: "Security & Governance", href: "/app/admin/security", desc: "Air-gapped deployment, sovereignty controls", count: "0 violations" },
  { icon: FileText, label: "Audit Logs", href: "/app/admin/audit", desc: "Tamper-evident logging, compliance reports", count: "4,892 events" },
  { icon: Database, label: "Content Ingestion", href: "/app/admin/content", desc: "Doctrine, manuals, and training material pipeline", count: "1,247 sources" },
];

export default function AdminPage() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp}>
        <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Administration</h1>
        <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">System Configuration, Security & Governance</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Active Users" value="684" icon={Users} />
        <MetricCard title="Roles Configured" value="14" icon={Lock} accentColor="text-aegis-gold" />
        <MetricCard title="Audit Events (24h)" value="4,892" icon={FileText} accentColor="text-aegis-purple" />
        <MetricCard title="Policy Violations" value="0" icon={Shield} accentColor="text-aegis-green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminModules.map((mod) => (
          <motion.div key={mod.label} variants={fadeInUp}>
            <Link href={mod.href}>
              <GlassPanel className="hover:border-aegis-cyan/15 transition-all cursor-pointer group" animated={false}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aegis-gold/20 to-aegis-amber/10 border border-aegis-gold/20 flex items-center justify-center shrink-0">
                      <mod.icon className="w-5 h-5 text-aegis-gold" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold text-aegis-white tracking-wide mb-1">{mod.label}</h3>
                      <p className="text-xs text-aegis-mist">{mod.desc}</p>
                      <p className="text-[10px] font-mono text-aegis-slate mt-2">{mod.count}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-aegis-gunmetal group-hover:text-aegis-cyan transition-colors" />
                </div>
              </GlassPanel>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
