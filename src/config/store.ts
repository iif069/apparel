// Konfigurasi Terpusat Toko MIG Digital Printing
export const STORE_CONFIG = {
  name: 'MIG Digital Printing',
  tagline: 'Pusat Apparel & Percetakan Digital Rajadesa',
  location: 'Jl. Raya Rajadesa - Rancah, Seberang MIG Swalayan, Kec. Rajadesa, Kab. Ciamis.',
  phoneDisplay: '+62 895-1040-5562',
  phoneRaw: '6289510405562',
  operatingHours: {
    daily: 'Buka setiap hari pukul 08.00 – 16.30 WIB',
  },
  whatsapp: {
    number: '6289510405562',
    defaultMessage: 'Halo MIG Digital Printing, saya mau tanya dan pesan apparel dari katalog',
    customDesignMessage: 'Halo MIG Digital Printing, saya mau konsultasi bikin desain custom apparel/jersey',
  },
} as const;

export function getWhatsAppUrl(message?: string): string {
  const phone = STORE_CONFIG.whatsapp.number;
  const text = message ? encodeURIComponent(message) : encodeURIComponent(STORE_CONFIG.whatsapp.defaultMessage);
  return `https://wa.me/${phone}?text=${text}`;
}
