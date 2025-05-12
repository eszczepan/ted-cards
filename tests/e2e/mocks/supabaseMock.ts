import { Page } from "@playwright/test";

export async function setupSupabaseMocks(page: Page) {
  await page.route("**/auth/v1/token?grant_type=password", async (route) => {
    const body = route.request().postDataJSON();

    if (body.email === "test@example.com" && body.password === "password123") {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "fake-access-token",
          refresh_token: "fake-refresh-token",
          expires_in: 3600,
          token_type: "bearer",
          user: {
            id: "fake-user-id",
            email: body.email,
            role: "authenticated",
          },
        }),
      });
    } else {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          error: "invalid_grant",
          error_description: "Invalid login credentials",
        }),
      });
    }
  });

  await page.route("**/auth/v1/user", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "fake-user-id",
        email: "test@example.com",
        app_metadata: { provider: "email" },
        user_metadata: {},
        aud: "authenticated",
        role: "authenticated",
      }),
    });
  });

  await page.route("**/auth/v1/callback*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  await page.addInitScript(() => {
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const url = args[0].toString();
      const options = args[1] || {};

      if (url.includes("/auth/v1/token") && options.method === "POST") {
        const body = typeof options.body === "string" ? JSON.parse(options.body) : {};
        if (body.email === "test@example.com" && body.password === "password123") {
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 100);
        } else {
          setTimeout(() => {
            const form = document.querySelector("form");
            if (form) {
              const errorDiv = document.createElement("div");
              errorDiv.className = "p-3 rounded-md bg-red-50 text-red-500 text-sm flex items-start gap-x-2";
              errorDiv.textContent = "Invalid login credentials";
              form.prepend(errorDiv);
            }
          }, 100);
        }
      }

      return originalFetch.apply(this, args);
    };
  });
}
