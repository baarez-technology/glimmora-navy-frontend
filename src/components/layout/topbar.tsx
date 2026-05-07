"use client";

import { useAppStore } from "@/stores/app-store";
import { useUserStore } from "@/stores/user-store";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  BrainCircuit,
  User,
  Command,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const ROLE_BREADCRUMB: Record<string, string> = {
  trainee: "My Training",
  instructor: "Instructor Console",
  evaluator: "Evaluator Console",
  doctrine: "Doctrine Console",
  fleet: "Fleet Command",
  admin: "Administration",
  maintainer: "Maintainer Console",
};

export function TopBar() {
  const { sidebarCollapsed, toggleAIWidget, toggleCommandPalette } = useAppStore();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();

  const breadcrumb = user
    ? pathname?.startsWith(user.homePath) || pathname === "/app/dashboard"
      ? ROLE_BREADCRUMB[user.role] ?? "Command Center"
      : "Command Center"
    : "Command Center";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <motion.header
      animate={{ paddingLeft: sidebarCollapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 h-16 z-[400] bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Breadcrumb area */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-aegis-slate font-heading tracking-wide">
              GLIMMORA AEGIS
            </span>
            <span className="text-aegis-gunmetal">/</span>
            <span className="text-aegis-cloud font-heading font-semibold tracking-wide">
              {breadcrumb}
            </span>
          </nav>
        </div>

        {/* Center: Search */}
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200/60 hover:border-aegis-cyan/20 transition-all duration-200 min-w-[320px] cursor-pointer"
        >
          <Search className="w-4 h-4 text-aegis-slate" />
          <span className="text-sm text-aegis-slate">
            Search modules, trainees, scenarios...
          </span>
          <div className="ml-auto flex items-center gap-1 text-aegis-gunmetal">
            <Command className="w-3 h-3" />
            <span className="text-xs font-mono">K</span>
          </div>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* AI Widget Toggle */}
          <button
            onClick={toggleAIWidget}
            className="relative p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <BrainCircuit className="w-5 h-5 text-aegis-purple group-hover:text-aegis-cyan transition-colors" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-aegis-green rounded-full animate-pulse" />
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <Bell className="w-5 h-5 text-aegis-mist hover:text-aegis-cloud transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-aegis-red rounded-full flex items-center justify-center text-[9px] font-bold text-white font-mono">
              3
            </span>
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-200/60 mx-2" />

          {/* Profile */}
          <button
            onClick={() => router.push("/app/profile")}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-aegis-cloud">
                {user ? `${user.rank} ${user.name}` : "Guest"}
              </p>
              <p className="text-[10px] text-aegis-slate font-heading tracking-wider">
                {user?.roleLabel ?? "NOT SIGNED IN"}
              </p>
            </div>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-lg hover:bg-aegis-red/10 text-aegis-mist hover:text-aegis-red transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
