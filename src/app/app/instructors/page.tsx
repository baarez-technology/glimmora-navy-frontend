"use client";

import { motion } from "framer-motion";
import {
  UserCog,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { users as usersApi } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import type { BackendUser } from "@/lib/api/types";

function formatDate(iso?: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LoadingPanel() {
  return (
    <GlassPanel animated={false}>
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-aegis-mist">
          <RefreshCw className="w-4 h-4 animate-spin text-aegis-cyan" />
          <span className="font-heading text-xs tracking-[0.1em] uppercase">
            Loading instructors...
          </span>
        </div>
      </div>
    </GlassPanel>
  );
}

function ErrorPanel({
  message,
  onRetry,
  forbidden,
}: {
  message: string;
  onRetry: () => void;
  forbidden?: boolean;
}) {
  return (
    <GlassPanel animated={false}>
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div
          className={`w-12 h-12 rounded-full border flex items-center justify-center ${
            forbidden
              ? "bg-aegis-amber/10 border-aegis-amber/30"
              : "bg-aegis-red/10 border-aegis-red/30"
          }`}
        >
          {forbidden ? (
            <ShieldAlert className="w-5 h-5 text-aegis-amber" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-aegis-red" />
          )}
        </div>
        <div className="text-center">
          <p className="font-heading text-sm font-semibold text-aegis-cloud tracking-wide">
            {forbidden ? "Insufficient permissions" : "Failed to load instructors"}
          </p>
          <p className="text-xs text-aegis-mist mt-1 max-w-md">{message}</p>
        </div>
        {!forbidden && (
          <AegisButton
            size="sm"
            variant="secondary"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={onRetry}
          >
            Retry
          </AegisButton>
        )}
      </div>
    </GlassPanel>
  );
}

export default function InstructorsPage() {
  const { data, loading, error, refetch } = useApi(
    () => usersApi.list({ role: "instructor", page: 1, page_size: 200 }),
    []
  );

  const items: BackendUser[] = data?.items ?? [];
  const totalCount = data?.total ?? items.length;
  const activeCount = items.filter((u) => u.is_active).length;

  const forbidden = !!error && /403|forbidden|permission/i.test(error);

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-purple to-aegis-blue flex items-center justify-center">
            <UserCog className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Instructor Management
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Instructor Profiles, Assignments, AI Governance &amp; Authoring
            </p>
          </div>
        </div>
        <StatusBadge label="Module Active" variant="active" pulse />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Instructors", value: String(totalCount) },
            { label: "Active", value: String(activeCount) },
            {
              label: "Units",
              value: String(
                new Set(items.map((u) => u.unit).filter(Boolean)).size
              ),
            },
            {
              label: "Ranks",
              value: String(
                new Set(items.map((u) => u.rank).filter(Boolean)).size
              ),
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

      <motion.div variants={fadeInUp}>
        {loading ? (
          <LoadingPanel />
        ) : error ? (
          <ErrorPanel message={error} onRetry={refetch} forbidden={forbidden} />
        ) : items.length === 0 ? (
          <GlassPanel animated={false}>
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <UserCog className="w-5 h-5 text-aegis-slate" />
              </div>
              <p className="font-heading text-sm text-aegis-mist tracking-wide">
                No instructors found.
              </p>
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel animated={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Name", "Service #", "Rank", "Unit", "Last Login", "Status", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-[10px] font-heading font-bold tracking-[0.1em] uppercase text-aegis-slate"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-aegis-cloud font-medium">{u.name}</td>
                      <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                        {u.service_number}
                      </td>
                      <td className="py-3 px-4 text-xs font-heading text-aegis-cloud">{u.rank}</td>
                      <td className="py-3 px-4 text-xs text-aegis-mist">{u.unit || "--"}</td>
                      <td className="py-3 px-4 text-[10px] font-mono text-aegis-slate">
                        {formatDate(u.last_login)}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge
                          label={u.is_active ? "ACTIVE" : "INACTIVE"}
                          variant={u.is_active ? "online" : "neutral"}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/app/instructors/${u.id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors"
                        >
                          View <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        )}
      </motion.div>
    </motion.div>
  );
}
