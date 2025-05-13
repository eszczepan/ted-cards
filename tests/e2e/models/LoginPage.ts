import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly signupLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly loginForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByTestId("password-input");
    this.loginButton = page.getByTestId("login-button");
    this.errorMessage = page.getByTestId("form-error");
    this.signupLink = page.getByTestId("signup-link");
    this.forgotPasswordLink = page.getByTestId("forgot-password-link");
    this.loginForm = page.getByTestId("login-form");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async expectPageLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginForm).toBeVisible();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectRedirectToDashboard() {
    await expect(this.page).toHaveURL(/.*dashboard/);
  }

  async getEnvironmentVariables() {
    return {
      username: process.env.E2E_USERNAME || "",
      password: process.env.E2E_PASSWORD || "",
      userId: process.env.E2E_USERNAME_ID || "",
    };
  }
}
