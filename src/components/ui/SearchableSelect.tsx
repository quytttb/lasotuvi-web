"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

export type SearchableSelectOption = {
  value: string;
  label: string;
};

type SearchableSelectProps = {
  id?: string;
  label: string;
  hint?: string;
  value: string;
  options: readonly SearchableSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  emptyOptionLabel?: string;
  className?: string;
  "data-testid"?: string;
};

/**
 * Dropdown + typeahead (phone-code picker pattern): closed shows selection;
 * open shows filter input + scrollable options.
 */
export function SearchableSelect({
  id: idProp,
  label,
  hint,
  value,
  options,
  onChange,
  placeholder = "Chọn…",
  emptyOptionLabel = "Không chọn",
  className,
  "data-testid": testId,
}: SearchableSelectProps) {
  const reactId = useId();
  const id = idProp ?? `searchable-${reactId}`;
  const listId = `${id}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? "",
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    function onDocPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => inputRef.current?.focus());
    }
  }, [open]);

  function selectValue(next: string) {
    onChange(next);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={rootRef} className={cn("relative min-w-0", className)} data-testid={testId}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[var(--ink)]">
        {label}
        {hint ? <span className="font-normal text-[var(--ink-muted)]"> {hint}</span> : null}
      </label>

      {!open ? (
        <button
          type="button"
          id={id}
          className={cn(
            "flex min-h-11 w-full items-center justify-between gap-2 rounded-sm border border-[var(--line)] bg-[var(--paper)] px-3 text-left text-[var(--ink)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
          )}
          aria-haspopup="listbox"
          aria-expanded={false}
          aria-controls={listId}
          onClick={() => {
            setQuery("");
            setOpen(true);
          }}
        >
          <span className={selectedLabel ? "text-[var(--ink)]" : "text-[var(--ink-muted)]"}>
            {selectedLabel || placeholder}
          </span>
          <span className="text-[var(--ink-muted)]" aria-hidden>
            ▾
          </span>
        </button>
      ) : (
        <input
          ref={inputRef}
          id={id}
          type="search"
          role="combobox"
          aria-expanded={true}
          aria-controls={listId}
          aria-autocomplete="list"
          className={cn(
            "min-h-11 w-full rounded-sm border border-[var(--line)] bg-[var(--paper)] px-3 text-[var(--ink)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
          )}
          placeholder="Gõ để tìm…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      )}

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] shadow-sm"
        >
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={!value}
              className={cn(
                "flex w-full min-h-10 items-center px-3 text-left text-sm",
                !value
                  ? "bg-[var(--ink)] text-[var(--paper)]"
                  : "text-[var(--ink-soft)] hover:bg-[var(--paper-muted)]",
              )}
              onClick={() => selectValue("")}
            >
              {emptyOptionLabel}
            </button>
          </li>
          {filtered.map((opt) => {
            const selected = opt.value === value;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    "flex w-full min-h-10 items-center px-3 text-left text-sm",
                    selected
                      ? "bg-[var(--ink)] text-[var(--paper)]"
                      : "text-[var(--ink-soft)] hover:bg-[var(--paper-muted)]",
                  )}
                  onClick={() => selectValue(opt.value)}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-[var(--ink-muted)]" role="presentation">
              Không khớp khu vực nào.
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
