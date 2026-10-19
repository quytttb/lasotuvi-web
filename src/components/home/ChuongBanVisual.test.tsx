import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChuongBanVisual } from "./ChuongBanVisual";

describe("ChuongBanVisual", () => {
  it("uses the left-palm artwork without mirroring its labels", () => {
    const { container } = render(<ChuongBanVisual />);
    const svg = screen.getByRole("img", { name: "Minh họa Bàn Tay Bấm Độn" });
    expect(svg.querySelector("image")).toHaveAttribute("href", "/illustrations/left-palm.svg");
    expect(svg.querySelector("image")).not.toHaveAttribute("transform");
    expect(svg.querySelector("desc")).toHaveTextContent("ngón cái bên phải");

    const x = (finger: string) =>
      Number(container.querySelector(`[data-finger="${finger}"] text`)?.getAttribute("x"));
    expect(x("index")).toBeGreaterThan(x("middle"));
    expect(x("middle")).toBeGreaterThan(x("ring"));
    expect(x("ring")).toBeGreaterThan(x("little"));
  });

  it("keeps the twelve branches on their corresponding fingers", () => {
    const { container } = render(<ChuongBanVisual />);
    const groups = container.querySelectorAll("[data-branch]");
    expect(groups).toHaveLength(12);
    for (const [finger, branches] of Object.entries({
      index: ["Dần", "Mão", "Thìn"],
      middle: ["Tỵ", "Ngọ", "Mùi"],
      ring: ["Thân", "Dậu", "Tuất"],
      little: ["Hợi", "Tý", "Sửu"],
    })) {
      expect(
        [...container.querySelectorAll(`[data-finger="${finger}"]`)].map((g) =>
          g.getAttribute("data-branch"),
        ),
      ).toEqual(branches);
    }
    // Only tiny annotation dots: the old bead-like badges and trail are gone.
    expect(container.querySelectorAll("circle")).toHaveLength(7);
    for (const circle of container.querySelectorAll("circle")) {
      expect(Number(circle.getAttribute("r"))).toBeLessThan(2);
    }
    expect(container.querySelector("[stroke-dasharray]")).toBeNull();
  });

  it("provides accessible artwork attribution and license details", () => {
    render(<ChuongBanVisual />);
    expect(screen.getByRole("link", { name: /LucasVB/ })).toHaveAttribute(
      "href",
      "/illustrations/left-palm.LICENSE.txt",
    );
  });
});
