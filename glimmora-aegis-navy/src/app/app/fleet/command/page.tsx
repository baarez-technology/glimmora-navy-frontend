"use client";

import { Ship } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function FleetCommandPage() {
  return (
    <ModulePage
      icon={Ship}
      iconGradient="from-aegis-gold to-aegis-amber"
      title="Fleet Training Command"
      subtitle="Strategic Readiness, Cross-Base Planning & Force Certification"
      metrics={[
        { label: "Fleet Readiness", value: "90.2%" },
        { label: "Active Bases", value: "5" },
        { label: "Certified Personnel", value: "412" },
        { label: "Training Pipeline", value: "On Track" },
      ]}
      capabilities={[
        "Enterprise-level strategic readiness metrics across all bases",
        "Cross-base training comparison and resource allocation",
        "Deployment scheduling and training pipeline health monitoring",
        "Force readiness certification status by ship and capability",
        "Fleet training command strategic planning dashboards",
        "Governed reporting to higher command with classification controls",
      ]}
    />
  );
}
