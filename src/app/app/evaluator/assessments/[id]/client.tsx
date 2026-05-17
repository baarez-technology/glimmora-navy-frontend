"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  BrainCircuit,
  Award,
  Ban,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import {
  sessions as sessionsApi,
  ai as aiApi,
  certifications as certsApi,
} from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import type { TrainingSession } from "@/lib/api/types";

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function formatDate(iso?: string | null): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

export default function AssessmentDetailClient({ id }: Props) {
  const sessionState = useApi(() => sessionsApi.get(id), [id]);
  const session = sessionState.data;

  const [traineeAction, setTraineeAction] = useState("");
  const [expectedAction, setExpectedAction] = useState("");
  const [contextNote, setContextNote] = useState("");

  const [certType, setCertType] = useState("Domain Qualification");
  const [certDomain, setCertDomain] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const [actionResult, setActionResult] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);

  const assessMutation = useMutation(aiApi.assess);
  const issueMutation = useMutation(certsApi.issue);

  const score = session ? scoreFromSession(session) : null;
  const aiResult = assessMutation.data;

  async function handleRunAssessment(e: React.FormEvent) {
    e.preventDefault();
    setActionResult(null);
    if (!session) return;
    if (!traineeAction.trim() || !expectedAction.trim()) {
      setActionResult({
        kind: "error",
        message: "Trainee action and expected action are required.",
      });
      return;
    }
    const result = await assessMutation.run({
      session_id: session.id,
      trainee_action: traineeAction.trim(),
      expected_action: expectedAction.trim(),
      context: contextNote.trim() || undefined,
    });
    if (!result && assessMutation.error) {
      setActionResult({ kind: "error", message: assessMutation.error });
    }
  }

  async function handleCertify() {
    setActionResult(null);
    if (!session) return;
    if (!certDomain.trim()) {
      setActionResult({
        kind: "error",
        message: "Domain is required to issue a certification.",
      });
      return;
    }
    const result = await issueMutation.run({
      user_id: session.trainee_id,
      cert_type: certType.trim() || "Domain Qualification",
      domain: certDomain.trim(),
      valid_until: validUntil || undefined,
      evidence_session_ids: [session.id],
    });
    if (result) {
      setActionResult({
        kind: "success",
        message: `Certification issued: ${result.certificate_number}`,
      });
    } else if (issueMutation.error) {
      setActionResult({ kind: "error", message: issueMutation.error });
    }
  }

  function handleDoNotCertify() {
    setActionResult({
      kind: "success",
      message:
        "Recorded: trainee will NOT be certified at this time. Notify instructor for remediation.",
    });
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <ClipboardCheck className="w-6 h-6 text-aegis-void" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Assessment Review: {session ? shortId(session.id) : shortId(id)}
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              Detailed Scoring, Evidence Review &amp; Final Determination
            </p>
          </div>
        </div>
        {session && (
          <StatusBadge
            label={session.status.toUpperCase()}
            variant={sessionStatusVariant(session.status)}
          />
        )}
      </motion.div>

      {/* Session detail */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Session Detail
          </h3>
          {sessionState.loading ? (
            <InlineLoading label="Loading session" />
          ) : sessionState.error ? (
            <InlineError
              message={sessionState.error}
              onRetry={sessionState.refetch}
            />
          ) : !session ? (
            <p className="text-xs text-aegis-slate py-3">No session data.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Session ID", value: shortId(session.id) },
                { label: "Trainee", value: shortId(session.trainee_id) },
                {
                  label: "Instructor",
                  value: session.instructor_id ? shortId(session.instructor_id) : "--",
                },
                { label: "Scenario", value: shortId(session.scenario_id) },
                { label: "Started", value: formatDate(session.started_at) },
                { label: "Ended", value: formatDate(session.ended_at) },
                {
                  label: "Score",
                  value: score !== null ? `${score}` : "--",
                },
                { label: "Status", value: session.status },
              ].map((f) => (
                <div
                  key={f.label}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase">
                    {f.label}
                  </p>
                  <p className="text-sm font-heading text-aegis-cloud mt-1 break-all">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          )}
          {session?.instructor_notes && (
            <div className="mt-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mb-1">
                Instructor Notes
              </p>
              <p className="text-sm text-aegis-cloud leading-relaxed">
                {session.instructor_notes}
              </p>
            </div>
          )}
          <div className="mt-4 flex items-center gap-3">
            {session && (
              <Link
                href={`/app/sessions/${session.id}`}
                className="inline-flex items-center gap-1 text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors"
              >
                Open Session <ChevronRight className="w-3 h-3" />
              </Link>
            )}
            {session && (
              <Link
                href={`/app/sessions/${session.id}/replay`}
                className="inline-flex items-center gap-1 text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors"
              >
                Replay <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </GlassPanel>
      </motion.div>

      {/* AI Assessment form */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
              AI-Assisted Assessment
            </h3>
            <BrainCircuit className="w-4 h-4 text-aegis-purple" />
          </div>
          <form onSubmit={handleRunAssessment} className="space-y-4">
            <div>
              <label className="block text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mb-1.5">
                Trainee Action
              </label>
              <textarea
                value={traineeAction}
                onChange={(e) => setTraineeAction(e.target.value)}
                rows={3}
                placeholder="Describe what the trainee actually did..."
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-aegis-cloud placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/40 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mb-1.5">
                Expected Action
              </label>
              <textarea
                value={expectedAction}
                onChange={(e) => setExpectedAction(e.target.value)}
                rows={3}
                placeholder="Describe the doctrine-correct action..."
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-aegis-cloud placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/40 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mb-1.5">
                Context (optional)
              </label>
              <textarea
                value={contextNote}
                onChange={(e) => setContextNote(e.target.value)}
                rows={2}
                placeholder="Additional context for the assessment..."
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-aegis-cloud placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/40 transition-colors resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <AegisButton
                size="sm"
                type="submit"
                loading={assessMutation.loading}
                icon={<BrainCircuit className="w-4 h-4" />}
              >
                Run AI Assessment
              </AegisButton>
              {assessMutation.error && (
                <span className="text-xs text-aegis-red">{assessMutation.error}</span>
              )}
            </div>
          </form>

          {aiResult && (
            <div className="mt-6 p-4 rounded-xl bg-aegis-purple/5 border border-aegis-purple/20">
              <div className="flex items-center justify-between mb-3">
                <p className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-purple">
                  AI Result
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-aegis-mist">
                    Confidence {Math.round(aiResult.confidence * 100)}%
                  </span>
                  <span className="text-lg font-mono font-bold text-aegis-cyan">
                    {Math.round(aiResult.score)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-aegis-cloud leading-relaxed whitespace-pre-wrap">
                {aiResult.feedback}
              </p>
              {aiResult.competency_tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {aiResult.competency_tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-heading px-2 py-0.5 rounded-full bg-white/[0.04] text-aegis-cyan border border-aegis-cyan/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </GlassPanel>
      </motion.div>

      {/* Final determination */}
      <motion.div variants={fadeInUp}>
        <GlassPanel>
          <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
            Final Determination
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mb-1.5">
                Certification Type
              </label>
              <input
                type="text"
                value={certType}
                onChange={(e) => setCertType(e.target.value)}
                placeholder="Domain Qualification"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-aegis-cloud placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mb-1.5">
                Domain
              </label>
              <input
                type="text"
                value={certDomain}
                onChange={(e) => setCertDomain(e.target.value)}
                placeholder="bridge_navigation"
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-aegis-cloud placeholder:text-aegis-slate focus:outline-none focus:border-aegis-cyan/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mb-1.5">
                Valid Until (optional)
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-aegis-cloud focus:outline-none focus:border-aegis-cyan/40 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AegisButton
              size="md"
              onClick={handleCertify}
              loading={issueMutation.loading}
              disabled={!session || sessionState.loading}
              icon={<Award className="w-4 h-4" />}
            >
              Certify
            </AegisButton>
            <AegisButton
              size="md"
              variant="danger"
              onClick={handleDoNotCertify}
              disabled={!session || sessionState.loading}
              icon={<Ban className="w-4 h-4" />}
            >
              Do Not Certify
            </AegisButton>
          </div>

          {actionResult && (
            <div
              className={`mt-4 flex items-start gap-3 p-3 rounded-lg border ${
                actionResult.kind === "success"
                  ? "bg-aegis-green/5 border-aegis-green/20"
                  : "bg-aegis-red/5 border-aegis-red/20"
              }`}
            >
              {actionResult.kind === "success" ? (
                <CheckCircle className="w-4 h-4 text-aegis-green shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-aegis-red shrink-0 mt-0.5" />
              )}
              <p
                className={`text-xs leading-relaxed ${
                  actionResult.kind === "success"
                    ? "text-aegis-green"
                    : "text-aegis-red"
                }`}
              >
                {actionResult.message}
              </p>
            </div>
          )}
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
