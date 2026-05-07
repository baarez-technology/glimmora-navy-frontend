"use client";

import { Flame } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function DamageControlPage() {
  return (
    <ModulePage
      icon={Flame}
      iconGradient="from-aegis-red to-aegis-amber"
      title="Damage Control, Firefighting & Survivability"
      subtitle="Ship Compartmentation, Casualty Response & Repair Party Coordination"
      metrics={[
        { label: "Active Sessions", value: "4" },
        { label: "Trainees Enrolled", value: "56" },
        { label: "Avg Score", value: "71%" },
        { label: "Scenarios Available", value: "78" },
      ]}
      capabilities={[
        "Ship compartmentation, watertight integrity, and stability fundamentals",
        "Fire detection, classification, and firefighting procedures",
        "Flooding, progressive flooding, dewatering, shoring, patching, and plugging",
        "Damage assessment, boundary control, and reporting",
        "Repair party organization, communication, and coordination",
        "Integration of engineering, DC, command, and cross-domain priorities",
        "Multi-hit and cascading casualty progression in synthetic scenarios",
        "VR multi-user team exercises for repair parties",
      ]}
    />
  );
}
