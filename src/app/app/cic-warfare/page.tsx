"use client";

import { Crosshair } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function CICWarfarePage() {
  return (
    <ModulePage
      icon={Crosshair}
      iconGradient="from-aegis-red to-aegis-orange"
      title="CIC / Operations Room & Warfare"
      subtitle="Tactical Picture, Track Management, Weapons Employment & Multi-Domain Warfare"
      metrics={[
        { label: "Active Sessions", value: "5" },
        { label: "Trainees Enrolled", value: "42" },
        { label: "Avg Score", value: "74%" },
        { label: "Scenarios Available", value: "89" },
      ]}
      capabilities={[
        "Tactical picture compilation and sensor fusion (radar, sonar, ESM, EO/IR, data links)",
        "Track management, classification, identification, and threat evaluation",
        "Command team coordination for warfare roles under time pressure",
        "Weapons employment logic for guns, missiles, torpedoes, CIWS, soft-kill systems",
        "ASuW, AAW, ASW, maritime security, and information warfare workflows",
        "Autonomous multi-agent warfare simulation with doctrine-bounded agents",
        "Swarm AI and emergent behavior modeling for coordinated UAV/USV/UUV threats",
        "Cross-domain battle simulation integrating naval, air, cyber, and EW effects",
      ]}
    />
  );
}
