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
    // Keep the small annotation dots without bringing back the oversized badges.
    expect(container.querySelectorAll("circle")).toHaveLength(7);
    for (const circle of container.querySelectorAll("circle")) {
      expect(Number(circle.getAttribute("r"))).toBeLessThan(2);
    }
  });

  it("restores the closed twelve-position circuit and the palm seal", () => {
    const { container } = render(<ChuongBanVisual />);
    const circuit = screen.getByTestId("branch-circuit");
    expect(circuit).toHaveAttribute("stroke-dasharray", "3 3");
    const points = circuit.getAttribute("points")!.split(" ");
    expect(points).toHaveLength(13);
    expect(new Set(points).size).toBe(12);
    expect(points[0]).toBe(points[12]);
    expect(points[0]).toBe("245,121"); // Dần on the finger, not its offset label.
    expect(screen.getByText("CHƯỞNG QUYẾT")).toBeInTheDocument();
    expect(container.querySelector('[aria-label="Chưởng quyết"] rect')).toBeInTheDocument();
  });

  it("keeps the source credit off the drawing and points to the about page", () => {
    const { container } = render(<ChuongBanVisual />);
    expect(screen.queryByText(/Dáng tay:/)).not.toBeInTheDocument();
    expect(container.querySelector("desc")).toHaveTextContent("trang Giới thiệu");
  });
});
