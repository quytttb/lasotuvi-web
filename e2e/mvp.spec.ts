import { expect, test } from "@playwright/test";
import path from "node:path";
import { readFileSync } from "node:fs";

const sample = JSON.parse(
  readFileSync(path.join(__dirname, "../src/test/fixtures/sample-chart.json"), "utf8"),
);

async function mockGenerate(
  page: import("@playwright/test").Page,
  handler: (route: import("@playwright/test").Route) => Promise<void> | void,
) {
  await page.route("**/chart/generate", handler);
}

test.describe("LasoTuVi MVP flows", () => {
  test("valid form generates 12-palace board", async ({ page }, testInfo) => {
    await mockGenerate(page, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "X-Request-ID": "e2e-ok" },
        body: JSON.stringify(sample),
      });
    });

    await page.goto("/lap-la-so");
    await page.getByTestId("submit-chart").click();
    await expect(page.getByRole("heading", { name: "Kết quả lá số" })).toBeVisible();
    if (testInfo.project.name === "mobile") {
      await expect(page.locator("[data-palace-index]:visible")).toHaveCount(12);
    } else {
      await expect(page.getByTestId("chart-board")).toBeVisible();
      await expect(page.getByTestId("chart-board").locator("[data-palace-index]")).toHaveCount(12);
    }
  });

  test("invalid solar date shows validation", async ({ page }) => {
    await page.goto("/lap-la-so");
    await page.getByLabel(/^Ngày$/).fill("31");
    await page.getByLabel(/^Tháng$/).fill("2");
    await page.getByTestId("submit-chart").click();
    await expect(page.getByText(/Ngày dương lịch không hợp lệ/i)).toBeVisible();
  });

  test("save, reload, open from list", async ({ page }) => {
    await mockGenerate(page, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(sample),
      });
    });

    await page.goto("/lap-la-so");
    await page.getByTestId("submit-chart").click();
    await page.getByTestId("save-chart").click();
    await expect(page.getByTestId("save-success")).toBeVisible();

    await page.goto("/da-luu");
    await expect(page.getByTestId("saved-list")).toBeVisible();
    await page.getByRole("button", { name: "Mở lại" }).click();
    await expect(page).toHaveURL(/lap-la-so/);
    await expect(page.getByRole("heading", { name: "Kết quả lá số" })).toBeVisible();
  });

  test("rename and delete chart", async ({ page }) => {
    await mockGenerate(page, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(sample),
      });
    });

    await page.goto("/lap-la-so");
    await page.getByTestId("submit-chart").click();
    await page.getByTestId("save-chart").click();
    await page.goto("/da-luu");
    await page.getByRole("button", { name: "Đổi tên" }).click();
    await page.getByLabel("Tên mới").fill("Lá số E2E");
    await page.getByTestId("confirm-rename").click();
    await expect(page.getByText("Lá số E2E")).toBeVisible();
    await page.getByRole("button", { name: "Xóa" }).click();
    await page.getByTestId("confirm-delete").click();
    await expect(page.getByTestId("empty-saved")).toBeVisible();
  });

  test("API 422 maps to form", async ({ page }) => {
    await mockGenerate(page, async (route) => {
      await route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({
          detail: [{ loc: ["body", "day"], msg: "Field required", type: "missing" }],
        }),
      });
    });
    await page.goto("/lap-la-so");
    await page.getByTestId("submit-chart").click();
    await expect(page.getByTestId("api-error")).toContainText(/Field required/i);
  });

  test("API 429 shows Retry-After", async ({ page }) => {
    await mockGenerate(page, async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        headers: {
          "Retry-After": "9",
          "X-Request-ID": "e2e-429",
          "Access-Control-Expose-Headers": "Retry-After, X-Request-ID",
        },
        body: JSON.stringify({
          detail: "rate limited",
          request_id: "e2e-429",
          retry_after: 9,
        }),
      });
    });
    await page.goto("/lap-la-so");
    await page.getByTestId("submit-chart").click();
    await expect(page.getByTestId("api-error")).toBeVisible();
    await expect(page.getByTestId("retry-after")).toBeVisible();
  });

  test("API 503 shows request id and retry hint", async ({ page }) => {
    await mockGenerate(page, async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        headers: { "X-Request-ID": "e2e-503" },
        body: JSON.stringify({ error: "Chart engine unavailable", request_id: "e2e-503" }),
      });
    });
    await page.goto("/lap-la-so");
    await page.getByTestId("submit-chart").click();
    await expect(page.getByTestId("api-error")).toContainText("e2e-503");
    await expect(page.getByTestId("api-error")).toContainText(/thử lại thủ công/i);
  });

  test("mobile viewport has no unexpected page overflow", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile project only");
    await mockGenerate(page, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(sample),
      });
    });
    await page.goto("/lap-la-so");
    await page.getByTestId("submit-chart").click();
    await expect(page.getByRole("heading", { name: "Kết quả lá số" })).toBeVisible();
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth > doc.clientWidth + 2;
    });
    expect(overflow).toBe(false);
  });

  test("print button calls window.print", async ({ page }) => {
    await mockGenerate(page, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(sample),
      });
    });
    await page.goto("/lap-la-so");
    await page.getByTestId("submit-chart").click();
    await expect(page.getByTestId("print-chart")).toBeVisible();
    await page.evaluate(() => {
      (window as unknown as { __printCalled?: boolean }).__printCalled = false;
      window.print = () => {
        (window as unknown as { __printCalled?: boolean }).__printCalled = true;
      };
    });
    await page.getByTestId("print-chart").click();
    expect(
      await page.evaluate(() => (window as unknown as { __printCalled?: boolean }).__printCalled),
    ).toBe(true);
  });
});
