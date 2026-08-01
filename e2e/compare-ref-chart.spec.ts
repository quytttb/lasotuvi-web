import { expect, test } from "@playwright/test";

/**
 * Compare FE+API against tuvivietnam sample chart:
 * Dương lịch 08/08/2008 10:30 → giờ Tỵ (6), Nam, năm xem 2026.
 * Live API only — excluded from mocked CI suite.
 */
test("reference chart 2008-08-08 matches major an sao", async ({ page }) => {
  test.skip(!!process.env.CI, "Requires live LasoTuVi API; not in mocked CI suite");
  test.setTimeout(90_000);

  await page.goto("/lap-la-so");
  await page.getByLabel(/Họ tên/).fill("Group FB Tử Vi Việt Nam");
  await page.getByLabel(/^Ngày$/).fill("8");
  await page.getByLabel(/^Tháng$/).fill("8");
  await page.getByLabel(/Năm sinh/).fill("2008");
  await page.getByLabel(/Giờ sinh/).selectOption("6"); // Tỵ 09:00–10:59
  await page.getByLabel(/Năm xem/).fill("2026");
  await page.getByLabel(/Giới tính/).selectOption("1");

  await page.getByTestId("submit-chart").click();
  await expect(page.getByTestId("chart-board")).toBeVisible({
    timeout: 60_000,
  });

  const board = page.getByTestId("chart-board");
  await expect(board).toBeVisible();

  // Meta from reference center
  await expect(board).toContainText(/Thủy\s*Nhị\s*Cục/i);
  await expect(board).toContainText(/Tích\s*Lịch\s*Hỏa/i);
  await expect(board).toContainText("Văn Khúc");
  await expect(board).toContainText(/nghịch lý/i);

  // Life palace Mão + Thiên tướng; body at Thê
  const menhCell = board.locator('[data-palace-index="4"]');
  await expect(menhCell).toContainText("Mệnh");
  await expect(menhCell).toContainText("Mão");
  await expect(menhCell).toContainText("Thiên tướng");

  const theCell = board.locator('[data-palace-index="2"]');
  await expect(theCell).toContainText(/Phu thê|Thê/i);
  await expect(theCell).toContainText("Thân");
  await expect(theCell).toContainText("Vũ khúc");
  await expect(theCell).toContainText("Tham lang");

  const phuc = board.locator('[data-palace-index="6"]');
  await expect(phuc).toContainText("Tử vi");
  await expect(phuc).toContainText("Thất sát");

  const thienDi = board.locator('[data-palace-index="10"]');
  await expect(thienDi).toContainText("Liêm trinh");
  await expect(thienDi).toContainText("Phá quân");

  // Tứ hóa full labels present
  await expect(board).toContainText("Hóa Lộc");
  await expect(board).toContainText("Hóa Quyền");
  await expect(board).toContainText("Hóa Khoa");
  await expect(board).toContainText("Hóa Kỵ");

  await page.screenshot({
    path: "/tmp/lasotuvi-test/compare-2008-our-board.png",
    fullPage: false,
  });
});
