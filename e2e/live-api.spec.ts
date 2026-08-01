import { expect, test } from "@playwright/test";

/**
 * Live integration against NEXT_PUBLIC_LASOTUVI_API_URL (Pi / handoff).
 * Not part of mocked CI suite — run explicitly:
 *   pnpm exec playwright test e2e/live-api.spec.ts --project=chromium
 */
test.describe("Live API integration", () => {
  test("form submit calls real /chart/generate and renders board", async ({
    page,
  }) => {
    test.skip(!!process.env.CI, "Requires live LasoTuVi API; not in mocked CI suite");
    const apiCalls: { url: string; status: number }[] = [];
    page.on("response", (response) => {
      const url = response.url();
      if (url.includes("/chart/generate")) {
        apiCalls.push({ url, status: response.status() });
      }
    });

    await page.goto("/lap-la-so");
    await expect(page.getByTestId("submit-chart")).toBeVisible();

    // Defaults match handoff smoke payload (15/8/1990, hour 7 Ngọ).
    await page.getByLabel(/Họ tên/).fill("Test FE Live");
    await page.getByTestId("submit-chart").click();

    await expect(page.getByRole("heading", { name: "Kết quả lá số" })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId("chart-board")).toBeVisible();
    await expect(
      page.getByTestId("chart-board").locator("[data-palace-index]"),
    ).toHaveCount(12);

    expect(apiCalls.length).toBeGreaterThanOrEqual(1);
    expect(apiCalls[0]?.url).toContain("/chart/generate");
    expect(apiCalls[0]?.status).toBe(200);

    await expect(page.getByText(/Ngũ hành cục/i)).toBeVisible();
    await expect(page.getByText(/Sát Phá Tham|Cách cục/i).first()).toBeVisible();

    const board = page.getByTestId("chart-board");
    await expect(board).toContainText("Hóa Lộc");
    await expect(board).toContainText("Hóa Quyền");
    await expect(board).toContainText("Hóa Khoa");
    await expect(board).toContainText("Hóa Kỵ");
    await expect(board).not.toContainText("hua_");
    await expect(page.locator("section[aria-labelledby=taboo-heading]")).toContainText("Sửu");
    await expect(page.locator("section[aria-labelledby=taboo-heading]")).toContainText("Ngọ");
    await expect(page.locator("section[aria-labelledby=taboo-heading]")).not.toContainText("chou");

    // Interpretation titles should be Vietnamese, not pinyin codes
    const interp = page.locator("section[aria-labelledby=palace-interp-heading]");
    await expect(interp).not.toContainText("zi_wei");
    await expect(interp).not.toContainText("po_jun");
  });
});
