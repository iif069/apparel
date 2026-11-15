import { CategoryId } from '@/types';

export type DetailIconName =
  | 'graduation'
  | 'users'
  | 'store'
  | 'trophy'
  | 'gamepad'
  | 'bike'
  | 'building'
  | 'award'
  | 'compass'
  | 'wind'
  | 'droplets'
  | 'layers'
  | 'sparkles'
  | 'shield'
  | 'palette';

export interface AudienceItem {
  icon: DetailIconName;
  label: string;
}

export interface ReasonItem {
  icon: DetailIconName;
  title: string;
  summary: string;
}

export interface CategoryDetailContent {
  audienceHeading: string;
  audiences: AudienceItem[];
  reasonsHeading: string;
  reasons: ReasonItem[];
}

export const CATEGORY_DETAILS: Record<CategoryId, CategoryDetailContent> = {
  kaos: {
    audienceHeading: 'Cocok untuk',
    audiences: [
      { icon: 'graduation', label: 'Kaos Kelas & Angkatan' },
      { icon: 'users', label: 'Komunitas & Event' },
      { icon: 'store', label: 'Seragam Usaha / UMKM' },
    ],
    reasonsHeading: 'Keunggulan & bahan',
    reasons: [
      {
        icon: 'wind',
        title: '100% katun halus standar distro',
        summary: 'Adem, lembut di kulit, dan nyaman dipakai seharian.',
      },
      {
        icon: 'sparkles',
        title: 'Sablon tajam awet & opsi menyala',
        summary: 'Warna detail tidak mudah retak, tersedia efek pantul cahaya flash.',
      },
      {
        icon: 'palette',
        title: 'Bebas custom desain depan-belakang',
        summary: 'Cetak gambar, logo, atau tulisan sesuai konsep acara kamu.',
      },
    ],
  },
  jersey: {
    audienceHeading: 'Cocok untuk',
    audiences: [
      { icon: 'trophy', label: 'Tim Olahraga' },
      { icon: 'gamepad', label: 'Skuad Esport' },
      { icon: 'bike', label: 'Komunitas & Event' },
    ],
    reasonsHeading: 'Keunggulan & bahan',
    reasons: [
      {
        icon: 'droplets',
        title: 'Kain olahraga berpori & cepat kering',
        summary: 'Ringan, sejuk, dan nyaman dipakai bergerak aktif.',
      },
      {
        icon: 'sparkles',
        title: 'Printing full warna anti-luntur',
        summary: 'Tinta meresap ke serat kain sehingga warna tetap cerah dan tajam.',
      },
      {
        icon: 'palette',
        title: 'Custom nama, nomor & logo bebas',
        summary: 'Tiap baju bisa beda nama/nomor, gratis lihat contoh desain.',
      },
    ],
  },
  puffer: {
    audienceHeading: 'Cocok untuk',
    audiences: [
      { icon: 'building', label: 'Seragam Kantor' },
      { icon: 'award', label: 'Korsa & PDH Organisasi' },
      { icon: 'compass', label: 'Tim Lapangan & Komunitas' },
    ],
    reasonsHeading: 'Keunggulan & bahan',
    reasons: [
      {
        icon: 'layers',
        title: 'Kain drill tebal & tidak mudah kusut',
        summary: 'Berstruktur rapi, kuat, dan tetap nyaman dipakai kerja.',
      },
      {
        icon: 'shield',
        title: 'Bordir rapi & jahitan kuat',
        summary: 'Logo instansi, nama dada, dan emblem tegas serta awet dicuci.',
      },
      {
        icon: 'palette',
        title: 'Detail model & warna fleksibel',
        summary: 'Bebas atur posisi bordir, warna list, hingga lengan pendek/panjang.',
      },
    ],
  },
};
