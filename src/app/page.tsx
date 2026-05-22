"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/logo.png";
import {
  Shield,
  BrainCircuit,
  Box,
  Glasses,
  Radar,
  BarChart3,
  Swords,
  Sparkles,
  Cpu,
  Globe,
  GraduationCap,
  Lock,
  ChevronDown,
  ArrowRight,
  Anchor,
  type LucideIcon,
} from "lucide-react";
import {
  staggerContainer,
  fadeInUp,
  heroTextReveal,
} from "@/animations/variants";
import { AegisButton } from "@/components/ui/aegis-button";
import { RadarDisplay } from "@/components/ui/radar-display";

/* ================================================================
   Animated Counter Component
   ================================================================ */
function AnimatedCounter({
  value,
  suffix = "",
  label,
}: {
  value: string;
  suffix?: string;
  label: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      className="text-center"
    >
      <div className="font-display text-4xl md:text-5xl font-bold text-aegis-cyan text-glow">
        {value}
        <span className="text-aegis-cyan-deep">{suffix}</span>
      </div>
      <p className="mt-2 font-heading text-sm text-aegis-mist tracking-wider uppercase">
        {label}
      </p>
    </motion.div>
  );
}

/* ================================================================
   Feature Card Component
   ================================================================ */
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{
        y: -6,
        boxShadow: "0 0 40px rgba(0,229,255,0.08)",
      }}
      className="glass-card glass-shine rounded-xl p-6 group cursor-default"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-cyan/20 to-aegis-blue/10 border border-aegis-cyan/20 flex items-center justify-center mb-4 group-hover:border-aegis-cyan/40 transition-colors">
        <Icon className="w-6 h-6 text-aegis-cyan" />
      </div>
      <h3 className="font-heading text-lg font-bold text-aegis-white tracking-wide mb-2">
        {title}
      </h3>
      <p className="text-sm text-aegis-mist leading-relaxed">{description}</p>
    </motion.div>
  );
}

/* ================================================================
   Capability Bento Card
   ================================================================ */
function BentoCard({
  icon: Icon,
  title,
  description,
  size = "normal",
  accent = "cyan",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  size?: "normal" | "large";
  accent?: "cyan" | "purple" | "gold" | "green";
}) {
  const accentMap = {
    cyan: "from-aegis-cyan/20 to-aegis-blue/10 border-aegis-cyan/20 text-aegis-cyan",
    purple: "from-aegis-purple/20 to-aegis-blue/10 border-aegis-purple/20 text-aegis-purple",
    gold: "from-aegis-gold/20 to-aegis-amber/10 border-aegis-gold/20 text-aegis-gold",
    green: "from-aegis-green/20 to-aegis-cyan/10 border-aegis-green/20 text-aegis-green",
  };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4 }}
      className={`glass-card glass-shine rounded-xl p-6 ${size === "large" ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br border flex items-center justify-center mb-4 ${accentMap[accent]}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-heading text-base font-bold text-aegis-white tracking-wide mb-2">
        {title}
      </h3>
      <p className="text-sm text-aegis-mist leading-relaxed">{description}</p>
    </motion.div>
  );
}

/* ================================================================
   LANDING PAGE
   ================================================================ */
export default function LandingPage() {
  return (
    <div className="bg-aegis-void min-h-screen overflow-hidden">
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 tactical-grid">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.08)_0%,transparent_70%)]" />

        {/* Animated scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-aegis-cyan/20 to-transparent animate-grid-scan" />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-aegis-cyan/10 border border-aegis-cyan/20 text-xs font-heading font-bold text-aegis-cyan tracking-[0.08em] uppercase">
              <Lock className="w-3 h-3" />
              100% Offline &bull; Air-Gapped &bull; Sovereign
            </span>
          </motion.div>

          {/* Logo mark */}
          <motion.div variants={heroTextReveal} className="mb-8 flex justify-center select-none">
            <div className="relative h-32 w-56 md:h-40 md:w-72">
              <Image
                src={logoImg}
                alt="Glimmora Aegis Navy"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={heroTextReveal}
            className="font-heading text-lg md:text-xl text-aegis-mist max-w-2xl mx-auto mb-10 leading-relaxed tracking-wide"
          >
            AGI-First 3D Digital Twin & AR/VR-Enabled Naval Training Platform.
            <br />
            <span className="text-aegis-cloud">
              Redefining Maritime Readiness.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <AegisButton href="/login" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Enter Command Center
            </AegisButton>
            <AegisButton href="#why-glimmora" variant="secondary" size="lg">
              Explore Platform
            </AegisButton>
          </motion.div>

          {/* Floating radar */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 flex justify-center"
          >
            <RadarDisplay size={180} />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-aegis-slate"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ============================================
          WHY GLIMMORA AEGIS SECTION
          ============================================ */}
      <section id="why-glimmora" className="relative py-32 px-6 bg-aegis-abyss">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.04)_0%,transparent_60%)]" />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="relative max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="font-heading text-[11px] font-bold tracking-[0.1em] uppercase text-aegis-cyan">
              Why Glimmora Aegis
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-aegis-white tracking-wide">
              The Future of Naval Training
            </h2>
            <p className="mt-4 font-body text-aegis-mist max-w-xl mx-auto">
              A unified, immersive, analytics-driven training ecosystem built
              for sovereign defense environments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={BrainCircuit}
              title="AGI Intelligence"
              description="Offline AI that teaches, adapts, and assesses. Doctrine-grounded, evidence-based, fully governed."
            />
            <FeatureCard
              icon={Box}
              title="3D Digital Twin"
              description="High-fidelity ship models with live systems behavior, compartment walkthroughs, and dependency tracing."
            />
            <FeatureCard
              icon={Glasses}
              title="AR/VR Immersion"
              description="Full immersive training across bridge, CIC, engineering, damage control, and unmanned systems."
            />
            <FeatureCard
              icon={Lock}
              title="Sovereign & Air-Gapped"
              description="100% offline operation with customer ownership of all data, models, and AI artifacts."
            />
            <FeatureCard
              icon={Swords}
              title="Multi-Agent Warfare"
              description="Autonomous force simulation with red, blue, neutral, and swarm entities under instructor governance."
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics & Certification"
              description="Cross-domain competency tracking, predictive intelligence, and governed qualification support."
            />
          </div>
        </motion.div>
      </section>

      {/* ============================================
          CAPABILITIES BENTO GRID
          ============================================ */}
      <section className="relative py-32 px-6 bg-aegis-void tactical-grid">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="relative max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="font-heading text-[11px] font-bold tracking-[0.1em] uppercase text-aegis-cyan">
              Platform Capabilities
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-aegis-white tracking-wide">
              Complete Training Ecosystem
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BentoCard
              icon={BrainCircuit}
              title="Adaptive AI Instructor"
              description="Active teaching component that coaches, questions, challenges, remediates, and escalates complexity under human governance. Far beyond a passive assistant."
              size="large"
              accent="purple"
            />
            <BentoCard
              icon={Radar}
              title="Swarm AI"
              description="Coordinated USV/UUV/UAV swarm modeling with emergent behavior analysis."
              accent="cyan"
            />
            <BentoCard
              icon={Globe}
              title="Cross-Domain Battle"
              description="Naval + Air + Cyber unified synthetic battlespace for multi-domain training."
              accent="gold"
            />
            <BentoCard
              icon={Cpu}
              title="Predictive Engine"
              description="Forecasts trainee decisions, escalation chains, and mission degradation pathways."
              accent="green"
            />
            <BentoCard
              icon={Sparkles}
              title="Cognitive Digital Twin"
              description="Self-learning twin that adapts fidelity and training relevance from governed telemetry."
              accent="purple"
            />
            <BentoCard
              icon={Sparkles}
              title="Scenario Generation"
              description="Rapid creation of doctrine-bounded training exercises with parameterized variations."
              accent="cyan"
              size="large"
            />
          </div>
        </motion.div>
      </section>

      {/* ============================================
          STATS COUNTER SECTION
          ============================================ */}
      <section className="relative py-24 px-6 bg-aegis-abyss border-y border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05)_0%,transparent_60%)]" />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="relative max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12"
        >
          <AnimatedCounter value="6" suffix="+" label="Training Domains" />
          <AnimatedCounter value="500" suffix="+" label="Scenarios" />
          <AnimatedCounter value="100" suffix="%" label="Offline Capable" />
          <AnimatedCounter value="24/7" label="AI Instructor" />
        </motion.div>
      </section>

      {/* ============================================
          TRAINING DOMAINS SECTION
          ============================================ */}
      <section className="relative py-32 px-6 bg-aegis-void">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="font-heading text-[11px] font-bold tracking-[0.1em] uppercase text-aegis-cyan">
              Training Scope
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-aegis-white tracking-wide">
              Six Naval Training Domains
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Anchor,
                title: "Bridge & Navigation",
                desc: "BRM, shiphandling, COLREGS, pilotage, degraded conditions",
              },
              {
                icon: Radar,
                title: "CIC & Warfare",
                desc: "Tactical picture, track management, weapons employment, ASuW/AAW/ASW",
              },
              {
                icon: Cpu,
                title: "Engineering & Propulsion",
                desc: "Platform systems, fault isolation, casualty response, predictive maintenance",
              },
              {
                icon: Shield,
                title: "Damage Control",
                desc: "Firefighting, flooding, boundary control, multi-hit casualty progression",
              },
              {
                icon: Anchor,
                title: "Small Boats & Boarding",
                desc: "Coxswain skills, VBSS, maritime security, ROE for training",
              },
              {
                icon: Swords,
                title: "Unmanned Systems",
                desc: "USV/UUV control, swarm supervision, MUM-T, contingency awareness",
              },
            ].map((domain) => (
              <motion.div
                key={domain.title}
                variants={fadeInUp}
                whileHover={{ y: -4, borderColor: "rgba(0,229,255,0.2)" }}
                className="glass-card rounded-xl p-6 border border-slate-200/50 transition-all duration-300"
              >
                <domain.icon className="w-8 h-8 text-aegis-cyan mb-4" />
                <h3 className="font-heading text-lg font-bold text-aegis-white mb-2 tracking-wide">
                  {domain.title}
                </h3>
                <p className="text-sm text-aegis-mist leading-relaxed">
                  {domain.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="relative py-32 px-6 bg-aegis-abyss">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.06)_0%,transparent_60%)]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center overflow-hidden rounded-2xl select-none">
            <Image
              src={logoImg}
              alt="Glimmora Aegis Navy"
              className="w-16 h-16 object-cover object-left"
            />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-aegis-white tracking-wide mb-4">
            Ready to Transform Naval Training?
          </h2>
          <p className="text-aegis-mist mb-10 max-w-lg mx-auto">
            Deploy the most advanced, sovereign, AI-powered training platform
            ever built for naval forces.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <AegisButton href="/login" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Enter Command Center
            </AegisButton>
            <AegisButton href="/contact" variant="ghost" size="lg">
              Contact Us
            </AegisButton>
          </div>
        </motion.div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="bg-aegis-void border-t border-slate-200/60 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center select-none">
            <div className="relative h-8 w-14">
              <Image
                src={logoImg}
                alt="Glimmora Aegis Navy"
                fill
                className="object-contain object-left"
              />
            </div>
          </div>
          <p className="text-xs text-aegis-slate font-mono">
            RESTRICTED -- FOR OFFICIAL USE ONLY | 100% OFFLINE | SOVEREIGN
            DEPLOYMENT
          </p>
        </div>
      </footer>
    </div>
  );
}
