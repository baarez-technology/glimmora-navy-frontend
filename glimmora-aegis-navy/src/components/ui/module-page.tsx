"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ModulePageProps {
  icon: LucideIcon;
  iconGradient: string;
  title: string;
  subtitle: string;
  capabilities: string[];
  metrics: { label: string; value: string }[];
  children?: ReactNode;
}

export function ModulePage({
  icon: Icon,
  iconGradient,
  title,
  subtitle,
  capabilities,
  metrics,
  children,
}: ModulePageProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              {title}
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
        <StatusBadge label="Module Active" variant="active" pulse />
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <GlassPanel key={m.label} className="p-4 text-center" animated={false}>
              <p className="font-mono text-2xl font-bold text-aegis-cyan">{m.value}</p>
              <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
                {m.label}
              </p>
            </GlassPanel>
          ))}
        </div>
      </motion.div>

      {/* Capabilities */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Training Scope & Capabilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {capabilities.map((cap) => (
              <div
                key={cap}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-aegis-cyan shrink-0 mt-1.5" />
                <span className="text-sm text-aegis-cloud leading-relaxed">{cap}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </motion.div>

      {children}
    </motion.div>
  );
}
