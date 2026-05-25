/* eslint-disable react-hooks/purity */
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  Play,
  Sliders,
  Activity,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GlassPanel } from "@/components/ui/glass-panel";
import { AegisButton } from "@/components/ui/aegis-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { scenarios, sessions, analytics } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { Scenario, TrainingSession } from "@/lib/api/types";

const DOMAIN = "swarm_ai";

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function LoadingInline({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-4 text-aegis-mist">
      <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
      <span className="text-xs font-heading tracking-wider uppercase">
        {label}&hellip;
      </span>
    </div>
  );
}

function ErrorInline({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <AlertTriangle className="w-4 h-4 text-aegis-red shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs text-aegis-cloud leading-relaxed">{message}</p>
        <button
          onClick={onRetry}
          className="text-[10px] font-heading text-aegis-cyan mt-2 tracking-wider uppercase cursor-pointer"
        >
          Retry &rarr;
        </button>
      </div>
    </div>
  );
}

export default function SwarmAIPage() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();

  const scenariosState = useApi(
    () => scenarios.list({ domain: DOMAIN, page_size: 50 }),
    []
  );
  const sessionsState = useApi(
    () =>
      user
        ? sessions.list({ trainee_id: user.id, page_size: 10 })
        : Promise.resolve(null),
    [user?.id],
    { skip: !user }
  );
  const weakState = useApi(() => analytics.domain(DOMAIN), [], {
    skip: !user || user.role === "trainee",
  });

  const { run: startScenario, loading: starting } = useMutation(scenarios.start);

  const onStart = async (scenarioId: string) => {
    if (!user) return;
    const res = await startScenario(scenarioId, { trainee_id: user.id });
    if (res) router.push(`/app/sessions/${res.session_id}`);
  };

  const onLaunch = async () => {
    const first = scenariosState.data?.items?.[0];
    if (first) await onStart(first.id);
  };

  const allScenarios: Scenario[] = scenariosState.data?.items ?? [];
  const recentSessions: TrainingSession[] = (sessionsState.data?.items ?? []).filter(
    (s) => allScenarios.some((sc) => sc.id === s.scenario_id)
  );

  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 80 + Math.random() * 60;
      const cx = Math.cos(angle) * radius + 160;
      const cy = Math.sin(angle) * radius + 160;
      return {
        id: i,
        cx,
        cy,
        duration: 2 + Math.random() * 2,
        delay: Math.random(),
      };
    });
  }, []);

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
            <Radar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Swarm AI & Emergent Behavior
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Coordinated Autonomous Entity Modeling
            </p>
          </div>
        </div>
        <AegisButton
          size="sm"
          icon={<Play className="w-4 h-4" />}
          disabled={!user || starting || allScenarios.length === 0}
          loading={starting}
          onClick={onLaunch}
        >
          Launch Simulation
        </AegisButton>
      </motion.div>

      {/* 3D Swarm Visualization */}
      <motion.div variants={fadeInUp}>
        <GlassPanel className="min-h-[400px] relative overflow-hidden" animated={false}>
          <div className="absolute inset-0 tactical-grid-dense flex items-center justify-center">
            {/* Swarm particles */}
            <div className="relative w-80 h-80">
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  animate={{
                    x: [p.cx - 3, p.cx + 3, p.cx - 3],
                    y: [p.cy - 2, p.cy + 4, p.cy - 2],
                  }}
                  transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
                  className="absolute w-2.5 h-2.5 rounded-full bg-aegis-cyan shadow-[0_0_8px_rgba(0,229,255,0.5)]"
                  style={{ left: 0, top: 0 }}
                />
              ))}
              {/* Center command node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-aegis-purple shadow-[0_0_16px_rgba(124,77,255,0.5)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <span className="absolute top-[calc(50%-24px)] left-1/2 -translate-x-1/2 text-[9px] font-mono text-aegis-purple whitespace-nowrap">
                COMMAND NODE
              </span>
            </div>
          </div>

          <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2">
            <span className="text-[10px] font-heading font-bold text-aegis-cyan tracking-[0.08em]">
              24 ENTITIES &bull; V-FORMATION &bull; COORDINATED SEARCH
            </span>
          </div>
        </GlassPanel>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters */}
        <GlassPanel>
          <div className="flex items-center gap-2 mb-5">
            <Sliders className="w-4 h-4 text-aegis-cyan" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Swarm Parameters
            </h3>
          </div>
          <div className="space-y-5">
            {[
              { label: "Entity Count", value: 24, max: 100 },
              { label: "Aggression", value: 35, max: 100 },
              { label: "Coordination Quality", value: 85, max: 100 },
              { label: "Stochasticity", value: 20, max: 100 },
              { label: "Communication Range", value: 70, max: 100 },
            ].map((param) => (
              <div key={param.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-aegis-cloud">{param.label}</span>
                  <span className="text-xs font-mono font-bold text-aegis-cyan">
                    {param.value}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-purple"
                    style={{ width: `${(param.value / param.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <AegisButton size="sm" className="flex-1">Apply</AegisButton>
              <AegisButton variant="ghost" size="sm" className="flex-1">Reset</AegisButton>
            </div>
          </div>
        </GlassPanel>

        {/* Available Scenarios */}
        <GlassPanel className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-aegis-purple" />
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Swarm Scenario Library
            </h3>
          </div>
          {scenariosState.loading ? (
            <LoadingInline label="Loading scenarios" />
          ) : scenariosState.error ? (
            <ErrorInline
              message={scenariosState.error}
              onRetry={scenariosState.refetch}
            />
          ) : allScenarios.length === 0 ? (
            <p className="text-xs text-aegis-slate py-3">
              No swarm AI scenarios available yet.
            </p>
          ) : (
            <div className="space-y-3">
              {allScenarios.slice(0, 6).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-aegis-cloud truncate">
                      {s.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge
                        label={s.difficulty.toUpperCase()}
                        variant="neutral"
                      />
                      <span className="text-[10px] font-mono text-aegis-slate">
                        {s.estimated_duration_minutes} min
                      </span>
                    </div>
                  </div>
                  <AegisButton
                    size="sm"
                    icon={<Play className="w-3.5 h-3.5" />}
                    disabled={!user || starting}
                    onClick={() => onStart(s.id)}
                  >
                    Start
                  </AegisButton>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>

      {/* Recent sessions + weakness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Your Recent Swarm Sessions
          </h3>
          {!user ? (
            <p className="text-xs text-aegis-slate py-3">Sign in to see your sessions.</p>
          ) : sessionsState.loading ? (
            <LoadingInline label="Loading sessions" />
          ) : sessionsState.error ? (
            <ErrorInline
              message={sessionsState.error}
              onRetry={sessionsState.refetch}
            />
          ) : recentSessions.length === 0 ? (
            <p className="text-xs text-aegis-slate py-3">
              No swarm AI sessions on record.
            </p>
          ) : (
            <div className="space-y-2">
              {recentSessions.slice(0, 5).map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <p className="text-xs font-mono font-bold text-aegis-cyan">
                    {shortId(s.id)}
                  </p>
                  <StatusBadge
                    label={s.status.toUpperCase()}
                    variant={
                      s.status === "active"
                        ? "active"
                        : s.status === "completed"
                        ? "online"
                        : s.status === "paused"
                        ? "warning"
                        : "neutral"
                    }
                    pulse={s.status === "active"}
                  />
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Domain Weakness
          </h3>
          {!user || user.role === "trainee" ? (
            <p className="text-xs text-aegis-slate py-3">
              Instructor or higher required to view domain analytics.
            </p>
          ) : weakState.loading ? (
            <LoadingInline label="Loading analytics" />
          ) : weakState.error ? (
            <ErrorInline message={weakState.error} onRetry={weakState.refetch} />
          ) : !weakState.data ? (
            <p className="text-xs text-aegis-slate py-3">No analytics available yet.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-aegis-cloud leading-relaxed">
                {weakState.data.recommended_focus}
              </p>
              <div className="space-y-2">
                {weakState.data.weakest_skills.slice(0, 5).map((s) => (
                  <div
                    key={s.skill}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-aegis-cloud truncate">{s.skill}</span>
                    <span className="font-mono font-bold text-aegis-amber">
                      {Math.round(s.average_score)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassPanel>
      </div>
    </motion.div>
  );
}
