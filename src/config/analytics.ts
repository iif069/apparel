// Konfigurasi Terpusat Pelacakan & Analitik Website MIG Apparel
// Bisa diisi melalui Environment Variables (Cloudflare Pages) atau langsung di sini.
export const ANALYTICS_CONFIG = {
  // ID Meta Pixel (contoh: '123456789012345')
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || '',

  // ID Google Analytics 4 (contoh: 'G-XXXXXXXXXX')
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || 'G-N3Z76HGMWQ',
} as const;
