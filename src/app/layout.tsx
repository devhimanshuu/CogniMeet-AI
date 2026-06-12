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
  title: "CogniMeet.AI — AI-Powered Meeting Intelligence",
  description: "Transform your meetings with AI coworkers that join calls, take notes, extract action items, and provide real-time intelligence. Built for teams that move fast.",
  keywords: ["AI meetings", "meeting intelligence", "AI assistant", "transcription", "action items"],
  openGraph: {
    title: "CogniMeet.AI — AI-Powered Meeting Intelligence",
    description: "Transform your meetings with AI coworkers that join calls, take notes, and provide real-time intelligence.",
    type: "website",
  },
};

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";

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
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                disableTransitionOnChange
              >
                <Toaster />
                {children}
              </ThemeProvider>
            </body>
          </html>
        </TRPCReactProvider>
      </NuqsAdapter>
    </ClerkProvider>
  );
}

