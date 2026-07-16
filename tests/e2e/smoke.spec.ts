import { test, expect } from "@playwright/test";

test.describe("Wonder launch smoke", () => {
  test("home page loads with nav and interactive section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /touch machine learning/i }),
    ).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explore" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Path" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Playground" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /try it now/i })).toBeVisible();
  });

  test("learning path shows module nodes", async ({ page }) => {
    await page.goto("/learn");
    await expect(
      page.getByRole("heading", { name: /learning path/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /start.*prediction-game/i })).toBeVisible();
  });

  test("lesson page loads with lesson engine", async ({ page }) => {
    await page.goto("/learn/prediction-game");
    await expect(
      page.getByRole("heading", { name: /the prediction game/i }),
    ).toBeVisible();
    await expect(page.getByText(/will maya love/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /find out/i })).toBeVisible();
  });

  test("ultimate playground loads with algorithm panels", async ({ page }) => {
    await page.goto("/playground");
    await expect(
      page.getByRole("heading", { name: /train, compare, break things/i }),
    ).toBeVisible();
    await expect(page.getByLabel("Experiment name")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Share" })).toBeVisible();
    await expect(page.getByLabel(/playground canvas/i)).toBeVisible({
      timeout: 15_000,
    });
  });

  test("navigate home → path → playground", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Path" }).click();
    await expect(page).toHaveURL("/learn");
    await page.getByRole("link", { name: "Playground" }).click();
    await expect(page).toHaveURL("/playground");
  });

  test("health API responds", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.version).toBeTruthy();
  });

  test("features API returns free tier", async ({ request }) => {
    const res = await request.get("/api/features");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.tier).toBe("free");
  });

  test("subscription API returns free tier", async ({ request }) => {
    const res = await request.get("/api/subscription");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.tier).toBe("free");
    expect(body.status).toBe("active");
  });
});
