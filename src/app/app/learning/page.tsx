"use client";

import { GraduationCap } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function LearningPage() {
  return (
    <ModulePage
      icon={GraduationCap}
      iconGradient="from-aegis-cyan to-aegis-blue"
      title="Learning Lifecycle Manager"
      subtitle="Guided Paths, Remediation & Competency Progression"
      metrics={[
        { label: "Active Learners", value: "247" },
        { label: "Courses Active", value: "34" },
        { label: "Completion Rate", value: "87%" },
        { label: "Remediation Plans", value: "18" },
      ]}
      capabilities={[
        "Guided learning paths aligned to qualification and competency milestones",
        "Explain-why behavior explanations for decisions and outcomes",
        "Adaptive quizzes and practice assessments across all domains",
        "Targeted remediation recommendations and suggested immersive exercises",
        "Context-sensitive help during approved learning modes",
        "Learning progression support across all modules and channels",
        "Multi-modal evidence from classroom, simulator, digital twin, AR/VR, and at-sea",
        "Continuous Learning Feedback Loop connecting all training subsystems",
      ]}
    />
  );
}
