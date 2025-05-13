import { test, expect } from "@playwright/test";
import { HomePage } from "./models/HomePage";

test.describe("TedCards Home Page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test("should display header and navigation", async () => {
    await homePage.verifyNavigation();
  });

  test("should display all main page sections", async () => {
    await homePage.expectFullPageStructure();
  });

  test("allows navigation to signup page via signup button", async ({ page }) => {
    await homePage.clickSignup();
    await expect(page).toHaveURL(/.*signup/);
  });

  test("allows navigation to signup page via get started button", async ({ page }) => {
    await homePage.clickGetStarted();
    await expect(page).toHaveURL(/.*login/);
  });

  test("allows navigation to signup page via try free button", async ({ page }) => {
    await homePage.scrollToCta();
    await homePage.clickTryFree();
    await expect(page).toHaveURL(/.*signup/);
  });

  test("allows navigation to login page", async ({ page }) => {
    await homePage.clickLogin();
    await expect(page).toHaveURL(/.*login/);
  });

  test("has correct hero heading text", async () => {
    const headingText = await homePage.getHeroHeadingText();
    expect(headingText).toContain("AI-Powered Flashcard Generator");
  });

  test("can scroll to all main sections", async () => {
    await homePage.scrollToFeatures();
    await expect(homePage.featureSection).toBeInViewport();

    await homePage.scrollToHowItWorks();
    await expect(homePage.howItWorksSection).toBeInViewport();

    await homePage.scrollToTestimonials();
    await expect(homePage.testimonialSection).toBeInViewport();

    await homePage.scrollToCta();
    await expect(homePage.ctaSection).toBeInViewport();

    await homePage.scrollToFooter();
    await expect(homePage.footerSection).toBeInViewport();
  });

  test("page performance - load time is acceptable", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });

  test("responsive design - mobile view", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await homePage.goto();

    await homePage.expectPageLoaded();

    await expect(homePage.loginButton).toBeVisible();
  });

  test("should take screenshot of hero section", async () => {
    await expect(homePage.heroSection).toBeVisible();
    await homePage.heroSection.screenshot({ path: "./test-results/hero-section.png" });
  });
});
