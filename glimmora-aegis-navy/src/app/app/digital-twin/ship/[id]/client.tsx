"use client";

import { Ship } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";
import { useParams } from "next/navigation";

export default function ShipDetailPage() {
  const params = useParams();
  return (
    <ModulePage
      icon={Ship}
      iconGradient="from-aegis-cyan to-aegis-blue"
      title={`Ship Digital Twin: ${params.id}`}
      subtitle="Ship-Class-Specific Model, Systems Status & Fault Injection"
      metrics={[
        { label: "Compartments", value: "247" },
        { label: "Subsystems", value: "38" },
        { label: "Injectable Faults", value: "156" },
        { label: "Training Sessions", value: "89" },
      ]}
      capabilities={[
        "High-fidelity external hull and superstructure model for this ship class",
        "Fully interactive bridge and CIC models with role-specific configurations",
        "Internal compartment and system routing visualization",
        "Training-safe interdependencies and cause-effect representation",
        "Environment models for ports, harbors, and sea areas",
        "Multi-layer fidelity suitable for desktop, simulator, and AR/VR delivery",
      ]}
    />
  );
}
