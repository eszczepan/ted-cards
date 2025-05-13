import { test, expect } from "@playwright/test";
import { LoginPage } from "./models/LoginPage";
import { HomePage } from "./models/HomePage";

test.describe("Login Flow", () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  test("should display login form", async () => {
    await loginPage.goto();
    await loginPage.expectPageLoaded();
  });

  test("should navigate to login from homepage", async ({ page }) => {
    await homePage.goto();
    await homePage.clickLogin();
    await expect(page).toHaveURL(/.*login/);
    await loginPage.expectPageLoaded();
  });

  test("should show error for invalid credentials", async () => {
    await loginPage.goto();
    await loginPage.login("wrong@example.com", "wrongpassword");
    await loginPage.expectError();
  });

  test("should navigate to signup page from login", async ({ page }) => {
    await loginPage.goto();
    await loginPage.signupLink.click();
    await expect(page).toHaveURL(/.*signup/);
  });

  test("should navigate to forgot password page", async ({ page }) => {
    await loginPage.goto();
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/.*reset-password/);
  });

  test("should login successfully and redirect to dashboard", async ({ page }) => {
    const username = process.env.E2E_USERNAME;
    const password = process.env.E2E_PASSWORD;

    if (!username || !password) {
      console.warn("E2E_USERNAME and E2E_PASSWORD environment variables are required for this test");
      test.skip();
      return;
    }

    await loginPage.goto();
    await loginPage.login(username, password);

    await expect(page).toHaveURL(/.*dashboard/);
  });
});
