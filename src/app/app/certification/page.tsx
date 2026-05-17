"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { AegisButton } from "@/components/ui/aegis-button";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import { certifications } from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";
import type { CertVerification } from "@/lib/api/types";

const EVALUATOR_ROLES = new Set(["evaluator", "admin", "instructor", "fleet"]);

export default function CertificationPage() {
  const user = useUserStore((s) => s.user);
  const isEvaluator = !!user && EVALUATOR_ROLES.has(user.role);

  const traineeState = useApi(
    () =>
      user && !isEvaluator
        ? certifications.forTrainee(user.id)
        : Promise.resolve(null),
    [user?.id, isEvaluator],
    { skip: !user || isEvaluator }
  );

  const pendingState = useApi(
    () => (isEvaluator ? certifications.pending() : Promise.resolve(null)),
    [isEvaluator],
    { skip: !isEvaluator }
  );

  const verifyMutation = useMutation(certifications.verify);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyResult, setVerifyResult] = useState<CertVerification | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = async (certId: string) => {
    setVerifyingId(certId);
    const res = await verifyMutation.run(certId);
    setVerifyingId(null);
    if (res) {
      setVerifyResult(res);
      setVerifyOpen(true);
    }
  };

  const myCerts = traineeState.data ?? [];
  const pending = pendingState.data ?? [];
  const loading = traineeState.loading || pendingState.loading;
  const error = traineeState.error || pendingState.error;

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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-aegis-gold to-aegis-amber flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
              Certification & Qualification Tracker
            </h1>
            <p className="font-heading text-sm text-aegis-mist tracking-wider mt-0.5">
              {isEvaluator
                ? "Review pending qualifications & verify issued certificates"
                : "Your earned certifications & qualification history"}
            </p>
          </div>
        </div>
        <StatusBadge label="Module Active" variant="active" pulse />
      </motion.div>

      {/* Banners */}
      {!user && (
        <GlassPanel animated={false} className="p-4">
          <p className="text-sm text-aegis-mist">Sign in to view certifications.</p>
        </GlassPanel>
      )}
      {error && (
        <GlassPanel animated={false} className="p-4 border border-aegis-red/30">
          <p className="text-sm text-aegis-red">Failed to load: {error}</p>
        </GlassPanel>
      )}
      {loading && (
        <GlassPanel animated={false} className="p-4">
          <p className="text-sm text-aegis-mist">Loading certifications...</p>
        </GlassPanel>
      )}

      {/* Metrics */}
      <motion.div variants={fadeInUp}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric
            label={isEvaluator ? "Pending Review" : "Earned"}
            value={isEvaluator ? String(pending.length) : String(myCerts.length)}
          />
          <Metric
            label={isEvaluator ? "Distinct Trainees" : "Active"}
            value={
              isEvaluator
                ? String(new Set(pending.map((p) => p.trainee_id)).size)
                : String(myCerts.filter((c) => !c.is_revoked).length)
            }
          />
          <Metric
            label={isEvaluator ? "Domains" : "Revoked"}
            value={
              isEvaluator
                ? String(new Set(pending.map((p) => p.domain)).size)
                : String(myCerts.filter((c) => c.is_revoked).length)
            }
          />
          <Metric
            label="Status"
            value={loading ? "Loading" : error ? "Error" : "Live"}
          />
        </div>
      </motion.div>

      {/* Trainee view: cert cards */}
      {!isEvaluator && user && (
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
              My Certifications
            </h3>
            {myCerts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myCerts.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border ${
                      c.is_revoked
                        ? "bg-aegis-red/[0.04] border-aegis-red/20"
                        : "bg-white/[0.02] border-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            c.is_revoked
                              ? "bg-aegis-red/15"
                              : "bg-aegis-gold/15"
                          }`}
                        >
                          <Award
                            className={`w-5 h-5 ${
                              c.is_revoked ? "text-aegis-red" : "text-aegis-gold"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-aegis-cloud capitalize">
                            {c.cert_type.replace(/_/g, " ")}
                          </p>
                          <p className="text-[10px] font-mono text-aegis-slate capitalize">
                            {c.domain.replace(/_/g, " ")}
                          </p>
                        </div>
                      </div>
                      <StatusBadge
                        label={c.is_revoked ? "REVOKED" : "VALID"}
                        variant={c.is_revoked ? "alert" : "online"}
                      />
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono">
                      <Row label="Cert No" value={c.certificate_number} />
                      <Row
                        label="Issued"
                        value={new Date(c.issued_at).toLocaleDateString()}
                      />
                      <Row
                        label="Valid Until"
                        value={
                          c.valid_until
                            ? new Date(c.valid_until).toLocaleDateString()
                            : "Indefinite"
                        }
                      />
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/[0.04]">
                      <AegisButton
                        size="sm"
                        variant="secondary"
                        loading={verifyingId === c.id}
                        onClick={() => handleVerify(c.id)}
                        icon={<ShieldCheck className="w-3.5 h-3.5" />}
                      >
                        Verify
                      </AegisButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading ? (
              <p className="text-xs text-aegis-slate">
                No certifications issued yet.
              </p>
            ) : null}
          </GlassPanel>
        </motion.div>
      )}

      {/* Evaluator view: pending candidates */}
      {isEvaluator && (
        <motion.div variants={fadeInUp}>
          <GlassPanel>
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
              Eligible for Certification
            </h3>
            {pending.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Trainee", "Rank", "Domain", "Session", "Score", ""].map(
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
                    {pending.map((p) => (
                      <tr
                        key={p.completed_session_id}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-aegis-cloud">
                          {p.trainee_name}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-mist">
                          {p.rank}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-mist capitalize">
                          {p.domain.replace(/_/g, " ")}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-cyan">
                          {p.completed_session_id.slice(0, 8)}
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-aegis-cloud">
                          {p.score
                            ? JSON.stringify(p.score).slice(0, 32)
                            : "--"}
                        </td>
                        <td className="py-3 px-4">
                          <a
                            href="/app/evaluator"
                            className="text-[10px] font-heading text-aegis-cyan hover:text-aegis-white transition-colors"
                          >
                            Issue &rarr;
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : !loading ? (
              <p className="text-xs text-aegis-slate">
                No trainees pending certification right now.
              </p>
            ) : null}
          </GlassPanel>
        </motion.div>
      )}

      {/* Verify modal */}
      {verifyOpen && verifyResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setVerifyOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl glass-card border border-white/10 p-6 relative"
          >
            <button
              onClick={() => setVerifyOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/[0.06] cursor-pointer"
            >
              <X className="w-4 h-4 text-aegis-mist" />
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  verifyResult.is_valid
                    ? "bg-aegis-green/15"
                    : "bg-aegis-red/15"
                }`}
              >
                {verifyResult.is_valid ? (
                  <CheckCircle2 className="w-6 h-6 text-aegis-green" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-aegis-red" />
                )}
              </div>
              <div>
                <p className="font-display text-lg font-bold text-aegis-white">
                  {verifyResult.is_valid
                    ? "Certificate Verified"
                    : "Certificate Invalid"}
                </p>
                <p className="text-[10px] font-mono text-aegis-slate">
                  {verifyResult.certificate_number}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-[12px] font-mono">
              <Row label="Issued To" value={`${verifyResult.issued_to_rank} ${verifyResult.issued_to}`} />
              <Row label="Cert Type" value={verifyResult.cert_type} />
              <Row label="Domain" value={verifyResult.domain} />
              <Row
                label="Issued At"
                value={new Date(verifyResult.issued_at).toLocaleString()}
              />
              <Row
                label="Valid Until"
                value={
                  verifyResult.valid_until
                    ? new Date(verifyResult.valid_until).toLocaleString()
                    : "Indefinite"
                }
              />
              <Row
                label="Revoked"
                value={verifyResult.is_revoked ? "Yes" : "No"}
              />
              {verifyResult.revoked_reason && (
                <Row label="Reason" value={verifyResult.revoked_reason} />
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <GlassPanel className="p-4 text-center" animated={false}>
      <p className="font-mono text-2xl font-bold text-aegis-cyan">{value}</p>
      <p className="text-[10px] font-heading text-aegis-slate tracking-[0.08em] uppercase mt-1">
        {label}
      </p>
    </GlassPanel>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-aegis-slate uppercase tracking-wider text-[10px]">
        {label}
      </span>
      <span className="text-aegis-cloud text-right truncate">{value}</span>
    </div>
  );
}
