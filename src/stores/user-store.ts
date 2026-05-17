import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BackendUser } from "@/lib/api/types";

export type UserRole =
  | "trainee"
  | "instructor"
  | "evaluator"
  | "doctrine"
  | "fleet"
  | "admin"
  | "maintainer";

export interface UserProfile {
  id: string;
  service_number: string;
  role: UserRole;
  name: string;
  rank: string;
  unit: string;
  cohort_id?: string | null;
  classification_clearance?: string;
  roleLabel: string;
  homePath: string;
}

interface UserState {
  user: UserProfile | null;
  hydrated: boolean;
  login: (profile: UserProfile) => void;
  logout: () => void;
  setHydrated: (v: boolean) => void;
}

const ROLE_META: Record<UserRole, { label: string; home: string }> = {
  trainee: { label: "TRAINEE", home: "/app/dashboard/trainee" },
  instructor: { label: "INSTRUCTOR", home: "/app/dashboard/instructor" },
  evaluator: { label: "EVALUATOR", home: "/app/evaluator" },
  doctrine: { label: "DOCTRINE MANAGER", home: "/app/doctrine" },
  fleet: { label: "FLEET COMMAND", home: "/app/fleet/command" },
  admin: { label: "ADMIN", home: "/app/admin" },
  maintainer: { label: "SYSTEM MAINTAINER", home: "/app/dashboard/maintainer" },
};

export function profileFromBackendUser(u: BackendUser): UserProfile {
  const role = u.role as UserRole;
  const meta = ROLE_META[role] ?? { label: role.toUpperCase(), home: "/app/dashboard" };
  // Many seeded user names are formatted like "LT Jayesh Kumar". Strip the rank
  // prefix from the display name when it duplicates the rank field, so headers
  // like "Welcome, LT LT Jayesh Kumar" don't double up.
  const cleanName = u.name.startsWith(`${u.rank} `)
    ? u.name.slice(u.rank.length + 1)
    : u.name;
  return {
    id: u.id,
    service_number: u.service_number,
    role,
    name: cleanName,
    rank: u.rank,
    unit: u.unit,
    cohort_id: u.cohort_id ?? null,
    classification_clearance: u.classification_clearance,
    roleLabel: meta.label,
    homePath: meta.home,
  };
}

export function homePathForRole(role: UserRole): string {
  return ROLE_META[role]?.home ?? "/app/dashboard";
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      login: (profile) => set({ user: profile }),
      logout: () => set({ user: null }),
      setHydrated: (v) => set({ hydrated: v }),
    }),
    { name: "aegis-user" }
  )
);
