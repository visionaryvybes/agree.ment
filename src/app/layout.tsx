import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import ScrollToTop from "@/components/ui/ScrollToTop";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "AgreeMint | Instant, Secure Agreements",
  description: "Secure your future with professional, legally-binding agreements. Generate, sign, and manage contracts in 60 seconds. Mobile-first and globally-compliant.",
  keywords: ["legal tech", "contracts", "agreements", "legal automation", "secure signatures"],
  openGraph: {
    title: "AgreeMint | Instant, Secure Agreements",
    description: "Secure your future with professional, legally-binding agreements.",
    type: "website",
    locale: "en_US",
    siteName: "AgreeMint",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgreeMint | Instant, Secure Agreements",
    description: "Secure your future with professional, legally-binding agreements.",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMockKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'pk_test_mockkey123' || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#050505] selection:bg-[#00F5D4] selection:text-[#050505]`}>
        <TooltipProvider>
          {children}
          <Toaster />
          <CookieBanner />
          <ScrollToTop />
        </TooltipProvider>
      </body>
    </html>
  );

  if (isMockKey) {
    return content;
  }

  return (
    <ClerkProvider>
      {content}
    </ClerkProvider>
  );
}
