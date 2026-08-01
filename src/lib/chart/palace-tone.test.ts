import { describe, expect, it } from "vitest";

import { formatStarCodeLabel } from "@/lib/chart/labels";
import {
  evaluatePalaceToneFromStars,
  formatSupportEffectLabel,
  inferSupportEffectFromNote,
} from "@/lib/chart/palace-tone";
import type { PalaceInfo } from "@/lib/chart/validate";

function palace(partial: Partial<PalaceInfo> & { stars: PalaceInfo["stars"] }): PalaceInfo {
  return {
    index: 1,
    branch_name: "Tý",
    palace_element: "Thủy",
    yin_yang: 1,
    interpretations: [],
    ...partial,
  };
}

describe("palace tone / support effect", () => {
  it("maps palace_tone to Vietnamese", () => {
    expect(formatStarCodeLabel("palace_tone")).toBe("Luận cung");
  });

  it("maps support_effect codes", () => {
    expect(formatSupportEffectLabel("rescued")).toBe("Được cứu lực");
    expect(formatSupportEffectLabel("reinforced")).toBe("Được củng cố");
    expect(formatSupportEffectLabel("burdened")).toBe("Bị giảm lực");
    expect(formatSupportEffectLabel("pressed")).toBe("Bị đè lực");
    expect(formatSupportEffectLabel("neutral")).toBe("Cần xét thêm");
  });

  it("infers effect from backend palace_tone notes", () => {
    expect(
      inferSupportEffectFromNote(
        "Chính tinh đang Hãm (yếu) nhưng cung có nhiều phụ tinh tốt đi kèm nên lực được cứu/nâng; không kết luận xấu chỉ vì chữ Hãm.",
      ),
    ).toBe("rescued");
    expect(
      inferSupportEffectFromNote(
        "Chính tinh sáng và phụ tinh hỗ trợ thuận; lực cung được củng cố (độ sáng + phụ tinh cùng xét).",
      ),
    ).toBe("reinforced");
  });

  it("evaluates rescued when dark major + good aux", () => {
    const tone = evaluatePalaceToneFromStars(
      palace({
        stars: [
          {
            id: 1,
            name: "Liêm trinh",
            category: 1,
            miao_wang: "H",
            is_auspicious: true,
          },
          {
            id: 2,
            name: "Văn xương",
            category: 2,
            is_auspicious: true,
          },
          {
            id: 3,
            name: "Lộc tồn",
            category: 2,
            is_auspicious: true,
          },
        ],
      }),
    );
    expect(tone.effect).toBe("rescued");
  });
});
