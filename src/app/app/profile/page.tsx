"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Shield,
  Award,
  Ship,
  MapPin,
  Mail,
  Calendar,
  ChevronRight,
  AlertTriangle,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { staggerContainer, fadeInUp } from "@/animations/variants";
import {
  analytics,
  certifications as certApi,
  users as usersApi,
} from "@/lib/api/endpoints";
import { useApi, useMutation } from "@/lib/api/hooks";
import {
  profileFromBackendUser,
  useUserStore,
} from "@/stores/user-store";
import type { BackendUser, Certification } from "@/lib/api/types";

function formatDate(iso?: string | null): string {
  if (!iso) return "--";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function shortId(id: string): string {
  return id.length > 8 ? id.slice(0, 8).toUpperCase() : id.toUpperCase();
}

function LoadingPanel({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-6 text-aegis-mist">
      <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
      <span className="text-xs font-heading tracking-wider uppercase">
        {label}&hellip;
      </span>
    </div>
  );
}

function ErrorPanel({
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

export default function ProfilePage() {
  const storeUser = useUserStore((s) => s.user);
  const setStoreUser = useUserStore((s) => s.login);

  // Pull fresh user from API.
  const userState = useApi<BackendUser | null>(
    () => (storeUser ? usersApi.get(storeUser.id) : Promise.resolve(null)),
    [storeUser?.id],
    { skip: !storeUser }
  );

  const analyticsState = useApi(
    () => (storeUser ? analytics.trainee(storeUser.id) : Promise.resolve(null)),
    [storeUser?.id],
    { skip: !storeUser }
  );

  const certState = useApi(
    () =>
      storeUser ? certApi.forTrainee(storeUser.id) : Promise.resolve(null),
    [storeUser?.id],
    { skip: !storeUser }
  );

  const updateMut = useMutation(
    (id: string, body: Partial<BackendUser>) => usersApi.update(id, body)
  );

  const backendUser = userState.data;

  const [editing, setEditing] = useState(false);
  const [rank, setRank] = useState("");
  const [unit, setUnit] = useState("");

  // Sync local form when the underlying user loads or changes.
  useEffect(() => {
    if (backendUser) {
      setRank(backendUser.rank ?? "");
      setUnit(backendUser.unit ?? "");
    } else if (storeUser) {
      setRank(storeUser.rank ?? "");
      setUnit(storeUser.unit ?? "");
    }
  }, [backendUser, storeUser]);

  const a = analyticsState.data;
  const certs: Certification[] = certState.data ?? [];

  const displayUser = backendUser ?? null;
  const displayName = displayUser
    ? displayUser.name
    : storeUser?.name ?? "Unknown";
  const displayRank = displayUser?.rank ?? storeUser?.rank ?? "";
  const displayUnit = displayUser?.unit ?? storeUser?.unit ?? "";
  const displayServiceNumber =
    displayUser?.service_number ?? storeUser?.service_number ?? "--";
  const displayRole = displayUser?.role ?? storeUser?.role ?? "trainee";
  const displayClearance =
    displayUser?.classification_clearance ?? storeUser?.classification_clearance;

  async function handleSave() {
    if (!storeUser) return;
    const trimmedRank = rank.trim();
    const trimmedUnit = unit.trim();
    if (!trimmedRank && !trimmedUnit) {
      setEditing(false);
      return;
    }
    const updated = await updateMut.run(storeUser.id, {
      rank: trimmedRank || displayRank,
      unit: trimmedUnit || displayUnit,
    });
    if (updated) {
      // Sync the persisted store so headers everywhere refresh.
      setStoreUser(profileFromBackendUser(updated));
      setEditing(false);
      userState.refetch();
    }
  }

  function handleCancel() {
    if (backendUser) {
      setRank(backendUser.rank ?? "");
      setUnit(backendUser.unit ?? "");
    }
    setEditing(false);
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      <motion.div
        variants={fadeInUp}
        className="flex items-center justify-between"
      >
        <h1 className="font-display text-2xl font-bold text-aegis-white tracking-wide">
          User Profile
        </h1>
        {editing ? (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={updateMut.loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass border border-aegis-cyan/30 text-xs font-heading text-aegis-cyan hover:bg-aegis-cyan/10 transition-colors cursor-pointer disabled:opacity-50"
            >
              {updateMut.loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              Save
            </button>
            <button
              onClick={handleCancel}
              disabled={updateMut.loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass border border-white/[0.06] text-xs font-heading text-aegis-mist hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            disabled={!storeUser}
            className="px-4 py-2 rounded-lg glass border border-white/[0.06] text-xs font-heading text-aegis-cyan hover:border-aegis-cyan/30 transition-colors cursor-pointer disabled:opacity-50"
          >
            Edit Profile
          </button>
        )}
      </motion.div>

      {updateMut.error && (
        <motion.div variants={fadeInUp}>
          <GlassPanel animated={false}>
            <ErrorPanel message={updateMut.error} />
          </GlassPanel>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div variants={fadeInUp}>
          <GlassPanel className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-aegis-cyan to-aegis-blue flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            {userState.loading ? (
              <LoadingPanel label="Loading profile" />
            ) : userState.error ? (
              <ErrorPanel
                message={userState.error}
                onRetry={userState.refetch}
              />
            ) : (
              <>
                <h2 className="font-heading text-xl font-bold text-aegis-white tracking-wide">
                  {displayRank} {displayName}
                </h2>
                <p className="text-xs font-mono text-aegis-mist mt-1">
                  SVC-ID: {displayServiceNumber}
                </p>
                <div className="flex justify-center gap-2 mt-3 flex-wrap">
                  <StatusBadge
                    label={displayRole.toUpperCase()}
                    variant="active"
                  />
                  {displayClearance && (
                    <StatusBadge
                      label={displayClearance.toUpperCase()}
                      variant="online"
                    />
                  )}
                </div>

                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-center gap-3 py-2">
                    <Shield className="w-4 h-4 text-aegis-slate shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                        Rank
                      </p>
                      {editing ? (
                        <input
                          value={rank}
                          onChange={(e) => setRank(e.target.value)}
                          className="w-full text-sm text-aegis-cloud bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 mt-0.5 outline-none focus:border-aegis-cyan/40"
                        />
                      ) : (
                        <p className="text-sm text-aegis-cloud">
                          {displayRank || "--"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <Ship className="w-4 h-4 text-aegis-slate shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                        Unit
                      </p>
                      {editing ? (
                        <input
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className="w-full text-sm text-aegis-cloud bg-white/[0.04] border border-white/[0.08] rounded px-2 py-1 mt-0.5 outline-none focus:border-aegis-cyan/40"
                        />
                      ) : (
                        <p className="text-sm text-aegis-cloud">
                          {displayUnit || "--"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <MapPin className="w-4 h-4 text-aegis-slate shrink-0" />
                    <div>
                      <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                        Role
                      </p>
                      <p className="text-sm text-aegis-cloud">
                        {displayRole}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <Mail className="w-4 h-4 text-aegis-slate shrink-0" />
                    <div>
                      <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                        Service Number
                      </p>
                      <p className="text-sm text-aegis-cloud">
                        {displayServiceNumber}
                      </p>
                    </div>
                  </div>

                  {displayUser?.created_at && (
                    <div className="flex items-center gap-3 py-2">
                      <Calendar className="w-4 h-4 text-aegis-slate shrink-0" />
                      <div>
                        <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                          Joined
                        </p>
                        <p className="text-sm text-aegis-cloud">
                          {formatDate(displayUser.created_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </GlassPanel>
        </motion.div>

        {/* Qualifications + Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={fadeInUp}>
            <GlassPanel>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-aegis-gold" />
                  <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                    Qualifications & Certifications
                  </h3>
                </div>
                <button className="text-[10px] font-heading text-aegis-cyan flex items-center gap-1 cursor-pointer">
                  View All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              {certState.loading ? (
                <LoadingPanel label="Loading certifications" />
              ) : certState.error ? (
                <ErrorPanel
                  message={certState.error}
                  onRetry={certState.refetch}
                />
              ) : certs.length === 0 ? (
                <p className="text-xs text-aegis-slate py-3">
                  No certifications on record yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {certs.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-aegis-cloud truncate">
                          {c.cert_type} &mdash; {c.domain}
                        </p>
                        <p className="text-[10px] font-mono text-aegis-slate mt-0.5">
                          {c.certificate_number} &bull; Issued{" "}
                          {formatDate(c.issued_at)}
                          {c.valid_until
                            ? ` • Valid until ${formatDate(c.valid_until)}`
                            : ""}
                        </p>
                      </div>
                      <StatusBadge
                        label={c.is_revoked ? "Revoked" : "Certified"}
                        variant={c.is_revoked ? "alert" : "online"}
                      />
                    </div>
                  ))}
                </div>
              )}
            </GlassPanel>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <GlassPanel>
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-5">
                Competency Scores
              </h3>
              {analyticsState.loading ? (
                <LoadingPanel label="Loading analytics" />
              ) : analyticsState.error ? (
                <ErrorPanel
                  message={analyticsState.error}
                  onRetry={analyticsState.refetch}
                />
              ) : !a || a.domains.length === 0 ? (
                <p className="text-xs text-aegis-slate py-3">
                  No competency data yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {a.domains.map((d) => (
                    <div
                      key={d.domain}
                      className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div>
                        <p className="text-sm font-semibold text-aegis-cloud">
                          {d.domain}
                        </p>
                        <p className="text-[10px] font-mono text-aegis-slate">
                          {d.session_count} sessions &bull; {d.trend}
                          {d.last_assessed
                            ? ` • Last ${formatDate(d.last_assessed)}`
                            : ""}
                        </p>
                      </div>
                      <span className="text-lg font-mono font-bold text-aegis-cyan">
                        {Math.round(d.average_score)}
                      </span>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between px-1">
                    <div>
                      <p className="text-[10px] font-heading text-aegis-slate tracking-wider uppercase">
                        Overall
                      </p>
                      <p className="text-xs text-aegis-cloud">
                        {a.sessions_completed} sessions &bull;{" "}
                        {a.certifications_earned} certifications
                      </p>
                    </div>
                    <span className="text-xl font-mono font-bold text-aegis-cyan">
                      {Math.round(a.overall_score)}
                    </span>
                  </div>
                </div>
              )}
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
