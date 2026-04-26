"use client";

import { motion } from "framer-motion";
import { User, Shield, Award, Ship, MapPin, Mail, Calendar, ChevronRight } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const qualifications = [
  { name: "Bridge Watchkeeping (OOW)", status: "Certified", date: "2024-08-15" },
  { name: "CIC Warfare Officer", status: "Certified", date: "2024-06-20" },
  { name: "Damage Control Leader", status: "In Progress", date: "2024-11-01" },
  { name: "USV Operator", status: "Pending", date: "--" },
];

const recentSessions = [
  { id: "BRM-047", domain: "Bridge Navigation", score: 87, date: "2024-10-20" },
  { id: "CIC-023", domain: "CIC Warfare", score: 79, date: "2024-10-18" },
  { id: "ENG-089", domain: "Engineering", score: 94, date: "2024-10-15" },
];

export default function ProfilePage() {
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">User Profile</h1>
        <button className="px-4 py-2 rounded-lg glass border border-white/[0.06] text-xs font-heading text-aegis-cyan hover:border-aegis-cyan/30 transition-colors cursor-pointer">
          Edit Profile
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div variants={fadeInUp}>
          <GlassPanel className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-heading text-xl font-bold text-aegis-white tracking-wide">CDR Arjun Sharma</h2>
            <p className="text-xs font-mono text-aegis-mist mt-1">SVC-ID: IN-NVY-2847</p>
            <div className="flex justify-center gap-2 mt-3">
              <StatusBadge label="Instructor" variant="active" />
              <StatusBadge label="Evaluator" variant="online" />
            </div>

            <div className="mt-6 space-y-3 text-left">
              {[
                { icon: Shield, label: "Rank", value: "Commander" },
                { icon: Ship, label: "Ship", value: "INS Vikrant (IAC-1)" },
                { icon: MapPin, label: "Base", value: "INS Dronacharya, Kochi" },
                { icon: Mail, label: "Email", value: "a.sharma@navy.mil" },
                { icon: Calendar, label: "Joined", value: "12 Mar 2019" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 py-2">
                  <item.icon className="w-4 h-4 text-aegis-slate shrink-0" />
                  <div>
                    <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">{item.label}</p>
                    <p className="text-sm text-aegis-cloud">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Qualifications + Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={fadeInUp}>
            <GlassPanel>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-aegis-gold" />
                  <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">Qualifications & Certifications</h3>
                </div>
                <button className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1 cursor-pointer">View All <ChevronRight className="w-3 h-3" /></button>
              </div>
              <div className="space-y-3">
                {qualifications.map((q) => (
                  <div key={q.name} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <p className="text-sm font-semibold text-aegis-cloud">{q.name}</p>
                      <p className="text-[10px] font-mono text-aegis-slate mt-0.5">{q.date}</p>
                    </div>
                    <StatusBadge
                      label={q.status}
                      variant={q.status === "Certified" ? "online" : q.status === "In Progress" ? "active" : "warning"}
                    />
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <GlassPanel>
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">Recent Training Sessions</h3>
              <div className="space-y-3">
                {recentSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div>
                      <p className="text-sm font-semibold text-aegis-cloud">{s.domain}</p>
                      <p className="text-[10px] font-mono text-aegis-slate">{s.id} &bull; {s.date}</p>
                    </div>
                    <span className="text-lg font-mono font-bold text-aegis-cyan">{s.score}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
