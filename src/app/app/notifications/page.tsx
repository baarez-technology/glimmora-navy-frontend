"use client";

import { motion } from "framer-motion";
import { Bell, BellOff, Settings } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";

export default function NotificationsPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center">
            <Bell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Notifications
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Operational alerts & system events
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            disabled
            className="p-2 rounded-lg text-aegis-slate cursor-not-allowed"
            aria-label="Notification settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
              <BellOff className="w-7 h-7 text-aegis-slate" />
            </div>
            <h2 className="font-heading text-base font-bold text-aegis-cloud tracking-wide">
              No notifications
            </h2>
            <p className="text-xs text-aegis-mist mt-2 max-w-md leading-relaxed">
              The notifications service is not yet wired into the backend. Once
              the endpoint is available, operational alerts, AI insights and
              system events will appear here.
            </p>
            <div className="mt-5">
              <StatusBadge label="ENDPOINT PENDING" variant="warning" />
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
