"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { cardVariants } from "@/animations/variants";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; direction: "up" | "down" | "neutral" };
  icon?: LucideIcon;
  accentColor?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  accentColor = "text-aegis-cyan",
  className,
}: MetricCardProps) {
  const TrendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
        ? TrendingDown
        : Minus;

  const trendColor =
    trend?.direction === "up"
      ? "text-aegis-green"
      : trend?.direction === "down"
        ? "text-aegis-red"
        : "text-aegis-mist";

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{
        y: -4,
        boxShadow: "0 12px 32px rgba(14,165,233,0.12)",
      }}
      className={cn(
        "glass-card glass-shine rounded-xl p-5 cursor-default group",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-heading text-[11px] font-bold tracking-[0.08em] uppercase text-aegis-mist">
          {title}
        </span>
        {Icon && (
          <div className={cn("p-2 rounded-lg bg-slate-100/80", accentColor)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-end gap-3">
        <span
          className={cn(
            "font-mono text-[28px] font-bold tracking-wide",
            accentColor
          )}
        >
          {value}
        </span>
        {trend && (
          <div className={cn("flex items-center gap-1 mb-1", trendColor)}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span className="font-mono text-xs font-semibold">
              {trend.value > 0 ? "+" : ""}
              {trend.value}%
            </span>
          </div>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 font-body text-xs text-aegis-mist">{subtitle}</p>
      )}

      {/* Bottom accent line */}
      <div className="mt-4 h-[2px] w-full rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-aegis-cyan to-aegis-cyan-deep"
        />
      </div>
    </motion.div>
  );
}
