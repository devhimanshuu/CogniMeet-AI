import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next";

import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CogniMeet.AI",
  description: "AI-powered Meeting Assistant",
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <NuqsAdapter>
        <TRPCReactProvider>
          <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} antialiased`}>
              <Toaster />
              {children}
            </body>
          </html>
        </TRPCReactProvider>
      </NuqsAdapter>
    </ClerkProvider>
  );
}
