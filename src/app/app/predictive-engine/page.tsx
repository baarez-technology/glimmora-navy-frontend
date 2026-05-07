"use client";

import { Cpu } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function PredictiveEnginePage() {
  return (
    <ModulePage
      icon={Cpu}
      iconGradient="from-aegis-green to-aegis-cyan"
      title="Predictive Decision Intelligence Engine"
      subtitle="Forecasting Trainee Decisions, Escalation Chains & Training Risk"
      metrics={[
        { label: "Predictions Active", value: "47" },
        { label: "Accuracy Rate", value: "94%" },
        { label: "Interventions Today", value: "12" },
        { label: "Models Deployed", value: "6" },
      ]}
      capabilities={[
        "Prediction of probable bridge, CIC, engineering, and DC decisions under uncertainty",
        "Forecasting escalation chains (collision, misclassification, overload, flood propagation)",
        "Training-risk scoring for scenarios, teams, watches, and learner profiles",
        "Recommendation of intervention timing, inject changes, and remediation tasks",
        "Explainable prediction outputs with contributing factors and confidence bands",
        "Integration with adaptive AI instructor for proactive intervention",
        "Use strictly within training, evaluation, and simulation contexts",
        "Closed-loop feedback into scenario generation and cognitive twin calibration",
      ]}
    />
  );
}
