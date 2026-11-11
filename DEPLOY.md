# Panduan Deploy ke Cloudflare Pages — MIG Apparel

Project ini dikonfigurasi menggunakan **Next.js 15 Static Export (`output: 'export'`)**. Setiap kali ada push ke cabang `main` di GitHub, Cloudflare Pages akan otomatis melakukan build dan memperbarui website secara instan dan gratis.

---

## Langkah Menghubungkan ke Cloudflare Pages (Sekali Saja)

1. Buka dashboard Cloudflare: [dash.cloudflare.com](https://dash.cloudflare.com/)
2. Di menu samping kiri, klik **Workers & Pages** → klik tombol **Create** di kanan atas.
3. Klik tab **Pages** (atau tautan *"Looking to deploy Pages? Get started"*).
4. Pilih **Connect to Git** (Hubungkan ke GitHub).
5. Pilih akun GitHub Anda dan pilih repositori:
   ```text
   iif069/apparel
   ```
6. Pada formulir **Set up builds and deployments**, isi konfigurasi berikut:

| Pengaturan | Nilai yang Harus Diisi | Keterangan |
|---|---|---|
| **Project name** | `mig-apparel` | Nanti alamat web Anda menjadi `https://mig-apparel.pages.dev` |
| **Production branch** | `main` | Cabang utama yang dipantau otomatis |
| **Framework preset** | `Next.js (Static HTML Export)` atau `None` | Preset bawaan Cloudflare |
| **Build command** | `npm run build` | Perintah build Next.js |
| **Build output directory** | `out` | Folder hasil export statis Next.js |
| **Root directory** | *(kosongkan / biarkan default)* | Karena `package.json` ada di folder paling atas |

7. **Environment variables** (di bagian bawah sebelum tombol save):
   * Tambahkan variabel untuk memastikan versi Node modern:
     * **Variable name**: `NODE_VERSION`
     * **Value**: `20` (atau `22`)
8. Klik **Save and Deploy**.
9. Cloudflare akan menjalankan build selama ~1 menit. Setelah selesai, website Anda langsung online dan dapat diakses dari HP maupun laptop di seluruh dunia melalui URL:
   ```text
   https://mig-apparel.pages.dev
   ```

---

## Alur Kerja Selanjutnya (Otomatis)
Setelah langkah di atas selesai:
* Setiap kali Anda menyetujui perbaikan kode dan kami menjalankan `git push origin main`:
  * Cloudflare Pages akan langsung mendeteksi commit baru.
  * Mengompilasi ulang website secara otomatis dalam 1 menit.
  * Website online langsung terbarui tanpa perlu upload manual lagi!
