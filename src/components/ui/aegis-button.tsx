"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Link from "next/link";

interface AegisButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  href?: string;
}

const variantStyles = {
  primary:
    "bg-gradient-to-r from-aegis-cyan to-aegis-cyan-deep text-white font-semibold hover:shadow-[0_8px_24px_rgba(14,165,233,0.3)]",
  secondary:
    "glass-card text-aegis-cyan border-aegis-cyan/30 hover:bg-aegis-cyan/5 hover:border-aegis-cyan/50",
  ghost:
    "bg-transparent text-aegis-cloud hover:bg-black/[0.04] hover:text-aegis-white",
  danger:
    "bg-gradient-to-r from-aegis-red to-red-700 text-white font-semibold hover:shadow-[0_8px_24px_rgba(220,38,38,0.2)]",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
};

export function AegisButton({
  variant = "primary",
  size = "md",
  icon,
  loading,
  children,
  className,
  disabled,
  onClick,
  type = "button",
  href,
}: AegisButtonProps) {
  const commonClasses = cn(
    "inline-flex items-center justify-center rounded-lg font-heading tracking-wide transition-all duration-200 cursor-pointer",
    variantStyles[variant],
    sizeStyles[size],
    (disabled || loading) && "opacity-50 cursor-not-allowed",
    className
  );

  if (href && !disabled && !loading) {
    return (
      <Link href={href} className={commonClasses} onClick={onClick}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={disabled || loading ? undefined : { scale: 1.02 }}
      whileTap={disabled || loading ? undefined : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={commonClasses}
      disabled={disabled || loading}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
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
      ) : (
        icon
      )}
      {children}
    </motion.button>
  );
}
