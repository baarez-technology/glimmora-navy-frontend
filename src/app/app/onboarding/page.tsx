"use client";

import { motion } from "framer-motion";
import { Shield, GraduationCap, UserCog, ClipboardCheck, Settings, ChevronRight, ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp, heroTextReveal } from "@/animations/variants";
import Link from "next/link";

const roles = [
  { icon: GraduationCap, label: "Trainee", desc: "Access training modules, sessions, and competency tracking", href: "/app/dashboard", color: "from-aegis-cyan to-aegis-blue" },
  { icon: UserCog, label: "Instructor", desc: "Manage sessions, author scenarios, supervise AI instructor", href: "/app/dashboard", color: "from-aegis-purple to-aegis-blue" },
  { icon: ClipboardCheck, label: "Evaluator", desc: "Assess qualifications, grade certifications, review evidence", href: "/app/evaluator", color: "from-aegis-gold to-aegis-amber" },
  { icon: Settings, label: "Admin", desc: "System configuration, RBAC, audit logs, content management", href: "/app/admin", color: "from-aegis-red to-aegis-orange" },
];

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-aegis-void tactical-grid flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05)_0%,transparent_60%)]" />

      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="relative z-10 max-w-3xl w-full">
        <motion.div variants={heroTextReveal} className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-aegis-cyan to-aegis-cyan-deep flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(0,229,255,0.2)]">
            <Shield className="w-8 h-8 text-aegis-void" />
          </div>
          <h1 className="font-display text-3xl font-bold text-aegis-white tracking-wide">Welcome to AEGIS</h1>
          <p className="font-heading text-sm text-aegis-mist mt-2">Select your role to configure your Command Center experience</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {roles.map((role) => (
            <motion.div key={role.label} variants={fadeInUp}>
              <Link href={role.href}>
                <GlassPanel className="cursor-pointer hover:border-aegis-cyan/20 transition-all group" animated={false}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-shadow`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-aegis-white tracking-wide mb-1">{role.label}</h3>
                  <p className="text-xs text-aegis-mist leading-relaxed">{role.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-[10px] font-heading text-aegis-cyan tracking-wider">
                    Continue as {role.label} <ChevronRight className="w-3 h-3" />
                  </div>
                </GlassPanel>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp} className="text-center">
          <Link href="/app/dashboard">
            <AegisButton variant="ghost" icon={<ArrowRight className="w-4 h-4" />}>Skip to Dashboard</AegisButton>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
