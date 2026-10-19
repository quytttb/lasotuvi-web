import { expect, test } from "@playwright/test";

test.describe("Home concept showcase", () => {
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

  test("large view enlarges the SVG, contains scrolling and restores keyboard focus", async ({
    page,
  }) => {
    await page.goto("/");
    const figure = page.getByRole("figure", {
      name: "Khám phá 10 khái niệm kinh điển Tử Vi Đẩu Số",
    });
    await figure.hover();
    const scale = () =>
      page.getByRole("img").evaluate((svg: SVGSVGElement) => {
        const box = svg.getBoundingClientRect();
        const view = svg.viewBox.baseVal;
        return Math.min(box.width / view.width, box.height / view.height);
      });
    const originalScale = await scale();
    const open = figure.getByRole("button", { name: "Xem lớn", exact: true });
    await open.click();
    const dialog = page.getByRole("dialog", { name: "Bát Quái Đồ" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("img")).toHaveCount(1);
    expect(await scale()).toBeGreaterThan(originalScale);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    await expect(dialog.getByRole("button", { name: "Đóng xem lớn" })).toBeFocused();

    // The large canvas can overflow its own viewport, never the page itself.
    const canvas = dialog.getByRole("region", { name: "Đồ hình phóng lớn, có thể cuộn" });
    await expect
      .poll(() =>
        canvas.evaluate((el) =>
          el.scrollWidth > el.clientWidth + 1
            ? Math.abs(el.scrollLeft - (el.scrollWidth - el.clientWidth) / 2) < 2
            : true,
        ),
      )
      .toBe(true);
    await canvas.evaluate((el) => {
      el.scrollLeft = el.scrollWidth;
      el.scrollTop = el.scrollHeight;
    });
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(open).toBeFocused();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
    await expect(figure.getByRole("img")).toBeVisible();

    await open.click();
    await dialog.getByRole("button", { name: "Đóng xem lớn" }).click();
    await expect(dialog).not.toBeVisible();
    await expect(open).toBeFocused();
  });
});
