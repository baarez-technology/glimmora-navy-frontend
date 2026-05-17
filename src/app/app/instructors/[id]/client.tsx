"use client";

import { motion } from "framer-motion";
import {
  UserCog,
  Activity,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import {
  users as usersApi,
  sessions as sessionsApi,
} from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import type { TrainingSession } from "@/lib/api/types";

function formatDate(iso?: string | null): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function scoreFromSession(s: TrainingSession): number | null {
  const raw = s.score;
  if (!raw) return null;
  const candidate = (raw.overall ?? raw.total ?? raw.score) as unknown;
  if (typeof candidate === "number") return Math.round(candidate);
  return null;
}

function sessionStatusVariant(
  status: TrainingSession["status"]
): "online" | "warning" | "active" | "neutral" {
  if (status === "completed") return "online";
  if (status === "active") return "active";
  if (status === "paused") return "warning";
  return "neutral";
}

function InlineLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-6 text-aegis-mist">
      <RefreshCw className="w-4 h-4 animate-spin text-aegis-cyan" />
      <span className="text-xs font-heading tracking-wider uppercase">
        {label}&hellip;
      </span>
    </div>
  );
}

function InlineError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-4">
      <AlertTriangle className="w-4 h-4 text-aegis-red shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs text-aegis-cloud leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-[10px] font-heading text-aegis-cyan mt-2 tracking-wider uppercase cursor-pointer"
          >
            Retry &rarr;
          </button>
        )}
      </div>
    </div>
  );
}

interface Props {
  id: string;
}

export default function InstructorDetailClient({ id }: Props) {
  const userState = useApi(() => usersApi.get(id), [id]);
  const sessionsState = useApi(
    () => sessionsApi.list({ instructor_id: id, page_size: 50 }),
    [id]
  );

  const user = userState.data;
  const sessionItems: TrainingSession[] = sessionsState.data?.items ?? [];

  const totalSessions = sessionsState.data?.total ?? sessionItems.length;
  const activeSessions = sessionItems.filter((s) => s.status === "active").length;
  const completedSessions = sessionItems.filter((s) => s.status === "completed").length;
  const uniqueTrainees = new Set(sessionItems.map((s) => s.trainee_id)).size;

  const displayName = user ? user.name : "Instructor";
  const displaySub = user
    ? `${user.unit || "Unassigned"} • ${user.rank} • ${user.classification_clearance || "Standard"}`
    : "Loading profile...";

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-blue flex items-center justify-center">
            <UserCog className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              {displayName}
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              {displaySub}
            </p>
          </div>
        </div>
        {user && (
          <StatusBadge
            label={user.is_active ? "ACTIVE" : "INACTIVE"}
            variant={user.is_active ? "active" : "neutral"}
            pulse={user.is_active}
          />
        )}
      </motion.div>

      {userState.error && (
        <GlassPanel animated={false}>
          <InlineError message={userState.error} onRetry={userState.refetch} />
        </GlassPanel>
      )}

      {/* Quick Stats */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Sessions Supervised",
              value: String(totalSessions),
            },
            {
              label: "Active Sessions",
              value: String(activeSessions),
            },
            {
              label: "Completed",
              value: String(completedSessions),
            },
            {
              label: "Trainees",
              value: String(uniqueTrainees),
            },
          ].map((m) => (
            <GlassPanel key={m.label} className="p-4 text-center" animated={false}>
              <p className="font-mono text-2xl font-bold text-aegis-cyan">{m.value}</p>
              <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
                {m.label}
              </p>
            </GlassPanel>
          ))}
        </div>
      </motion.div>

      {/* Profile */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Profile
          </h3>
          {userState.loading ? (
            <InlineLoading label="Loading profile" />
          ) : !user ? (
            <p className="text-xs text-aegis-slate py-3">No profile data.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Service Number", value: user.service_number },
                { label: "Rank", value: user.rank },
                { label: "Unit", value: user.unit || "--" },
                { label: "Role", value: user.role },
                {
                  label: "Clearance",
                  value: user.classification_clearance || "--",
                },
                {
                  label: "Last Login",
                  value: user.last_login ? formatDate(user.last_login) : "Never",
                },
                { label: "Joined", value: formatDate(user.created_at) },
                {
                  label: "Cohort",
                  value: user.cohort_id ? shortId(user.cohort_id) : "--",
                },
              ].map((f) => (
                <div
                  key={f.label}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                    {f.label}
                  </p>
                  <p className="text-sm font-heading text-aegis-cloud mt-1">{f.value}</p>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {/* Sessions Led */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              Sessions Led
            </h3>
            <Link
              href="/app/sessions"
              className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1 cursor-pointer"
            >
              All Sessions <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {sessionsState.loading ? (
            <InlineLoading label="Loading sessions" />
          ) : sessionsState.error ? (
            <InlineError
              message={sessionsState.error}
              onRetry={sessionsState.refetch}
            />
          ) : sessionItems.length === 0 ? (
            <p className="text-xs text-aegis-slate py-3">No sessions supervised yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Session", "Scenario", "Trainee", "Created", "Score", "Status", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-4 text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sessionItems.map((s) => {
                    const score = scoreFromSession(s);
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4 text-xs font-mono font-bold text-aegis-cyan">
                          {shortId(s.id)}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-cloud">
                          {shortId(s.scenario_id)}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                          {shortId(s.trainee_id)}
                        </td>
                        <td className="py-3 px-4 text-[10px] font-mono text-aegis-slate">
                          {formatDate(s.created_at)}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono font-bold text-aegis-cyan">
                          {score !== null ? score : "--"}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge
                            label={s.status.toUpperCase()}
                            variant={sessionStatusVariant(s.status)}
                            pulse={s.status === "active"}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/app/sessions/${s.id}`}
                            className="inline-flex items-center gap-1 text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors"
                          >
                            <Activity className="w-3 h-3" /> View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
