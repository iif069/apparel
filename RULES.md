# RULES.md — Aturan Kerja MIG Apparel

Dokumen ini adalah aturan kerja baku untuk AI Assistant dalam mengembangkan project **MIG Apparel**.

---

## 1. Aturan Pengujian & Git Push
* **JANGAN LANGSUNG PUSH KE MAIN**:
  * Setiap kali selesai melakukan perubahan kode atau perbaikan bug, **jangan langsung menjalankan `git push origin main`**.
  * Berikan instruksi pengujian (*test steps*) yang jelas di akhir pesan agar pengguna dapat mencoba dan memverifikasi sendiri terlebih dahulu di browser (`localhost:3000`).
  * `git push` ke branch `main` hanya boleh dilakukan setelah pengguna mencoba, menyatakan puas, atau menginstruksikan untuk push.
* **Wajib Lint & Build Sebelum Selesai Giliran**:
  * Sebelum melaporkan bahwa pekerjaan selesai, jalankan `npm run build` dan pastikan **0 error** (tipe TypeScript valid dan halaman berhasil dikompilasi).
  * Jika ada error pada build atau lint, perbaiki terlebih dahulu sampai bersih sebelum menyerahkan ke pengguna.

---

## 2. Cara Kerja Bertahap & Rapi
* **Satu Langkah Fokus**:
  * Fokus selesaikan satu isu atau komponen dalam satu waktu sesuai permintaan pengguna.
  * Hindari merombak file yang tidak berkaitan di luar lingkup permintaan.
* **Ringkasan Perubahan**:
  * Setelah selesai mengedit, berikan ringkasan singkat:
    * **File baru**: path file
    * **File diubah**: path file + apa yang diperbaiki
* **Panduan Tes Jelas**:
  * Selalu sertakan langkah pengetesan singkat di akhir jawaban:
    1. Halaman mana yang dibuka.
    2. Apa yang perlu diklik / di-hover / digeser.
    3. Apa hasil visual dan interaksi yang diharapkan.

---

## 3. Desain & Komunikasi
* **Patuhi Desain Sistem MIG UI**:
  * Semua warna, radius, dan gaya harus berpatokan pada [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md).
  * Warna `brand` ungu (`#7B29BA`) hanya untuk elemen terpilih, aktif, atau tombol aksi utama. Selebihnya gunakan palet netral (`page`, `surface`, `line`, `ink`, `muted`).
  * Elemen sentuh di mobile minimal tinggi `44px`.
* **Bahasa Komunikasi**:
  * **Bahasa UI**: Bahasa Indonesia yang jelas, ramah, dan ringkas.
  * **Bahasa Kode**: Variabel, fungsi, dan nama file dalam bahasa Inggris yang deklaratif. Komentar kode dalam bahasa Indonesia.
  * Gunakan penjelasan awam dan analogi visual yang mudah dipahami karena pengguna berlatar belakang desain percetakan.

---

## 4. Dilarang Mengubah Desain Tanpa Instruksi
* **Pertahankan Desain yang Sudah Ada**:
  * Jika pengguna meminta perbaikan fungsi (contoh: "saat ukuran dipilih langsung nutup"), **JANGAN PERNAH merombak desain UI**, menambah tombol/elemen baru (seperti badge "+ Tambah"), atau mengubah tata letak.
  * Kembalikan dan pertahankan 100% gaya visual sebelumnya, hanya ubah perilaku interaksinya agar langsung menutup saat dipilih.
* **Minimalis & Presisi**:
  * Ubah hanya baris kode yang benar-benar esensial untuk memenuhi instruksi pengguna. Jangan berinisiatif menambahkan ornamen visual sendiri.

---

## 5. Aturan Referensi Kasir MIG (Tanya Dulu Jika Tidak Yakin)
* **Referensi Resmi**:
  * Referensi Kasir MIG yang benar adalah **`iif069/Kasir-MIG-DIGITAL-PRINTING`** (repo private pengguna), **BUKAN** repo lama `pos-smk-user` (yang masih memakai font Sora dan desain lama).
* **Jangan Menebak atau Berasumsi**:
  * Jika kode atau komponen dari `Kasir-MIG-DIGITAL-PRINTING` belum tersedia di workspace atau repo belum terhubung, **JANGAN MENEBAK-NEBAK TAMPILANNYA**.
  * **Tanyakan kepada pengguna** untuk melihat screenshot, menyalin komponen, atau memberikan izin/potongan kode referensi sebelum membuat komponen tiruan.
  * *"Kalau tidak yakin, tanya dulu!"* — Utamakan bertanya dan berdialog daripada membuat perubahan yang salah arah.

---

## 6. Aturan Ikon & Larangan Keras Emotikon (Satu Sumber Seragam)
* **DILARANG MENGGUNAKAN EMOTIKON TEKS / UNICODE EMOJI**:
  * Dilarang keras menyisipkan karakter emoji unicode (seperti `🔒`, `🔓`, `✓`, `✨`, `🔥`, dll.) di dalam teks tombol, notifikasi toast, badge, maupun alert.
  * Semua ikon grafis **WAJIB berasal dari satu sumber seragam: paket `lucide-react`** (misal: `<Lock />`, `<Unlock />`, `<Check />`, `<Sparkles />`).
* **Ikon WhatsApp Bebas Warna Hijau**:
  * Ikon WhatsApp tidak boleh menggunakan warna hijau (`#25D366`), melainkan harus seragam monokrom/netral:
    * Pada tombol outline/putih: `fill="currentColor"` mewarisi `text-ink`.
    * Pada tombol utama ungu: `fill="currentColor"` dengan `text-white`.
    * Pada badge/lencana kecil: `text-brand` di dalam lingkaran `bg-brand-soft`.
  * Semua tombol atau banner yang mengarah ke WhatsApp wajib memakai komponen SVG vektor resmi WhatsApp yang seragam (jangan diganti balon bicara biasa atau ikon lain).

---

## 7. Aturan CTA, Tombol Pill, dan Kepatuhan Desain Sistem
* **CTA Desktop Tunggal (Dilarang Ada 2 CTA Redundan)**:
  * Di tampilan desktop, **hanya boleh ada 1 CTA tunggal** di sisi kiri bawah footer panggung rak (sebagai penyeimbang kartu produk di sisi kanan bawah).
  * Banner CTA tengah atas rak hanya dikhususkan untuk tampilan mobile (`md:hidden`), tidak boleh muncul menduplikasi di desktop.
* **Keseragaman Wording CTA**:
  * Seragamkan teks CTA pesanan custom menjadi: **`Desain custom? Chat via WhatsApp`**. Jangan mencampuradukkan variasi kalimat (seperti "Punya desain sendiri" vs "Desain custom") di satu layar yang sama.
* **Kepatuhan Bentuk Pill MIG UI**:
  * Tombol pill dan kartu kapsul footer wajib mengikuti token MIG UI:
    * Latar: Putih kaca semi-transparan (`bg-surface/95 backdrop-blur-md`).
    * Border: Garis abu-abu tipis presisi (`border border-line hover:border-brand/40`), **BUKAN border ungu tipis (`border-brand/30`)**.
    * Teks: Hitam tegas (`text-ink`), **BUKAN teks ungu (`text-brand`)**.
    * Bayangan: `shadow-[0_6px_24px_rgba(0,0,0,0.08)]` atau `shadow-soft`.
    * Tinggi: Seimbang dan selaras dengan kartu produk di sebelahnya (`px-5 py-3 rounded-full`).

---

## 8. Aturan Layout Responsif (Navbar & Toast Notifikasi)
* **Navbar Mobile Rapi & Bebas Tumpukan Teks**:
  * Tombol navigasi dan tombol aksi di navbar mobile wajib memakai `shrink-0 whitespace-nowrap` agar teksnya tidak tertekan menjadi 2 baris vertikal.
  * Elemen sekunder (seperti badge admin di judul atau subtitle panjang) disembunyikan di HP agar navbar tetap lega dan bernapas.
* **Toast Notifikasi Melayang di Atas**:
  * Notifikasi toast wajib diposisikan di **bagian atas layar** (`top-18 md:top-6`) agar tidak menutupi footer rak atau bar aksi bawah.
  * Bentuk toast wajib kartu kapsul proporsional (`rounded-2xl`), **DILARANG memakai `rounded-full`** yang bisa membengkak menjadi lingkaran/telur saat berisi teks panjang.

---

## 9. Nomor WhatsApp Resmi Toko & Konfigurasi Terpusat
* **Nomor WhatsApp Resmi MIG Apparel**:
  * Nomor resmi CS Toko adalah **`+62 895-1040-5562`** (format link wa.me: `6289510405562`).
* **Wajib Menggunakan Konfigurasi Terpusat (`@/config/store`)**:
  * Seluruh tautan atau pemanggilan `window.open` ke WhatsApp **DILARANG KERAS di-hardcode** di masing-masing file komponen.
  * Wajib mengimpor helper `getWhatsAppUrl(pesan)` atau konstanta `STORE_CONFIG` dari `@/config/store`.
  * Dengan demikian, jika suatu saat nomor WhatsApp berganti, cukup ubah satu baris di `src/config/store.ts`.

  * Gunakan animasi transisi halus (`animate-in fade-in slide-in-from-top-2`), tanpa efek *bounce* berlebihan.
* **Widget Musik Latar (BGM) Dilarang Menutupi Teks Produk**:
  * Widget floating BGM diposisikan melayang di atas kartu produk (`bottom-[84px]`), bukan di `bottom-4` yang bertumpukan dengan teks *"Mulai dari"*.
  * Widget BGM otomatis disembunyikan saat modal detail produk terbuka (`isDetailOpen = true`) agar tampilan formulir ukuran dan pemesanan tetap bersih tanpa halangan.

