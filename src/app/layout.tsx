import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#111110" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
