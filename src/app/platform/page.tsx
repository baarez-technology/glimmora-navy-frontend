"use client";

import { Shield, Box, BrainCircuit, Glasses, Swords, BarChart3, Radar, Sparkles, Cpu, Globe, Lock, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp, heroTextReveal } from "@/animations/variants";
import { AegisButton } from "@/components/ui/aegis-button";
import Link from "next/link";

const capabilities = [
  { icon: Box, title: "3D Digital Twin", desc: "High-fidelity ship models with compartment walkthroughs and system dependency tracing" },
  { icon: BrainCircuit, title: "Adaptive AI Instructor", desc: "Active teaching that coaches, questions, challenges, and remediates under governance" },
  { icon: Glasses, title: "AR/VR Immersion", desc: "Full immersive training across bridge, CIC, engineering, DC, and unmanned systems" },
  { icon: Swords, title: "Multi-Agent Warfare", desc: "Autonomous force simulation with red, blue, neutral, and swarm entities" },
  { icon: Radar, title: "Swarm AI", desc: "Coordinated USV/UUV/UAV modeling with emergent behavior analysis" },
  { icon: Globe, title: "Cross-Domain Battle", desc: "Naval + Air + Cyber unified synthetic battlespace for multi-domain training" },
  { icon: Sparkles, title: "Scenario Generation", desc: "Rapid creation of doctrine-bounded exercises with parameterized variations" },
  { icon: Cpu, title: "Predictive Engine", desc: "Forecasts trainee decisions, escalation chains, and training risk" },
  { icon: BarChart3, title: "Analytics Center", desc: "Cross-domain competency tracking and performance evaluation" },
  { icon: Award, title: "Certification", desc: "Governed qualification pipelines with full audit trails" },
  { icon: Lock, title: "Sovereign Deployment", desc: "100% offline, air-gapped, customer-owned infrastructure" },
  { icon: Shield, title: "Full Governance", desc: "RBAC, audit logging, model versioning, and instructor override at all times" },
];

export default function PlatformPage() {
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

      <motion.section variants={staggerContainer} initial="initial" animate="animate" className="max-w-6xl mx-auto px-6 py-24">
        <motion.div variants={heroTextReveal} className="text-center mb-16">
          <span className="font-heading text-[11px] font-bold tracking-[0.1em] uppercase text-aegis-cyan">Platform</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-aegis-white tracking-wide mt-3">Complete Capability Overview</h1>
          <p className="text-lg text-aegis-mist mt-4 max-w-2xl mx-auto">12 integrated capabilities delivering the world&apos;s most advanced sovereign naval training platform.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <motion.div key={cap.title} variants={fadeInUp} className="glass-card glass-shine rounded-xl p-6">
              <cap.icon className="w-8 h-8 text-aegis-cyan mb-4" />
              <h3 className="font-heading text-base font-bold text-aegis-white tracking-wide mb-2">{cap.title}</h3>
              <p className="text-sm text-aegis-mist leading-relaxed">{cap.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeInUp} className="text-center mt-16">
          <Link href="/login"><AegisButton size="lg" icon={<ArrowRight className="w-5 h-5" />}>Enter Command Center</AegisButton></Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
