"use client";

import { Compass } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function BridgeTrainingPage() {
  return (
    <ModulePage
      icon={Compass}
      iconGradient="from-aegis-cyan to-aegis-blue"
      title="Bridge, Navigation & Seamanship"
      subtitle="Watchkeeping, Shiphandling, COLREGS & Pilotage Training"
      metrics={[
        { label: "Active Sessions", value: "8" },
        { label: "Trainees Enrolled", value: "67" },
        { label: "Avg Score", value: "82%" },
        { label: "Scenarios Available", value: "124" },
      ]}
      capabilities={[
        "Bridge resource management and watchkeeping (OOW, JOOW, navigator, helmsman, lookout)",
        "Shiphandling and maneuvering including wind, current, shallow water effects",
        "Navigation and pilotage with visual, radar, ECDIS, AIS integration",
        "COLREGS application and tactical maneuvering in complex traffic",
        "Standard bridge procedures, reporting, logs, and watch handover",
        "High-workload and degraded conditions (reduced visibility, equipment faults)",
        "VR bridge familiarization mapped to ship-class-specific digital twins",
        "Performance comparison across learners, watches, and training stages",
      ]}
    />
  );
}
