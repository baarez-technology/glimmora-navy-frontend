"use client";

import { Database } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function ContentIngestionPage() {
  return (
    <ModulePage
      icon={Database}
      iconGradient="from-aegis-cyan to-aegis-blue"
      title="Content Ingestion & Validation"
      subtitle="Doctrine, Technical Manuals & Training Material Pipeline"
      metrics={[
        { label: "Approved Sources", value: "1,247" },
        { label: "Pending Review", value: "12" },
        { label: "Rejected", value: "3" },
        { label: "Last Ingestion", value: "2h ago" },
      ]}
      capabilities={[
        "Content pipeline dashboard for doctrine, technical manuals, and training materials",
        "Ingestion status tracking: pending, validated, rejected",
        "Validation workflow: upload, review, approve, publish to knowledge base",
        "Source management with version control and provenance tracking",
        "OwnLLM knowledge base synchronization after approval",
        "Controlled content ingestion with no non-approved external sources",
      ]}
    />
  );
}
