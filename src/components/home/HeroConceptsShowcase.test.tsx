import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HeroConceptsShowcase } from "@/components/home/HeroConceptsShowcase";
import { CONCEPTS_DATA } from "@/components/home/hero-concepts-data";

describe("HeroConceptsShowcase", () => {
  afterEach(() => vi.useRealTimers());

  it("renders only the current concept so hidden slides cannot size the card", () => {
    render(<HeroConceptsShowcase />);

    // Check heading of first concept in the main card
    expect(screen.getByRole("heading", { name: CONCEPTS_DATA[0].title })).toBeInTheDocument();

    // Only the current slide participates in layout and the accessibility tree.
    const slides = screen.getAllByRole("group", { name: /trên 10:/i });
    expect(slides).toHaveLength(1);
    expect(screen.getByLabelText("Đồ hình 1 trên 10")).toHaveTextContent("01 / 10");
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
    expect(screen.getByRole("heading", { name: CONCEPTS_DATA[1].title })).toBeInTheDocument();
    expect(screen.getAllByRole("group", { name: /trên 10:/i })).toHaveLength(1);
    await user.click(prevBtn);
    expect(screen.getByRole("heading", { name: CONCEPTS_DATA[0].title })).toBeInTheDocument();
  });

  it("keeps all ten concepts reachable and wraps back to the first", async () => {
    const user = userEvent.setup();
    render(<HeroConceptsShowcase />);
    for (let index = 1; index <= CONCEPTS_DATA.length; index++) {
      await user.click(screen.getByRole("button", { name: "Đồ hình tiếp theo" }));
      expect(
        screen.getByRole("group", {
          name: `${CONCEPTS_DATA[index % 10].number} trên 10: ${CONCEPTS_DATA[index % 10].title}`,
        }),
      ).toBeInTheDocument();
    }
  });

  it("moves the current artwork into the large viewer and restores it on close", async () => {
    const user = userEvent.setup();
    render(<HeroConceptsShowcase />);
    await user.click(screen.getByRole("button", { name: "Xem lớn" }));
    const dialog = screen.getByRole("dialog", { name: CONCEPTS_DATA[0].title });
    expect(within(dialog).getByRole("img")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(document.body.style.overflow).toBe("hidden");
    await user.click(within(dialog).getByRole("button", { name: "Đóng xem lớn" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("pauses automatic changes while keyboard focus is inside the showcase", () => {
    vi.useFakeTimers();
    render(<HeroConceptsShowcase />);
    fireEvent.focus(screen.getByRole("button", { name: "Đồ hình tiếp theo" }));
    act(() => vi.advanceTimersByTime(20000));
    expect(screen.getByRole("heading", { name: CONCEPTS_DATA[0].title })).toBeInTheDocument();
  });
});
