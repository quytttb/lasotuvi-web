import { expect, test } from "@playwright/test";

/**
 * Reference: tuvivietnam sample — Nam, 24/02/2002 16:30 (Thân), năm xem 2026.
 * Live API only — excluded from mocked CI suite.
 */
test("reference chart 2002-02-24 matches major an sao", async ({ page }) => {
  test.skip(!!process.env.CI, "Requires live LasoTuVi API; not in mocked CI suite");
  test.setTimeout(90_000);

  await page.goto("/lap-la-so");
  await page.getByLabel(/Họ tên/).fill("Mẫu 2002");
  await page.getByLabel(/^Ngày$/).fill("24");
  await page.getByLabel(/^Tháng$/).fill("2");
  await page.getByLabel(/Năm sinh/).fill("2002");
  await page.getByLabel(/Giờ sinh/).selectOption("9"); // Thân 15:00–16:59
  await page.getByLabel(/Năm xem/).fill("2026");
  await page.getByLabel(/Giới tính/).selectOption("1");

  await page.getByTestId("submit-chart").click();
  await expect(page.getByTestId("chart-board")).toBeVisible({
    timeout: 60_000,
  });

  const board = page.getByTestId("chart-board");
  await expect(board).toContainText(/Thủy\s*Nhị\s*Cục/i);
  await expect(board).toContainText(/Dương\s*Liễu\s*Mộc/i);
  await expect(board).toContainText(/Phá\s*quân/i);
  await expect(board).toContainText(/thuận lý/i);

  // Mệnh @ Ngọ — Thiên cơ; Thân @ Quan lộc
  const menh = board.locator('[data-palace-index="7"]');
  await expect(menh).toContainText("Mệnh");
  await expect(menh).toContainText("Ngọ");
  await expect(menh).toContainText("Thiên cơ");

  const quan = board.locator('[data-palace-index="11"]');
  await expect(quan).toContainText(/Quan/i);
  await expect(quan).toContainText("Thân");
  await expect(quan).toContainText("Thái âm");

  const phuMau = board.locator('[data-palace-index="8"]');
  await expect(phuMau).toContainText("Tử vi");
  await expect(phuMau).toContainText("Phá quân");

  const taiBach = board.locator('[data-palace-index="3"]');
  await expect(taiBach).toContainText("Thiên đồng");
  await expect(taiBach).toContainText("Thiên lương");

  await expect(board).toContainText("Hóa Lộc");
  await expect(board).toContainText("Hóa Quyền");
  await expect(board).toContainText("Hóa Khoa");
  await expect(board).toContainText("Hóa Kỵ");

  // Palace tone / support effect from generate (no /chart/analyze)
  await page.getByRole("tab", { name: /^Mệnh\b/i }).click();
  await expect(page.getByTestId("palace-tone")).toBeVisible();
  await expect(page.getByTestId("palace-tone")).toContainText("Luận cung");
  await expect(page.getByTestId("support-effect")).toBeVisible();

  await page.screenshot({
    path: "/tmp/lasotuvi-test/compare-2002-our-board.png",
    fullPage: false,
  });
});
