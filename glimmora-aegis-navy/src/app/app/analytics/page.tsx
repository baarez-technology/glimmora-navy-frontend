"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Download,
  Filter,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  Users,
} from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";

const performanceData = [
  { domain: "Bridge & Navigation", score: 82, trend: "+3.2%", sessions: 147, errors: 23 },
  { domain: "CIC & Warfare", score: 74, trend: "+1.8%", sessions: 98, errors: 41 },
  { domain: "Engineering", score: 89, trend: "+4.1%", sessions: 203, errors: 12 },
  { domain: "Damage Control", score: 71, trend: "-0.5%", sessions: 76, errors: 34 },
  { domain: "Small Boats", score: 86, trend: "+2.7%", sessions: 54, errors: 8 },
  { domain: "Unmanned Systems", score: 91, trend: "+5.3%", sessions: 42, errors: 5 },
];

const topTrainees = [
  { name: "CPO M. Singh", domain: "Engineering", score: 96, rank: 1 },
  { name: "SLT K. Nair", domain: "Unmanned Systems", score: 94, rank: 2 },
  { name: "LT A. Verma", domain: "Bridge Nav", score: 93, rank: 3 },
  { name: "LT J. Kumar", domain: "Bridge Nav", score: 91, rank: 4 },
  { name: "CPO R. Das", domain: "Engineering", score: 89, rank: 5 },
];

export default function AnalyticsPage() {
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-green to-aegis-cyan flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Simulator Intelligence & Analytics
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Cross-Domain Performance Evaluation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AegisButton variant="ghost" size="sm" icon={<Filter className="w-4 h-4" />}>
            Filters
          </AegisButton>
          <AegisButton variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
            Export PDF
          </AegisButton>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="flex flex-wrap items-center gap-4 p-4" animated={false}>
          {[
            { label: "Domain", value: "All Domains" },
            { label: "Ship", value: "All Ships" },
            { label: "Cohort", value: "2024-B" },
            { label: "Range", value: "Last 30 days" },
          ].map((filter) => (
            <div key={filter.label} className="flex items-center gap-2">
              <span className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                {filter.label}:
              </span>
              <select className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30">
                <option>{filter.value}</option>
              </select>
            </div>
          ))}
        </GlassPanel>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Procedural Compliance"
          value="94.2%"
          trend={{ value: 1.8, direction: "up" }}
          icon={CheckCircle}
          accentColor="text-aegis-green"
        />
        <MetricCard
          title="Avg Time to Complete"
          value="23m 14s"
          trend={{ value: -3.2, direction: "down" }}
          icon={Clock}
          accentColor="text-aegis-cyan"
        />
        <MetricCard
          title="Safety Events Detected"
          value="99.1%"
          trend={{ value: 0.4, direction: "up" }}
          icon={AlertTriangle}
          accentColor="text-aegis-amber"
        />
        <MetricCard
          title="Error Rate"
          value="3.2%"
          trend={{ value: -0.8, direction: "down" }}
          icon={Target}
          accentColor="text-aegis-red"
        />
        <MetricCard
          title="Pass Rate"
          value="87%"
          trend={{ value: 2.1, direction: "up" }}
          icon={Users}
          accentColor="text-aegis-purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Domain */}
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-6">
            Performance by Domain
          </h3>
          <div className="space-y-4">
            {performanceData.map((domain) => {
              const isPositive = domain.trend.startsWith("+");
              return (
                <div key={domain.domain}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-heading font-semibold text-aegis-cloud tracking-wide">
                      {domain.domain}
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-semibold ${isPositive ? "text-aegis-green" : "text-aegis-red"}`}
                      >
                        {domain.trend}
                      </span>
                      <span className="text-sm font-mono font-bold text-aegis-cyan">
                        {domain.score}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${domain.score}%` }}
                      transition={{
                        duration: 1,
                        delay: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`h-full rounded-full ${
                        domain.score >= 85
                          ? "bg-gradient-to-r from-aegis-green to-aegis-cyan"
                          : domain.score >= 75
                            ? "bg-gradient-to-r from-aegis-cyan to-aegis-blue"
                            : "bg-gradient-to-r from-aegis-amber to-aegis-orange"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[10px] font-mono text-aegis-slate">
                      {domain.sessions} sessions
                    </span>
                    <span className="text-[10px] font-mono text-aegis-slate">
                      {domain.errors} errors
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {/* Top Performers */}
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-6">
            Top Performers
          </h3>
          <div className="space-y-3">
            {topTrainees.map((trainee) => (
              <div
                key={trainee.name}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold ${
                      trainee.rank === 1
                        ? "bg-aegis-gold/20 text-aegis-gold"
                        : trainee.rank === 2
                          ? "bg-aegis-cloud/10 text-aegis-cloud"
                          : trainee.rank === 3
                            ? "bg-aegis-amber/20 text-aegis-amber"
                            : "bg-white/[0.04] text-aegis-mist"
                    }`}
                  >
                    #{trainee.rank}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-aegis-cloud">
                      {trainee.name}
                    </p>
                    <p className="text-[10px] font-mono text-aegis-slate">
                      {trainee.domain}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-mono font-bold text-aegis-cyan">
                  {trainee.score}
                </span>
              </div>
            ))}
          </div>

          {/* Competency Radar Placeholder */}
          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <h4 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
              Fleet Competency Radar
            </h4>
            <div className="flex items-center justify-center h-48 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-center">
                <Target className="w-8 h-8 text-aegis-cyan/30 mx-auto mb-2" />
                <p className="text-xs text-aegis-slate">
                  Recharts Spider/Radar Chart
                </p>
                <p className="text-[10px] font-mono text-aegis-gunmetal">
                  6 domains &bull; competency mapping
                </p>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Data Table */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Session Detail Table
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-aegis-slate">
                Showing 620 records
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Trainee", "Domain", "Score", "Errors", "Duration", "Trend", "Status"].map(
                    (header) => (
                      <th
                        key={header}
                        className="text-left py-3 px-4 text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "LT J. Kumar", domain: "Bridge", score: 87, errors: 2, duration: "47m", trend: "+3%", status: "completed" },
                  { name: "SLT R. Patel", domain: "CIC", score: 72, errors: 5, duration: "34m", trend: "-1%", status: "active" },
                  { name: "CPO M. Singh", domain: "Engineering", score: 94, errors: 0, duration: "52m", trend: "+5%", status: "completed" },
                  { name: "LT A. Desai", domain: "DC", score: 68, errors: 4, duration: "28m", trend: "-2%", status: "remediation" },
                  { name: "SLT K. Nair", domain: "Unmanned", score: 91, errors: 1, duration: "41m", trend: "+4%", status: "completed" },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-aegis-cloud font-medium">
                      {row.name}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                      {row.domain}
                    </td>
                    <td className="py-3 px-4 text-sm font-mono font-bold text-aegis-cyan">
                      {row.score}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                      {row.errors}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                      {row.duration}
                    </td>
                    <td className={`py-3 px-4 text-xs font-mono font-semibold ${row.trend.startsWith("+") ? "text-aegis-green" : "text-aegis-red"}`}>
                      {row.trend}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        label={row.status.toUpperCase()}
                        variant={
                          row.status === "completed"
                            ? "online"
                            : row.status === "active"
                              ? "active"
                              : "warning"
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
