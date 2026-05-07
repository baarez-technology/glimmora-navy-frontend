"use client";

import { Anchor } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function SmallBoatsPage() {
  return (
    <ModulePage
      icon={Anchor}
      iconGradient="from-aegis-cyan to-aegis-cyan-deep"
      title="Small Boats, Boarding & Maritime Security"
      subtitle="Coxswain Skills, VBSS, Launch/Recovery & Maritime Operations"
      metrics={[
        { label: "Active Sessions", value: "3" },
        { label: "Trainees Enrolled", value: "34" },
        { label: "Avg Score", value: "86%" },
        { label: "Scenarios Available", value: "42" },
      ]}
      capabilities={[
        "Small boat coxswain skills and handling in various sea states and conditions",
        "Launch and recovery procedures with safety checks and communications",
        "Visit, board, search, and seizure (VBSS) concepts and team coordination",
        "Maritime exclusion zone, escort, and presence operations",
        "VR small boat handling and approach scenarios",
        "Immersive boarding and close-quarters approach training",
        "3D mission-space visualization for contact layout and approach vectors",
        "AR-enhanced overlays for equipment checks, formations, and safety zones",
      ]}
    />
  );
}
