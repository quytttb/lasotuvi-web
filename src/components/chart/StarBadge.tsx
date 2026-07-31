import type { StarInfo } from "@/lib/chart/validate";
import { cn } from "@/lib/utils/cn";

const ELEMENT_CLASS: Record<string, string> = {
  Mộc: "text-[var(--wood)]",
  Hỏa: "text-[var(--fire)]",
  Thổ: "text-[var(--earth)]",
  Kim: "text-[var(--metal)]",
  Thủy: "text-[var(--water)]",
};

function auspiciousLabel(star: StarInfo): string | null {
  if (star.is_auspicious === true) return "cát";
  if (star.is_auspicious === false) return "hung";
  return null;
}

export function StarBadge({ star }: { star: StarInfo }) {
  const isMajor = star.category === 1;
  const elementClass = star.element ? ELEMENT_CLASS[star.element] : undefined;
  const nature = auspiciousLabel(star);

  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-baseline gap-x-1 rounded-sm px-0.5",
        isMajor ? "text-[0.95rem] font-semibold text-[var(--ink)]" : "text-[0.72rem] text-[var(--ink-soft)]",
        elementClass && !isMajor ? elementClass : undefined,
      )}
      title={[star.name, star.miao_wang_label, star.mutagen, nature]
        .filter(Boolean)
        .join(" · ")}
    >
      <span>{star.name}</span>
      {star.miao_wang_label ? (
        <span className="text-[0.65rem] font-normal text-[var(--ink-muted)]">
          {star.miao_wang_label}
        </span>
      ) : null}
      {star.mutagen ? (
        <span className="text-[0.65rem] font-medium text-[var(--fire)]">[{star.mutagen}]</span>
      ) : null}
      {nature ? (
        <span className="sr-only">
          {nature}
        </span>
      ) : null}
      {nature ? (
        <span aria-hidden className="text-[0.65rem] text-[var(--ink-muted)]">
          {nature === "cát" ? "◆" : "◇"}
        </span>
      ) : null}
    </span>
  );
}
