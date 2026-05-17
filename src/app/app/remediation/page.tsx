"use client";

import { motion } from "framer-motion";
import { Target, Plus, CheckCircle, Clock, AlertTriangle, Sparkles } from "lucide-react";
import { useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { MetricCard } from "@/components/ui/metric-card";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { ai } from "@/lib/api/endpoints";
import { useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";

const DOMAIN_OPTIONS = [
  "bridge_navigation",
  "cic_warfare",
  "engineering",
  "damage_control",
  "small_boats",
  "unmanned_systems",
];

export default function RemediationPage() {
  const user = useUserStore((s) => s.user);
  const [domain, setDomain] = useState(DOMAIN_OPTIONS[0]);
  const [weakness, setWeakness] = useState("");
  const [sessionId, setSessionId] = useState("");

  const { run, loading, error, data } = useMutation(ai.remediate);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !weakness.trim()) return;
    run({
      user_id: user.id,
      domain,
      weakness_description: weakness.trim(),
      session_id: sessionId.trim() || undefined,
    });
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-amber to-aegis-orange flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Targeted Remediation Plans
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              AI-Recommended & Instructor-Assigned Training Interventions
            </p>
          </div>
        </div>
        <StatusBadge label="AI Coach" variant="active" pulse />
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Recommended Scenarios"
          value={
            data?.recommended_scenarios
              ? String(data.recommended_scenarios.length)
              : "--"
          }
          icon={Target}
          accentColor="text-aegis-amber"
        />
        <MetricCard
          title="Estimated Sessions"
          value={
            data?.estimated_improvement_sessions !== undefined
              ? String(data.estimated_improvement_sessions)
              : "--"
          }
          icon={Clock}
        />
        <MetricCard
          title="Plan Generated"
          value={data ? "Yes" : "--"}
          icon={CheckCircle}
          accentColor="text-aegis-green"
        />
        <MetricCard
          title="Status"
          value={loading ? "Working" : error ? "Error" : "Ready"}
          icon={AlertTriangle}
          accentColor="text-aegis-purple"
        />
      </div>

      {/* Form */}
      <motion.div variants={fadeInUp}>
        <GlassPanel animated={false}>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Request Remediation Plan
          </h3>
          {!user && (
            <p className="text-sm text-aegis-mist">
              Sign in to request a remediation plan.
            </p>
          )}
          {user && (
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Domain">
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-aegis-cloud focus:outline-none focus:border-aegis-cyan/40 capitalize"
                >
                  {DOMAIN_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Session ID (optional)">
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="uuid of related session"
                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm font-mono text-aegis-cloud focus:outline-none focus:border-aegis-cyan/40"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Weakness Description">
                  <textarea
                    value={weakness}
                    onChange={(e) => setWeakness(e.target.value)}
                    placeholder="e.g. consistently fails track classification under heavy ECM and clutter"
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-aegis-cloud focus:outline-none focus:border-aegis-cyan/40 resize-y"
                    required
                  />
                </Field>
              </div>

              <div className="md:col-span-2 flex items-center gap-3">
                <AegisButton
                  type="submit"
                  loading={loading}
                  disabled={!weakness.trim()}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Generate Plan
                </AegisButton>
                {data && (
                  <span className="text-[10px] font-mono text-aegis-slate">
                    interaction {data.interaction_id.slice(0, 8)}
                  </span>
                )}
              </div>
            </form>
          )}
        </GlassPanel>
      </motion.div>

      {/* Error */}
      {error && (
        <GlassPanel animated={false} className="p-4 border border-aegis-red/30">
          <p className="text-sm text-aegis-red">Plan generation failed: {error}</p>
        </GlassPanel>
      )}

      {/* Plan output */}
      {data && (
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-aegis-cyan/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-aegis-cyan" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-aegis-cloud">
                  AI-Generated Remediation Plan
                </p>
                <p className="text-[10px] font-mono text-aegis-slate mt-0.5 capitalize">
                  {domain.replace(/_/g, " ")} - estimated{" "}
                  {data.estimated_improvement_sessions} sessions
                </p>
              </div>
              <StatusBadge label="ACTIVE" variant="active" />
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-5">
              <p className="text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate mb-2">
                Plan
              </p>
              <p className="text-sm text-aegis-cloud whitespace-pre-wrap leading-relaxed">
                {data.plan}
              </p>
            </div>

            {data.recommended_scenarios.length > 0 && (
              <div>
                <p className="text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate mb-3">
                  Recommended Scenarios
                </p>
                <div className="space-y-2">
                  {data.recommended_scenarios.map((scenario, i) => (
                    <div
                      key={`${scenario}-${i}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-aegis-amber/15 text-aegis-amber flex items-center justify-center font-mono text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-sm text-aegis-cloud truncate">{scenario}</p>
                      </div>
                      <StatusBadge label="QUEUED" variant="neutral" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassPanel>
        </motion.div>
      )}
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
