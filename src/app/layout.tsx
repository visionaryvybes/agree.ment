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
  title: "AgreeMint | Instant, Ironclad Contracts",
  description: "Secure your future with AI-driven, legally-binding contracts. Generate, sign, and manage contracts in 60 seconds. Mobile-first, globally-compliant, and ironclad.",
  keywords: ["legal tech", "contracts", "contracts", "AI law", "smart contracts", "legal automation"],
  openGraph: {
    title: "AgreeMint | Instant, Ironclad Contracts",
    description: "Secure your future with AI-driven, legally-binding contracts.",
    type: "website",
    locale: "en_US",
    siteName: "AgreeMint",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgreeMint | Instant, Ironclad Contracts",
    description: "Secure your future with AI-driven, legally-binding contracts.",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
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
    </ClerkProvider>
  );
}
