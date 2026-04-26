"use client";

import { motion } from "framer-motion";
import { Play, ChevronRight } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";

const steps = [
  { num: 1, label: "Select Domain", active: true },
  { num: 2, label: "Choose Scenario", active: false },
  { num: 3, label: "Assign Trainees", active: false },
  { num: 4, label: "Configure AI", active: false },
  { num: 5, label: "Review & Launch", active: false },
];

const domains = [
  { id: "bridge", label: "Bridge & Navigation", sessions: 124, color: "from-aegis-cyan to-aegis-blue" },
  { id: "cic", label: "CIC & Warfare", sessions: 89, color: "from-aegis-red to-aegis-orange" },
  { id: "engineering", label: "Engineering", sessions: 156, color: "from-aegis-amber to-aegis-orange" },
  { id: "dc", label: "Damage Control", sessions: 78, color: "from-aegis-red to-aegis-amber" },
  { id: "boats", label: "Small Boats & Boarding", sessions: 42, color: "from-aegis-cyan to-aegis-cyan-deep" },
  { id: "unmanned", label: "Unmanned Systems", sessions: 36, color: "from-aegis-purple to-aegis-blue" },
];

export default function NewSessionPage() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp}>
        <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Launch New Training Session</h1>
        <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">Configure and launch a training scenario</p>
      </motion.div>

      {/* Progress Steps */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="flex items-center justify-between p-4" animated={false}>
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold ${step.active ? "bg-aegis-cyan/20 text-aegis-cyan border border-aegis-cyan/40" : "bg-white/[0.04] text-aegis-slate"}`}>
                {step.num}
              </div>
              <span className={`text-xs font-heading tracking-wide ${step.active ? "text-aegis-cloud font-semibold" : "text-aegis-slate"}`}>{step.label}</span>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-aegis-gunmetal mx-2" />}
            </div>
          ))}
        </GlassPanel>
      </motion.div>

      {/* Step 1: Domain Selection */}
      <motion.div variants={fadeInUp}>
        <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">Step 1: Select Training Domain</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map((domain) => (
            <GlassPanel
              key={domain.id}
              className="cursor-pointer hover:border-aegis-cyan/20 transition-all group"
              animated={false}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-shadow`}>
                <Play className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-heading text-base font-bold text-aegis-white tracking-wide mb-1">{domain.label}</h4>
              <p className="text-[10px] font-mono text-aegis-slate">{domain.sessions} scenarios available</p>
            </GlassPanel>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div variants={fadeInUp} className="flex justify-end gap-3">
        <Link href="/app/sessions">
          <AegisButton variant="ghost">Cancel</AegisButton>
        </Link>
        <AegisButton icon={<ChevronRight className="w-4 h-4" />}>Next: Choose Scenario</AegisButton>
      </motion.div>
    </motion.div>
  );
}
