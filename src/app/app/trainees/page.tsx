"use client";

import { Users } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function TraineesPage() {
  return (
    <ModulePage
      icon={Users}
      iconGradient="from-aegis-cyan to-aegis-blue"
      title="Trainee Management"
      subtitle="Enrolment, Profiles, Competency Tracking & Progression"
      metrics={[
        { label: "Total Trainees", value: "636" },
        { label: "Active This Week", value: "247" },
        { label: "Avg Competency", value: "78%" },
        { label: "Cohorts", value: "12" },
      ]}
      capabilities={[
        "Trainee enrolment and profile management across ships and bases",
        "Role-based competency tracking (OOW, engineer, DC leader, USV operator)",
        "Individual learning path assignment and progression monitoring",
        "Cross-domain performance radar for each trainee",
        "Session history, scores, errors, and trend analysis",
        "Remediation plan assignment and tracking",
        "Cohort grouping and batch management",
        "Integration with certification and qualification workflows",
      ]}
    />
  );
}
