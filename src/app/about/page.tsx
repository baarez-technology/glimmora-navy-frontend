"use client";

import { motion } from "framer-motion";
import { Shield, Target, Lock, Globe, ArrowRight } from "lucide-react";
import { staggerContainer, fadeInUp, heroTextReveal } from "@/animations/variants";
import { AegisButton } from "@/components/ui/aegis-button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-aegis-void min-h-screen">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-200/60">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aegis-cyan to-aegis-cyan-deep flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-sm font-bold tracking-widest text-aegis-cyan">GLIMMORA AEGIS</span>
        </Link>
        <Link href="/login"><AegisButton size="sm">Login</AegisButton></Link>
      </nav>

      <motion.section variants={staggerContainer} initial="initial" animate="animate" className="max-w-4xl mx-auto px-6 py-24">
        <motion.div variants={heroTextReveal} className="mb-16">
          <span className="font-heading text-[11px] font-bold tracking-[0.1em] uppercase text-aegis-cyan">About</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-aegis-white tracking-wide mt-3">Our Mission</h1>
          <p className="text-lg text-aegis-mist mt-6 leading-relaxed max-w-2xl">
            Glimmora Aegis -- Navy transforms naval training from fragmented simulators and static manuals into a unified,
            immersive, AI-powered training ecosystem covering surface, subsurface, unmanned maritime, and multi-domain battlespace domains.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Target, title: "Training Excellence", desc: "Competency-based training with AI-driven adaptation, predictive analytics, and governed self-improvement across all naval domains." },
            { icon: Lock, title: "Sovereign Security", desc: "100% offline, air-gapped deployment with full customer ownership of all data, models, and AI artifacts." },
            { icon: Globe, title: "Multi-Domain", desc: "Unified surface, air, cyber, electronic warfare, and information operations in synthetic training scenarios." },
            { icon: Shield, title: "Governed AI", desc: "Every AI output is evidence-based or refused. Instructor override at all times. Full auditability and rollback." },
          ].map((item) => (
            <motion.div key={item.title} variants={fadeInUp} className="glass-card rounded-xl p-6">
              <item.icon className="w-8 h-8 text-aegis-cyan mb-4" />
              <h3 className="font-heading text-lg font-bold text-aegis-white tracking-wide mb-2">{item.title}</h3>
              <p className="text-sm text-aegis-mist leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
