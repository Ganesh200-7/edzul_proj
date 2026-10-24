import type { Metadata, Viewport } from 'next';
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
  title: 'WildLife Explorer – Global Species Discovery',
  description: 'Search species worldwide, explore scientific and common taxonomy, community wildlife imagery, and real-world citizen science observation records.',
  keywords: ['wildlife', 'biodiversity', 'species discovery', 'iNaturalist', 'GBIF', 'conservation', 'animals', 'plants'],
  authors: [{ name: 'WildLife Explorer Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
