import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "sm" | "lg";
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink-soft)] focus-visible:outline-[var(--water)]",
  secondary:
    "bg-[var(--paper-raised)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--paper-muted)]",
  ghost: "bg-transparent text-[var(--ink)] hover:bg-[var(--paper-muted)]",
  danger:
    "bg-[var(--fire)] text-white hover:opacity-90 focus-visible:outline-[var(--fire)]",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-11 px-3 text-sm",
  md: "min-h-11 px-4 text-sm",
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
        "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
