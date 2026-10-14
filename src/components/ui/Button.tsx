import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "sm" | "lg";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: [
    // Oriental ink-black button with subtle shimmer
    "relative overflow-hidden",
    "bg-[var(--ink)] text-[var(--paper)]",
    "border border-[rgba(255,255,255,0.06)]",
    "shadow-[0_2px_6px_rgba(26,21,16,0.2),0_1px_0_rgba(255,255,255,0.05)_inset]",
    "hover:bg-[var(--ink-soft)] hover:shadow-[0_3px_12px_rgba(26,21,16,0.25)]",
    "hover:-translate-y-px",
    "active:translate-y-0 active:shadow-none",
    "focus-visible:outline-[var(--water)]",
  ].join(" "),
  secondary: [
    "bg-[var(--paper-raised)] text-[var(--ink)]",
    "border border-[var(--line)]",
    "shadow-[0_1px_3px_rgba(26,21,16,0.06)]",
    "hover:bg-[var(--paper-muted)] hover:border-[var(--earth)]/40",
    "focus-visible:outline-[var(--water)]",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--ink-soft)]",
    "hover:bg-[var(--paper-muted)] hover:text-[var(--ink)]",
    "focus-visible:outline-[var(--water)]",
  ].join(" "),
  danger: [
    "bg-[var(--fire)] text-white",
    "shadow-[0_2px_6px_rgba(158,43,30,0.2)]",
    "hover:bg-[var(--fire-light)] hover:shadow-[0_3px_12px_rgba(158,43,30,0.25)]",
    "hover:-translate-y-px",
    "focus-visible:outline-[var(--fire)]",
  ].join(" "),
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-10 px-4 text-sm",
  lg: "min-h-12 px-6 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-medium",
        "transition-all duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
