"use client";

import { ClipboardCheck } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";
import { useParams } from "next/navigation";

export default function AssessmentDetailPage() {
  const params = useParams();
  return (
    <ModulePage
      icon={ClipboardCheck}
      iconGradient="from-aegis-gold to-aegis-amber"
      title={`Assessment Review: ${params.id}`}
      subtitle="Detailed Scoring, Evidence Review & Final Determination"
      metrics={[
        { label: "Rubric Items", value: "12" },
        { label: "Evidence Sources", value: "4" },
        { label: "AI Score", value: "82%" },
        { label: "Status", value: "Pending" },
      ]}
      capabilities={[
        "Detailed scoring rubric with per-item assessment and weighting",
        "Session replay evidence linked to specific rubric criteria",
        "AI instructor scoring with confidence levels for evaluator comparison",
        "Instructor notes and annotations attached to evidence",
        "Final pass/fail/conditional determination with justification",
        "Digital signature and submission to certification pipeline",
      ]}
    />
  );
}
