"use client";

import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  Loader2,
  AlertTriangle,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassPanel } from "@/components/ui/glass-panel";
import { AegisButton } from "@/components/ui/aegis-button";
import {
  staggerContainer,
  fadeInUp,
  heroTextReveal,
} from "@/animations/variants";
import { users } from "@/lib/api/endpoints";
import { useApi } from "@/lib/api/hooks";
import { useUserStore } from "@/stores/user-store";

export default function OnboardingPage() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();

  const profileState = useApi(
    () => (user ? users.get(user.id) : Promise.resolve(null)),
    [user?.id],
    { skip: !user }
  );

  const goToDashboard = () => {
    if (user) router.push(user.homePath);
    else router.push("/app/dashboard");
  };

  return (
    <div className="min-h-screen bg-aegis-void tactical-grid flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05)_0%,transparent_60%)]" />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-2xl w-full"
      >
        <motion.div variants={heroTextReveal} className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-aegis-cyan to-aegis-cyan-deep flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(0,229,255,0.2)]">
            <Shield className="w-8 h-8 text-aegis-void" />
          </div>
          <h1 className="font-display text-3xl font-bold text-aegis-white tracking-wide">
            Welcome to AEGIS
          </h1>
          <p className="font-heading text-sm text-aegis-mist mt-2">
            Confirm your profile and step into your Command Center
          </p>
        </motion.div>

        {/* Onboarding flow explainer */}
        <motion.div variants={fadeInUp}>
          <GlassPanel animated={false} className="mb-6">
            <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist mb-4">
              Onboarding Flow
            </h3>
            <ol className="space-y-3 text-sm text-aegis-cloud">
              {[
                {
                  step: "01",
                  text: "Verify your service profile (rank, unit, classification clearance).",
                },
                {
                  step: "02",
                  text: "Your role determines which modules and dashboards are visible.",
                },
                {
                  step: "03",
                  text: "Begin a guided scenario or open your role-specific Command Center.",
                },
              ].map((item) => (
                <li key={item.step} className="flex items-start gap-3">
                  <span className="font-mono text-[10px] font-bold text-aegis-cyan shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <span className="leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ol>
          </GlassPanel>
        </motion.div>

        {/* Profile */}
        <motion.div variants={fadeInUp}>
          <GlassPanel animated={false} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <UserIcon className="w-4 h-4 text-aegis-cyan" />
              <h3 className="font-heading text-xs font-bold tracking-[0.1em] uppercase text-aegis-mist">
                Your Profile
              </h3>
            </div>
            {!user ? (
              <p className="text-xs text-aegis-slate py-3">
                Sign in to load your profile.
              </p>
            ) : profileState.loading ? (
              <div className="flex items-center gap-2 py-3 text-aegis-mist">
                <Loader2 className="w-4 h-4 animate-spin text-aegis-cyan" />
                <span className="text-xs font-heading tracking-wider uppercase">
                  Loading profile&hellip;
                </span>
              </div>
            ) : profileState.error ? (
              <div className="flex items-start gap-3 py-3">
                <AlertTriangle className="w-4 h-4 text-aegis-red shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-aegis-cloud leading-relaxed">
                    {profileState.error}
                  </p>
                  <button
                    onClick={profileState.refetch}
                    className="text-[10px] font-heading text-aegis-cyan mt-2 tracking-wider uppercase cursor-pointer"
                  >
                    Retry &rarr;
                  </button>
                </div>
              </div>
            ) : profileState.data ? (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Name", value: profileState.data.name },
                  { label: "Rank", value: profileState.data.rank },
                  {
                    label: "Service Number",
                    value: profileState.data.service_number,
                  },
                  { label: "Unit", value: profileState.data.unit },
                  {
                    label: "Role",
                    value: profileState.data.role.toUpperCase(),
                  },
                  {
                    label: "Clearance",
                    value: profileState.data.classification_clearance,
                  },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-[10px] font-heading tracking-[0.1em] uppercase text-aegis-slate">
                      {row.label}
                    </p>
                    <p className="text-sm font-semibold text-aegis-cloud mt-0.5">
                      {row.value || "--"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-aegis-slate py-3">
                Profile not available.
              </p>
            )}
          </GlassPanel>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex items-center justify-between gap-3">
          <Link href="/app/profile">
            <AegisButton variant="ghost" size="sm">
              Edit Profile
            </AegisButton>
          </Link>
          <AegisButton
            onClick={goToDashboard}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Dashboard
          </AegisButton>
        </motion.div>
      </motion.div>
    </div>
  );
}
