"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, User as UserIcon } from "lucide-react";
import { ModulePage } from "@/components/ui/module-page";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { fadeInUp } from "@/animations/variants";
import { useAppStore } from "@/stores/app-store";
import { useUserStore } from "@/stores/user-store";

export default function SettingsPage() {
  const user = useUserStore((s) => s.user);
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebarCollapse = useAppStore((s) => s.toggleSidebarCollapse);
  const classificationLevel = useAppStore((s) => s.classificationLevel);
  const setClassification = useAppStore((s) => s.setClassification);

  return (
    <ModulePage
      icon={SettingsIcon}
      iconGradient="from-aegis-slate to-aegis-gunmetal"
      title="Settings"
      subtitle="Personal Preferences, Notifications & System Configuration"
      metrics={[
        { label: "Theme", value: "Dark" },
        { label: "Sidebar", value: sidebarCollapsed ? "Collapsed" : "Expanded" },
        { label: "Display Density", value: "Default" },
        {
          label: "Classification",
          value: classificationLevel.split(" ")[0] || "RESTRICTED",
        },
      ]}
      capabilities={[
        "Personal theme and display density preferences",
        "Notification channel configuration (alerts, AI insights, sessions, certifications)",
        "Keyboard shortcut customization",
        "System classification level configuration (admin only)",
        "AI policy defaults for instructor role",
        "Deployment mode and sync settings (admin only)",
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile info */}
        <motion.div variants={fadeInUp}>
          <GlassPanel animated={false}>
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="w-4 h-4 text-aegis-cyan" />
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Signed-In User
              </h3>
            </div>
            {!user ? (
              <p className="text-xs text-aegis-slate py-3">No active session.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Name", value: `${user.rank} ${user.name}` },
                  { label: "Service Number", value: user.service_number },
                  { label: "Unit", value: user.unit },
                  { label: "Role", value: user.roleLabel },
                  {
                    label: "Clearance",
                    value: user.classification_clearance || "--",
                  },
                  { label: "Cohort", value: user.cohort_id ?? "--" },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-[10px] font-heading tracking-[0.1em] uppercase text-aegis-slate">
                      {row.label}
                    </p>
                    <p className="text-sm font-semibold text-aegis-cloud mt-0.5 truncate">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </motion.div>

        {/* App preferences */}
        <motion.div variants={fadeInUp}>
          <GlassPanel animated={false}>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
              App Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-aegis-cloud">Sidebar</p>
                  <p className="text-[10px] font-mono text-aegis-slate">
                    Toggle compact vs expanded
                  </p>
                </div>
                <AegisButton
                  size="sm"
                  variant="secondary"
                  onClick={toggleSidebarCollapse}
                >
                  {sidebarCollapsed ? "Expand" : "Collapse"}
                </AegisButton>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-aegis-cloud">Classification Banner</p>
                  <p className="text-[10px] font-mono text-aegis-slate truncate max-w-[260px]">
                    {classificationLevel}
                  </p>
                </div>
                <StatusBadge label="ACTIVE" variant="warning" pulse />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  "UNCLASSIFIED",
                  "RESTRICTED -- FOR OFFICIAL USE ONLY",
                  "CONFIDENTIAL",
                  "SECRET",
                ].map((level) => (
                  <button
                    key={level}
                    onClick={() => setClassification(level)}
                    className={`text-left text-[10px] font-heading tracking-wider uppercase px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                      classificationLevel === level
                        ? "border-aegis-cyan/40 bg-aegis-cyan/10 text-aegis-cyan"
                        : "border-white/[0.06] text-aegis-mist hover:border-white/[0.12]"
                    }`}
                  >
                    {level.split(" --")[0]}
                  </button>
                ))}
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </ModulePage>
  );
}
