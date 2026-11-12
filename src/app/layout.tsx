import type { Metadata, Viewport } from 'next';
import './globals.css';

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
    <html lang="id">
      <body className="min-h-screen bg-page text-ink antialiased select-none md:select-auto font-sans">
        {children}
      </body>
    </html>
  );
}
