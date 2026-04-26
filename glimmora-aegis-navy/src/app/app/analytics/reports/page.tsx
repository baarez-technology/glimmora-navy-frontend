"use client";

import { FileText } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function ReportsPage() {
  return (
    <ModulePage
      icon={FileText}
      iconGradient="from-aegis-cyan to-aegis-blue"
      title="Report Builder"
      subtitle="Configurable Reports, PDF Export & Scheduled Generation"
      metrics={[
        { label: "Report Templates", value: "12" },
        { label: "Generated This Month", value: "47" },
        { label: "Scheduled Reports", value: "6" },
        { label: "Export Formats", value: "PDF, CSV" },
      ]}
      capabilities={[
        "Configurable report builder with domain/ship/cohort/date filters",
        "Template selection: individual, cohort, fleet readiness, certification audit",
        "PDF export preview with branded headers and classification banners",
        "Scheduled report generation for recurring distribution",
        "Cross-modal evidence integration from all training channels",
        "Instructor-ready debrief and remediation reports",
      ]}
    />
  );
}
