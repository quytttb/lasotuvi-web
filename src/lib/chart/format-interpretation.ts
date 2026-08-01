/**
 * Parse API palace-star interpretation text into readable UI sections.
 * Backend text is often one dense paragraph with repeated minor-star templates.
 */

export type ParsedInterpretation = {
  /** Opening / main body paragraphs (major-star style). */
  paragraphs: string[];
  /** Structured fields when the text matches the minor-star template. */
  minor?: {
    role?: string;
    nature?: string;
    favorable?: string;
    caution?: string;
  };
  /** Trailing [Tương tác Ngũ Hành: …] note, if present. */
  elementNote?: string;
  /** True when most of the body is shared boilerplate we hide in compact UI. */
  isMinorTemplate: boolean;
};

const ELEMENT_NOTE_RE = /\[Tương tác Ngũ Hành:\s*([^\]]+)\]\s*$/u;

const ROLE_RE = /đóng vai trò\s+(.+?)\s+đối với/u;
const NATURE_RE = /(?:^|[.。]\s*)([^.]{1,40}?)\s+chủ\s+(.+?)(?:\.|$)/u;
const FAVORABLE_RE = /mặt thuận thường là:\s*(.+?)(?:\.\s*Mặt lệch|\.|$)/u;
const CAUTION_RE = /Mặt lệch cần để ý:\s*(.+?)(?:\.|$)/u;

/** Shared filler in minor-star templates — shown once per palace, not per star. */
const BOILERPLATE_SNIPPETS = [
  "Khi cùng cung với chính tinh sáng",
  "Khi chính tinh vốn yếu",
  "Gợi ý thực tế: ghi nhận",
  "Chỉ mang tính tham khảo",
  "cần đọc kèm toàn cục, không tách một phụ tinh",
];

const MAJOR_SECTION_MARKERS = [
  "Đắc địa hoặc",
  "Đắc địa:",
  "Hãm địa hoặc",
  "Hãm địa:",
  "Hướng xử lý",
  "Nên xem thêm",
  "Nội dung mang tính",
];

function stripBoilerplate(text: string): string {
  let rest = text;
  for (const snippet of BOILERPLATE_SNIPPETS) {
    const idx = rest.indexOf(snippet);
    if (idx >= 0) {
      // Cut from first boilerplate onward (templates put filler at the end).
      rest = rest.slice(0, idx).trim();
      break;
    }
  }
  return rest.replace(/\s+/g, " ").trim();
}

function splitMajorParagraphs(body: string): string[] {
  const parts: string[] = [];
  let remaining = body.trim();

  while (remaining) {
    let cutAt = -1;
    for (const marker of MAJOR_SECTION_MARKERS) {
      // Skip marker at start of remaining (already started a section).
      const from = remaining.startsWith(marker) ? marker.length : 0;
      const idx = remaining.indexOf(marker, from > 0 ? from : 1);
      if (idx > 0 && (cutAt < 0 || idx < cutAt)) {
        cutAt = idx;
      }
    }
    if (cutAt > 0) {
      const chunk = remaining.slice(0, cutAt).trim();
      if (chunk) parts.push(chunk);
      remaining = remaining.slice(cutAt).trim();
      continue;
    }
    // Soft-split very long remaining text on ". " near the middle.
    if (remaining.length > 280) {
      const mid = Math.floor(remaining.length / 2);
      const dot = remaining.indexOf(". ", mid);
      if (dot > 40 && dot < remaining.length - 40) {
        parts.push(remaining.slice(0, dot + 1).trim());
        remaining = remaining.slice(dot + 2).trim();
        continue;
      }
    }
    parts.push(remaining);
    break;
  }

  return parts.filter(Boolean);
}

function parseMinorFields(text: string): ParsedInterpretation["minor"] | undefined {
  const role = text.match(ROLE_RE)?.[1]?.trim();
  const natureMatch = text.match(NATURE_RE);
  const nature = natureMatch?.[2]?.trim();
  const favorable = text.match(FAVORABLE_RE)?.[1]?.trim();
  const caution = text.match(CAUTION_RE)?.[1]?.trim();

  if (!role && !nature && !favorable && !caution) return undefined;
  return { role, nature, favorable, caution };
}

export function parseInterpretation(raw: string): ParsedInterpretation {
  const trimmed = raw.replace(/\s+/g, " ").trim();
  if (!trimmed) {
    return { paragraphs: [], isMinorTemplate: false };
  }

  let body = trimmed;
  let elementNote: string | undefined;
  const elementMatch = body.match(ELEMENT_NOTE_RE);
  if (elementMatch) {
    elementNote = elementMatch[1]?.trim();
    body = body.slice(0, elementMatch.index).trim();
  }

  const looksLikeMinorTemplate =
    /đóng vai trò\s+.+\s+đối với/u.test(body) && /mặt thuận thường là:/u.test(body);

  if (looksLikeMinorTemplate) {
    const compact = stripBoilerplate(body);
    const minor = parseMinorFields(compact.length > 0 ? compact : body);
    return {
      paragraphs: [],
      minor,
      elementNote,
      isMinorTemplate: true,
    };
  }

  return {
    paragraphs: splitMajorParagraphs(body),
    elementNote,
    isMinorTemplate: false,
  };
}
