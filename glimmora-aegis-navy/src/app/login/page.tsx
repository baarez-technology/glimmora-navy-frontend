"use client";

import { motion } from "framer-motion";
import { Shield, LogIn, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { staggerContainer, fadeInUp, heroTextReveal } from "@/animations/variants";
import { buildProfile, useUserStore, type UserRole } from "@/stores/user-store";

const roles: { label: string; value: UserRole }[] = [
  { label: "Trainee", value: "trainee" },
  { label: "Instructor", value: "instructor" },
  { label: "Evaluator", value: "evaluator" },
  { label: "Doctrine Manager", value: "doctrine" },
  { label: "Fleet Training Command", value: "fleet" },
  { label: "Admin", value: "admin" },
  { label: "System Maintainer", value: "maintainer" },
];

export default function LoginPage() {
  const router = useRouter();
  const loginUser = useUserStore((s) => s.login);
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedProfile = selectedRole ? buildProfile(selectedRole) : null;

  const handleLogin = () => {
    if (!selectedRole) {
      setError("Please select your role to continue");
      return;
    }

    setError("");
    setLoading(true);

    const profile = buildProfile(selectedRole);
    loginUser(profile);

    setTimeout(() => {
      router.push(profile.homePath);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-aegis-void tactical-grid flex flex-col">
      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05)_0%,transparent_60%)]" />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo */}
          <motion.div variants={heroTextReveal} className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-aegis-cyan to-aegis-cyan-deep flex items-center justify-center mx-auto mb-4 shadow-[0_8px_32px_rgba(14,165,233,0.25)]">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-aegis-white tracking-[0.04em]">
              GLIMMORA AEGIS
            </h1>
            <p className="font-heading text-sm text-aegis-cyan tracking-[0.2em] mt-1">
              &mdash; N A V Y &mdash;
            </p>
          </motion.div>

          {/* Login Card */}
          <motion.div variants={fadeInUp} className="glass-card rounded-2xl p-8">
            <h2 className="font-heading text-lg font-bold text-aegis-white tracking-wide mb-1 text-center">
              Welcome
            </h2>
            <p className="text-xs text-aegis-mist mb-8 text-center">
              Select your role to enter the Command Center
            </p>

            <div className="space-y-5">
              {/* Role Dropdown */}
              <div>
                <label className="text-[10px] font-heading font-bold text-aegis-slate tracking-[0.1em] uppercase block mb-2">
                  Login As
                </label>
                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value as UserRole | "");
                      setError("");
                    }}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-sm text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-aegis-navy text-aegis-mist">
                      -- Choose your role --
                    </option>
                    {roles.map((role) => (
                      <option
                        key={role.value}
                        value={role.value}
                        className="bg-aegis-navy text-aegis-cloud"
                      >
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aegis-slate pointer-events-none" />
                </div>
              </div>

              {/* Redirect hint */}
              {selectedProfile && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-aegis-cyan/5 border border-aegis-cyan/10"
                >
                  <div className="w-2 h-2 rounded-full bg-aegis-cyan animate-pulse shrink-0" />
                  <p className="text-[11px] text-aegis-cyan">
                    You will enter as{" "}
                    <span className="font-bold">
                      {selectedProfile.rank} {selectedProfile.name}
                    </span>{" "}
                    &rarr;{" "}
                    <span className="font-mono text-[10px]">
                      {selectedProfile.homePath}
                    </span>
                  </p>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-aegis-red text-center"
                >
                  {error}
                </motion.p>
              )}

              {/* Submit */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-aegis-cyan to-aegis-cyan-deep text-white font-heading font-bold tracking-wide hover:shadow-[0_8px_32px_rgba(14,165,233,0.25)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Entering...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Enter Command Center
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-[9px] font-mono text-aegis-slate mt-6 tracking-wider">
            AIR-GAPPED DEPLOYMENT &bull; NO EXTERNAL CONNECTIVITY &bull; SOVEREIGN
          </p>
        </motion.div>
      </div>
    </div>
  );
}
