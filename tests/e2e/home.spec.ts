import { test, expect } from "@playwright/test";
import { HomePage } from "./models/HomePage";

test.describe("TedCards Home Page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should display header and navigation", async () => {
    await homePage.expectPageLoaded();
  });

  test("allows navigation to signup page", async ({ page }) => {
    await homePage.clickGetStarted();
    await expect(page).toHaveURL(/.*signup/);
  });

  test("allows navigation to login page", async ({ page }) => {
    await homePage.clickLogin();
    await expect(page).toHaveURL(/.*login/);
  });
});
