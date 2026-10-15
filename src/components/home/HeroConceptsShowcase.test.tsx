import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { HeroConceptsShowcase } from "@/components/home/HeroConceptsShowcase";
import { CONCEPTS_DATA } from "@/components/home/hero-concepts-data";

describe("HeroConceptsShowcase", () => {
  it("renders the showcase with all 10 concepts", () => {
    render(<HeroConceptsShowcase />);

    // Check heading of first concept in the main card
    expect(screen.getByRole("heading", { name: CONCEPTS_DATA[0].title })).toBeInTheDocument();

    // Check 10 slides rendered
    const slides = screen.getAllByRole("group", { name: /trên 10:/i });
    expect(slides).toHaveLength(10);
  });

  it("renders the left and right navigation arrow buttons", () => {
    render(<HeroConceptsShowcase />);

    const prevBtn = screen.getByRole("button", { name: /đồ hình trước/i });
    const nextBtn = screen.getByRole("button", { name: /đồ hình tiếp theo/i });

    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();
  });

  it("clicking next and prev buttons can be triggered without errors", async () => {
    const user = userEvent.setup();
    render(<HeroConceptsShowcase />);

    const nextBtn = screen.getByRole("button", { name: /đồ hình tiếp theo/i });
    const prevBtn = screen.getByRole("button", { name: /đồ hình trước/i });

    await user.click(nextBtn);
    await user.click(prevBtn);
  });
});
