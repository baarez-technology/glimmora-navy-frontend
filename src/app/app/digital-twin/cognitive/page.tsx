"use client";

import { BrainCircuit } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function CognitiveDigitalTwinPage() {
  return (
    <ModulePage
      icon={BrainCircuit}
      iconGradient="from-aegis-purple to-aegis-cyan"
      title="Cognitive Digital Twin"
      subtitle="Self-Learning Twin &bull; Governed Adaptation &bull; Telemetry Ingestion"
      metrics={[
        { label: "Telemetry Sources", value: "24" },
        { label: "Model Version", value: "v2.4.1" },
        { label: "Last Calibration", value: "2h ago" },
        { label: "Drift Score", value: "0.02%" },
      ]}
      capabilities={[
        "Continuous ingestion of approved telemetry from simulation, AR/VR, and evaluations",
        "Self-improving behavioral calibration subject to approval workflows",
        "Learning of frequent error paths, role confusion, and tactical hesitation patterns",
        "Version-controlled learning updates with rollback, explainability, and audit trails",
        "Strict governance preventing unsupervised drift or unauthorized behavior adaptation",
        "Adjustment of fidelity levels, inject timing, and remediation sequences from evidence",
      ]}
    />
  );
}
