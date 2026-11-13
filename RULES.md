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

