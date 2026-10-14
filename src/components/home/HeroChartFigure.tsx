"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils/cn";

const CHART_SRC = "/images/hero-chart.webp";
const CHART_ALT = "Lá số Tử Vi mẫu của LasoTuVi với bàn 12 cung theo bố cục truyền thống";
const CHART_WIDTH = 1440;
const CHART_HEIGHT = 881;

const ENTER_DURATION_MS = 380;
const EXIT_DURATION_MS = 260;

type Rect = { left: number; top: number; width: number; height: number };

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Khung ảnh nhỏ xoay nghiêng 2deg trên desktop (xem .hero-chart-frame). */
function thumbnailTilted(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(min-width: 1024px)").matches
  );
}

/**
 * Lá số minh họa trên trang chủ. Bấm vào ảnh để phóng to (lightbox),
 * bấm lại / nhấn Escape / bấm nền mờ / bấm X để thu nhỏ.
 * Hiệu ứng thuần transform tuyến tính: phóng + tịnh tiến từ đúng vị trí
 * ảnh nhỏ tới bản lớn, không dùng fade.
 */
export function HeroChartFigure() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<Rect | null>(null);
  const leavingRef = useRef(false);

  function handleOpen() {
    const trigger = triggerRef.current;
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      originRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    } else {
      originRef.current = null;
    }
    setOpen(true);
  }

  const requestClose = useCallback(() => {
    if (leavingRef.current) return;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const canAnimate =
      panel != null &&
      trigger != null &&
      typeof panel.animate === "function" &&
      !prefersReducedMotion();
    if (!canAnimate) {
      setOpen(false);
      return;
    }
    const from = panel.getBoundingClientRect();
    const to = trigger.getBoundingClientRect();
    if (from.width === 0 || to.width === 0) {
      setOpen(false);
      return;
    }
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const scale = Math.min(1, to.width / from.width);
    leavingRef.current = true;
    const animation = panel.animate(
      [
        { transform: "translate(0px, 0px) scale(1)" },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
      ],
      { duration: EXIT_DURATION_MS, easing: "linear", fill: "forwards" },
    );
    const finish = () => {
      leavingRef.current = false;
      setOpen(false);
    };
    animation.onfinish = finish;
    animation.oncancel = finish;
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    panelRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") requestClose();
    }
    document.addEventListener("keydown", onKey);

    const panel = panelRef.current;
    const origin = originRef.current;
    let raf = 0;
    if (
      panel != null &&
      origin != null &&
      typeof panel.animate === "function" &&
      !prefersReducedMotion()
    ) {
      raf = requestAnimationFrame(() => {
        const target = panel.getBoundingClientRect();
        if (target.width === 0 || origin.width === 0) return;
        const dx = origin.left + origin.width / 2 - (target.left + target.width / 2);
        const dy = origin.top + origin.height / 2 - (target.top + target.height / 2);
        const scale = Math.min(1, origin.width / target.width);
        const tilt = thumbnailTilted() ? " rotate(2deg)" : "";
        panel.animate(
          [
            { transform: `translate(${dx}px, ${dy}px) scale(${scale})${tilt}` },
            { transform: "translate(0px, 0px) scale(1) rotate(0deg)" },
          ],
          { duration: ENTER_DURATION_MS, easing: "linear" },
        );
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, requestClose]);

  return (
    <figure className="relative min-w-0 lg:-mr-8">
      <div className="hero-chart-frame">
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
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
        </button>
      </div>
      <figcaption className="mt-6 flex items-center justify-between gap-3 text-xs leading-relaxed text-[var(--paper)]/75 sm:text-sm">
        <span>Lá số minh họa · Dữ liệu mẫu</span>
        <span className="shrink-0 font-serif text-[var(--gold-light)]">12 cung · Ngũ hành</span>
      </figcaption>

      {/* Portal ra body để overlay nằm trên header sticky (hero section dùng isolate). */}
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              role="presentation"
            >
              <button
                type="button"
                aria-label="Thu nhỏ lá số minh họa"
                data-testid="hero-chart-backdrop"
                onClick={requestClose}
                className="absolute inset-0 cursor-zoom-out bg-[var(--ink)]/60"
              />
              <button
                type="button"
                onClick={requestClose}
                aria-label="Đóng"
                data-testid="hero-chart-close"
                className={cn(
                  "absolute right-4 top-4 z-20 inline-flex min-h-11 min-w-11 items-center justify-center",
                  "rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] text-lg leading-none text-[var(--ink)] shadow-md",
                  "transition-colors hover:border-[var(--gold)] hover:text-[var(--vermillion)]",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--water)]",
                )}
              >
                <span aria-hidden="true">✕</span>
              </button>
              <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label="Lá số minh họa phóng to"
                tabIndex={-1}
                data-testid="hero-chart-dialog"
                className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-5xl overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--paper-raised)] p-2 shadow-2xl focus:outline-none sm:p-3"
              >
                <button
                  type="button"
                  onClick={requestClose}
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
                    className="mx-auto h-auto w-auto max-w-full max-h-[calc(100dvh-5rem)]"
                  />
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </figure>
  );
}
