"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { getPalaceTonePresentation } from "@/lib/chart/palace-tone";
import type { PalaceInfo } from "@/lib/chart/validate";
import { cn } from "@/lib/utils/cn";

type PalaceInterpTabsProps = {
  palaces: PalaceInfo[];
  renderPanel: (palace: PalaceInfo) => ReactNode;
  className?: string;
};

function tabLabel(palace: PalaceInfo): string {
  return palace.palace_name ?? `Cung ${palace.index}`;
}

export function PalaceInterpTabs({ palaces, renderPanel, className }: PalaceInterpTabsProps) {
  const baseId = useId();
  const defaultId = String(palaces[0]?.index ?? 1);
  const [selectedId, setSelectedId] = useState(defaultId);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const moveFocusRef = useRef(false);

  const selected =
    palaces.find((p) => String(p.index) === selectedId) ?? palaces[0] ?? null;

  useEffect(() => {
    if (!moveFocusRef.current) return;
    moveFocusRef.current = false;
    tabRefs.current.get(selectedId)?.focus();
  }, [selectedId]);

  function selectByIndex(index: number, moveFocus = false) {
    const palace = palaces[index];
    if (!palace) return;
    if (moveFocus) moveFocusRef.current = true;
    setSelectedId(String(palace.index));
  }

  function onTabListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (palaces.length === 0) return;
    const currentIndex = Math.max(
      0,
      palaces.findIndex((p) => String(p.index) === selectedId),
    );
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectByIndex((currentIndex + 1) % palaces.length, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectByIndex((currentIndex - 1 + palaces.length) % palaces.length, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectByIndex(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      selectByIndex(palaces.length - 1, true);
    }
  }

  if (!selected) return null;

  const panelId = `${baseId}-panel`;

  return (
    <div className={cn("w-full space-y-2", className)} data-testid="palace-interp-tabs">
      <div
        role="tablist"
        aria-label="Chọn cung để xem luận giải"
        className="grid w-full grid-cols-3 gap-1 sm:grid-cols-4 lg:grid-cols-6"
        onKeyDown={onTabListKeyDown}
      >
        {palaces.map((palace) => {
          const id = String(palace.index);
          const isSelected = id === String(selected.index);
          const tone = getPalaceTonePresentation(palace);
          const tabId = `${baseId}-tab-${id}`;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={tabId}
              ref={(el) => {
                if (el) tabRefs.current.set(id, el);
                else tabRefs.current.delete(id);
              }}
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              data-testid={`palace-tab-${id}`}
              className={cn(
                "min-h-11 rounded-sm border px-1.5 py-1.5 text-center text-sm font-medium leading-tight transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--water)]",
                isSelected
                  ? "border-[var(--ink)] bg-[var(--paper-raised)] text-[var(--ink)]"
                  : "border-[var(--line)] bg-[var(--paper)] text-[var(--ink-soft)] hover:bg-[var(--paper-muted)]",
              )}
              onClick={() => setSelectedId(id)}
            >
              <span className="block truncate">{tabLabel(palace)}</span>
              <span className="mt-0.5 block truncate text-[0.65rem] font-normal text-[var(--ink-muted)]">
                {palace.branch_name} · {tone.effectLabel}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={`${baseId}-tab-${selected.index}`}
        className="w-full border border-[var(--line)] bg-[var(--paper-raised)] px-2 py-3 text-sm text-[var(--ink-soft)] sm:px-3"
        data-testid="palace-interp-panel"
        data-palace-index={selected.index}
      >
        {renderPanel(selected)}
      </div>
    </div>
  );
}
