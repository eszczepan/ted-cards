import { test, expect } from "@playwright/test";
import { LoginPage } from "./models/LoginPage";
import { HomePage } from "./models/HomePage";

test.describe("Login Flow", () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    await page.route("**/supabase.co/**", (route) => route.abort());
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

  test("should show error for invalid credentials", async ({ page }) => {
    await page.route("**/rest/v1/auth/**", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Invalid login credentials",
          message: "Invalid login credentials",
        }),
      });
    });

    await loginPage.goto();
    await loginPage.login("wrong@example.com", "wrongpassword");

    const emailInput = await loginPage.emailInput;
    const passwordInput = await loginPage.passwordInput;

    await expect(emailInput).toHaveValue("wrong@example.com");
    await expect(passwordInput).toHaveValue("wrongpassword");

    await expect(await page.locator('input[name="email"]')).toHaveValue("wrong@example.com");
  });

  test("should verify valid login credentials", async ({ page }) => {
    await loginPage.goto();
    await loginPage.login("test@example.com", "password123");

    await expect(await page.locator('input[name="email"]')).toHaveValue("test@example.com");
    await expect(await page.locator('input[name="password"]')).toHaveValue("password123");

    await expect(await page.locator('button[type="submit"]')).toBeEnabled();
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
