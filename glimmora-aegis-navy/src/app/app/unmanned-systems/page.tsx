"use client";

import { Bot } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function UnmannedSystemsPage() {
  return (
    <ModulePage
      icon={Bot}
      iconGradient="from-aegis-purple to-aegis-blue"
      title="Unmanned & Autonomous Maritime Systems"
      subtitle="USV, UUV & UAV Control, Swarm Supervision & MUM-T Training"
      metrics={[
        { label: "Active Sessions", value: "2" },
        { label: "Trainees Enrolled", value: "28" },
        { label: "Avg Score", value: "91%" },
        { label: "Scenarios Available", value: "36" },
      ]}
      capabilities={[
        "Control station procedures and workflows for training-only use",
        "Payload and sensor operations via digital twins and synthetic environments",
        "Link loss, contingency, and recovery logic",
        "Mission workflow from planning and briefing to execution and debrief",
        "Simulated swarm and manned-unmanned teaming (MUM-T) concepts",
        "Human-in-the-loop supervision training logic",
        "Exception handling, contingency awareness, and mission discipline",
        "Autonomous mission supervisor training using governed multi-agent constructs",
      ]}
    />
  );
}
