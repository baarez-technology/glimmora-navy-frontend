"use client";

import { Globe } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function CrossDomainPage() {
  return (
    <ModulePage
      icon={Globe}
      iconGradient="from-aegis-gold to-aegis-amber"
      title="Cross-Domain Battle Simulation"
      subtitle="Naval + Air + Cyber Unified Synthetic Battlespace"
      metrics={[
        { label: "Active Scenarios", value: "3" },
        { label: "Domains Integrated", value: "5" },
        { label: "Avg Score", value: "76%" },
        { label: "After-Action Reviews", value: "28" },
      ]}
      capabilities={[
        "Maritime, air, cyber, EW, ISR, and information operations in common timelines",
        "Cyber effects modeling (sensor degradation, data integrity, timing disruption)",
        "Air domain integration for friendly, neutral, and adversary aircraft and missiles",
        "Domain-crossing injects forcing trade-offs across safety, mission, and survivability",
        "Unified after-action review across all participating domains",
        "Electronic warfare pressure and emissions control training",
        "Command-and-control disruption scenarios in training-safe synthetic mode",
        "Integration with autonomous multi-agent and swarm simulation frameworks",
      ]}
    />
  );
}
