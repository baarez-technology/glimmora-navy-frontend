"use client";

import { motion } from "framer-motion";
import {
  Users,
  Search,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
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
            Loading trainees...
          </span>
        </div>
      </div>
    </GlassPanel>
  );
}

function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <GlassPanel animated={false}>
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-12 h-12 rounded-full bg-aegis-red/10 border border-aegis-red/30 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-aegis-red" />
        </div>
        <div className="text-center">
          <p className="font-heading text-sm font-semibold text-aegis-cloud tracking-wide">
            Failed to load trainees
          </p>
          <p className="text-xs text-aegis-mist mt-1 max-w-md">{message}</p>
        </div>
        <AegisButton
          size="sm"
          variant="secondary"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={onRetry}
        >
          Retry
        </AegisButton>
      </div>
    </GlassPanel>
  );
}

export default function TraineesPage() {
  const [search, setSearch] = useState("");

  const { data, loading, error, refetch } = useApi(
    () => usersApi.trainees({ page: 1, page_size: 100 }),
    []
  );

  const items: BackendUser[] = data?.items ?? [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((u) => {
      return (
        u.name.toLowerCase().includes(q) ||
        u.service_number.toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  const totalCount = data?.total ?? items.length;
  const activeCount = items.filter((u) => u.is_active).length;
  const unitCount = new Set(items.map((u) => u.unit).filter(Boolean)).size;
  const cohortCount = new Set(items.map((u) => u.cohort_id).filter(Boolean)).size;

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Trainee Management
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Enrolment, Profiles, Competency Tracking &amp; Progression
            </p>
          </div>
        </div>
        <StatusBadge label="Module Active" variant="active" pulse />
      </motion.div>

      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Trainees", value: String(totalCount) },
            { label: "Active", value: String(activeCount) },
            { label: "Units", value: String(unitCount) },
            { label: "Cohorts", value: String(cohortCount) },
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
        <GlassPanel animated={false} className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aegis-slate pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or service number..."
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-aegis-cloud placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/40 transition-colors"
            />
          </div>
        </GlassPanel>
      </motion.div>

      <motion.div variants={fadeInUp}>
        {loading ? (
          <LoadingPanel />
        ) : error ? (
          <ErrorPanel message={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <GlassPanel animated={false}>
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Users className="w-5 h-5 text-aegis-slate" />
              </div>
              <p className="font-heading text-sm text-aegis-mist tracking-wide">
                {search ? "No trainees match your search." : "No trainees found."}
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
                  {filtered.map((u) => (
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
                          href={`/app/trainees/${u.id}`}
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
