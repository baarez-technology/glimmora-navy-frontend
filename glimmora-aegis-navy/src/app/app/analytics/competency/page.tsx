"use client";

import { Target } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function CompetencyPage() {
  return (
    <ModulePage
      icon={Target}
      iconGradient="from-aegis-purple to-aegis-cyan"
      title="Competency Tracking"
      subtitle="Multi-Domain Spider Charts, Gap Analysis & Remediation Recommendations"
      metrics={[
        { label: "Trainees Tracked", value: "636" },
        { label: "Competency Dimensions", value: "42" },
        { label: "Avg Fleet Score", value: "78%" },
        { label: "Active Remediations", value: "18" },
      ]}
      capabilities={[
        "Multi-domain spider/radar charts per trainee and per cohort",
        "Competency gap analysis with weakness identification",
        "Linked remediation recommendations from AI instructor",
        "Drill-down to individual competency dimensions and contributing sessions",
        "Cross-cohort difficulty pattern identification",
        "Continuous competency tracking across roles and platforms",
      ]}
    />
  );
}
