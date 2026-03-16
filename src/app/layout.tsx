import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "AgreeMint — Personal Agreements, Legally Grounded",
  description: "Create, sign, and enforce personal agreements in minutes. AI-powered contract generation, WhatsApp import, payment tracking, and jurisdiction-aware legal guidance for 195+ countries.",
  keywords: ["contract generator", "legal agreement", "personal loan agreement", "AI contract", "e-signature", "legal advice", "WhatsApp agreement", "bill of sale", "freelance contract", "rental agreement"],
  authors: [{ name: "AgreeMint" }],
  openGraph: {
    title: "AgreeMint — Personal Agreements, Legally Grounded",
    description: "The one platform for personal agreements. AI contract creation, WhatsApp import, payment tracking, and legal guidance for 195+ countries.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#111110" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-slate-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium">
            Skip to main content
          </a>
          <TooltipProvider delayDuration={300}>
            {children}
          </TooltipProvider>
          <Toaster />
          <CookieBanner />
        </body>
      </html>
    </ClerkProvider>
  );
}
