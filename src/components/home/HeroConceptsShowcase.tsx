"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CONCEPTS_DATA } from "./hero-concepts-data";
import { ConceptVisualRenderer } from "./ConceptVisuals";

const SLIDE_DURATION_MS = 10000; // 10 seconds auto-advance

export function HeroConceptsShowcase({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const currentConcept = CONCEPTS_DATA[currentIndex];

  const goToSlide = useCallback(
    (nextIdx: number, dir: "next" | "prev") => {
      setPrevIndex(currentIndex);
      setDirection(dir);
      setCurrentIndex(nextIdx);
    },
    [currentIndex],
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % CONCEPTS_DATA.length, "next");
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + CONCEPTS_DATA.length) % CONCEPTS_DATA.length, "prev");
  }, [currentIndex, goToSlide]);

  // Clear prevIndex after animation duration
  useEffect(() => {
    if (prevIndex !== null) {
      const timer = setTimeout(() => {
        setPrevIndex(null);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [prevIndex]);

  // Pick a random concept different from the current one
  const pickRandomIndex = useCallback(() => {
    let next: number;
    do {
      next = Math.floor(Math.random() * CONCEPTS_DATA.length);
    } while (next === currentIndex && CONCEPTS_DATA.length > 1);

    goToSlide(next, "next");
  }, [currentIndex, goToSlide]);

  // Pause while reading with a pointer or keyboard.
  useEffect(() => {
    if (isHovered || isFocused) {
      return;
    }

    const timer = setInterval(() => {
      pickRandomIndex();
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [isHovered, isFocused, pickRandomIndex]);

  // Touch swipe support on mobile (does not shift browser window)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  return (
    <figure
      className={cn("group/showcase relative min-w-0 w-full animate-fade-in-scale", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false);
      }}
      aria-label="Khám phá 10 khái niệm kinh điển Tử Vi Đẩu Số"
    >
      {/* Give the artwork the full card width; controls live below, not beside it. */}
      <div
        className="relative w-full min-w-0 overflow-hidden rounded-sm border border-[var(--gold)]/60 bg-[var(--lacquer-dark)]/95 shadow-[0_24px_64px_rgba(48,15,13,0.42),0_4px_16px_rgba(48,15,13,0.25)] ring-1 ring-[var(--gold-light)]/20 backdrop-blur-md"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStartX.current = null;
        }}
      >
        {/* Oriental corner gold accents on the fixed card frame */}
        <span
          className="pointer-events-none absolute -top-1.5 -left-1.5 text-xs text-[var(--gold-light)] opacity-85 select-none z-20"
          aria-hidden="true"
        >
          ❖
        </span>
        <span
          className="pointer-events-none absolute -top-1.5 -right-1.5 text-xs text-[var(--gold-light)] opacity-85 select-none z-20"
          aria-hidden="true"
        >
          ❖
        </span>
        <span
          className="pointer-events-none absolute -bottom-1.5 -left-1.5 text-xs text-[var(--gold-light)] opacity-85 select-none z-20"
          aria-hidden="true"
        >
          ❖
        </span>
        <span
          className="pointer-events-none absolute -bottom-1.5 -right-1.5 text-xs text-[var(--gold-light)] opacity-85 select-none z-20"
          aria-hidden="true"
        >
          ❖
        </span>

        {/* Subtle background radial glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,185,117,0.11)_0%,transparent_75%)]"
          aria-hidden="true"
        />

        {/* Sliding Track: Only active and transitioning slides animate with GPU-accelerated directional cross-slide */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Thanh trượt 10 khái niệm Tử Vi"
          className="relative w-full"
        >
          {CONCEPTS_DATA.map((item, idx) => {
            const isCurrent = idx === currentIndex;
            const isPrev = idx === prevIndex;
            // Hidden slides must not size the card or remain in the tab order.
            if (!isCurrent && !isPrev) return null;

            let motionClass = "";
            if (isCurrent) {
              motionClass =
                "opacity-100 translate-x-0 scale-100 z-10 pointer-events-auto motion-safe:animate-[fadeInScale_350ms_ease-out]";
            } else if (isPrev) {
              motionClass = cn(
                "opacity-0 z-0 pointer-events-none scale-[0.98]",
                direction === "next" ? "-translate-x-8" : "translate-x-8",
              );
            }

            return (
              <div
                key={item.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${item.number} trên 10: ${item.title}`}
                aria-hidden={!isCurrent}
                inert={!isCurrent}
                className={cn(
                  "w-full flex flex-col gap-3 p-3 sm:gap-4 sm:p-5 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[transform,opacity]",
                  isCurrent ? "relative" : "absolute inset-0",
                  motionClass,
                )}
              >
                {/* Clean Header: Removed 5 Yếu Tố, 02/10, etc. Kept Title, Subtitle & Hanzi Stamp */}
                <div className="relative z-10 flex min-h-22 items-start justify-between gap-3 sm:min-h-20">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--paper-raised)]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm sm:text-base text-[var(--gold-light)] font-medium">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Traditional Hanzi Stamp */}
                  <div
                    className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center whitespace-nowrap rounded-xs border border-[var(--gold-light)]/60 bg-[var(--vermillion)]/90 text-center font-serif text-lg sm:text-xl font-bold text-white shadow-md select-none"
                    title={item.hanzi}
                  >
                    {item.hanzi}
                  </div>
                </div>

                <div className="relative flex h-[350px] items-center justify-center sm:h-[440px] lg:h-[460px]">
                  <ConceptVisualRenderer
                    id={item.id}
                    className="h-full w-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
                  />
                </div>

                {/* Concise, easy-to-understand description footer */}
                <div className="relative z-10 flex min-h-24 items-center rounded-sm border border-[var(--gold)]/30 bg-black/45 p-3 text-sm leading-relaxed text-[var(--paper)]/95 shadow-inner sm:min-h-20 sm:p-3.5 sm:text-base">
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Đồ hình trước"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)]/80 bg-[var(--lacquer-dark)] text-[var(--gold-light)] transition-colors hover:bg-[var(--lacquer-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-light)] cursor-pointer"
        >
          <span aria-hidden="true" className="text-2xl">
            ‹
          </span>
        </button>
        <span
          className="text-sm font-medium tabular-nums text-[var(--gold-light)]"
          aria-label={`Đồ hình ${currentIndex + 1} trên ${CONCEPTS_DATA.length}`}
        >
          {currentConcept.number} / {CONCEPTS_DATA.length}
        </span>
        <button
          type="button"
          onClick={nextSlide}
          title="Đồ hình tiếp theo"
          aria-label="Đồ hình tiếp theo"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--gold)]/80 bg-[var(--lacquer-dark)] text-[var(--gold-light)] transition-colors hover:bg-[var(--lacquer-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-light)] cursor-pointer"
        >
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </figure>
  );
}
