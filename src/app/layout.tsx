import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import ScrollToTop from "@/components/ui/ScrollToTop";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "AgreeMint | Instant, Secure Agreements",
  description:
    "Secure your future with professional, legally-binding agreements. Generate, sign, and manage contracts in 60 seconds. Mobile-first and globally-compliant.",
  keywords: [
    "legal tech",
    "contracts",
    "agreements",
    "legal automation",
    "secure signatures",
  ],
  openGraph: {
    title: "AgreeMint | Instant, Secure Agreements",
    description:
      "Secure your future with professional, legally-binding agreements.",
    type: "website",
    locale: "en_US",
    siteName: "AgreeMint",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgreeMint | Instant, Secure Agreements",
    description:
      "Secure your future with professional, legally-binding agreements.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthProvider>
      <html lang="en" className="dark">
        <body
          className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#050505] selection:bg-[#00F5D4] selection:text-[#050505]`}
        >
          <TooltipProvider>
            {children}
            <Toaster />
            <CookieBanner />
            <ScrollToTop />
          </TooltipProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
