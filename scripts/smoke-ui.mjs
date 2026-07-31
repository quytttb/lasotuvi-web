import { chromium, devices } from "@playwright/test";

async function check(name, viewport) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  for (const path of ["/", "/lap-la-so", "/da-luu", "/gioi-thieu"]) {
    await page.goto(`http://127.0.0.1:3000${path}`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    const title = await page.title();
    console.log(`${name} ${path}: title=${JSON.stringify(title)} overflow=${overflow}`);
  }
  await browser.close();
}

await check("desktop", { width: 1280, height: 800 });
await check("mobile", devices["Pixel 7"].viewport);
