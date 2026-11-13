# MIG UI: Desain Sistem — MIG Apparel (v1.10)

Sistem desain visual terpadu untuk ekosistem **MIG Digital Printing**, diadopsi langsung dari standar desain sistem Kasir MIG Digital Printing dan disesuaikan untuk katalog pakaian interaktif 3D.

---

## 1. Prinsip Utama MIG UI
1. **Minimalis & Sedikit Warna**:
   * Ungu `brand` hanya digunakan untuk status terpilih, aktif, atau tombol aksi utama.
   * Hijau, kuning, dan merah hanya dipakai untuk indikator status (stok, peringatan, diskon).
   * Selebihnya didominasi oleh palet monokrom bersih: hitam (`ink`), putih (`surface`), dan abu-abu halus (`page`, `line`).
2. **Pill vs Kartu**:
   * **Teks kecil sampai 3 baris = Pill (radius 999px)**: Tombol aksi, kolom input, chip kategori, badge harga, dan tab sudut berbentuk pill kapsul penuh.
   * **Teks besar atau blok tinggi = Kartu (radius 32px atau 24px)**: Panel produk, rincian keterangan bahan, dan drawer keranjang belanja berbentuk kartu melengkung elegan.
3. **Cepat & Intuitif**:
   * Pilihan 2-3 opsi wajib menggunakan baris pill (seperti kategori produk dan tab sudut), bukan dropdown tersembunyi.
4. **Struktur Layar**:
   * Bagian atas tetap (*fixed/sticky header*), area tengah bergulir (*scrollable content*), dan aksi utama menempel di bawah (*floating bottom action bar*).
5. **Mobile First**:
   * Semua tombol dan area interaktif yang bisa disentuh memiliki tinggi minimal **`44px`** agar nyaman dioperasikan satu tangan.

---

## 2. Token Warna & Material

| Nama Token | Kode HEX | Kegunaan |
|---|---|---|
| `brand` | `#7B29BA` | Aksi utama, tombol WhatsApp, pilihan aktif |
| `brand-hover` | `#6A21A3` | State hover tombol aksi utama |
| `brand-soft` | `#F4EBFA` | Latar badge aktif, highlight lembut, tag harga |
| `brand-deep` | `#551C7D` | Gradasi aksen gelap |
| `page` | `#F5F4F8` | Latar belakang panggung & halaman web |
| `surface` | `#FFFFFF` | Latar kartu, modal, popover, kolom isian |
| `line` | `#E2E0EA` | Garis tepi (*border*) tipis 1px |
| `ink` | `#1C1B1A` | Teks utama, judul, chip kategori aktif |
| `muted` | `#6B675E` | Teks pendukung, keterangan sekunder |
| `brand-soft` | `#F4EBFA` / `#7B29BA` | Badge "Desain custom" |
| `warning` | `#FDF0D5` / `#8A5A00` | Badge perhatian / catatan pesanan |
| `danger` | `#FEE2E2` / `#B91C1C` | Tombol hapus item keranjang |

---

## 3. Tipografi
* **Font Utama**: **Inter** (antarmuka UI, label, teks tombol, dan deskripsi).
* **Font Display / Jersey**: **Anton** (nomor punggung jersey printing dan tipografi display).
* **Font Aksen**: **Serif Italic** (callout dekoratif desktop "Tampil *MENAWAN*").
* **Angka Monospace**: Menggunakan kelas `tabular-nums` untuk angka harga, kuantitas, dan counter (agar angka sejajar dan tidak bergeser saat nilainya berubah).

### Skala Ukuran Font
* `11px - 12px`: Label kecil, counter (04/07), status stok.
* `13px`: Chip kategori mobile, teks tombol navigasi, label opsi.
* `14px - 15px`: Teks isi deskripsi produk, rincian ukuran.
* `16px - 18px`: Tombol aksi besar, nama produk di baris atas.
* `20px - 24px`: Judul kartu produk, judul modal.
* `28px - 32px`: Angka harga utama (`Rp 115.000`).

---

## 4. Pola Visual Khusus MIG Apparel

### A. Chip Kategori Mobile
* **Layout**: `grid grid-cols-3 gap-2 w-full px-3.5 pt-3 pb-2`
* **Tinggi**: Tepat **`42px`** (`min-h-[42px]`)
* **Font**: **`13px font-semibold`**
* **Radius**: **`rounded-full`** (pill kapsul)
* **Status**:
  * *Aktif*: `bg-ink text-surface shadow-sm` (Hitam `#1c1b1a` dengan teks putih)
  * *Tidak Aktif*: `bg-surface text-ink border border-line` (Putih dengan border garis tipis)
* **Penempatan**: Hanya muncul di panggung Rak Gantungan (Stage 1), tidak ikut muncul di panggung Detail (Stage 2).

### B. Rel Kawat Chrome & Kait Gantungan
* **Rel Chrome Horizontal**:
  * Tinggi 8px (mobile 7px).
  * Gradasi metalik: `linear-gradient(180deg, #d6d4de 0%, #ffffff 28%, #6b675e 68%, #1c1b1a 100%)`.
  * Garis kilau putih atas: `height: 2px; bg-white/85`.
* **Kait Gantungan (Hanger Hook)**:
  * Kait logam perak yang menembus dan menggantung rapat di atas rel chrome kawat.
  * Tag harga miring **-8°** warna ungu lembut `brand-soft` menggantung dengan tali putus-putus.

### C. Panggung Baju 3D & Rotator
* **Panggung Sticky Flush**:
  * Menempel rapat di bawah navbar tanpa celah (*zero gap*).
* **Tab Sudut Tampilan [Samping] [Depan] [Belakang]**:
  * Kapsul horizontal putih berisi 3 pill switch.
  * Diposisikan pas di bawah keliman baju agar tidak menutupi grafis cetakan kaos/jersey.

### D. Sudut Kelengkungan (*Border Radius*)
* `rounded-full` (999px): Semua tombol, pill kategori, tag harga, dan tab sudut.
* `rounded-3xl` (24px - 32px): Kartu produk, modal atur katalog, drawer keranjang belanja.
* `rounded-2xl` (16px): Kotak rincian bahan, pilihan warna, dan tombol tambahan opsional.

---

## 5. Bahasa & UX Copy (Indonesia)
* Menggunakan kalimat aktif yang lugas dan bersahabat:
  * *"Masukkan keranjang"* bukan *"Add to Cart"*.
  * *"Pesan langsung lewat WhatsApp"* bukan *"Checkout via WA"*.
  * *"Atur katalog"* bukan *"Edit Catalog"*.
* Format mata uang: `Rp 115.000` (menggunakan titik pemisah ribuan).
