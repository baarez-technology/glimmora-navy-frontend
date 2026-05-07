"use client";

import { BookOpen } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function DoctrinePage() {
  return (
    <ModulePage
      icon={BookOpen}
      iconGradient="from-aegis-gold to-aegis-amber"
      title="Doctrine Management"
      subtitle="Document Library, Version Control & Compliance Monitoring"
      metrics={[
        { label: "Documents", value: "1,247" },
        { label: "Pending Updates", value: "8" },
        { label: "Last Updated", value: "2d ago" },
        { label: "Compliance Score", value: "98%" },
      ]}
      capabilities={[
        "Doctrine document library with search and categorization",
        "Version management with change tracking and approval workflows",
        "Domain-to-doctrine mapping for scenario and AI alignment",
        "Doctrine compliance monitoring across all generated scenarios",
        "OwnLLM knowledge base alignment verification",
        "Doctrine manager approval gates for content updates",
      ]}
    />
  );
}
