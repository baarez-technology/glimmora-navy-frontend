"use client";

import { Wrench } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function EngineeringPage() {
  return (
    <ModulePage
      icon={Wrench}
      iconGradient="from-aegis-amber to-aegis-orange"
      title="Engineering, Propulsion & Platform Systems"
      subtitle="Technical Education, System Understanding & Fault Isolation Training"
      metrics={[
        { label: "Active Sessions", value: "12" },
        { label: "Trainees Enrolled", value: "89" },
        { label: "Avg Score", value: "89%" },
        { label: "Scenarios Available", value: "156" },
      ]}
      capabilities={[
        "Ship platform system architecture (propulsion, power, fuel, HVAC, steering, auxiliaries)",
        "Control room and local machinery space operations (monitoring, alarms, logging)",
        "Fault identification, isolation logic, and troubleshooting pathways",
        "Engineering watchkeeping, rounds, alarm response, and reporting procedures",
        "Planned maintenance, inspections, permits, tool selection, and safety procedures",
        "Platform survivability implications of engineering configuration",
        "Training-safe engineering casualty logic and reasoning exercises",
        "Predictive failure and degradation simulation within approved boundaries",
      ]}
    />
  );
}
