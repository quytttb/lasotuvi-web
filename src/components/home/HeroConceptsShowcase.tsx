"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CONCEPTS_DATA, type ConceptItem } from "./hero-concepts-data";
import { ConceptVisualRenderer } from "./ConceptVisuals";

const SLIDE_DURATION_MS = 10000; // 10 seconds auto-advance

export function HeroConceptsShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timerStartRef = useRef<number>(Date.now());
  const elapsedBeforePauseRef = useRef<number>(0);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeConcept: ConceptItem = CONCEPTS_DATA[currentIndex];

  // Smooth scroll horizontally to target index
  const scrollToSlide = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    const targetSlide = slideRefs.current[index];
    if (!scroller || !targetSlide) return;

    isProgrammaticScrollRef.current = true;
    setCurrentIndex(index);
    setProgress(0);
    timerStartRef.current = Date.now();
    elapsedBeforePauseRef.current = 0;

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
    }, 500);
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
      setProgress(0);
      timerStartRef.current = Date.now();
      elapsedBeforePauseRef.current = 0;
    }
  }, [currentIndex]);

  // 10-Second Auto-Advance Timer with Random Pick
  useEffect(() => {
    if (!isPlaying || isHovered) {
      return;
    }

    timerStartRef.current = Date.now() - elapsedBeforePauseRef.current;

    const interval = setInterval(() => {
      const elapsed = Date.now() - timerStartRef.current;
      const pct = Math.min(100, (elapsed / SLIDE_DURATION_MS) * 100);
      setProgress(pct);

      if (elapsed >= SLIDE_DURATION_MS) {
        pickRandomIndex();
      }
    }, 100);

    return () => {
      clearInterval(interval);
      elapsedBeforePauseRef.current = Date.now() - timerStartRef.current;
    };
  }, [isPlaying, isHovered, pickRandomIndex]);

  return (
    <figure
      className="relative min-w-0 w-full animate-fade-in-scale"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Khám phá 10 khái niệm kinh điển Tử Vi Đẩu Số"
    >
      {/* Lacquer & Gold frame */}
      <div className="relative rounded-sm border border-[var(--gold)]/60 bg-[var(--lacquer-dark)]/90 p-3 shadow-[0_24px_64px_rgba(48,15,13,0.38),0_4px_16px_rgba(48,15,13,0.25)] ring-1 ring-[var(--gold-light)]/20 backdrop-blur-md sm:p-5">
        {/* Oriental corner gold accents */}
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

        {/* Top Control Bar */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--gold)]/30 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold-light)]/20 text-xs text-[var(--gold-light)]">
              ☯
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-[var(--gold-light)]">
              10 ĐỒ HÌNH KINH ĐIỂN
            </span>
            <span className="rounded-full bg-[var(--gold)]/20 px-2 py-0.5 text-[10px] font-bold text-[var(--gold-light)]">
              {activeConcept.number} / 10
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev Button */}
            <button
              type="button"
              onClick={prevSlide}
              title="Đồ hình trước"
              aria-label="Đồ hình trước"
              className="flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--gold)]/40 bg-[var(--lacquer-deep)]/70 text-xs text-[var(--gold-light)] transition hover:border-[var(--gold-light)] hover:bg-[var(--gold-light)]/15 active:scale-95"
            >
              ❮
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextSlide}
              title="Đồ hình kế tiếp"
              aria-label="Đồ hình kế tiếp"
              className="flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--gold)]/40 bg-[var(--lacquer-deep)]/70 text-xs text-[var(--gold-light)] transition hover:border-[var(--gold-light)] hover:bg-[var(--gold-light)]/15 active:scale-95"
            >
              ❯
            </button>

            {/* Random Button */}
            <button
              type="button"
              onClick={pickRandomIndex}
              title="Chuyển ngẫu nhiên đồ hình khác"
              aria-label="Chọn ngẫu nhiên đồ hình khác"
              className="inline-flex items-center gap-1 rounded-sm border border-[var(--gold)]/50 bg-[var(--lacquer-deep)]/80 px-2.5 py-1 text-xs font-medium text-[var(--gold-light)] transition-all hover:border-[var(--gold-light)] hover:bg-[var(--gold-light)]/15 active:scale-95"
            >
              <span aria-hidden="true">🎲</span>
              <span className="hidden min-[420px]:inline">Ngẫu nhiên</span>
            </button>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              title={isPlaying ? "Tạm dừng tự chuyển (10s)" : "Tiếp tục tự chuyển (10s)"}
              aria-label={isPlaying ? "Tạm dừng tự động chuyển" : "Bật tự động chuyển"}
              className="flex h-7 w-7 items-center justify-center rounded-sm border border-[var(--gold)]/40 bg-[var(--lacquer-deep)]/70 text-xs text-[var(--gold-light)] transition hover:border-[var(--gold-light)] hover:bg-[var(--gold-light)]/15"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>
        </div>

        {/* 10-Second Auto-Advance Progress Bar */}
        <div
          className="relative mb-3 h-1 w-full overflow-hidden rounded-full bg-black/40"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Thời gian tự động chuyển sang đồ hình tiếp theo (10 giây)"
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--gold)] via-[var(--gold-light)] to-[#fffaf2] transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Horizontal Scrollable Slider Container */}
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Thanh trượt ngang 10 khái niệm Tử Vi"
          className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth overscroll-x-contain focus:outline-hidden"
          style={{ scrollbarWidth: "thin" }}
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
                className="w-full shrink-0 snap-center px-0.5"
              >
                <div className="relative flex flex-col justify-between overflow-hidden rounded-[2px] border border-[var(--gold)]/50 bg-[#1e0706]/95 p-3 sm:p-5 transition-all duration-300">
                  {/* Subtle background radial glow */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,185,117,0.08)_0%,transparent_70%)]"
                    aria-hidden="true"
                  />

                  {/* Header info */}
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block rounded-xs px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white"
                          style={{ backgroundColor: item.tagColor }}
                        >
                          {item.tag}
                        </span>
                        <span className="text-xs text-[var(--gold-light)]/80">
                          {item.significance}
                        </span>
                      </div>
                      <h3 className="mt-1 font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--paper-raised)]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[var(--gold-light)] font-medium">
                        {item.subtitle}
                      </p>
                    </div>

                    {/* Traditional Hanzi Stamp */}
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xs border border-[var(--gold-light)]/60 bg-[var(--vermillion)]/90 text-center font-serif text-base font-bold text-white shadow-md select-none"
                      title={item.hanzi}
                    >
                      {item.hanzi}
                    </div>
                  </div>

                  {/* SVG Illustration */}
                  <div className="relative my-3 flex items-center justify-center py-1">
                    <ConceptVisualRenderer
                      id={item.id}
                      className={cn(
                        "h-52 sm:h-60 w-full max-w-[420px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all duration-500",
                        isSlideActive ? "scale-100 opacity-100" : "scale-95 opacity-80",
                      )}
                    />
                  </div>

                  {/* Description footer */}
                  <div className="relative z-10 rounded-sm border border-[var(--gold)]/25 bg-black/40 px-3.5 py-2.5 text-xs leading-relaxed text-[var(--paper)]/90">
                    <p>{item.description}</p>
                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-[var(--gold-light)]/75">
                      <span>↔ Vuốt hoặc cuộn ngang (horizontal scroll) để chuyển</span>
                      <span>Tự chuyển sau 10s · Random</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Horizontal Navigation Pills / Dots Bar */}
        <div className="mt-3 flex items-center justify-between gap-1 border-t border-[var(--gold)]/25 pt-2.5">
          <div
            className="flex flex-1 items-center gap-1.5 overflow-x-auto py-1 scroll-smooth"
            role="tablist"
            aria-label="Danh sách các đồ hình khái niệm"
          >
            {CONCEPTS_DATA.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => scrollToSlide(idx)}
                  className={cn(
                    "group relative flex shrink-0 items-center gap-1.5 rounded-xs px-2.5 py-1 text-xs font-medium transition-all duration-200",
                    isActive
                      ? "border border-[var(--gold-light)] bg-[var(--lacquer-deep)] text-[var(--paper-raised)] shadow-[0_2px_8px_rgba(217,185,117,0.25)] ring-1 ring-[var(--gold)]/40"
                      : "border border-transparent bg-white/5 text-[var(--paper)]/65 hover:border-[var(--gold)]/30 hover:bg-white/10 hover:text-[var(--paper-raised)]",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] font-bold",
                      isActive ? "text-[var(--gold-light)]" : "opacity-60",
                    )}
                  >
                    {item.number}
                  </span>
                  <span className="hidden sm:inline text-[11px]">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </figure>
  );
}
