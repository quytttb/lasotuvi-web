"use client";

import { cn } from "@/lib/utils/cn";

export type SegmentOption<T extends string = string> = {
  value: T;
  label: string;
  /** Shorter label for compact layouts (optional). */
  shortLabel?: string;
};

type SegmentedControlProps<T extends string> = {
  id: string;
  label: string;
  hint?: string;
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  /** denser chip wrap for 4+ options */
  wrap?: boolean;
};

/** Compact binary / few-option toggle group (not for long lists). */
export function SegmentedControl<T extends string>({
  id,
  label,
  hint,
  value,
  options,
  onChange,
  className,
  wrap = false,
}: SegmentedControlProps<T>) {
  const labelId = `${id}-label`;
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className={cn("min-w-0", className)}>
      <p id={labelId} className="mb-1 text-sm font-medium text-[var(--ink)]">
        {label}
        {hint ? <span className="font-normal text-[var(--ink-muted)]"> {hint}</span> : null}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={hintId}
        className={cn(
          "flex gap-1 rounded-sm border border-[var(--line)] bg-[var(--paper)] p-1",
          wrap ? "flex-wrap" : "flex-nowrap",
        )}
        data-testid={id}
      >
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value || "__empty"}
              type="button"
              role="radio"
              aria-checked={selected}
              data-selected={selected ? "true" : undefined}
              className={cn(
                "min-h-10 flex-1 rounded-sm px-2.5 text-sm font-medium transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--water)]",
                wrap ? "min-w-[calc(50%-0.125rem)] sm:min-w-0 sm:flex-1" : null,
                selected
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "bg-transparent text-[var(--ink-soft)] hover:bg-[var(--paper-muted)]",
              )}
              onClick={() => onChange(opt.value)}
            >
              {opt.shortLabel ?? opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
