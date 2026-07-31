import type { CSSProperties } from "react";

import type { PalaceInfo } from "@/lib/chart/validate";
import { StarBadge } from "@/components/chart/StarBadge";
import { cn } from "@/lib/utils/cn";

type PalaceCellProps = {
  palace: PalaceInfo;
  className?: string;
  style?: CSSProperties;
};

export function PalaceCell({ palace, className, style }: PalaceCellProps) {
  const majorStars = palace.stars.filter((s) => s.category === 1);
  const otherStars = palace.stars.filter((s) => s.category !== 1);

  return (
    <article
      className={cn(
        "palace-cell flex min-h-0 flex-col border border-[var(--line)] bg-[var(--paper-raised)] p-1.5 text-[0.7rem] leading-tight",
        "break-inside-avoid",
        className,
      )}
      style={style}
      data-palace-index={palace.index}
      aria-label={`Cung ${palace.palace_name ?? palace.index} — ${palace.branch_name}`}
    >
      <header className="mb-1 flex flex-wrap items-start justify-between gap-1 border-b border-[var(--line-soft)] pb-1">
        <div>
          <p className="font-serif text-[0.8rem] font-semibold text-[var(--ink)]">
            {palace.palace_name ?? `Cung ${palace.index}`}
          </p>
          <p className="text-[var(--ink-muted)]">
            {palace.stem_name ? `${palace.stem_name} ` : ""}
            {palace.branch_name}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {palace.is_body_palace ? (
            <span className="rounded-sm bg-[var(--earth-soft)] px-1 text-[0.65rem] text-[var(--earth)]">
              Thân
            </span>
          ) : null}
          {palace.is_xun ? (
            <span className="rounded-sm border border-[var(--line)] px-1 text-[0.65rem]" title="Tuần">
              Tuần
            </span>
          ) : null}
          {palace.is_triet ? (
            <span className="rounded-sm border border-[var(--line)] px-1 text-[0.65rem]" title="Triệt">
              Triệt
            </span>
          ) : null}
        </div>
      </header>

      <div className="mb-1 space-y-0.5 text-[0.65rem] text-[var(--ink-muted)]">
        {palace.da_xian_age != null ? <p>Đại hạn: {palace.da_xian_age}</p> : null}
        {palace.xiao_xian_branch ? <p>Tiểu hạn: {palace.xiao_xian_branch}</p> : null}
        {palace.yue_xian != null ? <p>Nguyệt hạn: {palace.yue_xian}</p> : null}
      </div>

      <div className="flex flex-wrap gap-x-1.5 gap-y-0.5">
        {majorStars.map((star) => (
          <StarBadge key={`m-${star.id}-${star.name}`} star={star} />
        ))}
      </div>
      {otherStars.length > 0 ? (
        <div className="mt-1 flex flex-wrap gap-x-1 gap-y-0.5">
          {otherStars.map((star) => (
            <StarBadge key={`o-${star.id}-${star.name}`} star={star} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
