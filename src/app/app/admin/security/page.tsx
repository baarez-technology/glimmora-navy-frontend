"use client";

import { Shield } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function SecurityPage() {
  return (
    <ModulePage
      icon={Shield}
      iconGradient="from-aegis-gold to-aegis-amber"
      title="Security, Governance & RBAC"
      subtitle="Air-Gapped Deployment, Audit Logs, Role-Based Access & Sovereignty Controls"
      metrics={[
        { label: "Active Users", value: "684" },
        { label: "Roles Configured", value: "14" },
        { label: "Audit Events (24h)", value: "4,892" },
        { label: "Policy Violations", value: "0" },
      ]}
      capabilities={[
        "Air-gapped deployment with no external connectivity at runtime",
        "Customer ownership of all data, models, digital twin assets, and AI artifacts",
        "Role-Based Access Control aligned to rank, billet, clearance, and functional role",
        "Tamper-evident audit logging for all critical system and user actions",
        "Patch-based upgrades with rollback capability",
        "Controlled content ingestion and validation workflows",
        "Policy controls for instructor, trainee, evaluator, admin, and maintainer privileges",
        "Formal governance for self-learning, prediction, and autonomous agent modules",
      ]}
    />
  );
}
