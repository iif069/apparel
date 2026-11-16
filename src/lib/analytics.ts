import { CategoryId } from '@/types';
import { ANALYTICS_CONFIG } from '@/config/analytics';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export type WhatsAppCtaLocation =
  | 'rack_mobile_banner'
  | 'rack_desktop_cta'
  | 'detail_header_wa'
  | 'detail_price_link'
  | 'detail_order_cta';

/**
 * Mengubah ID internal kategori menjadi slug ramah pembaca/analitik
 * ('puffer' dipetakan menjadi 'kemeja' agar laporan mudah dibaca).
 */
export function toPublicCategorySlug(categoryId: CategoryId): 'kaos' | 'jersey' | 'kemeja' {
  if (categoryId === 'puffer') return 'kemeja';
  return categoryId;
}

/**
 * Mengurai parameter URL (?cat=... atau ?kategori=...) ke CategoryId internal.
 */
export function resolveCategoryFromParam(rawParam: string | null | undefined): CategoryId | null {
  if (!rawParam) return null;
  const normalized = rawParam.trim().toLowerCase();
  if (normalized === 'kaos' || normalized === 'kaos-sablon') return 'kaos';
  if (normalized === 'jersey' || normalized === 'jersey-printing') return 'jersey';
  if (normalized === 'kemeja' || normalized === 'puffer' || normalized === 'korsa') return 'puffer';
  return null;
}

function sendGaEvent(eventName: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined' || !ANALYTICS_CONFIG.gaMeasurementId) return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

function sendMetaEvent(
  method: 'track' | 'trackCustom',
  eventName: string,
  params: Record<string, unknown>
) {
  if (typeof window === 'undefined' || !ANALYTICS_CONFIG.metaPixelId) return;
  if (typeof window.fbq === 'function') {
    window.fbq(method, eventName, params);
  }
}

/**
 * Mencatat saat pengunjung melihat kategori tertentu (Kaos / Jersey / Kemeja).
 */
export function trackCategoryView(categoryId: CategoryId, categoryLabel: string) {
  const categorySlug = toPublicCategorySlug(categoryId);

  sendGaEvent('view_category', {
    category_id: categorySlug,
    category_name: categoryLabel,
  });

  sendMetaEvent('trackCustom', 'ViewCategory', {
    content_category: categorySlug,
    category_name: categoryLabel,
  });
}

/**
 * Mencatat saat pengunjung membuka detail produk tertentu.
 */
export function trackProductDetailView(params: {
  itemId: string;
  itemName: string;
  colorName: string;
  categoryId: CategoryId;
  categoryLabel: string;
}) {
  const categorySlug = toPublicCategorySlug(params.categoryId);

  sendGaEvent('view_item', {
    item_id: params.itemId,
    item_name: params.itemName,
    item_variant: params.colorName,
    item_category: categorySlug,
    category_name: params.categoryLabel,
  });

  sendMetaEvent('track', 'ViewContent', {
    content_ids: [params.itemId],
    content_name: params.itemName,
    content_category: categorySlug,
    content_type: 'product',
  });
}

/**
 * Mencatat setiap klik tombol WhatsApp beserta asal kategori & tombolnya.
 */
export function trackWhatsAppClick(params: {
  location: WhatsAppCtaLocation;
  categoryId: CategoryId;
  categoryLabel?: string;
  itemId?: string;
  itemName?: string;
  colorName?: string;
}) {
  const categorySlug = toPublicCategorySlug(params.categoryId);

  sendGaEvent('whatsapp_click', {
    cta_location: params.location,
    item_category: categorySlug,
    item_id: params.itemId || '',
    item_name: params.itemName || '',
    item_variant: params.colorName || '',
  });

  sendMetaEvent('track', 'Lead', {
    content_category: categorySlug,
    content_name: params.itemName || params.categoryLabel || categorySlug,
    content_ids: params.itemId ? [params.itemId] : undefined,
    cta_location: params.location,
  });
}
