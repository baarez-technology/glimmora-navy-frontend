"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { StatusBar } from "@/components/layout/status-bar";
import { AIAssistantWidget } from "@/components/ai/ai-assistant-widget";
import { useAppStore } from "@/stores/app-store";
import { useAuthHydration } from "@/lib/auth";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import Image from "next/image";
import logoImg from "@/assets/logo.png";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useAppStore();
  const { ready, user } = useAuthHydration();

  if (!ready) {
    return (
      <div className="min-h-screen bg-aegis-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl animate-pulse select-none">
            <Image
              src={logoImg}
              alt="Glimmora Aegis Navy"
              className="w-12 h-12 object-cover object-left"
            />
          </div>
          <p className="text-xs font-mono text-aegis-mist tracking-wider">
            AUTHENTICATING...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    // useAuthHydration already pushed /login; render nothing while it navigates.
    return null;
  }

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
