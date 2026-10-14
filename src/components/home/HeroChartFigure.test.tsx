import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HeroChartFigure } from "@/components/home/HeroChartFigure";

describe("HeroChartFigure", () => {
  it("opens a zoom dialog when the sample chart is clicked and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<HeroChartFigure />);

    expect(screen.queryByTestId("hero-chart-dialog")).not.toBeInTheDocument();

    await user.click(screen.getByTestId("hero-chart-open"));
    const dialog = screen.getByTestId("hero-chart-dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog.className).toContain("animate-chart-zoom");
    expect(screen.getByTestId("hero-chart-open")).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("hero-chart-dialog")).not.toBeInTheDocument();
  });

  it("closes when the enlarged image is clicked", async () => {
    const user = userEvent.setup();
    render(<HeroChartFigure />);

    await user.click(screen.getByTestId("hero-chart-open"));
    expect(screen.getByTestId("hero-chart-dialog")).toBeInTheDocument();

    await user.click(screen.getByTestId("hero-chart-close-image"));
    expect(screen.queryByTestId("hero-chart-dialog")).not.toBeInTheDocument();
  });
});
