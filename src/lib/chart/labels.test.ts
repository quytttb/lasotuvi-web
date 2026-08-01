import { describe, expect, it } from "vitest";

import {
  formatBranchPinyinLabel,
  formatCategoryLabel,
  formatElementLabel,
  formatMiaoWangLabel,
  formatMutagenLabel,
  formatStarCodeLabel,
  isDisplayableVietnameseMeta,
} from "@/lib/chart/labels";

describe("chart labels", () => {
  it("maps Tứ Hóa mutagen codes to full Vietnamese", () => {
    expect(formatMutagenLabel("hua_lu")).toBe("Hóa Lộc");
    expect(formatMutagenLabel("hua_quan")).toBe("Hóa Quyền");
    expect(formatMutagenLabel("hua_ke")).toBe("Hóa Khoa");
    expect(formatMutagenLabel("hua_ji")).toBe("Hóa Kỵ");
  });

  it("maps element slugs used by API and hides placeholders", () => {
    expect(formatElementLabel("moc")).toBe("Mộc");
    expect(formatElementLabel("hoa")).toBe("Hỏa");
    expect(formatElementLabel("tho")).toBe("Thổ");
    expect(formatElementLabel("kim")).toBe("Kim");
    expect(formatElementLabel("thuy")).toBe("Thủy");
    expect(formatElementLabel("O")).toBeNull();
  });

  it("maps earthly-branch pinyin (taboo_palaces)", () => {
    expect(formatBranchPinyinLabel("chou")).toBe("Sửu");
    expect(formatBranchPinyinLabel("wu")).toBe("Ngọ");
    expect(formatBranchPinyinLabel("zi")).toBe("Tý");
  });

  it("maps star pinyin codes to Vietnamese names", () => {
    expect(formatStarCodeLabel("zi_wei")).toBe("Tử vi");
    expect(formatStarCodeLabel("po_jun")).toBe("Phá quân");
    expect(formatStarCodeLabel("wu_qu")).toBe("Vũ khúc");
    expect(formatStarCodeLabel("Tử vi")).toBe("Tử vi");
    expect(formatStarCodeLabel("palace_tone")).toBe("Luận cung");
  });

  it("maps miao_wang codes and prefers label", () => {
    expect(formatMiaoWangLabel("M")).toBe("Miếu");
    expect(formatMiaoWangLabel("V", "Vượng")).toBe("Vượng");
    expect(formatMiaoWangLabel("H")).toBe("Hãm");
  });

  it("maps category labels", () => {
    expect(formatCategoryLabel("major_star")).toBe("Chính tinh");
    expect(formatCategoryLabel("malefic_star")).toBe("Sát tinh");
  });

  it("rejects engine placeholder meta", () => {
    expect(isDisplayableVietnameseMeta("O")).toBe(false);
    expect(isDisplayableVietnameseMeta("LỘ BÀN THỔ")).toBe(true);
  });
});
