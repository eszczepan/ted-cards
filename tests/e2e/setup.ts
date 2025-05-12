import { expect, test as base } from "@playwright/test";
import { setupSupabaseMocks } from "./mocks/supabaseMock";

// Rozszerzamy test fixture, aby automatycznie dodać mocki dla Supabase
export const test = base.extend({
  // eslint-disable-next-line react-hooks/rules-of-hooks
  page: async ({ page }, callback) => {
    // Dodajemy mocki Supabase przed każdym testem
    await setupSupabaseMocks(page);

    // Ignorujemy błędy nawigacji (np. gdy próbujemy przejść do /dashboard bez zalogowania)
    page.on("pageerror", (error) => {
      console.error(`Page error: ${error.message}`);
      // Nie zatrzymujemy testów na błędach JavaScript
    });

    await callback(page);
  },
});

export { expect };
