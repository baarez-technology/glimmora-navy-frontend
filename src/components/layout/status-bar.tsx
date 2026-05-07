"use client";

import { useAppStore } from "@/stores/app-store";
import { motion } from "framer-motion";
import { StatusBadge } from "@/components/ui/status-badge";

export function StatusBar() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <motion.footer
      animate={{ paddingLeft: sidebarCollapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 left-0 right-0 h-8 z-[200] bg-white/80 backdrop-blur-sm border-t border-slate-200/60 flex items-center px-6 justify-between"
    >
      <div className="flex items-center gap-4">
        <StatusBadge label="System Nominal" variant="online" pulse />
        <StatusBadge label="AI Engine: Active" variant="active" pulse />
        <StatusBadge label="Digital Twin: Synced" variant="synced" />
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-mono text-aegis-slate tracking-wider">
          DEPLOYMENT: AIR-GAPPED
        </span>
        <span className="text-[10px] font-heading font-bold text-aegis-gold tracking-[0.08em]">
          RESTRICTED
        </span>
      </div>
    </motion.footer>
  );
}
