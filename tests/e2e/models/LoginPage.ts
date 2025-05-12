import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly signupLink: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel("Email address");
    this.passwordInput = page.getByLabel("Password");
    this.submitButton = page.getByRole("button", { name: /sign in/i });
    this.errorMessage = page.getByText(/invalid login details|login failed/i);
    this.signupLink = page.getByRole("link", { name: /sign up/i });
    this.forgotPasswordLink = page.getByRole("link", { name: /forgot your password/i });
  }

  async goto() {
    await this.page.goto("/login");
  }

  async expectPageLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectRedirectToDashboard() {
    await expect(this.page).toHaveURL(/.*dashboard/);
  }
}
