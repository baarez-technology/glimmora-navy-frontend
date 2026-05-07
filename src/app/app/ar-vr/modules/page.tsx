"use client";

import { Glasses } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function ARVRModulesPage() {
  return (
    <ModulePage
      icon={Glasses}
      iconGradient="from-aegis-purple to-aegis-electric"
      title="AR/VR Training Modules"
      subtitle="Immersive Training Library for All Naval Domains"
      metrics={[
        { label: "VR Modules", value: "48" },
        { label: "AR Overlays", value: "32" },
        { label: "Active Sessions", value: "7" },
        { label: "Avg Completion", value: "84%" },
      ]}
      capabilities={[
        "VR bridge familiarization and shiphandling in varied environments",
        "VR CIC/operations room replicating consoles, displays, and comms",
        "VR machinery space and engineering control room walk-throughs",
        "VR damage control scenarios (fires, flooding, explosions, structural damage)",
        "AR contextual overlays for equipment, controls, and component identification",
        "AR-guided maintenance and inspection with overlay-based component ID",
        "Instructor-led and self-paced immersive training paths",
        "Session tracking, usage analytics, and competency linkage",
      ]}
    />
  );
}
