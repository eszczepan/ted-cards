import React from "react";
import Link from "next/link";
import { AuthBenefits } from "@/components/auth/AuthBenefits";

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="flex min-h-screen relative">
      <Link
        href="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 text-2xl font-bold text-slate-900 hover:text-slate-700 z-10"
      >
        TedCards
      </Link>
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center mt-6 p-4 sm:p-6 md:p-8">{children}</div>
      <AuthBenefits />
    </div>
  );
}
