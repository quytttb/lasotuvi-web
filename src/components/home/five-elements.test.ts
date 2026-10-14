import { describe, expect, it } from "vitest";

import { FIVE_ELEMENTS } from "@/components/home/five-elements";

describe("FIVE_ELEMENTS", () => {
  it("is ordered Kim, Mộc, Thủy, Hỏa, Thổ from left to right", () => {
    expect(FIVE_ELEMENTS.map((el) => el.name)).toEqual(["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"]);
  });
});
