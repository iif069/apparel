import type { Metadata, Viewport } from 'next';
import { Inter, Anton, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MIG Apparel — Katalog Gantungan Interaktif',
  description: 'Katalog etalase gantungan baju 3D interaktif MIG Digital Printing. Kaos sablon, jersey printing, kemeja komunitas.',
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${anton.variable} ${cormorant.variable}`}>
      <body className="min-h-screen bg-page text-ink antialiased select-none md:select-auto">
        {children}
      </body>
    </html>
  );
}
