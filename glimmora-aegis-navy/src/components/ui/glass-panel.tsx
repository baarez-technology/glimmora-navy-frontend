"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { cardVariants } from "@/animations/variants";
import type { ReactNode } from "react";

interface GlassPanelProps {
  variant?: "default" | "elevated" | "subtle";
  glow?: boolean;
  animated?: boolean;
  className?: string;
  children?: ReactNode;
}

export function GlassPanel({
  className,
  variant = "default",
  glow = false,
  animated = true,
  children,
}: GlassPanelProps) {
  const variantStyles = {
    default: "glass-card",
    elevated:
      "glass-card shadow-[0_12px_40px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.04)]",
    subtle: "bg-slate-50/40 border border-slate-200/60",
  };

  const cls = cn(
    "rounded-xl p-6 transition-all duration-300",
    variantStyles[variant],
    glow && "glow-border",
    className
  );

  if (!animated) {
    return <div className={cls}>{children}</div>;
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className={cls}
    >
      {children}
    </motion.div>
  );
}
