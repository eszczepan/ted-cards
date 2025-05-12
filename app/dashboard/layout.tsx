import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { SidebarNav } from "@/components/shared/SidebarNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ted Cards - 2025",
  description: "Ted Cards - 2025",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <SidebarNav />
          <SidebarTrigger />
          <div className="flex flex-col w-full pr-7">
            <main className="flex flex-col gap-8 max-w-5xl mx-auto w-full font-[family-name:var(--font-geist-sans)]">
              {children}
            </main>
            <footer className="text-center text-sm text-muted-foreground py-4 mt-8 max-w-5xl mx-auto w-full">
              Ted Cards - 2025
            </footer>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
