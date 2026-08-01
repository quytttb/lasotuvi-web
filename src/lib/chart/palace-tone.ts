import type { PalaceInfo, StarInfo } from "@/lib/chart/validate";

/** Matches backend `evaluate_palace_tone` effect codes. */
export type SupportEffect = "rescued" | "burdened" | "reinforced" | "pressed" | "neutral";

const BRIGHT_CODES = new Set(["M", "V", "Đ", "D"]);
const DARK_CODES = new Set(["H"]);

const SUPPORT_EFFECT_LABELS: Record<SupportEffect, string> = {
  rescued: "Được cứu lực",
  burdened: "Bị giảm lực",
  reinforced: "Được củng cố",
  pressed: "Bị đè lực",
  neutral: "Cần xét thêm",
};

export function formatSupportEffectLabel(effect: string | null | undefined): string | null {
  if (!effect) return null;
  const key = effect.trim().toLowerCase() as SupportEffect;
  return SUPPORT_EFFECT_LABELS[key] ?? null;
}

export function supportEffectToneClass(effect: string | null | undefined): string {
  switch ((effect ?? "").toLowerCase()) {
    case "rescued":
    case "reinforced":
      return "border-[var(--wood)] bg-[var(--wood-soft)] text-[var(--wood)]";
    case "burdened":
    case "pressed":
      return "border-[var(--fire)] bg-[var(--fire-soft)] text-[var(--fire)]";
    default:
      return "border-[var(--line)] bg-[var(--paper-muted)] text-[var(--ink-muted)]";
  }
}

export function isMajorStar(star: StarInfo): boolean {
  return star.category === 1 || star.category_label === "major_star";
}

function brightnessCode(star: StarInfo): string | null {
  const raw = (star.miao_wang ?? "").trim();
  if (!raw) return null;
  // Normalize common variants (Đắc may arrive as D/Đ)
  if (raw === "D") return "Đ";
  return raw;
}

/**
 * Infer support effect from palace_tone note text (generate payload).
 * Prefer exact phrases emitted by backend `evaluate_palace_tone`.
 */
export function inferSupportEffectFromNote(note: string | null | undefined): SupportEffect | null {
  if (!note) return null;
  const text = note.toLowerCase();
  if (text.includes("cứu/nâng") || text.includes("được cứu")) return "rescued";
  if (text.includes("bị giảm") || text.includes("phụ tinh xấu kèm")) return "burdened";
  if (text.includes("củng cố")) return "reinforced";
  if (text.includes("đè lực")) return "pressed";
  if (text.includes("không có chính tinh")) return "neutral";
  if (text.includes("chỉ là một phần")) return "neutral";
  return null;
}

/** Client-side mirror of backend tone rules (no /chart/analyze call). */
export function evaluatePalaceToneFromStars(palace: PalaceInfo): {
  effect: SupportEffect;
  interpretation: string;
} {
  const majors = palace.stars.filter(isMajorStar);
  const auxiliaries = palace.stars.filter((s) => !isMajorStar(s));

  if (majors.length === 0) {
    return {
      effect: "neutral",
      interpretation:
        "Cung không có chính tinh; luận theo phụ tinh và cung hội chiếu, không kết luận chỉ từ độ sáng.",
    };
  }

  const hasBright = majors.some((s) => {
    const code = brightnessCode(s);
    return code != null && BRIGHT_CODES.has(code);
  });
  const hasDark = majors.some((s) => {
    const code = brightnessCode(s);
    return code != null && DARK_CODES.has(code);
  });
  const goodAux = auxiliaries.filter((s) => s.is_auspicious === true).length;
  const badAux = auxiliaries.filter((s) => s.is_auspicious === false).length;

  if (hasDark && goodAux > badAux) {
    return {
      effect: "rescued",
      interpretation:
        "Chính tinh đang Hãm (yếu) nhưng cung có nhiều phụ tinh tốt đi kèm nên lực được cứu/nâng; không kết luận xấu chỉ vì chữ Hãm.",
    };
  }
  if (hasBright && badAux > goodAux) {
    return {
      effect: "burdened",
      interpretation:
        "Chính tinh đang sáng (Miếu/Vượng/Đắc) nhưng bị nhiều phụ tinh xấu kèm theo nên lực bị giảm; không kết luận tốt chỉ vì độ sáng.",
    };
  }
  if (hasBright && goodAux >= badAux && (goodAux || badAux)) {
    return {
      effect: "reinforced",
      interpretation:
        "Chính tinh sáng và phụ tinh hỗ trợ thuận; lực cung được củng cố (độ sáng + phụ tinh cùng xét).",
    };
  }
  if (hasDark && badAux >= goodAux && (goodAux || badAux)) {
    return {
      effect: "pressed",
      interpretation:
        "Chính tinh Hãm lại thêm phụ tinh xấu; cung dễ bị đè lực — cần thận trọng khi luận.",
    };
  }
  return {
    effect: "neutral",
    interpretation:
      "Độ sáng chính tinh chỉ là một phần; phải xem thêm phụ tinh tốt/xấu trong cùng cung trước khi kết luận tốt–xấu.",
  };
}

export function getPalaceTonePresentation(palace: PalaceInfo): {
  effect: SupportEffect;
  note: string;
  effectLabel: string;
} {
  const toneItem = palace.interpretations.find((i) => i.star === "palace_tone");
  const fromNote = inferSupportEffectFromNote(toneItem?.interpretation);
  const evaluated = evaluatePalaceToneFromStars(palace);
  const effect = fromNote ?? evaluated.effect;
  const note = toneItem?.interpretation?.trim() || evaluated.interpretation;
  return {
    effect,
    note,
    effectLabel: formatSupportEffectLabel(effect) ?? effect,
  };
}
