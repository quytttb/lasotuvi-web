import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HeroConceptsShowcase } from "@/components/home/HeroConceptsShowcase";
import { CONCEPTS_DATA } from "@/components/home/hero-concepts-data";

describe("HeroConceptsShowcase", () => {
  it("renders the 10 concepts showcase with default first concept", () => {
    render(<HeroConceptsShowcase />);

    // Check heading of first concept in the main card
    expect(screen.getByRole("heading", { name: CONCEPTS_DATA[0].title })).toBeInTheDocument();
    expect(screen.getByText(/10 ĐỒ HÌNH KINH ĐIỂN/i)).toBeInTheDocument();

    // Check tabs in vertical rail
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(10);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });

  it("updates the active concept when a concept tab is clicked", async () => {
    const user = userEvent.setup();
    render(<HeroConceptsShowcase />);

    const tabs = screen.getAllByRole("tab");
    // Click on Ngũ Hành (index 1)
    await user.click(tabs[1]);

    expect(screen.getByRole("heading", { name: CONCEPTS_DATA[1].title })).toBeInTheDocument();
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
  });

  it("toggles play/pause button state", async () => {
    const user = userEvent.setup();
    render(<HeroConceptsShowcase />);

    const pauseBtn = screen.getByRole("button", { name: /tạm dừng tự động chuyển/i });
    expect(pauseBtn).toBeInTheDocument();

    await user.click(pauseBtn);

    const playBtn = screen.getByRole("button", { name: /bật tự động chuyển/i });
    expect(playBtn).toBeInTheDocument();
  });

  it("random button changes the active concept or can be clicked safely", async () => {
    const user = userEvent.setup();
    render(<HeroConceptsShowcase />);

    const randomBtn = screen.getByRole("button", { name: /chọn ngẫu nhiên đồ hình khác/i });
    expect(randomBtn).toBeInTheDocument();

    await user.click(randomBtn);

    // One of the tabs should be selected
    const selectedTabs = screen
      .getAllByRole("tab")
      .filter((t) => t.getAttribute("aria-selected") === "true");
    expect(selectedTabs).toHaveLength(1);
  });
});
