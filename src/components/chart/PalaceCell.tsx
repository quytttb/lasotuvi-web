import type { CSSProperties } from "react";

import type { PalaceInfo } from "@/lib/chart/validate";
import { isMajorStar } from "@/lib/chart/palace-tone";
import { StarBadge } from "@/components/chart/StarBadge";
import { cn } from "@/lib/utils/cn";

type PalaceCellProps = {
  palace: PalaceInfo;
  className?: string;
  style?: CSSProperties;
};

function formatDaXianRange(palace: PalaceInfo): string | null {
  if (palace.da_xian_age == null) return null;
  if (palace.da_xian_end_age != null) {
    return `Đại hạn ${palace.da_xian_age}–${palace.da_xian_end_age}`;
  }
  return `Đại hạn ${palace.da_xian_age}`;
}

export function PalaceCell({ palace, className, style }: PalaceCellProps) {
  const majorStars = palace.stars.filter(isMajorStar);
  const otherStars = palace.stars.filter((s) => !isMajorStar(s));
  const isActive = palace.is_active_da_xian === true;
  const daXianLabel = formatDaXianRange(palace);

  return (
    <article
      className={cn(
        // Base layout
        "palace-cell flex min-h-0 flex-col text-[0.8rem] leading-snug",
        "border border-[var(--line)]",
        "break-inside-avoid",
        // Default: warm paper background
        "bg-[var(--paper-raised)]",
        // Hover elevation
        "transition-all duration-200",
        // Active: ochre gold highlight
        isActive && "border-[var(--earth)]/70 bg-[var(--earth-soft)]/50 ring-1 ring-[var(--earth)]/30 shadow-[0_0_12px_rgba(138,100,32,0.1)]",
        className,
      )}
      style={style}
      data-palace-index={palace.index}
      data-active-da-xian={isActive ? "true" : undefined}
      aria-label={`Cung ${palace.palace_name ?? palace.index} — ${palace.branch_name}${isActive ? " — đại hạn đang xem" : ""}`}
    >
      {/* ── Cell header ── */}
      <header className="palace-cell-header flex items-start justify-between gap-1 border-b border-[var(--line-soft)] px-2.5 py-2">
        <div className="min-w-0">
          {/* Palace name */}
          <p className="palace-cell-title font-serif text-[1rem] font-semibold leading-tight text-[var(--ink)]">
            {palace.palace_name ?? `Cung ${palace.index}`}
          </p>
          {/* Branch info */}
          <p className="palace-cell-sub mt-0.5 text-[0.72rem] text-[var(--ink-muted)]">
            {palace.stem_name ? (
              <span className="font-medium text-[var(--earth)]">{palace.stem_name} </span>
            ) : null}
            <span>{palace.branch_name}</span>
            {palace.palace_element ? (
              <span className="opacity-70"> · {palace.palace_element}</span>
            ) : null}
          </p>
        </div>

        {/* Badges */}
        <div className="flex shrink-0 flex-wrap justify-end gap-0.5 pt-0.5">
          {isActive ? (
            <span
              className={[
                "rounded-sm px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-wide",
                "bg-[var(--earth)] text-[var(--paper-raised)]",
                "shadow-sm",
              ].join(" ")}
              data-testid="active-da-xian-badge"
            >
              Đang hạn
            </span>
          ) : null}
          {palace.is_body_palace ? (
            <span
              className={[
                "rounded-sm px-1.5 py-0.5 text-[0.65rem] font-semibold",
                "border border-[var(--earth)]/40 bg-[var(--earth-soft)] text-[var(--earth)]",
              ].join(" ")}
            >
              Thân
            </span>
          ) : null}
          {palace.is_xun ? (
            <span className="rounded-sm border border-[var(--line)] px-1 py-0.5 text-[0.65rem] text-[var(--ink-muted)]">
              Tuần
            </span>
          ) : null}
          {palace.is_triet ? (
            <span className="rounded-sm border border-[var(--line)] px-1 py-0.5 text-[0.65rem] text-[var(--ink-muted)]">
              Triệt
            </span>
          ) : null}
        </div>
      </header>

      {/* ── Stars body ── */}
      <div className="palace-cell-body flex min-h-0 flex-1 flex-col gap-1.5 px-2.5 py-2">
        {majorStars.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {majorStars.map((star, index) => (
              <StarBadge key={`m-${palace.index}-${star.id}-${index}`} star={star} />
            ))}
          </div>
        ) : (
          <p className="text-[0.72rem] italic text-[var(--ink-faint)]">Vô chính diệu</p>
        )}

        {otherStars.length > 0 ? (
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 border-t border-dashed border-[var(--line-faint)] pt-1.5">
            {otherStars.map((star, index) => (
              <StarBadge key={`o-${palace.index}-${star.id}-${index}`} star={star} />
            ))}
          </div>
        ) : null}
      </div>

      {/* ── Footer: hạn info ── */}
      {(daXianLabel || palace.xiao_xian_branch || palace.yue_xian != null) ? (
        <footer className="palace-cell-footer flex flex-wrap gap-x-2 gap-y-0.5 border-t border-[var(--line-faint)] bg-[var(--paper-muted)]/30 px-2.5 py-1.5 text-[0.68rem] text-[var(--ink-faint)]">
          {daXianLabel ? (
            <span className="flex items-center gap-1">
              <span className="text-[var(--earth)] opacity-60" aria-hidden="true">◇</span>
              {daXianLabel}
            </span>
          ) : null}
          {palace.xiao_xian_branch ? (
            <span>Tiểu {palace.xiao_xian_branch}</span>
          ) : null}
          {palace.yue_xian != null ? (
            <span>Nguyệt {palace.yue_xian}</span>
          ) : null}
        </footer>
      ) : null}
    </article>
  );
}
