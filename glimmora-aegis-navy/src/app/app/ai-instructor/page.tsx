"use client";

import { motion } from "framer-motion";
import {
  BrainCircuit,
  Eye,
  HelpCircle,
  AlertTriangle,
  Zap,
  MessageSquare,
  Activity,
  Users,
  Clock,
  ChevronRight,
  Settings,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const instructionModes = [
  { icon: Eye, label: "Silent Observe", active: false },
  { icon: HelpCircle, label: "Hinting", active: false },
  { icon: MessageSquare, label: "Guided Questioning", active: true },
  { icon: AlertTriangle, label: "Corrective", active: false },
  { icon: Zap, label: "Challenge Escalation", active: false },
];

const activeSessions = [
  {
    id: "BRM-047",
    trainee: "LT J. Kumar",
    domain: "Bridge Navigation",
    duration: "47 min",
    aiMode: "Guided Questioning",
    confidence: 82,
    lastAction: "Why did you alter course to port when the contact was on your starboard bow?",
  },
  {
    id: "CIC-012",
    trainee: "SLT R. Patel",
    domain: "CIC Warfare - AAW",
    duration: "23 min",
    aiMode: "Hinting",
    confidence: 65,
    lastAction: "Consider the classification criteria for this radar return in a cluttered environment.",
  },
  {
    id: "ENG-091",
    trainee: "CPO M. Singh",
    domain: "Engineering - Fault Isolation",
    duration: "34 min",
    aiMode: "Silent Observe",
    confidence: 91,
    lastAction: "Monitoring -- trainee following correct isolation procedure.",
  },
];

const interventionLog = [
  { time: "14:23", action: "Hint sent to LT Kumar -- COLREGS Rule 15 prompt", type: "hint" },
  { time: "14:21", action: "Challenge escalated for SLT Patel -- target re-evaluation", type: "challenge" },
  { time: "14:19", action: "Silent observation -- CPO Singh performing correctly", type: "observe" },
  { time: "14:15", action: "Session BRM-047 started -- AI Instructor activated", type: "system" },
  { time: "14:12", action: "Corrective prompt issued -- trainee missed bridge check", type: "corrective" },
  { time: "14:08", action: "Competency update -- navigation proficiency +2%", type: "update" },
];

const logTypeColors: Record<string, string> = {
  hint: "text-aegis-amber",
  challenge: "text-aegis-purple",
  observe: "text-aegis-cyan",
  system: "text-aegis-mist",
  corrective: "text-aegis-red",
  update: "text-aegis-green",
};

export default function AIInstructorPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-cyan flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Adaptive AI Instructor
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Active Teaching & Assessment under Human Governance
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/[0.06] text-xs font-heading text-aegis-mist hover:text-aegis-cyan transition-colors cursor-pointer">
          <Settings className="w-4 h-4" />
          Configure
        </button>
      </motion.div>

      {/* Instruction Mode Selector */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="flex items-center gap-2 p-3" animated={false}>
          <span className="text-[10px] font-heading font-bold text-aegis-slate tracking-[0.1em] uppercase mr-3">
            Mode:
          </span>
          {instructionModes.map((mode) => (
            <button
              key={mode.label}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-heading font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                mode.active
                  ? "bg-aegis-cyan/15 text-aegis-cyan border border-aegis-cyan/30"
                  : "text-aegis-mist hover:text-aegis-cloud hover:bg-white/[0.04]"
              }`}
            >
              <mode.icon className="w-3.5 h-3.5" />
              {mode.label}
            </button>
          ))}
        </GlassPanel>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Active Sessions (Left 60%) */}
        <div className="lg:col-span-3 space-y-4">
          <motion.div variants={fadeInUp}>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
              Active Sessions Monitor
            </h3>
          </motion.div>

          {activeSessions.map((session) => (
            <motion.div key={session.id} variants={fadeInUp}>
              <GlassPanel className="hover:border-aegis-cyan/15 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aegis-cyan/20 to-aegis-blue/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-aegis-cyan" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading text-sm font-bold text-aegis-white tracking-wide">
                          {session.id}
                        </span>
                        <StatusBadge label="ACTIVE" variant="active" pulse />
                      </div>
                      <p className="text-xs text-aegis-mist mt-0.5">
                        {session.trainee} &bull; {session.domain}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-aegis-slate">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-mono">{session.duration}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                      AI Mode
                    </span>
                    <p className="text-sm font-heading font-semibold text-aegis-purple mt-0.5">
                      {session.aiMode}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                      Confidence
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${session.confidence}%` }}
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-green"
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-aegis-cyan">
                        {session.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                    Last AI Action
                  </span>
                  <p className="text-xs text-aegis-cloud mt-1 leading-relaxed italic">
                    &ldquo;{session.lastAction}&rdquo;
                  </p>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>

        {/* Right Column (40%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Intervention Log */}
          <motion.div variants={fadeInUp}>
            <GlassPanel>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                  Intervention Log
                </h3>
                <button className="text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors flex items-center gap-1 cursor-pointer">
                  Full Log <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {interventionLog.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[10px] font-mono text-aegis-slate shrink-0 mt-0.5 w-10">
                      {entry.time}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-aegis-gunmetal shrink-0 mt-1.5" />
                    <p className={`text-xs leading-relaxed ${logTypeColors[entry.type]}`}>
                      {entry.action}
                    </p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>

          {/* Policy Controls */}
          <motion.div variants={fadeInUp}>
            <GlassPanel>
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
                Policy Controls
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Instructor Override Required", enabled: true },
                  { label: "Auto Remediation Prompts", enabled: true },
                  { label: "Challenge Escalation", enabled: false },
                  { label: "Session Recording", enabled: true },
                  { label: "Predictive Intervention", enabled: false },
                ].map((control) => (
                  <div key={control.label} className="flex items-center justify-between">
                    <span className="text-xs text-aegis-cloud">{control.label}</span>
                    <button
                      className={`w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer relative ${
                        control.enabled ? "bg-aegis-cyan" : "bg-aegis-gunmetal"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                          control.enabled ? "left-[22px]" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>

          {/* Active Trainees */}
          <motion.div variants={fadeInUp}>
            <GlassPanel>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-aegis-cyan" />
                <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                  Active Trainees
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-3xl font-bold text-aegis-cyan">
                  3
                </span>
                <span className="text-xs text-aegis-mist">
                  under AI supervision
                </span>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
