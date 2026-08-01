import {
  categoryToneClass,
  formatMiaoWangLabel,
  formatMutagenLabel,
  mutagenToneClass,
} from "@/lib/chart/labels";
import { isMajorStar } from "@/lib/chart/palace-tone";
import type { StarInfo } from "@/lib/chart/validate";
import { cn } from "@/lib/utils/cn";

export function StarBadge({ star }: { star: StarInfo }) {
  const isMajor = isMajorStar(star);
  const brightness = formatMiaoWangLabel(star.miao_wang, star.miao_wang_label);
  const mutagen = formatMutagenLabel(star.mutagen);
  const categoryClass = categoryToneClass(star.category_label ?? null);
  const mutagenClass = mutagenToneClass(star.mutagen);

  return (
    <span
      className={cn(
        "star-badge inline-flex max-w-full flex-wrap items-baseline gap-x-1 leading-snug",
        isMajor
          ? "star-badge-major text-[0.95rem] font-semibold tracking-tight text-[var(--ink)]"
          : cn("star-badge-minor text-[0.8rem] font-medium", categoryClass),
      )}
    >
      <span>{star.name}</span>
      {brightness ? (
        <span className="star-badge-meta text-[0.72rem] font-normal text-[var(--ink-muted)]">
          {brightness}
        </span>
      ) : null}
      {mutagen ? (
        <span
          className={cn(
            "star-badge-meta text-[0.72rem] font-semibold",
            mutagenClass ?? "text-[var(--fire)]",
          )}
        >
          {mutagen}
        </span>
      ) : null}
    </span>
  );
}
