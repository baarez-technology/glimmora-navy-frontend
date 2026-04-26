"use client";

import { motion } from "framer-motion";
import { Sparkles, Play, CheckCircle, XCircle, Edit, Clock } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const scenarioParams = [
  { label: "Domain", value: "Bridge Navigation" },
  { label: "Difficulty", value: "Advanced" },
  { label: "Weather", value: "Heavy Rain" },
  { label: "Sea State", value: "5" },
  { label: "Visibility", value: "Reduced (< 1nm)" },
  { label: "Traffic Density", value: "Dense" },
  { label: "Threat Profile", value: "Multi-Axis" },
  { label: "Engineering State", value: "Degraded (1 GT offline)" },
  { label: "Casualty Chain", value: "Progressive (fire + flood)" },
  { label: "Cross-Domain Injects", value: "Cyber + EW" },
];

const generatedScenarios = [
  { id: "SCN-2024-147", name: "Strait Transit -- Multi-Threat", difficulty: "Advanced", status: "approved", domain: "Bridge + CIC" },
  { id: "SCN-2024-148", name: "Port Approach -- Degraded Nav", difficulty: "Intermediate", status: "pending", domain: "Bridge" },
  { id: "SCN-2024-149", name: "Engine Casualty -- Progressive", difficulty: "Advanced", status: "approved", domain: "Engineering" },
  { id: "SCN-2024-150", name: "Multi-Hit DC -- Swarm Attack", difficulty: "Expert", status: "pending", domain: "DC + Warfare" },
  { id: "SCN-2024-151", name: "USV Swarm Defense", difficulty: "Advanced", status: "rejected", domain: "Unmanned + CIC" },
];

const statusMap: Record<string, { variant: "online" | "active" | "alert"; label: string }> = {
  approved: { variant: "online", label: "APPROVED" },
  pending: { variant: "active", label: "PENDING REVIEW" },
  rejected: { variant: "alert", label: "REJECTED" },
};

export default function ScenarioEnginePage() {
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Synthetic Scenario Generation Engine
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Doctrine-Bounded Exercise Creation
            </p>
          </div>
        </div>
        <AegisButton size="sm" icon={<Sparkles className="w-4 h-4" />}>
          Generate New
        </AegisButton>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Builder Panel (Left 40%) */}
        <GlassPanel className="lg:col-span-2">
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Scenario Parameters
          </h3>
          <div className="space-y-4">
            {scenarioParams.map((param) => (
              <div key={param.label}>
                <label className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase block mb-1">
                  {param.label}
                </label>
                <select className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30">
                  <option>{param.value}</option>
                </select>
              </div>
            ))}
            <div className="pt-4 space-y-2">
              <AegisButton className="w-full" icon={<Sparkles className="w-4 h-4" />}>
                Generate Scenario Family
              </AegisButton>
              <AegisButton variant="secondary" className="w-full">
                Generate Remediation
              </AegisButton>
              <AegisButton variant="ghost" className="w-full">
                Generate Red Cell Behavior
              </AegisButton>
            </div>
          </div>
        </GlassPanel>

        {/* Preview Panel (Right 60%) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Generated Scenarios Library */}
          <GlassPanel>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
              Generated Scenarios
            </h3>
            <div className="space-y-3">
              {generatedScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-aegis-gold" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-aegis-slate">{scenario.id}</span>
                        <StatusBadge
                          label={statusMap[scenario.status].label}
                          variant={statusMap[scenario.status].variant}
                        />
                      </div>
                      <p className="text-sm font-semibold text-aegis-cloud mt-0.5 truncate">
                        {scenario.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-mono text-aegis-mist">
                          {scenario.domain}
                        </span>
                        <span className="text-[10px] font-heading text-aegis-amber tracking-wider">
                          {scenario.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {scenario.status === "pending" && (
                      <>
                        <button className="p-2 rounded-lg hover:bg-aegis-green/10 text-aegis-green transition-colors cursor-pointer">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-aegis-red/10 text-aegis-red transition-colors cursor-pointer">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button className="p-2 rounded-lg hover:bg-white/[0.04] text-aegis-mist transition-colors cursor-pointer">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Approval Workflow */}
          <GlassPanel>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
              Approval Workflow
            </h3>
            <div className="flex items-center gap-4">
              {[
                { label: "Generated", complete: true },
                { label: "SME Review", complete: true },
                { label: "Instructor Approval", complete: false },
                { label: "Published", complete: false },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.complete ? "bg-aegis-cyan/20 text-aegis-cyan" : "bg-white/[0.04] text-aegis-slate"}`}>
                    {step.complete ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-xs font-heading tracking-wide ${step.complete ? "text-aegis-cloud" : "text-aegis-slate"}`}>
                    {step.label}
                  </span>
                  {i < 3 && <div className={`w-8 h-px ${step.complete ? "bg-aegis-cyan/30" : "bg-white/[0.06]"}`} />}
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </motion.div>
  );
}
