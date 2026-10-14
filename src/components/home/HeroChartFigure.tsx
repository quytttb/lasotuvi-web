"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const CHART_SRC = "/images/hero-chart.webp";
const CHART_ALT = "Lá số Tử Vi mẫu của LasoTuVi với bàn 12 cung theo bố cục truyền thống";
const CHART_WIDTH = 1440;
const CHART_HEIGHT = 881;

/**
 * Lá số minh họa trên trang chủ. Bấm vào ảnh để phóng to (lightbox),
 * bấm lại / nhấn Escape / bấm nền mờ để thu nhỏ, có animation scale + fade.
 */
export function HeroChartFigure() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, close]);

  return (
    <figure className="relative min-w-0 lg:-mr-8">
      <div className="hero-chart-frame">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          data-testid="hero-chart-open"
          aria-label="Phóng to lá số minh họa"
          className={cn(
            "group relative block w-full cursor-zoom-in",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--water)]",
          )}
        >
          <Image
            src={CHART_SRC}
            alt={CHART_ALT}
            width={CHART_WIDTH}
            height={CHART_HEIGHT}
            sizes="(min-width: 1200px) 530px, (min-width: 1024px) 46vw, (min-width: 640px) calc(100vw - 64px), calc(100vw - 40px)"
            preload
            className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.01]"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-sm border border-[var(--line)] bg-[var(--paper-raised)]/95 px-2.5 py-1.5 text-xs font-medium text-[var(--ink-soft)] shadow-sm transition-colors group-hover:border-[var(--earth)]/50 group-hover:text-[var(--ink)]"
          >
            <span aria-hidden="true">⤢</span> Bấm để phóng to
          </span>
        </button>
      </div>
      <figcaption className="mt-6 flex items-center justify-between gap-3 text-xs leading-relaxed text-[var(--ink-muted)] sm:text-sm">
        <span>Lá số minh họa · Dữ liệu mẫu</span>
        <span className="shrink-0 font-serif text-[var(--earth)]">12 cung · Ngũ hành</span>
      </figcaption>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Thu nhỏ lá số minh họa"
            data-testid="hero-chart-backdrop"
            onClick={close}
            className="absolute inset-0 cursor-zoom-out bg-[var(--ink)]/60"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Lá số minh họa phóng to"
            tabIndex={-1}
            data-testid="hero-chart-dialog"
            className="animate-chart-zoom relative z-10 max-h-full w-full max-w-5xl overflow-auto rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] p-3 shadow-2xl focus:outline-none sm:p-4"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Thu nhỏ lá số minh họa"
              data-testid="hero-chart-close-image"
              className="block w-full cursor-zoom-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]"
            >
              <Image
                src={CHART_SRC}
                alt={CHART_ALT}
                width={CHART_WIDTH}
                height={CHART_HEIGHT}
                sizes="(min-width: 1200px) 960px, 92vw"
                className="h-auto w-full"
              />
            </button>
            <div className="flex flex-wrap items-center justify-between gap-3 px-1 pb-1 pt-3">
              <p className="text-sm text-[var(--ink-muted)]">Lá số minh họa · Dữ liệu mẫu</p>
              <Button size="sm" variant="secondary" onClick={close} data-testid="hero-chart-close">
                Thu nhỏ
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </figure>
  );
}
