# AI-CONTEXT.md — Log Konteks, Perintah & Perubahan MIG Apparel

File ini menyimpan ringkasan konteks terbaru, preferensi desain pengguna, serta riwayat perintah dan perubahan kode agar asisten AI tetap sinkron meskipun berpindah perangkat (*device*) atau sesi.

> **Instruksi Wajib untuk AI**:
> 1. **Baca file ini di awal sesi** (bersama [`RULES.md`](./RULES.md) dan [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md)) sebelum mengubah kode.
> 2. **Perbarui file ini setiap kali selesai mengerjakan perintah pengguna**: catat tanggal, inti perintah pengguna, ringkasan perubahan & file yang terdampak, hasil verifikasi (`lint`/`build`), serta status Git (`commit`/`push`).
> 3. Jangan pernah mengembalikan fitur atau gaya visual yang sudah ditolak pengguna di bagian **Keputusan & Preferensi Aktif**.

---

## Keputusan & Preferensi Aktif Pengguna

* **Tanpa Efek Liquid Glass**:
  * Pengguna menolak penggunaan efek **liquid glass** (`.liquid-glass` / prisma optik / kilau tepi kaca).
  * Gunakan gaya permukaan standar MIG UI sesuai [`RULES.md`](./RULES.md) Bagian 7 (`bg-surface`, `bg-surface/95 backdrop-blur-md`, `.glass` standar pada bar penuh desktop, `border-line`).
* **Standar Foto Produk & Kait Gantungan** (`RULES.md` Bagian 10, commit `9275572`):
  * Seluruh foto tampak samping (`*-side.webp`) menghadap ke kiri dengan batang kawat tipis tampak samping (*edge-on*) dan poros tengah lurus di `x = 50%`.
* **Aturan Git Push** (`RULES.md` Bagian 1):
  * Jangan langsung menjalankan `git push origin main` setelah mengedit; tunggu verifikasi dan izin pengguna terlebih dahulu.
  * Wajib menjalankan `npm run lint` dan `npm run build` dengan `0` error sebelum menyerahkan hasil.

---

## Riwayat Perintah & Perubahan (Terbaru di Atas)

### 2026-11-28 — Hapus Efek Liquid Glass & Buat File Konteks Lintas Device
* **Perintah Pengguna**:
  1. *"kembalikan lagi, gak usah pake efek liquid glass"*
  2. *"catat tiap perubahan dan perintah ya, buatkan file khusus untuk itu biar ai tetap tau konteks terbaru walau beda device"*
* **Perubahan Dilakukan**:
  * Melakukan fast-forward `main` lokal ke `origin/main` (`9275572`) agar pembaruan foto produk & kait gantungan tetap terbawa.
  * Merevert commit eksperimen liquid glass (`e6a621f`, `99af755`, `8cfacc0`) dan menghapus sisa class `.liquid-glass` sepenuhnya:
    * `src/app/globals.css`: Menghapus definisi `.liquid-glass`.
    * `src/components/Topbar.tsx`: Kembali ke navbar atas full-width sticky (`.glass` + `border-b border-line/60`) dengan pill kategori solid (`bg-surface border-line`).
    * `src/components/HangerRack.tsx`: Mengembalikan tombol kategori mobile, tombol *Flash*, CTA WhatsApp, dan kapsul detail bawah ke gaya solid/semi-transparan standar (`bg-surface/95 border-line`), tetap mempertahankan mask sambungan kait dari `9275572`.
    * `src/components/AngleTabs.tsx`: Kembali ke `bg-surface border-line shadow-sm`.
    * `src/components/BackgroundMusic.tsx`: Kembali ke `bg-surface border-line shadow-sm`.
    * `src/components/OrderBottomBar.tsx`: Kembali ke `bg-surface/95 backdrop-blur-2xl border-line/90`.
    * `src/components/DetailStage.tsx`: Header desktop kembali full-width `.glass`, tombol *Flash* kembali `bg-surface border-line`, dan header kapsul mobile diganti ke `bg-surface/95 backdrop-blur-md border border-line`.
  * Membuat [`AI-CONTEXT.md`](./AI-CONTEXT.md) dan menambahkan Bagian 11 di [`RULES.md`](./RULES.md) agar setiap AI di device mana pun membaca dan memperbarui log ini.
* **Verifikasi & Status Git**:
  * `npm run lint` lulus (0 error/warning) dan `npm run build` lulus (`✓ Compiled successfully`, static export 4/4 halaman) untuk perubahan UI.
  * Status Git: **Sudah di-commit dan di-push ke `origin/main`** atas instruksi pengguna (`push`).

---

### 2026-11-23 — Standardisasi Foto Produk, Kait Gantungan & Eksperimen Liquid Glass (Riwayat Git `origin/main`)
* `9275572`: Menstandarkan arah hadap produk tampak samping ke kiri, kait gantungan, dan poros tengah `50%` di seluruh aset `public/products/*.webp`, `src/components/HangerHookSVG.tsx`, `src/components/HangerRack.tsx`, dan `RULES.md` Bagian 10 (**dipertahankan**).
* `e6a621f`, `99af755`, `8cfacc0`: Penambahan & peningkatan efek optical liquid glass pada dock CTA mobile, panggung depan, dan desktop (**sudah dibatalkan/dihapus pada 2026-11-28 sesuai instruksi pengguna**).
* `3044d53`: Menempatkan CTA dock desktop di kiri bawah `DetailStage.tsx` dan memperkuat fade bawah mobile.
* `2bc5f4b`: Perbaikan UI/UX, rotasi sisi 3D, kartu DP alur order, dan modal admin 2 kolom.
