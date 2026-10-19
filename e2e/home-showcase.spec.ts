import { expect, test } from "@playwright/test";

test.describe("Home concept showcase", () => {
  test("keeps the highlighted phrase on one line in the hero title", async ({ page }) => {
    await page.goto("/");
    const phrase = page
      .getByRole("heading", { level: 1 })
      .getByText("truyền thống", { exact: true });
    await expect(phrase).toBeVisible();
    const lineCount = await phrase.evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getClientRects().length;
    });
    expect(lineCount).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  });

  test("all ten diagrams use the full card width without page overflow", async ({ page }) => {
    await page.goto("/");
    const figure = page.getByRole("figure", {
      name: "Khám phá 10 khái niệm kinh điển Tử Vi Đẩu Số",
    });
    await figure.hover();

    for (let index = 1; index <= 10; index++) {
      const active = figure.locator('[aria-roledescription="slide"][aria-hidden="false"]');
      await expect(active).toHaveAttribute(
        "aria-label",
        new RegExp(`^${String(index).padStart(2, "0")} trên 10:`),
      );
      await active.evaluate((el) =>
        Promise.allSettled(
          el.getAnimations({ subtree: true }).map((animation) => animation.finished),
        ),
      );
      await expect(figure.getByRole("group", { name: /trên 10:/ })).toHaveCount(1);
      const svg = active.getByRole("img");
      await expect(svg).toBeVisible();
      await svg.scrollIntoViewIfNeeded();
      const diagramBox = await svg.boundingBox();
      const frameBox = await figure.boundingBox();
      expect(diagramBox!.width / frameBox!.width).toBeGreaterThan(0.85);
      expect(diagramBox!.height).toBeGreaterThanOrEqual(350);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
        false,
      );
      await figure.getByRole("button", { name: "Đồ hình tiếp theo", exact: true }).click();
    }

    await expect(figure.getByLabel("Đồ hình 1 trên 10", { exact: true })).toHaveText("01 / 10");
  });
});
