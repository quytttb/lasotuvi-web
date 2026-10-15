"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CONCEPTS_DATA } from "./hero-concepts-data";
import { ConceptVisualRenderer } from "./ConceptVisuals";

const SLIDE_DURATION_MS = 10000; // 10 seconds auto-advance

export function HeroConceptsShowcase({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth scroll horizontally to target index
  const scrollToSlide = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    const targetSlide = slideRefs.current[index];
    if (!scroller || !targetSlide) return;

    isProgrammaticScrollRef.current = true;
    setCurrentIndex(index);

    targetSlide.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 450);
  }, []);

  // Pick a random concept different from the current one
  const pickRandomIndex = useCallback(() => {
    let next: number;
    do {
      next = Math.floor(Math.random() * CONCEPTS_DATA.length);
    } while (next === currentIndex && CONCEPTS_DATA.length > 1);

    scrollToSlide(next);
  }, [currentIndex, scrollToSlide]);

  const nextSlide = useCallback(() => {
    scrollToSlide((currentIndex + 1) % CONCEPTS_DATA.length);
  }, [currentIndex, scrollToSlide]);

  const prevSlide = useCallback(() => {
    scrollToSlide((currentIndex - 1 + CONCEPTS_DATA.length) % CONCEPTS_DATA.length);
  }, [currentIndex, scrollToSlide]);

  // Handle manual horizontal scroll / swipe
  const handleScroll = useCallback(() => {
    if (isProgrammaticScrollRef.current) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollLeft = scroller.scrollLeft;
    const slideWidth = scroller.offsetWidth;
    if (slideWidth <= 0) return;

    const newIndex = Math.min(
      CONCEPTS_DATA.length - 1,
      Math.max(0, Math.round(scrollLeft / slideWidth)),
    );

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex]);

  // 10-Second Auto-Advance Timer (silent random pick in background, paused on hover)
  useEffect(() => {
    if (isHovered) {
      return;
    }

    const timer = setInterval(() => {
      pickRandomIndex();
    }, SLIDE_DURATION_MS);

    return () => clearInterval(timer);
  }, [isHovered, pickRandomIndex]);

  return (
    <figure
      className={cn("group/showcase relative min-w-0 w-full animate-fade-in-scale", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Khám phá 10 khái niệm kinh điển Tử Vi Đẩu Số"
    >
      {/* Slider outer container strictly bounded to container width */}
      <div className="relative w-full overflow-hidden rounded-sm flex items-center">
        {/* Left Arrow Button (cạnh trái của khung slider) */}
        <button
          type="button"
          onClick={prevSlide}
          title="Đồ hình trước"
          aria-label="Đồ hình trước"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[var(--gold)]/80 bg-[var(--lacquer-dark)]/90 text-[var(--gold-light)] shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-xs transition-all duration-200 hover:scale-110 hover:border-[var(--gold-light)] hover:bg-[var(--lacquer-deep)] active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--gold-light)]"
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
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Right Arrow Button (cạnh phải của khung slider) */}
        <button
          type="button"
          onClick={nextSlide}
          title="Đồ hình tiếp theo"
          aria-label="Đồ hình tiếp theo"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[var(--gold)]/80 bg-[var(--lacquer-dark)]/90 text-[var(--gold-light)] shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-xs transition-all duration-200 hover:scale-110 hover:border-[var(--gold-light)] hover:bg-[var(--lacquer-deep)] active:scale-95 focus-visible:outline-2 focus-visible:outline-[var(--gold-light)]"
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

        {/* Horizontal Scrollable Slider Container: each slide occupies full width cleanly */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Thanh trượt 10 khái niệm Tử Vi"
          className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth overscroll-x-contain focus:outline-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {CONCEPTS_DATA.map((item, idx) => {
            const isSlideActive = idx === currentIndex;
            return (
              <div
                key={item.id}
                ref={(el) => {
                  slideRefs.current[idx] = el;
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${item.number} trên 10: ${item.title}`}
                className="w-full shrink-0 snap-center"
              >
                {/* Each card receives the lacquer & gold border with oriental corner accents */}
                <div className="relative flex flex-col justify-between rounded-sm border border-[var(--gold)]/60 bg-[var(--lacquer-dark)]/95 p-4 sm:p-6 shadow-[0_24px_64px_rgba(48,15,13,0.38),0_4px_16px_rgba(48,15,13,0.25)] ring-1 ring-[var(--gold-light)]/20 backdrop-blur-md transition-all duration-300">
                  {/* Oriental corner gold accents on the card itself */}
                  <span
                    className="pointer-events-none absolute -top-1.5 -left-1.5 text-xs text-[var(--gold-light)] opacity-85 select-none z-10"
                    aria-hidden="true"
                  >
                    ❖
                  </span>
                  <span
                    className="pointer-events-none absolute -top-1.5 -right-1.5 text-xs text-[var(--gold-light)] opacity-85 select-none z-10"
                    aria-hidden="true"
                  >
                    ❖
                  </span>
                  <span
                    className="pointer-events-none absolute -bottom-1.5 -left-1.5 text-xs text-[var(--gold-light)] opacity-85 select-none z-10"
                    aria-hidden="true"
                  >
                    ❖
                  </span>
                  <span
                    className="pointer-events-none absolute -bottom-1.5 -right-1.5 text-xs text-[var(--gold-light)] opacity-85 select-none z-10"
                    aria-hidden="true"
                  >
                    ❖
                  </span>

                  {/* Subtle background radial glow */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,185,117,0.09)_0%,transparent_75%)]"
                    aria-hidden="true"
                  />

                  {/* Header info */}
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="inline-block rounded-xs px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-2xs"
                          style={{ backgroundColor: item.tagColor }}
                        >
                          {item.tag}
                        </span>
                        <span className="rounded-xs bg-[var(--gold)]/20 px-2 py-0.5 font-mono text-[11px] font-bold text-[var(--gold-light)]">
                          {item.number} / 10
                        </span>
                        <span className="hidden sm:inline text-xs text-[var(--gold-light)]/85">
                          · {item.significance}
                        </span>
                      </div>
                      <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--paper-raised)]">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 text-xs sm:text-sm text-[var(--gold-light)] font-medium">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Traditional Hanzi Stamp */}
                    <div
                      className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xs border border-[var(--gold-light)]/60 bg-[var(--vermillion)]/90 text-center font-serif text-lg sm:text-xl font-bold text-white shadow-md select-none"
                      title={item.hanzi}
                    >
                      {item.hanzi}
                    </div>
                  </div>

                  {/* Centered Large SVG Illustration with side padding to clear arrow buttons */}
                  <div className="relative my-3 sm:my-4 flex items-center justify-center px-8 sm:px-10 py-1">
                    <ConceptVisualRenderer
                      id={item.id}
                      className={cn(
                        "h-56 sm:h-64 w-full max-w-[400px] drop-shadow-[0_6px_20px_rgba(0,0,0,0.55)] transition-all duration-500",
                        isSlideActive ? "scale-100 opacity-100" : "scale-95 opacity-75",
                      )}
                    />
                  </div>

                  {/* Folk-friendly description footer filling the space */}
                  <div className="relative z-10 rounded-sm border border-[var(--gold)]/30 bg-black/45 p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed text-[var(--paper)]/95 shadow-inner">
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
