import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
