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

  const isBright = brightness === "Miếu" || brightness === "Vượng";
  const isDark = brightness === "Hãm";

  return (
    <span
      className={cn(
        "star-badge inline-flex max-w-full flex-wrap items-baseline gap-x-1 leading-snug rounded-sm transition-all duration-200",
        isMajor
          ? "star-badge-major text-[0.95rem] font-serif font-semibold tracking-tight text-[var(--ink)]"
          : cn("star-badge-minor text-[0.78rem] font-medium", categoryClass),
      )}
    >
      <span className={cn(isMajor && "tracking-wide")}>{star.name}</span>
      {brightness ? (
        <span
          className={cn(
            "star-badge-meta text-[0.7rem] font-normal",
            isBright && "font-medium text-[var(--gold)]",
            isDark && "text-[var(--ink-faint)] italic",
            !isBright && !isDark && "text-[var(--ink-muted)]",
          )}
        >
          {brightness}
        </span>
      ) : null}
      {mutagen ? (
        <span
          className={cn(
            "star-badge-meta inline-block rounded-[2px] border px-1 py-[0.5px] text-[0.65rem] font-bold tracking-tight shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
            mutagenClass ?? "text-[var(--fire)]",
            "border-current/40 bg-[var(--paper-raised)]/90",
          )}
        >
          {mutagen}
        </span>
      ) : null}
    </span>
  );
}
