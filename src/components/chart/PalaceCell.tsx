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
        "palace-cell flex min-h-0 flex-col bg-[var(--paper-raised)] p-2.5 text-[0.8rem] leading-snug",
        "border border-[var(--line)]",
        "break-inside-avoid",
        isActive && "border-[var(--earth)] bg-[var(--earth-soft)]/35 ring-1 ring-[var(--earth)]/40",
        className,
      )}
      style={style}
      data-palace-index={palace.index}
      data-active-da-xian={isActive ? "true" : undefined}
      aria-label={`Cung ${palace.palace_name ?? palace.index} — ${palace.branch_name}${isActive ? " — đại hạn đang xem" : ""}`}
    >
      <header className="palace-cell-header mb-1.5 flex items-start justify-between gap-1 border-b border-[var(--line-soft)] pb-1.5">
        <div className="min-w-0">
          <p className="palace-cell-title font-serif text-[1rem] font-semibold leading-none text-[var(--ink)]">
            {palace.palace_name ?? `Cung ${palace.index}`}
          </p>
          <p className="palace-cell-sub mt-0.5 text-[0.78rem] text-[var(--ink-muted)]">
            {palace.stem_name ? `${palace.stem_name} ` : ""}
            {palace.branch_name}
            {palace.palace_element ? ` · ${palace.palace_element}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-0.5">
          {isActive ? (
            <span
              className="rounded-sm bg-[var(--earth)] px-1 py-0.5 text-[0.7rem] font-medium text-[var(--paper-raised)]"
              data-testid="active-da-xian-badge"
            >
              Đang hạn
            </span>
          ) : null}
          {palace.is_body_palace ? (
            <span className="rounded-sm bg-[var(--earth-soft)] px-1 py-0.5 text-[0.7rem] font-medium text-[var(--earth)]">
              Thân
            </span>
          ) : null}
          {palace.is_xun ? (
            <span className="rounded-sm border border-[var(--line)] px-1 py-0.5 text-[0.7rem] text-[var(--ink-muted)]">
              Tuần
            </span>
          ) : null}
          {palace.is_triet ? (
            <span className="rounded-sm border border-[var(--line)] px-1 py-0.5 text-[0.7rem] text-[var(--ink-muted)]">
              Triệt
            </span>
          ) : null}
        </div>
      </header>

      <div className="palace-cell-body flex min-h-0 flex-1 flex-col gap-1.5">
        {majorStars.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {majorStars.map((star, index) => (
              <StarBadge key={`m-${palace.index}-${star.id}-${index}`} star={star} />
            ))}
          </div>
        ) : (
          <p className="text-[0.75rem] italic text-[var(--ink-muted)]">Vô chính diệu</p>
        )}

        {otherStars.length > 0 ? (
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 border-t border-dashed border-[var(--line-soft)] pt-1.5">
            {otherStars.map((star, index) => (
              <StarBadge key={`o-${palace.index}-${star.id}-${index}`} star={star} />
            ))}
          </div>
        ) : null}
      </div>

      <footer className="palace-cell-footer mt-auto flex flex-wrap gap-x-2 gap-y-0.5 border-t border-[var(--line-soft)] pt-1.5 text-[0.72rem] text-[var(--ink-muted)]">
        {daXianLabel ? <span>{daXianLabel}</span> : null}
        {palace.xiao_xian_branch ? <span>Tiểu {palace.xiao_xian_branch}</span> : null}
        {palace.yue_xian != null ? <span>Nguyệt {palace.yue_xian}</span> : null}
      </footer>
    </article>
  );
}
