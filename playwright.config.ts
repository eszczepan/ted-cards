import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

const authFile = path.join(__dirname, "tests/e2e/.auth/user.json");

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  webServer: {
    command: "npm run dev",
    url: process.env.BASE_URL || "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "setup", testMatch: /.*setup\.[jt]s/ },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: authFile,
        screenshot: "only-on-failure",
        video: "on-first-retry",
        trace: "on-first-retry",
        baseURL: process.env.BASE_URL || "http://localhost:3000",
        contextOptions: {
          ignoreHTTPSErrors: true,
        },
      },
      dependencies: ["setup"],
      testMatch: /.*(test|spec)\.[jt]s/,
    },
    {
      name: "chromium-no-auth",
      use: {
        ...devices["Desktop Chrome"],
        storageState: { cookies: [], origins: [] },
        screenshot: "only-on-failure",
        video: "on-first-retry",
        trace: "on-first-retry",
        baseURL: process.env.BASE_URL || "http://localhost:3000",
        contextOptions: {
          ignoreHTTPSErrors: true,
        },
      },
      testMatch: /.*(test|spec)\.[jt]s/,
      grepInvert: /@auth/,
    },
  ],
});
