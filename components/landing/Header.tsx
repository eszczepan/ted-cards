import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="w-full fixed top-0 z-50 border-b bg-background/95 backdrop-blur" data-testid="main-header">
      <div className="container max-w-screen-xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl" data-testid="logo">
          <span className="sr-only">TedCards</span>
          TedCards
        </Link>
        <div className="flex items-center gap-x-2">
          <Link href="/login" data-testid="login-button">
            <Button>Login</Button>
          </Link>
          <Link href="/signup" data-testid="signup-button">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
