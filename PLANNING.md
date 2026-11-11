# PLANNING — MIG Apparel Interactive Catalog

Dokumen peta rencana dan arsitektur pengembangan web catalog interaktif 3D untuk **MIG Digital Printing**.

---

## 1. Tujuan & Visi Project
* **Tujuan**: Menghadirkan katalog produk apparel (kaos sablon, jersey olahraga/esport, kemeja kerja) interaktif dengan pengalaman visual 3D seperti berada di ruang pamer (butik) fisik.
* **Keunggulan Pengalaman Pengguna**:
  1. Pengunjung dapat menggeser deretan baju di atas kawat gantungan (*hanger rack*).
  2. Saat kursor mouse diarahkan ke baju (desktop hover) atau diketuk (mobile tap), baju berputar tampak depan secara mulus disertai efek suara geser (*slide sound*).
  3. Membuka halaman detail memungkinkan pengguna memutar baju 360° (*interactive 3D rotator*), mengecek sudut tampak samping, depan, dan belakang.
  4. Pemilihan ukuran multi-size (bisa pesan S: 2 pcs, M: 5 pcs, XL: 3 pcs sekaligus) dengan kalkulasi harga instan.
  5. Fitur tambahan sablon nama/logo dan kemasan kotak kado.
  6. Checkout langsung terhubung ke WhatsApp CS MIG Digital Printing dengan format pesanan rapi atau disimpan ke keranjang belanja.
  7. Pemilik toko dapat mengganti foto, nama produk, warna, dan harga lewat menu **Atur Katalog** langsung di browser.

---

## 2. Arsitektur & Teknologi

```
Client Browser (Next.js 15 + Tailwind CSS + TypeScript)
│
├── App Router (src/app/)
│   ├── layout.tsx         : Root layout, font Inter & Anton, metadata
│   ├── page.tsx           : Pengendali state utama (kategori, slot aktif, modal, keranjang)
│   └── globals.css        : Token warna MIG UI, utilitas 3D preserve-3d, font display
│
├── Komponen Modular (src/components/)
│   ├── Topbar.tsx            : Header toko, navigasi kategori desktop, keranjang & menu HP
│   ├── HangerRack.tsx        : Panggung rak kawat chrome 3D, hover effect, grid mobile
│   ├── HangerHookSVG.tsx     : Kait logam krom & tag harga ungu miring (-8°)
│   ├── GarmentSVG.tsx        : Vektor pakaian 3D (Kaos, Jersey, Kemeja) & foto custom
│   ├── GarmentRotator.tsx    : Panggung putar 3D interaktif drag/touch gesture
│   ├── AngleTabs.tsx         : Tab switch sudut [Samping] [Depan] [Belakang]
│   ├── DetailStage.tsx       : Layar detail produk sticky flush tanpa celah di bawah navbar
│   ├── OrderBottomBar.tsx    : Bar aksi bawah (Masukkan Keranjang & Pesan via WhatsApp)
│   ├── CartDrawer.tsx        : Panel laci keranjang belanja multi-item
│   └── CustomCatalogModal.tsx: Modal ganti foto kustom, harga, nama & warna
│
├── Data & Logic (src/data/, src/hooks/, src/types/)
│   ├── catalog.ts         : Data awal 3 kategori (Kaos Sablon, Jersey Printing, Kemeja)
│   ├── useSound.ts        : Sintesis audio Web Audio API tanpa file eksternal
│   └── index.ts           : Tipe data TypeScript deklaratif
│
└── Penyimpanan Lokal (LocalStorage)
    ├── mig-apparel-cart              : Daftar item keranjang
    ├── mig-apparel-custom-photos     : Foto custom per item (DataURL)
    └── mig-apparel-custom-categories : Judul & label kategori custom
```

---

## 3. Rincian Fitur Utama

### A. Stage 1: Panggung Rak Gantungan 3D (Hanger Rack)
* **Kawat Chrome Horizontal Presisi**: Batang logam rel melintang dengan gradasi krom perak dan garis kilau putih. Kait kawat gantungan menembus rel secara natural.
* **Deretan Baju & Efek Interaktif**:
  * Desktop: Mengarahkan mouse (*pointerenter*) otomatis memutar baju ke depan, memperlebar slot, membunyikan efek slide, dan memperbarui label produk aktif.
  * Mobile: Menggeser (*swipe/drag*) deretan baju dan mengetuk baju untuk memilih.
* **Grid Kategori Mobile Sesuai Desain Sistem**:
  * 3 kolom seimbang (`grid-cols-3 gap-2`), tinggi `42px`, font `13px font-semibold`, bentuk kapsul membulat (*pill*).
  * Tampil hanya di panggung rak, tidak ikut ke halaman detail.
* **Tipografi Latar Raksasa "APPAREL"**:
  * Judul air (*watermark*) raksasa dengan bayangan lantai perspektif 3D yang berubah mengikuti kategori aktif (APPAREL, JERSEY, KEMEJA).
* **Menu Atur Katalog**:
  * Memungkinkan admin/toko mengunggah foto baju buatan sendiri (tampak depan, samping, belakang), menentukan warna gantungan, nama, dan harga.

### B. Stage 2: Halaman Detail Produk & Rotator 3D
* **Panggung Sticky Flush**: Panggung visual atas menempel langsung di bawah navbar tanpa celah kosong (*zero top gap*).
* **3D Garment Rotator**:
  * Baju dapat diputar bebas 360° menggunakan gesekan jari di HP atau mouse drag di desktop.
  * Melepaskan putaran otomatis mengunci (*snap*) ke tampak depan (0°) atau belakang (180°).
* **Tab Sudut Pandang**: Tombol pill `[Samping]`, `[Depan]`, `[Belakang]` diletakkan pas di bawah baju tanpa menutupi area gambar cetakan.
* **Multi-Size Selector**: Menambah ukuran (S, M, L, XL, XXL) dengan tombol `+` dan `-` kuantitas per ukuran.
* **Tambahan Opsional**:
  * Cetak logo / nama dada (+Rp 15.000).
  * Kemasan kotak kado (+Rp 10.000).
* **Kalkulasi Harga Otomatis**: Menghitung kuantitas total dikali harga satuan beserta tambahan secara instan.

### C. Alur Checkout & Keranjang Belanja
* **Pesan Langsung via WhatsApp**: Menghasilkan pesan teks terstruktur rapi ke WhatsApp CS MIG Digital Printing:
  * Nama produk & warna
  * Rincian ukuran dan kuantitas per ukuran
  * Tambahan yang dipilih
  * Total tagihan
* **Keranjang Belanja (Cart Drawer)**: Menampung banyak item dengan pilihan ukuran berbeda, dilengkapi tombol hapus dan total harga agregat.

---

## 4. Status Pengerjaan & Roadmap

### Selesai Dikerjakan (Done)
- [x] Migrasi dari arsitektur monolith HTML ke Next.js 15 + Tailwind CSS + TypeScript.
- [x] Pemisahan 13 komponen modular dengan tanggung jawab tunggal.
- [x] Web Audio API hook sintetis (bebas latensi, tanpa file mp3 eksternal).
- [x] Penyelarasan kawat k chrome horizontal menempel pas pada cincin kait gantungan.
- [x] Animasi putar tampak depan saat hover kursor mouse desktop.
- [x] Grid pill kategori mobile sesuai desain sistem (3 kolom, tinggi 42px, font 13px).
- [x] Panggung detail menempel rapat di bawah navbar tanpa celah.
- [x] Penyimpanan foto dan katalog kustom di LocalStorage.
- [x] Verifikasi build produksi (`npm run build`) dengan 0 error.

### Rencana Pengembangan Berikutnya (Upcoming)
- [ ] **Sinkronisasi Database Supabase**: Menghubungkan katalog ke tabel produk Supabase milik MIG Digital Printing agar katalog bisa disinkronkan langsung dari aplikasi Kasir.
- [ ] **Simulator Desain Sablon Langsung**: Fitur pratinjau unggah logo/desain milik pembeli langsung ditempel di atas dada kaos/jersey secara real-time.
- [ ] **Mode Bagikan Tautan Produk**: URL unik per produk (contoh: `/jersey-biru-elektrik`) untuk memudahkan promosi di media sosial.
