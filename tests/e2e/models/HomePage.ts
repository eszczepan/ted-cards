import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly heroSection: Locator;
  readonly getStartedButton: Locator;
  readonly loginButton: Locator;
  readonly signupButton: Locator;
  readonly logoImage: Locator;
  readonly featureSection: Locator;
  readonly howItWorksSection: Locator;
  readonly testimonialSection: Locator;
  readonly ctaSection: Locator;
  readonly tryFreeButton: Locator;
  readonly footerSection: Locator;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = page.getByTestId("main-header");
    this.heading = page.getByTestId("hero-heading");
    this.heroSection = page.getByTestId("hero-section");
    this.getStartedButton = page.getByTestId("get-started-button");
    this.loginButton = page.getByTestId("login-button");
    this.signupButton = page.getByTestId("signup-button");
    this.logoImage = page.getByTestId("logo");
    this.featureSection = page.getByTestId("feature-section");
    this.howItWorksSection = page.getByTestId("how-it-works-section");
    this.testimonialSection = page.getByTestId("testimonial-section");
    this.ctaSection = page.getByTestId("cta-section");
    this.tryFreeButton = page.getByTestId("try-free-button");
    this.footerSection = page.getByTestId("footer");
  }

  async goto() {
    await this.page.goto("/");
  }

  async expectPageLoaded() {
    await expect(this.header).toBeVisible();
    await expect(this.heading).toBeVisible();
    await expect(this.getStartedButton).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectFullPageStructure() {
    await this.expectPageLoaded();
    await expect(this.featureSection).toBeVisible();
    await expect(this.howItWorksSection).toBeVisible();
    await expect(this.testimonialSection).toBeVisible();
    await expect(this.ctaSection).toBeVisible();
    await expect(this.footerSection).toBeVisible();
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickSignup() {
    await this.signupButton.click();
  }

  async clickTryFree() {
    await this.tryFreeButton.click();
  }

  async getHeroHeadingText() {
    return (await this.heading.textContent()) || "";
  }

  async scrollToFeatures() {
    await this.featureSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  async scrollToHowItWorks() {
    await this.howItWorksSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  async scrollToTestimonials() {
    await this.testimonialSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  async scrollToCta() {
    await this.ctaSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  async scrollToFooter() {
    await this.footerSection.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
  }

  async verifyNavigation() {
    await expect(this.header).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.signupButton).toBeVisible();
    await expect(this.logoImage).toBeVisible();
  }
}
