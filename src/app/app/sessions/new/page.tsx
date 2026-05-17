"use client";

import { motion } from "framer-motion";
import { Play, ChevronRight, AlertTriangle, RefreshCw, Search } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { scenarios as scenariosApi, users as usersApi, sessions as sessionsApi } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";

const steps = [
  { num: 1, label: "Select Scenario", active: true },
  { num: 2, label: "Assign Trainee", active: true },
  { num: 3, label: "Launch", active: true },
];

function LoadingBlock({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-8 gap-3 text-aegis-mist">
      <RefreshCw className="w-4 h-4 animate-spin text-aegis-cyan" />
      <span className="font-heading text-xs tracking-[0.1em] uppercase">{label}</span>
    </div>
  );
}

function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="w-10 h-10 rounded-full bg-aegis-red/10 border border-aegis-red/30 flex items-center justify-center">
        <AlertTriangle className="w-4 h-4 text-aegis-red" />
      </div>
      <p className="text-xs text-aegis-mist text-center max-w-md">{message}</p>
      <AegisButton size="sm" variant="secondary" icon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
        Retry
      </AegisButton>
    </div>
  );
}

export default function NewSessionPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const isTrainee = user?.role === "trainee";

  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [traineeId, setTraineeId] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const scenariosQ = useApi(
    () =>
      scenariosApi.list({
        page: 1,
        page_size: 50,
        domain: domainFilter || undefined,
        difficulty: difficultyFilter || undefined,
      }),
    [domainFilter, difficultyFilter]
  );

  const traineesQ = useApi(
    () => usersApi.trainees({ page: 1, page_size: 100 }),
    [],
    { skip: isTrainee }
  );

  const createSession = useMutation(sessionsApi.create);

  const filteredScenarios = useMemo(() => {
    const items = scenariosQ.data?.items ?? [];
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q) ||
        s.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [scenariosQ.data, search]);

  const effectiveTraineeId = isTrainee ? user?.id ?? null : traineeId;
  const canSubmit = !!scenarioId && !!effectiveTraineeId && !createSession.loading;

  async function handleSubmit() {
    if (!scenarioId || !effectiveTraineeId) return;
    const result = await createSession.run({
      scenario_id: scenarioId,
      trainee_id: effectiveTraineeId,
      instructor_id: !isTrainee ? user?.id : undefined,
    });
    if (result) {
      router.push(`/app/sessions/${result.id}`);
    }
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
      <motion.div variants={fadeInUp}>
        <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">Launch New Training Session</h1>
        <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
          Configure and launch a training scenario
        </p>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <GlassPanel className="flex items-center justify-between p-4" animated={false}>
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm font-bold ${
                  step.active
                    ? "bg-aegis-cyan/20 text-aegis-cyan border border-aegis-cyan/40"
                    : "bg-white/[0.04] text-aegis-slate"
                }`}
              >
                {step.num}
              </div>
              <span
                className={`text-xs font-heading tracking-wide ${
                  step.active ? "text-aegis-cloud font-semibold" : "text-aegis-slate"
                }`}
              >
                {step.label}
              </span>
              {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-aegis-gunmetal mx-2" />}
            </div>
          ))}
        </GlassPanel>
      </motion.div>

      {/* Step 1: Scenario Selection */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
            Step 1: Select Scenario
          </h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-aegis-slate absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scenarios..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/30 w-48"
              />
            </div>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
            >
              <option value="">All domains</option>
              <option value="bridge">Bridge</option>
              <option value="cic">CIC</option>
              <option value="engineering">Engineering</option>
              <option value="damage_control">Damage Control</option>
              <option value="unmanned">Unmanned</option>
            </select>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs font-heading text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30"
            >
              <option value="">All difficulty</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {scenariosQ.loading ? (
          <GlassPanel animated={false}>
            <LoadingBlock label="Loading scenarios..." />
          </GlassPanel>
        ) : scenariosQ.error ? (
          <GlassPanel animated={false}>
            <ErrorBlock message={scenariosQ.error} onRetry={scenariosQ.refetch} />
          </GlassPanel>
        ) : filteredScenarios.length === 0 ? (
          <GlassPanel animated={false}>
            <p className="text-center text-xs text-aegis-mist py-8">No scenarios match your filters.</p>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScenarios.map((scenario) => {
              const selected = scenarioId === scenario.id;
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => setScenarioId(scenario.id)}
                  className="text-left"
                >
                  <GlassPanel
                    className={`cursor-pointer transition-all group ${
                      selected
                        ? "border-aegis-cyan/40 shadow-[0_0_20px_rgba(0,229,255,0.1)]"
                        : "hover:border-aegis-cyan/20"
                    }`}
                    animated={false}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-shadow">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-heading text-base font-bold text-aegis-white tracking-wide mb-1 truncate">
                      {scenario.title}
                    </h4>
                    <p className="text-[10px] font-mono text-aegis-slate uppercase tracking-wider">
                      {scenario.domain} &bull; {scenario.difficulty}
                    </p>
                    <p className="text-[10px] font-mono text-aegis-slate mt-1">
                      ~{scenario.estimated_duration_minutes}m &bull; doctrine {scenario.doctrine_version}
                    </p>
                  </GlassPanel>
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Step 2: Trainee Selection */}
      {!isTrainee && (
        <motion.div variants={fadeInUp}>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
            Step 2: Assign Trainee
          </h3>
          <GlassPanel animated={false}>
            {traineesQ.loading ? (
              <LoadingBlock label="Loading trainees..." />
            ) : traineesQ.error ? (
              <ErrorBlock message={traineesQ.error} onRetry={traineesQ.refetch} />
            ) : (traineesQ.data?.items.length ?? 0) === 0 ? (
              <p className="text-center text-xs text-aegis-mist py-4">No trainees available.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {traineesQ.data!.items.map((t) => {
                  const selected = traineeId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTraineeId(t.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                        selected
                          ? "bg-aegis-cyan/10 border-aegis-cyan/40"
                          : "bg-white/[0.02] border-white/[0.04] hover:border-white/[0.08]"
                      }`}
                    >
                      <div className="text-left">
                        <p className="text-sm font-heading font-semibold text-aegis-cloud">
                          {t.rank} {t.name}
                        </p>
                        <p className="text-[10px] font-mono text-aegis-slate">
                          {t.service_number} &bull; {t.unit}
                        </p>
                      </div>
                      {selected && (
                        <span className="text-[10px] font-heading font-bold tracking-wider text-aegis-cyan uppercase">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </GlassPanel>
        </motion.div>
      )}

      {isTrainee && user && (
        <motion.div variants={fadeInUp}>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
            Trainee
          </h3>
          <GlassPanel animated={false}>
            <p className="text-sm font-heading font-semibold text-aegis-cloud">
              {user.rank} {user.name}
            </p>
            <p className="text-[10px] font-mono text-aegis-slate mt-1">
              {user.service_number} &bull; {user.unit}
            </p>
          </GlassPanel>
        </motion.div>
      )}

      {createSession.error && (
        <motion.div variants={fadeInUp}>
          <GlassPanel animated={false} className="border-aegis-red/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-aegis-red shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-heading font-semibold text-aegis-red">Could not start session</p>
                <p className="text-xs text-aegis-mist mt-1">{createSession.error}</p>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      )}

      <motion.div variants={fadeInUp} className="flex justify-end gap-3">
        <Link href="/app/sessions">
          <AegisButton variant="ghost">Cancel</AegisButton>
        </Link>
        <AegisButton
          icon={<ChevronRight className="w-4 h-4" />}
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={createSession.loading}
        >
          Launch Session
        </AegisButton>
      </motion.div>
    </motion.div>
  );
}
