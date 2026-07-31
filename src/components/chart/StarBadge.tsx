import {
  categoryToneClass,
  formatMiaoWangLabel,
  formatMutagenLabel,
  mutagenToneClass,
} from "@/lib/chart/labels";
import type { StarInfo } from "@/lib/chart/validate";
import { cn } from "@/lib/utils/cn";

export function StarBadge({ star }: { star: StarInfo }) {
  const isMajor = star.category === 1 || star.category_label === "major_star";
  const brightness = formatMiaoWangLabel(star.miao_wang, star.miao_wang_label);
  const mutagen = formatMutagenLabel(star.mutagen);
  const categoryClass = categoryToneClass(star.category_label ?? null);
  const mutagenClass = mutagenToneClass(star.mutagen);

  return (
    <span
      className={cn(
        "inline-flex max-w-full flex-wrap items-baseline gap-x-1 leading-snug",
        isMajor
          ? "text-[0.82rem] font-semibold tracking-tight text-[var(--ink)]"
          : cn("text-[0.68rem] font-medium", categoryClass),
      )}
    >
      <span>{star.name}</span>
      {brightness ? (
        <span className="text-[0.62rem] font-normal text-[var(--ink-muted)]">{brightness}</span>
      ) : null}
      {mutagen ? (
        <span className={cn("text-[0.62rem] font-semibold", mutagenClass ?? "text-[var(--fire)]")}>
          {mutagen}
        </span>
      ) : null}
    </span>
  );
}
