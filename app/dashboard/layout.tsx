import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { SidebarNav } from "@/components/shared/SidebarNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/shared/Footer";

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

export default function DashboardLayout({
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
            <main className="flex flex-col gap-8 max-w-5xl mx-auto w-full min-h-[90vh] font-[family-name:var(--font-geist-sans)]">
              {children}
            </main>
            <Footer />
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
