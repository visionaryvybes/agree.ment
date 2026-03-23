import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgreeMint | Premium AI Contract Generator',
  description: 'Turn any conversation into a legally sound, professionally formatted contract in seconds. Built globally for 195 jurisdictions. Generative AI for standard agreements.',
  openGraph: {
    title: 'AgreeMint | Describe your deal. We write the contract.',
    description: 'Stop paying for simple documents. Turn your standard agreements into legally sound contracts in 30 seconds.',
    url: 'https://agreemint.com',
    siteName: 'AgreeMint',
    images: [
      {
        url: 'https://agreemint.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgreeMint - Instant Contracts',
    description: 'Turn any conversation into a contract in seconds.',
  }
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
