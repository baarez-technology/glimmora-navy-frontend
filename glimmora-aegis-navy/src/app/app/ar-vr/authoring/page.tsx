"use client";

import { Sparkles } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function ARVRAuthoringPage() {
  return (
    <ModulePage
      icon={Sparkles}
      iconGradient="from-aegis-purple to-aegis-electric"
      title="AR/VR Instructor Authoring"
      subtitle="Create & Configure Immersive Scenarios, Overlays & Assessment Criteria"
      metrics={[
        { label: "Published Scenarios", value: "48" },
        { label: "In Draft", value: "7" },
        { label: "AR Overlay Templates", value: "32" },
        { label: "Assessment Rubrics", value: "24" },
      ]}
      capabilities={[
        "Creation and configuration of immersive scenarios across all domains",
        "Guided versus unguided execution mode configuration",
        "Activation of hints, annotations, prompts, and overlays during sessions",
        "Scenario branching based on learner actions and AI-generated variations",
        "Role-based control over assessment visibility and feedback timing",
        "Session playback and review configuration for debrief purposes",
        "Synthetic Scenario Generation Engine controls for parameterized families",
        "Template library for rapid scenario creation and reuse",
      ]}
    />
  );
}
