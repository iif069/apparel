// Konfigurasi Terpusat Toko MIG Digital Printing
export const STORE_CONFIG = {
  name: 'MIG Digital Printing',
  tagline: 'Pusat Apparel & Percetakan Digital Rajadesa',
  location: 'Jl. Raya Rajadesa (Dekat Alun-alun Rajadesa), Kec. Rajadesa, Kabupaten Ciamis, Jawa Barat.',
  phoneDisplay: '+62 895-1040-5562',
  phoneRaw: '6289510405562',
  operatingHours: {
    workdays: 'Senin – Sabtu: 08.00 – 17.00 WIB',
    holidays: 'Minggu / Hari Libur: Pesanan Online Tetap Diproses',
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
