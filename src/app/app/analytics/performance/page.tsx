"use client";

import { BarChart3 } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function PerformancePage() {
  return (
    <ModulePage
      icon={BarChart3}
      iconGradient="from-aegis-green to-aegis-cyan"
      title="Performance Analytics"
      subtitle="Deep-Dive Dashboards, Time-Series Trends & Cohort Benchmarking"
      metrics={[
        { label: "Data Points", value: "1.2M" },
        { label: "Active Dashboards", value: "8" },
        { label: "Trend Period", value: "90 days" },
        { label: "Anomalies Flagged", value: "3" },
      ]}
      capabilities={[
        "Time-series performance charts across all training domains",
        "Cross-domain comparison and cohort benchmarking overlays",
        "Individual vs. group performance analysis with drill-down",
        "Session-over-session trend analysis with regression detection",
        "Safety-critical event pattern analysis across training channels",
        "Repeat-attempt learning curve measurement and visualization",
      ]}
    />
  );
}
