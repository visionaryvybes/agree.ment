import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "AgreeMint — Personal Agreements, Legally Grounded",
  description: "Create, sign, and enforce personal agreements in minutes. AI-powered contract generation, WhatsApp import, payment tracking, and jurisdiction-aware legal guidance for 195+ countries.",
  authors: [{ name: "AgreeMint" }],
  keywords: "contract generator,legal agreement,personal loan agreement,AI contract,e-signature,legal advice,WhatsApp agreement,bill of sale,freelance contract,rental agreement",
  robots: "index, follow",
  openGraph: {
    title: "AgreeMint — Personal Agreements, Legally Grounded",
    description: "The one platform for personal agreements. AI contract creation, WhatsApp import, payment tracking, and legal guidance for 195+ countries.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "AgreeMint — Personal Agreements, Legally Grounded",
    description: "The one platform for personal agreements. AI contract creation, WhatsApp import, payment tracking, and legal guidance for 195+ countries.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
    >
      <html lang="en">
        <body style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-slate-900 focus:text-[var(--bg)] focus:px-4 focus:py-2 rounded-lg text-sm font-medium">
            Skip to main content
          </a>
          <TooltipProvider delayDuration={300}>
            {children}
            <Toaster />
            <CookieBanner />
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
