import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgreeMint | Professional Agreements',
  description: 'Document any deal into a professionally formatted agreement in seconds. Built for 195 jurisdictions. Secure and standard contracts.',
  openGraph: {
    title: 'AgreeMint | Describe your deal. We write the agreement.',
    description: 'Professional documents in seconds. Turn your conversation into a legally sound agreement.',
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
