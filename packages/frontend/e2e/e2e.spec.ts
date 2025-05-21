import { expect, test } from "@playwright/test";

test.describe("E2E Test", () => {
  test("Should return 200 response - /", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    const contentH1 = page.locator("h1");
    await expect(contentH1).toHaveText("React Router and Hono");

    const contentH2 = await page.textContent("h2");
    expect(contentH2).toMatch(/URL is http:\/\/localhost:\d+/);

    const contentH3 = page.locator("h3");
    await expect(contentH3).toHaveText("Extra is stuff");
  });

  test("Should return 200 response - /api", async ({ page }) => {
    const response = await page.goto("/api");
    expect(response?.status()).toBe(200);
    expect(await response?.json()).toEqual({ message: "Hello" });
  });
});
