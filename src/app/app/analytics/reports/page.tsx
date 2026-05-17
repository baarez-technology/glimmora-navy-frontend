"use client";

import { motion } from "framer-motion";
import { FileText, Download, Play } from "lucide-react";
import { useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { analytics } from "@/lib/api/endpoints";
import { useMutation } from "@/lib/api/hooks";

const REPORT_TYPES = [
  { value: "trainee", label: "Individual Trainee" },
  { value: "cohort", label: "Cohort" },
  { value: "fleet", label: "Fleet Readiness" },
  { value: "domain", label: "Domain" },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("trainee");
  const [targetId, setTargetId] = useState("");
  const [domain, setDomain] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [includeRecs, setIncludeRecs] = useState(true);

  const { run, loading, error, data } = useMutation(analytics.report);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run({
      report_type: reportType,
      target_id: targetId.trim() || undefined,
      domain: domain.trim() || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      include_recommendations: includeRecs,
    });
  };

  const onDownload = () => {
    if (!data) return;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `aegis-report-${reportType}-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Report Builder
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Configurable Reports, JSON Export & Audit Snapshots
            </p>
          </div>
        </div>
        <StatusBadge label="Module Active" variant="active" pulse />
      </motion.div>

      {/* Form */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Configure Report
          </h3>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Report Type">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-aegis-cloud focus:outline-none focus:border-aegis-cyan/40"
              >
                {REPORT_TYPES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Target ID (optional)">
              <input
                type="text"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="user_id / cohort_id"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-aegis-cloud focus:outline-none focus:border-aegis-cyan/40 font-mono"
              />
            </Field>

            <Field label="Domain (optional)">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="bridge_navigation"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-aegis-cloud focus:outline-none focus:border-aegis-cyan/40 font-mono"
              />
            </Field>

            <Field label="Include Recommendations">
              <label className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRecs}
                  onChange={(e) => setIncludeRecs(e.target.checked)}
                  className="accent-aegis-cyan"
                />
                <span className="text-xs text-aegis-cloud">
                  Embed AI remediation recommendations
                </span>
              </label>
            </Field>

            <Field label="Date From">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-aegis-cloud focus:outline-none focus:border-aegis-cyan/40 font-mono"
              />
            </Field>

            <Field label="Date To">
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-aegis-cloud focus:outline-none focus:border-aegis-cyan/40 font-mono"
              />
            </Field>

            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <AegisButton
                type="submit"
                loading={loading}
                icon={<Play className="w-4 h-4" />}
              >
                Generate Report
              </AegisButton>
              <AegisButton
                type="button"
                variant="secondary"
                disabled={!data || loading}
                onClick={onDownload}
                icon={<Download className="w-4 h-4" />}
              >
                Download JSON
              </AegisButton>
            </div>
          </form>
        </GlassPanel>
      </motion.div>

      {/* Error */}
      {error && (
        <GlassPanel animated={false} className="p-4 border border-aegis-red/30">
          <p className="text-sm text-aegis-red">Report failed: {error}</p>
        </GlassPanel>
      )}

      {/* Result */}
      {data && (
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Report Output
              </h3>
              <StatusBadge label="Generated" variant="online" />
            </div>
            <pre className="max-h-[480px] overflow-auto rounded-xl bg-black/30 border border-white/[0.06] p-4 text-[11px] font-mono text-aegis-cloud leading-relaxed">
              {JSON.stringify(data, null, 2)}
            </pre>
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
