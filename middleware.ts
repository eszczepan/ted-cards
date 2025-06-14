import { type NextRequest } from "next/server";
import { updateSession } from "@/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|signup|login|reset-password|feedback|support|update-password|auth/.*|api/.*|.*.(?:svg|png|jpg|jpeg|gif|webp)$|$).*)",
  ],
};
