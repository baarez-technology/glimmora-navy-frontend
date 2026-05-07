"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { StatusBar } from "@/components/layout/status-bar";
import { AIAssistantWidget } from "@/components/ai/ai-assistant-widget";
import { useAppStore } from "@/stores/app-store";
import { motion } from "framer-motion";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-aegis-void">
      <TopBar />
      <Sidebar />

      <motion.main
        animate={{ paddingLeft: sidebarCollapsed ? 72 : 280 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="pt-16 pb-8 min-h-screen"
      >
        <div className="p-6">{children}</div>
      </motion.main>

      <StatusBar />
      <AIAssistantWidget />
    </div>
  );
}
