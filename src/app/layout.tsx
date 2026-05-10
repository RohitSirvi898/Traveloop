import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider, Show, UserButton } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarWrapper } from "@/components/layout/SidebarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Traveloop - Plan Your Perfect Trip",
  description: "Plan incredible trips, manage budgets, build itineraries, and travel with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-white flex min-h-screen text-gray-900`}>
          <Show when="signed-in">
            <SidebarWrapper />
          </Show>
          <main className="flex-1 min-h-screen overflow-y-auto">
            <Show when="signed-in">
              <div className="fixed top-6 right-8 z-50">
                <UserButton
                  afterSignOutUrl="/sign-in"
                  userProfileUrl="/my-account"
                  appearance={{
                    elements: {
                      userButtonPopoverCard: "shadow-xl border border-slate-200 rounded-2xl",
                      userButtonPopoverActionButton: "hover:bg-slate-50",
                    },
                  }}
                />
              </div>
            </Show>
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}