"use client";

import { UserCog } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function InstructorsPage() {
  return (
    <ModulePage
      icon={UserCog}
      iconGradient="from-aegis-purple to-aegis-blue"
      title="Instructor Management"
      subtitle="Instructor Profiles, Assignments, AI Governance & Authoring"
      metrics={[
        { label: "Total Instructors", value: "48" },
        { label: "Active Today", value: "16" },
        { label: "Sessions Supervised", value: "1,247" },
        { label: "Scenarios Authored", value: "89" },
      ]}
      capabilities={[
        "Instructor profile management with domain specialization tracking",
        "Session assignment and scheduling across training domains",
        "AI Instructor governance controls and override authority",
        "Scenario authoring and approval workflows",
        "Debrief generation and remediation plan creation tools",
        "Trainee allocation and cohort management",
        "Cross-instructor performance benchmarking",
        "Content ingestion and validation workflow management",
      ]}
    />
  );
}
