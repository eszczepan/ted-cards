import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/supabase/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export type SupabaseClient = typeof createClient;

export const DEFAULT_USER_ID = "2cd30b10-8b24-466c-8c19-a0c6aad7f901";
