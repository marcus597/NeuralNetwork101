import { test, expect } from "@playwright/test";

test.describe("Wonder foundation", () => {
  test("home page loads with nav", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /touch machine learning/i })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Path" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Playground" })).toBeVisible();
  });

  test("navigate to path and playground", async ({ page }) => {
    await page.goto("/learn");
    await expect(page.getByRole("heading", { name: /learning path/i })).toBeVisible();
    await page.getByRole("link", { name: "Playground" }).click();
    await expect(page).toHaveURL("/playground");
    await expect(page.getByRole("heading", { name: "Playground" })).toBeVisible();
  });

  test("health API responds", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
