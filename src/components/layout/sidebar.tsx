"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { useUserStore, type UserRole } from "@/stores/user-store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Compass,
  Crosshair,
  Wrench,
  Flame,
  Anchor,
  Bot,
  BrainCircuit,
  Cpu,
  Box,
  Glasses,
  Swords,
  Radar,
  Globe,
  Sparkles,
  BarChart3,
  GraduationCap,
  Award,
  Users,
  UserCog,
  Ship,
  Shield,
  ChevronLeft,
  ChevronRight,
  Play,
  Target,
  ClipboardCheck,
  Bell,
  User,
  Settings,
  FileText,
  Lock,
  Database,
  BookOpen,
  Video,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const ALL: UserRole[] = [
  "trainee",
  "instructor",
  "evaluator",
  "doctrine",
  "fleet",
  "admin",
  "maintainer",
];

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard, roles: ALL },
      { label: "Sessions", href: "/app/sessions", icon: Play, roles: ["trainee", "instructor", "evaluator", "fleet", "admin"] },
      { label: "Notifications", href: "/app/notifications", icon: Bell, roles: ALL },
    ],
  },
  {
    title: "Training Domains",
    items: [
      { label: "Bridge & Navigation", href: "/app/bridge-training", icon: Compass, roles: ["trainee", "instructor", "evaluator", "admin"] },
      { label: "CIC & Warfare", href: "/app/cic-warfare", icon: Crosshair, roles: ["trainee", "instructor", "evaluator", "admin"] },
      { label: "Engineering", href: "/app/engineering", icon: Wrench, roles: ["trainee", "instructor", "evaluator", "admin"] },
      { label: "Damage Control", href: "/app/damage-control", icon: Flame, roles: ["trainee", "instructor", "evaluator", "admin"] },
      { label: "Small Boats", href: "/app/small-boats", icon: Anchor, roles: ["trainee", "instructor", "evaluator", "admin"] },
      { label: "Unmanned Systems", href: "/app/unmanned-systems", icon: Bot, roles: ["trainee", "instructor", "evaluator", "admin"] },
    ],
  },
  {
    title: "AI & Intelligence",
    items: [
      { label: "AI Instructor", href: "/app/ai-instructor", icon: BrainCircuit, roles: ["trainee", "instructor", "admin"] },
      { label: "Text-to-Video", href: "/app/text-to-video", icon: Video, roles: ["trainee", "instructor", "admin"] },
      { label: "Predictive Engine", href: "/app/predictive-engine", icon: Cpu, roles: ["instructor", "evaluator", "fleet", "admin"] },
      { label: "OwnLLM", href: "/app/own-llm", icon: Sparkles, roles: ["instructor", "doctrine", "admin"] },
    ],
  },
  {
    title: "Digital Twin",
    items: [
      { label: "3D Ship Viewer", href: "/app/digital-twin", icon: Box, roles: ["trainee", "instructor", "evaluator", "admin"] },
      { label: "Cognitive Twin", href: "/app/digital-twin/cognitive", icon: BrainCircuit, roles: ["instructor", "admin"] },
      { label: "AR/VR Modules", href: "/app/ar-vr/modules", icon: Glasses, roles: ["trainee", "instructor", "evaluator", "admin"] },
      { label: "AR/VR Sessions", href: "/app/ar-vr/sessions", icon: Glasses, roles: ["trainee", "instructor", "evaluator", "admin"] },
      { label: "AR/VR Authoring", href: "/app/ar-vr/authoring", icon: Sparkles, roles: ["instructor", "doctrine", "admin"] },
    ],
  },
  {
    title: "Warfare Simulation",
    items: [
      { label: "Multi-Agent Sim", href: "/app/warfare-sim", icon: Swords, roles: ["instructor", "evaluator", "admin"] },
      { label: "Swarm AI", href: "/app/swarm-ai", icon: Radar, roles: ["instructor", "evaluator", "admin"] },
      { label: "Cross-Domain", href: "/app/cross-domain", icon: Globe, roles: ["instructor", "evaluator", "admin"] },
      { label: "Scenario Engine", href: "/app/scenario-engine", icon: Sparkles, roles: ["instructor", "doctrine", "admin"] },
    ],
  },
  {
    title: "Analytics & Evaluation",
    items: [
      { label: "Intelligence Center", href: "/app/analytics", icon: BarChart3, roles: ["instructor", "evaluator", "fleet", "admin"] },
      { label: "Performance", href: "/app/analytics/performance", icon: BarChart3, roles: ["instructor", "evaluator", "fleet", "admin"] },
      { label: "Competency", href: "/app/analytics/competency", icon: Target, roles: ["trainee", "instructor", "evaluator", "fleet", "admin"] },
      { label: "Reports", href: "/app/analytics/reports", icon: FileText, roles: ["instructor", "evaluator", "fleet", "admin"] },
      { label: "Remediation", href: "/app/remediation", icon: Target, roles: ["trainee", "instructor", "evaluator", "admin"] },
      { label: "Evaluator", href: "/app/evaluator", icon: ClipboardCheck, roles: ["evaluator", "instructor", "admin"] },
    ],
  },
  {
    title: "Learning & Certification",
    items: [
      { label: "Learning", href: "/app/learning", icon: GraduationCap, roles: ["trainee", "instructor", "admin"] },
      { label: "Certification", href: "/app/certification", icon: Award, roles: ["trainee", "instructor", "evaluator", "fleet", "admin"] },
      { label: "Doctrine", href: "/app/doctrine", icon: BookOpen, roles: ["instructor", "doctrine", "evaluator", "admin"] },
    ],
  },
  {
    title: "Personnel & Fleet",
    items: [
      { label: "Trainees", href: "/app/trainees", icon: Users, roles: ["instructor", "evaluator", "fleet", "admin"] },
      { label: "Instructors", href: "/app/instructors", icon: UserCog, roles: ["fleet", "admin"] },
      { label: "Fleet Dashboard", href: "/app/fleet", icon: Ship, roles: ["fleet", "admin"] },
      { label: "Fleet Command", href: "/app/fleet/command", icon: Ship, roles: ["fleet", "admin"] },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Admin Panel", href: "/app/admin", icon: Settings, roles: ["admin"] },
      { label: "Roles & RBAC", href: "/app/admin/roles", icon: Lock, roles: ["admin"] },
      { label: "Security", href: "/app/admin/security", icon: Shield, roles: ["admin", "maintainer"] },
      { label: "Audit Logs", href: "/app/admin/audit", icon: FileText, roles: ["admin", "maintainer"] },
      { label: "Content", href: "/app/admin/content", icon: Database, roles: ["admin", "doctrine"] },
    ],
  },
];

const stripTrailingSlash = (p: string) =>
  p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapse } = useAppStore();
  const user = useUserStore((s) => s.user);
  const rawPathname = usePathname();
  const pathname = stripTrailingSlash(rawPathname ?? "");

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: user
        ? group.items.filter((item) => item.roles.includes(user.role))
        : group.items,
    }))
    .filter((group) => group.items.length > 0);

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 bottom-0 z-[300] flex flex-col bg-slate-50 border-r border-slate-200/60 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-200/60 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aegis-cyan to-aegis-cyan-deep flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="font-display text-sm font-bold tracking-widest text-aegis-cyan">
                AEGIS
              </span>
              <span className="font-heading text-xs text-aegis-mist ml-1.5 tracking-wider">
                NAVY
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {visibleGroups.map((group) => (
          <div key={group.title} className="mb-4">
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 mb-1.5 font-heading text-[10px] font-bold tracking-[0.1em] uppercase text-aegis-slate"
                >
                  {group.title}
                </motion.h3>
              )}
            </AnimatePresence>
            {group.items.map((item) => {
              const href =
                item.href === "/app/dashboard" && user ? user.homePath : item.href;
              const isActive =
                pathname === href ||
                (item.href === "/app/dashboard" && pathname === "/app/dashboard");
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body transition-all duration-200 group relative",
                    isActive
                      ? "bg-aegis-cyan/10 text-aegis-cyan"
                      : "text-aegis-mist hover:text-aegis-cloud hover:bg-slate-100/60"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-aegis-cyan rounded-r-full"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      "w-4.5 h-4.5 shrink-0",
                      isActive ? "text-aegis-cyan" : "text-aegis-slate group-hover:text-aegis-mist"
                    )}
                  />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebarCollapse}
        className="flex items-center justify-center h-12 border-t border-slate-200/60 text-aegis-slate hover:text-aegis-cyan transition-colors cursor-pointer"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  );
}
