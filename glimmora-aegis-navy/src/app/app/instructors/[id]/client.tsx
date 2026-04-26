"use client";

import { UserCog } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";
import { useParams } from "next/navigation";

export default function InstructorDetailPage() {
  const params = useParams();
  return (
    <ModulePage
      icon={UserCog}
      iconGradient="from-aegis-purple to-aegis-blue"
      title={`Instructor: ${params.id}`}
      subtitle="Profile, Domain Specializations, Assignments & AI Governance"
      metrics={[
        { label: "Sessions Supervised", value: "312" },
        { label: "Trainees Assigned", value: "24" },
        { label: "Scenarios Authored", value: "18" },
        { label: "AI Overrides", value: "7" },
      ]}
      capabilities={[
        "Instructor profile with rank, billet, and domain specializations",
        "Assigned trainees and cohort management view",
        "Session supervision history with scores and outcomes",
        "Scenario authoring history with approval status",
        "AI Instructor governance settings and override log",
        "Cross-instructor performance benchmarking metrics",
      ]}
    />
  );
}
