"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth as authApi } from "@/lib/api/endpoints";
import { clearTokens, getAccessToken } from "@/lib/api/client";
import {
  profileFromBackendUser,
  useUserStore,
  type UserProfile,
} from "@/stores/user-store";

/**
 * Rehydrate the user from /api/auth/me on app mount, using the persisted token.
 * If the token is missing or invalid, clear local state and bounce to /login.
 *
 * Returns { ready: boolean } — true once the hydration attempt has finished.
 */
export function useAuthHydration(): { ready: boolean; user: UserProfile | null } {
  const user = useUserStore((s) => s.user);
  const hydrated = useUserStore((s) => s.hydrated);
  const setHydrated = useUserStore((s) => s.setHydrated);
  const setUser = useUserStore((s) => s.login);
  const logout = useUserStore((s) => s.logout);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const token = getAccessToken();

    if (!token) {
      // No token — if we somehow still have a persisted user, drop it.
      if (user) logout();
      setHydrated(true);
      return;
    }

    authApi
      .me()
      .then((backendUser) => {
        if (cancelled) return;
        setUser(profileFromBackendUser(backendUser));
        setHydrated(true);
      })
      .catch(() => {
        if (cancelled) return;
        clearTokens();
        logout();
        setHydrated(true);
        router.replace("/login");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for 401s anywhere in the app and bounce to /login.
  useEffect(() => {
    const handler = () => {
      logout();
      router.replace("/login");
    };
    window.addEventListener("aegis:unauthenticated", handler);
    return () => window.removeEventListener("aegis:unauthenticated", handler);
  }, [logout, router]);

  return { ready: hydrated, user };
}

export async function performLogout() {
  try {
    await authApi.logout();
  } catch {
    // best-effort — token might already be invalid
  }
  clearTokens();
  useUserStore.getState().logout();
}
