import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
  | "trainee"
  | "instructor"
  | "evaluator"
  | "doctrine"
  | "fleet"
  | "admin"
  | "maintainer";

export interface UserProfile {
  role: UserRole;
  name: string;
  rank: string;
  unit: string;
  cohort?: string;
  roleLabel: string;
  homePath: string;
}

interface UserState {
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
}

export const ROLE_PROFILES: Record<UserRole, Omit<UserProfile, "role">> = {
  trainee: {
    name: "Jayesh Kumar",
    rank: "LT",
    unit: "INS Vikrant",
    cohort: "2024-B",
    roleLabel: "TRAINEE",
    homePath: "/app/dashboard/trainee",
  },
  instructor: {
    name: "Arjun Sharma",
    rank: "CDR",
    unit: "INS Dronacharya",
    roleLabel: "INSTRUCTOR",
    homePath: "/app/dashboard/instructor",
  },
  evaluator: {
    name: "Priya Menon",
    rank: "CAPT",
    unit: "Fleet Training Centre",
    roleLabel: "EVALUATOR",
    homePath: "/app/evaluator",
  },
  doctrine: {
    name: "Rakesh Iyer",
    rank: "CDR",
    unit: "Naval Doctrine Cell",
    roleLabel: "DOCTRINE MANAGER",
    homePath: "/app/doctrine",
  },
  fleet: {
    name: "Vikram Bhatia",
    rank: "RADM",
    unit: "Fleet Training Command",
    roleLabel: "FLEET COMMAND",
    homePath: "/app/fleet/command",
  },
  admin: {
    name: "Sanjay Rao",
    rank: "CMDE",
    unit: "Systems Authority",
    roleLabel: "ADMIN",
    homePath: "/app/admin",
  },
  maintainer: {
    name: "Ananya Rao",
    rank: "CDR",
    unit: "Sustainment Cell",
    roleLabel: "SYSTEM MAINTAINER",
    homePath: "/app/dashboard/maintainer",
  },
};

export function buildProfile(role: UserRole): UserProfile {
  return { role, ...ROLE_PROFILES[role] };
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      login: (profile) => set({ user: profile }),
      logout: () => set({ user: null }),
    }),
    { name: "aegis-user" }
  )
);
