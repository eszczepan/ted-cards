import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TedCards - AI-powered Flashcards",
  description: "Generate flashcards from YouTube videos using AI",
};

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="w-full fixed top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container max-w-screen-xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="sr-only">TedCards</span>
              TedCards
            </Link>
            <div className="flex items-center gap-x-2">
              <Link href="/login">
                <Button>Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 pt-16">{children}</main>
      </body>
    </html>
  );
}
