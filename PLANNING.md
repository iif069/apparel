# PLANNING — MIG Apparel Interactive Catalog (Showcase & WhatsApp Conversion)

Dokumen peta rencana dan arsitektur pengembangan web catalog interaktif 3D untuk **MIG Digital Printing**.

---

## 1. Tujuan & Visi Project (Refined Focus)
* **Tujuan**: Menghadirkan **katalog showcase visual 3D** yang memukau dan interaktif untuk apparel MIG Digital Printing (Kaos Sablon, Jersey Printing, Kemeja PDH), dengan fokus menarik perhatian pengunjung dan mengonversi minat beli menjadi **pesanan custom langsung via WhatsApp**.
* **Prinsip Utama (Keep It Simple & High Impact)**:
  1. **Bukan E-Commerce Kompleks**: Fitur keranjang belanja (*cart drawer*) dan tab sekunder ditiadakan agar antarmuka tidak rumit dan pengunjung tidak terdistraksi.
  2. **Daya Tarik Visual 3D**: Deretan gantungan baju di kawat rel krome horizontal, ayunan inersia saat di-hover/swipe, dan rotator baju 360° tampak depan-belakang.
  3. **One-Click WhatsApp Order & Custom Consultation**: Setiap pilihan ukuran, warna, dan tambahan langsung dikalkulasikan ke dalam draf template pesan WhatsApp siap kirim ke CS MIG.
  4. **Pintu Masuk Desain Custom**: Banner dan tombol CTA khusus *"Desain custom? Chat via WhatsApp"* di panggung utama maupun halaman detail agar calon konsumen yang memiliki logo, motif, atau seragam tim sendiri langsung terhubung ke desainer.

---

## 2. Arsitektur & Teknologi

```
Client Browser (Next.js 15 + Tailwind CSS + TypeScript)
│
├── App Router (src/app/)
│   ├── layout.tsx         : Root layout, font Inter & Anton, metadata
│   ├── page.tsx           : Pengendali state utama (kategori, slot aktif, detail modal, mode admin)
│   └── globals.css        : Token warna MIG UI, material kaca glass, animasi gerak, utilitas 3D
│
├── Komponen Modular (src/components/)
│   ├── Topbar.tsx            : Header toko kaca (logo toko, nama, navigasi kategori, tombol Chat WA)
│   ├── HangerRack.tsx        : Panggung rak kawat chrome 3D, hover effect, banner CTA custom, kartu detail
│   ├── HangerHookSVG.tsx     : Kait logam krom & tag harga ungu miring (-8°)
│   ├── GarmentSVG.tsx        : Vektor pakaian 3D (Kaos, Jersey, Kemeja) & foto custom
│   ├── GarmentRotator.tsx    : Panggung putar 3D interaktif drag/touch gesture
│   ├── AngleTabs.tsx         : Tab switch sudut [Samping] [Depan] [Belakang]
│   ├── DetailStage.tsx       : Layar detail produk sticky flush tanpa celah di bawah navbar
│   ├── OrderBottomBar.tsx    : Bar aksi bawah terfokus (Pesan via WhatsApp dengan kalkulasi instan)
│   ├── CustomCatalogModal.tsx: Modal admin ganti foto kustom, harga, nama & warna
│   └── BackgroundMusic.tsx   : Audio latar lofi santai untuk nuansa butik modern
│
├── Data & Logic (src/data/, src/hooks/, src/types/)
│   ├── catalog.ts         : Data awal 3 kategori (Kaos Sablon, Jersey Printing, Kemeja)
│   ├── useSound.ts        : Sintesis audio Web Audio API tanpa file eksternal
│   └── index.ts           : Tipe data TypeScript deklaratif
│
└── Penyimpanan Lokal (LocalStorage)
    ├── mig-apparel-custom-photos     : Foto custom per item (DataURL)
    ├── mig-apparel-custom-categories : Judul & label kategori custom
    └── mig-apparel-admin-mode        : Status login admin rahasia
```

---

## 3. Rincian Fitur Utama

### A. Stage 1: Panggung Rak Gantungan 3D (Hanger Rack)
* **Kawat Chrome Horizontal Presisi**: Batang logam rel melintang dengan gradasi krom perak dan garis kilau putih. Kait kawat gantungan menembus rel secara natural.
* **Deretan Baju & Efek Interaktif**:
  * Desktop: Mengarahkan mouse (*pointerenter*) otomatis memutar baju ke depan, memperlebar slot, membunyikan efek slide, dan memperbarui label produk aktif.
  * Mobile: Menggeser (*swipe/drag*) deretan baju dan mengetuk baju untuk memilih.
* **Grid Kategori Mobile Sesuai Desain Sistem**:
  * 3 kolom seimbang (`grid-cols-3 gap-2`), tinggi `42px`, bentuk kapsul membulat (*pill*).
* **CTA Desain Custom Bebas**:
  * Banner kapsul kaca di atas rak baju dan tombol interaktif di kiri bawah: *"Desain custom? Chat via WhatsApp"*.
* **Menu Atur Katalog (Admin Mode)**:
  * Akses rahasia (klik 5x pada logo toko) untuk mengganti foto baju, nama, harga, dan warna gantungan.

### B. Stage 2: Halaman Detail Produk & Rotator 3D
* **Panggung Sticky Flush**: Panggung visual atas menempel langsung di bawah navbar tanpa celah kosong (*zero top gap*).
* **3D Garment Rotator**:
  * Baju dapat diputar bebas 360° menggunakan gesekan jari di HP atau mouse drag di desktop.
  * Melepaskan putaran otomatis mengunci (*snap*) ke tampak depan (0°) atau belakang (180°).
* **Tab Sudut Pandang**: Tombol pill `[Samping]`, `[Depan]`, `[Belakang]`.
* **Multi-Size Selector**: Menambah ukuran (S, M, L, XL, XXL) dengan tombol `+` dan `-` kuantitas per ukuran.
* **Tambahan Opsional**:
  * Cetak logo / nama dada (+Rp 15.000).
  * Kemasan kotak kado (+Rp 10.000).
* **Kartu CTA Desain Custom**: Kartu panduan konsultasi gratis bagi pembeli yang membawa motif/logo sendiri.

### C. Alur Pemesanan Cepat via WhatsApp
* **Single Primary Action**: Menghilangkan tombol keranjang belanja, menggantikannya dengan tombol utama tunggal: **"Pesan via WhatsApp"**.
* Menghasilkan pesan teks terstruktur rapi ke WhatsApp CS MIG Digital Printing:
  * Nama produk & warna
  * Rincian ukuran dan kuantitas per ukuran
  * Tambahan yang dipilih
  * Total kalkulasi harga instan
  * Siap konfirmasi langsung ke nomor CS toko.

---

## 4. Status Pengerjaan

### Selesai Dikerjakan (Done)
- [x] Migrasi dari arsitektur monolith HTML ke Next.js 15 + Tailwind CSS + TypeScript.
- [x] Panggung gantungan baju 3D kawat chrome dengan inersia ayunan dan hover slide sound.
- [x] Rotator 3D 360° interaktif dengan tab sudut pandang [Samping] [Depan] [Belakang].
- [x] Penyederhanaan alur: Menghapus keranjang belanja kompleks, memfokuskan web pada katalog showcase visual.
- [x] Tombol CTA *"Desain custom? Chat via WhatsApp"* di panggung utama, header, dan halaman detail.
- [x] Integrasi template pesan otomatis WhatsApp dengan rincian ukuran & kalkulasi harga.
- [x] Desain sistem MIG UI v1.10 (Material Kaca Glass, Pill 44px, Card 32px, Token Warna MIG).
- [x] Optimalisasi Navbar Mobile: Layout rapi, single line, teks Chat WA tidak terpotong/menumpuk, ruang lega.
- [x] Notifikasi Mode Admin Elegan: Toast melayang di atas, bentuk kartu `rounded-2xl`, tidak menutupi footer atau berbentuk bulat telur.
- [x] Penghapusan bagian opsional tambahan: Sederhana & fokus ke katalog showcase WhatsApp.
- [x] Penyeragaman 100% Ikon WhatsApp Resmi di seluruh tombol aksi & CTA (bebas warna hijau, monokrom netral / putih).
- [x] Verifikasi build TypeScript & Linting (`npx tsc --noEmit` & `npm run lint`) **0 error**.
