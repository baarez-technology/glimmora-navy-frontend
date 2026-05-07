"use client";

import { Sparkles } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function OwnLLMPage() {
  return (
    <ModulePage
      icon={Sparkles}
      iconGradient="from-aegis-purple to-aegis-cyan"
      title="OwnLLM -- Navy Domain Intelligence"
      subtitle="Offline Navy-Domain Language Model for Doctrine-Grounded Responses"
      metrics={[
        { label: "Queries Today", value: "342" },
        { label: "Citation Rate", value: "98%" },
        { label: "Refusal Rate", value: "4.2%" },
        { label: "Approved Sources", value: "1,247" },
      ]}
      capabilities={[
        "Navy-domain language model aligned to customer-approved content",
        "Role-based response depth and visibility control",
        "Strict citation enforcement or refusal behavior for ungrounded queries",
        "Query answering grounded in approved doctrine, TTPs, and technical manuals",
        "No speculative or uncontrolled output in governed training contexts",
        "Lesson plan generation aligned to naval training syllabi",
        "Session debrief generation from simulator and immersive telemetry",
        "Cross-cohort difficulty pattern identification and remediation planning",
      ]}
    />
  );
}
