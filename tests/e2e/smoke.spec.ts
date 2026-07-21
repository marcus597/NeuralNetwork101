import { test, expect } from "@playwright/test";

test.describe("Neural Network Museum", () => {
  test("homepage invites play", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Neural Network Museum/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Start Game 1/i })).toBeVisible();
  });

  test("game map lists zones", async ({ page }) => {
    await page.goto("/learn");
    await expect(page.getByRole("heading", { name: /Game map/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Zone 1/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /What is a neuron/i })).toBeVisible();
  });

  test("first game requires typed answers", async ({ page }) => {
    await page.goto("/learn/what-is-a-neuron");
    await expect(page.getByRole("heading", { name: /What is a neuron/i })).toBeVisible();
    const totalInput = page.getByPlaceholder(/Type the number/i);
    await expect(totalInput).toBeVisible();
    await expect(page.getByRole("button", { name: /Check my answer/i })).toBeDisabled();

    await totalInput.fill("3");
    await page.getByRole("button", { name: /Check my answer/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Neurons add their inputs/i })).toBeVisible();
    await page.getByRole("button", { name: /Got it — keep playing!/i }).click();

    await page.getByPlaceholder("on / off").fill("off");
    await page.getByRole("button", { name: /Check my answer/i }).click();
    await expect(page.getByRole("heading", { name: /Neurons turn on or off/i })).toBeVisible();
    await page.getByRole("button", { name: /Got it — keep playing!/i }).click();
    await expect(page.getByText(/Star earned/i)).toBeVisible();
  });

  test("legacy playground redirects to map", async ({ page }) => {
    await page.goto("/playground");
    await expect(page).toHaveURL("/learn");
  });


  test("pizza network exhibit is interactive", async ({ page }) => {
    await page.goto("/network");
    await expect(page.getByRole("heading", { name: /Build a Pizza Brain/i })).toBeVisible();
    await expect(page.getByText(/Tap an ingredient to start/i)).toBeVisible();
    await page.getByRole("button", { name: /Classic pizza/i }).click();
    await expect(page.getByText(/Pizza!/i).first()).toBeVisible();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("heading", { name: /You built a neural network!/i })).toBeVisible();
    await page.getByRole("button", { name: /Nice — keep experimenting!/i }).click();
    await page.getByRole("button", { name: /Dessert plate/i }).click();
    await expect(page.getByText(/Not pizza/i).first()).toBeVisible();
  });

  test("health API responds", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBeTruthy();
  });
});
