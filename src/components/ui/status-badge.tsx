"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "online" | "offline" | "alert" | "warning" | "neutral" | "active" | "synced";

const variants: Record<BadgeVariant, string> = {
  online: "bg-aegis-green/15 text-aegis-green border-aegis-green/30",
  offline: "bg-aegis-red/15 text-aegis-red border-aegis-red/30",
  alert: "bg-aegis-red/15 text-aegis-red border-aegis-red/30",
  warning: "bg-aegis-amber/15 text-aegis-amber border-aegis-amber/30",
  neutral: "bg-aegis-slate/15 text-aegis-mist border-aegis-slate/30",
  active: "bg-aegis-cyan/15 text-aegis-cyan border-aegis-cyan/30",
  synced: "bg-aegis-green/15 text-aegis-green border-aegis-green/30",
};

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({
  label,
  variant = "neutral",
  pulse = false,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-heading font-bold tracking-[0.06em] uppercase",
        variants[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              variant === "online" || variant === "synced"
                ? "bg-aegis-green"
                : variant === "alert" || variant === "offline"
                  ? "bg-aegis-red"
                  : variant === "active"
                    ? "bg-aegis-cyan"
                    : "bg-aegis-amber"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-1.5 w-1.5",
              variant === "online" || variant === "synced"
                ? "bg-aegis-green"
                : variant === "alert" || variant === "offline"
                  ? "bg-aegis-red"
                  : variant === "active"
                    ? "bg-aegis-cyan"
                    : "bg-aegis-amber"
            )}
          />
        </span>
      )}
      {label}
    </span>
  );
}
