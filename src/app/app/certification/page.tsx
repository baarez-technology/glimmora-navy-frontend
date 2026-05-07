"use client";

import { Award } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function CertificationPage() {
  return (
    <ModulePage
      icon={Award}
      iconGradient="from-aegis-gold to-aegis-amber"
      title="Certification & Qualification Tracker"
      subtitle="Standardized Evaluation, Audit Readiness & Qualification Pipelines"
      metrics={[
        { label: "Certifications Issued", value: "412" },
        { label: "Pending Review", value: "23" },
        { label: "Pass Rate", value: "87%" },
        { label: "Audit Records", value: "1,847" },
      ]}
      capabilities={[
        "Standardized evaluation rubrics across ships, bases, and training pipelines",
        "Continuous competency tracking across roles and platforms",
        "Instructor override and final authority mechanisms",
        "Assessment record retention and auditability",
        "Configurable approval workflows for completion and qualification readiness",
        "Learner and team progression by ship, class, module, competency, and role",
        "Immersive remediation loops for weak competency areas",
        "Instructor-controlled pass/fail and review logic for exercises and scenarios",
      ]}
    />
  );
}
