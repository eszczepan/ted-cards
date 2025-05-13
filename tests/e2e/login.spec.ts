import { test, expect } from "@playwright/test";
import { LoginPage } from "./models/LoginPage";
import { HomePage } from "./models/HomePage";

test.describe("Login Flow", () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let testUser: {
    username: string;
    password: string;
    userId: string;
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    testUser = await loginPage.getEnvironmentVariables();

    if (!testUser.username || !testUser.password) {
      test.skip(true, "Test requires E2E_USERNAME and E2E_PASSWORD environment variables");
    }
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

  test("should login successfully with valid credentials", async () => {
    await loginPage.goto();
    await loginPage.login(testUser.username, testUser.password);

    await loginPage.expectRedirectToDashboard();
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
});
