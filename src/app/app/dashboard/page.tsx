"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { useUserStore } from "@/stores/user-store";

export default function DashboardDispatchPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const hydrated = useUserStore((s) => s.hydrated);

  useEffect(() => {
    // Wait until auth hydration has finished so we don't bounce the user
    // to /login before /api/auth/me has had a chance to resolve.
    if (!hydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    router.replace(user.homePath);
  }, [user, hydrated, router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex items-center gap-3 text-aegis-mist">
        <Shield className="w-5 h-5 text-aegis-cyan animate-pulse" />
        <span className="text-sm font-heading tracking-wider">
          Routing to your dashboard&hellip;
        </span>
      </div>
    </div>
  );
}
