import type { Metadata } from 'next';
import { Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  variable: '--font-ui',
  subsets: ['latin'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lumen-greenlight.geoaxis.chatgpt.site'),
  title: 'Lumen — Find the signal before the spotlight',
  description: 'Gemini-orchestrated, Parallel-grounded creative intelligence for film and television.',
  openGraph: {
    title: 'Lumen — Find the signal before the spotlight',
    description: 'Gemini-orchestrated, Parallel-grounded creative intelligence for film and television.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumen — Find the signal before the spotlight',
    description: 'Gemini-orchestrated, Parallel-grounded creative intelligence for film and television.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
