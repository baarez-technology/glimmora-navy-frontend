"use client";

import { ClipboardCheck } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function AssessmentsPage() {
  return (
    <ModulePage
      icon={ClipboardCheck}
      iconGradient="from-aegis-gold to-aegis-amber"
      title="Assessment Management"
      subtitle="Rubric Builder, Grading Interface & Sign-Off Workflows"
      metrics={[
        { label: "Active Assessments", value: "23" },
        { label: "Rubric Templates", value: "18" },
        { label: "Graded This Month", value: "47" },
        { label: "Pending Sign-Off", value: "5" },
      ]}
      capabilities={[
        "Assessment creation with rubric builder and scoring weights",
        "Multi-modal evidence attachment from sessions and AR/VR",
        "Instructor vs. AI scoring comparison for evaluator review",
        "Digital signature and chain-of-command sign-off workflow",
        "Competency mapping from assessment results to qualification status",
        "Assessment history and audit trail for compliance",
      ]}
    />
  );
}
