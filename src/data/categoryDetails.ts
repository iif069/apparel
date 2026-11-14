import { CategoryId } from '@/types';

export interface AudienceItem {
  title: string;
  description: string;
}

export interface ReasonItem {
  title: string;
  description: string;
}

export interface CategoryDetailContent {
  audienceHeading: string;
  audienceIntro: string;
  audiences: AudienceItem[];
  reasonsHeading: string;
  reasons: ReasonItem[];
  materialLabel: string;
  printLabel: string;
}

export const CATEGORY_DETAILS: Record<CategoryId, CategoryDetailContent> = {
  kaos: {
    audienceHeading: 'Cocok untuk siapa aja?',
    audienceIntro: 'Pas buat kamu yang cari kaos sablon rapi, nyaman dipakai bareng-bareng maupun harian:',
    audiences: [
      {
        title: 'Kaos Kelas & Angkatan',
        description: 'Bikin seragam kompak untuk acara perpisahan, study tour, kepanitiaan OSIS, atau foto buku tahunan.',
      },
      {
        title: 'Komunitas, Event & Gathering',
        description: 'Tampil solid untuk klub motor, karang taruna, panitia acara, hingga kegiatan outing kantor.',
      },
      {
        title: 'Merchandise Brand & Usaha',
        description: 'Cocok dijadikan seragam tim toko/UMKM, merchandise promosi, atau kaos distro dengan desain sendiri.',
      },
    ],
    reasonsHeading: 'Kenapa kaos sablon ini layak dipilih?',
    reasons: [
      {
        title: 'Adem & Nyaman Dipakai Seharian',
        description: 'Bahan 100% katun halus standar distro yang lembut di kulit, adem, dan mudah menyerap keringat.',
      },
      {
        title: 'Sablon Tajam, Awet & Opsi Menyala',
        description: 'Hasil sablon warna detail dan tebal tidak mudah retak—tersedia juga opsi sablon yang memantul terang saat kena lampu flash.',
      },
      {
        title: 'Bebas Custom Desain Sesuka Hati',
        description: 'Bisa cetak gambar, tulisan, maupun logo depan-belakang sesuai konsep acara atau komunitas kamu.',
      },
    ],
    materialLabel: '100% Katun Halus Standar Distro (Adem & Lembut)',
    printLabel: 'Sablon Warna Tajam, Tebal Awet & Opsi Menyala (Flash)',
  },
  jersey: {
    audienceHeading: 'Cocok untuk siapa aja?',
    audienceIntro: 'Pilihan tepat buat tim dan komunitas yang butuh tampilan sporty, kompak, dan bebas gerak:',
    audiences: [
      {
        title: 'Tim Voli, Futsal, Sepak Bola & Badminton',
        description: 'Siap untuk jersey tanding maupun latihan, lengkap dengan nama punggung dan nomor tiap pemain.',
      },
      {
        title: 'Skuad Esport & Turnamen Gaming',
        description: 'Tampil keren dan profesional saat turnamen dengan motif full-print dan logo tim kebanggaan.',
      },
      {
        title: 'Komunitas Lari, Sepeda & Event',
        description: 'Ringan dan sejuk untuk kegiatan fun run, gowes bareng, lomba antar instansi, atau tim pendukung.',
      },
    ],
    reasonsHeading: 'Kenapa jersey printing ini layak dipilih?',
    reasons: [
      {
        title: 'Berpori, Ringan & Cepat Kering',
        description: 'Bahan kain olahraga berpori yang sejuk di kulit, ringan dipakai gerak aktif, dan cepat menyerap keringat.',
      },
      {
        title: 'Warna Tajam & Anti-Luntur',
        description: 'Tinta meresap langsung ke serat kain sehingga warna cerah, tajam, dan tidak mudah pudar meski sering dicuci.',
      },
      {
        title: 'Custom Nama, Nomor & Logo Bebas',
        description: 'Tiap baju bisa pakai nama dan nomor berbeda, plus dibantu lihat contoh desain sebelum dicetak.',
      },
    ],
    materialLabel: 'Kain Olahraga Berpori (Ringan, Adem & Cepat Kering)',
    printLabel: 'Cetak Full Warna Menyatu ke Kain (Anti-Luntur)',
  },
  puffer: {
    audienceHeading: 'Cocok untuk siapa aja?',
    audienceIntro: 'Dirancang untuk tampilan yang rapi, berwibawa, dan tahan dipakai aktivitas kerja maupun organisasi:',
    audiences: [
      {
        title: 'Seragam Kantor & Perusahaan',
        description: 'Memberi kesan profesional dan serasi bagi tim operasional, marketing, toko, hingga staf lapangan.',
      },
      {
        title: 'Kemeja Korsa & PDH Organisasi',
        description: 'Identitas kebanggaan untuk mahasiswa (BEM/HIMA), karang taruna, lembaga, dan panitia kegiatan resmi.',
      },
      {
        title: 'Tim Lapangan & Komunitas Hobi',
        description: 'Kuat dan nyaman dipakai aktivitas luar ruangan untuk teknisi, tim proyek, maupun komunitas otomotif.',
      },
    ],
    reasonsHeading: 'Kenapa kemeja ini layak dipilih?',
    reasons: [
      {
        title: 'Kain Tebal, Rapi & Tidak Mudah Kusut',
        description: 'Menggunakan bahan kain drill pilihan yang tebal dan berstruktur rapi namun tetap nyaman dipakai lama.',
      },
      {
        title: 'Bordir Rapi & Jahitan Kuat',
        description: 'Logo instansi, nama dada, dan emblem dibordir tegas, rapi, dan awet meski sering dicuci.',
      },
      {
        title: 'Detail Model & Warna Fleksibel',
        description: 'Bebas sesuaikan posisi bordir, kombinasi warna list, hingga pilihan lengan pendek atau panjang.',
      },
    ],
    materialLabel: 'Kain Drill Pilihan (Tebal, Rapi & Tidak Mudah Kusut)',
    printLabel: 'Bordir Rapi & Sablon Tebal Awet',
  },
};
