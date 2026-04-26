"use client";

import { Settings } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";

export default function SettingsPage() {
  return (
    <ModulePage
      icon={Settings}
      iconGradient="from-aegis-slate to-aegis-gunmetal"
      title="Settings"
      subtitle="Personal Preferences, Notifications & System Configuration"
      metrics={[
        { label: "Theme", value: "Dark" },
        { label: "Notifications", value: "On" },
        { label: "Display Density", value: "Default" },
        { label: "Classification", value: "Restricted" },
      ]}
      capabilities={[
        "Personal theme and display density preferences",
        "Notification channel configuration (alerts, AI insights, sessions, certifications)",
        "Keyboard shortcut customization",
        "System classification level configuration (admin only)",
        "AI policy defaults for instructor role",
        "Deployment mode and sync settings (admin only)",
      ]}
    />
  );
}
