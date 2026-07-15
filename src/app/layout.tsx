import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/CookieBanner";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { ThemeProvider } from "@/components/ThemeToggle";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plexmono",
});

export const metadata: Metadata = {
  title: "AgreeMint — Put it in writing",
  description:
    "Turn everyday deals into clear, signed agreements. Describe the deal in plain words — or paste the chat — and get a proper document both sides can sign in minutes.",
  keywords: ["contracts", "agreements", "e-signature", "loan agreement", "freelance contract"],
  openGraph: {
    title: "AgreeMint — Put it in writing",
    description: "Turn everyday deals into clear, signed agreements in minutes.",
    type: "website",
    locale: "en_US",
    siteName: "AgreeMint",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgreeMint — Put it in writing",
    description: "Turn everyday deals into clear, signed agreements in minutes.",
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
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${bricolage.variable} ${archivo.variable} ${mono.variable} font-sans antialiased bg-paper text-ink selection:bg-mint selection:text-paper`}
        >
          <ThemeProvider>
            <TooltipProvider>
              {children}
              <Toaster />
              <CookieBanner />
              <ScrollToTop />
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
