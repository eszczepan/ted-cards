import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly getStartedButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { level: 1 });

    this.getStartedButton = page
      .locator("section")
      .filter({ hasText: "Ready to 10X your Knowledge?" })
      .getByRole("link", { name: /try tedcards/i });

    this.loginButton = page.getByRole("link", { name: /login/i, exact: true });
  }

  async goto() {
    await this.page.goto("/");
  }

  async expectPageLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.getStartedButton).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async clickGetStarted() {
    await this.page.waitForTimeout(1000);
    await this.getStartedButton.click();
  }

  async clickLogin() {
    await this.loginButton.click();
  }
}
