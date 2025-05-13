import { test as setup, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const authFile = path.join(__dirname, ".auth/user.json");

setup.beforeAll(async () => {
  try {
    const dir = path.dirname(authFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(authFile)) {
      fs.unlinkSync(authFile);
    }
  } catch (error) {
    console.error("Error cleaning up auth file:", error);
  }
});

setup("authenticate", async ({ page }) => {
  const username = process.env.E2E_USERNAME;
  const password = process.env.E2E_PASSWORD;

  if (!username || !password) {
    throw new Error("E2E_USERNAME and E2E_PASSWORD environment variables must be set for authentication tests");
  }

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  await page.goto(`${baseUrl}/login`);

  if (page.url().includes("/dashboard")) {
    console.log("Already logged in, skipping login process");
    await page.context().storageState({ path: authFile });
    return;
  }

  await page.getByTestId("email-input").fill(username);
  await page.getByTestId("password-input").fill(password);
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });

  await page.context().storageState({ path: authFile });
});
