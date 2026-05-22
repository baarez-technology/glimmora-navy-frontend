"use client";

import { motion } from "framer-motion";
import { Shield, LogIn } from "lucide-react";
import Image from "next/image";
import logoImg from "@/assets/logo.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { staggerContainer, fadeInUp, heroTextReveal } from "@/animations/variants";
import { profileFromBackendUser, useUserStore } from "@/stores/user-store";
import { auth as authApi } from "@/lib/api/endpoints";
import { ApiError, setTokens } from "@/lib/api/client";

// Seeded service numbers — surfaced for demo convenience.
const PRESETS: { label: string; service_number: string }[] = [
  { label: "Trainee — LT Jayesh Kumar", service_number: "IN-2024-001" },
  { label: "Instructor — CDR Arjun Sharma", service_number: "IN-2019-042" },
  { label: "Evaluator — CAPT Priya Menon", service_number: "IN-2015-018" },
  { label: "Doctrine Mgr — CDR Rakesh Iyer", service_number: "IN-2016-031" },
  { label: "Fleet HQ — RADM Vikram Bhatia", service_number: "IN-2010-007" },
  { label: "Admin — CMDE Sanjay Rao", service_number: "IN-2008-003" },
];

export default function LoginPage() {
  const router = useRouter();
  const loginUser = useUserStore((s) => s.login);
  const [serviceNumber, setServiceNumber] = useState("");
  const [password, setPassword] = useState("aegis123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceNumber.trim() || !password) {
      setError("Service number and password are required");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const result = await authApi.login(serviceNumber.trim(), password);
      setTokens(result.access_token, result.refresh_token);
      const profile = profileFromBackendUser(result.user);
      loginUser(profile);
      router.push(profile.homePath);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
          ? err.message
          : "Login failed";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aegis-void tactical-grid flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.05)_0%,transparent_60%)]" />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative z-10 w-full max-w-md"
        >
          <motion.div variants={heroTextReveal} className="text-center mb-10 flex flex-col items-center justify-center select-none">
            <div className="relative h-20 w-36">
              <Image
                src={logoImg}
                alt="Glimmora Aegis Navy"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          <motion.form
            variants={fadeInUp}
            onSubmit={handleLogin}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="font-heading text-lg font-bold text-aegis-white tracking-wide mb-1 text-center">
              Sign in
            </h2>
            <p className="text-xs text-aegis-mist mb-8 text-center">
              Authenticate with your service number
            </p>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-heading font-bold text-aegis-slate tracking-[0.1em] uppercase block mb-2">
                  Service Number
                </label>
                <input
                  type="text"
                  value={serviceNumber}
                  onChange={(e) => setServiceNumber(e.target.value)}
                  placeholder="IN-2024-001"
                  autoComplete="username"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-sm text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-heading font-bold text-aegis-slate tracking-[0.1em] uppercase block mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-sm text-aegis-cloud focus:outline-none focus:border-aegis-cyan/30 transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-heading font-bold text-aegis-slate tracking-[0.1em] uppercase block mb-2">
                  Quick fill (seeded users)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.service_number}
                      onClick={() => setServiceNumber(p.service_number)}
                      className="text-[10px] font-mono px-2 py-1.5 rounded-md bg-white/[0.02] border border-white/[0.06] text-aegis-mist hover:text-aegis-cyan hover:border-aegis-cyan/30 transition-colors text-left truncate"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-aegis-red text-center"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
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
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Enter Command Center
                  </>
                )}
              </button>
            </div>
          </motion.form>

          <p className="text-center text-[9px] font-mono text-aegis-slate mt-6 tracking-wider">
            AIR-GAPPED DEPLOYMENT &bull; NO EXTERNAL CONNECTIVITY &bull; SOVEREIGN
          </p>
        </motion.div>
      </div>
    </div>
  );
}
