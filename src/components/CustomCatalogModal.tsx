'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, RotateCcw, Check, Copy } from 'lucide-react';
import { GarmentItem, CategoryData, CustomPhotoData, CustomCategoryData } from '@/types';

interface CustomCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryData: CategoryData;
  customPhotos: Record<string, CustomPhotoData>;
  customCategories: Record<string, CustomCategoryData>;
  onSaveCustom: (itemId: string, data: CustomPhotoData, catData: CustomCategoryData) => void;
  onResetCustom: () => void;
}

export function CustomCatalogModal({
  isOpen,
  onClose,
  categoryData,
  customPhotos,
  customCategories,
  onSaveCustom,
  onResetCustom,
}: CustomCatalogModalProps) {
  const items = categoryData.rack;
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || '');
  const [productName, setProductName] = useState('');
  const [variantName, setVariantName] = useState('');
  const [price, setPrice] = useState(60000);
  const [ownHanger, setOwnHanger] = useState(true);

  const [frontDataUrl, setFrontDataUrl] = useState<string | null>(null);
  const [sideDataUrl, setSideDataUrl] = useState<string | null>(null);
  const [backDataUrl, setBackDataUrl] = useState<string | null>(null);

  const [catTabLabel, setCatTabLabel] = useState(categoryData.tabLabel);
  const [catHeroTitle, setCatHeroTitle] = useState(categoryData.heroTitle);

  // Sinkronkan input saat produk dipilih
  useEffect(() => {
    const item = items.find((i) => i.id === selectedItemId) || items[0];
    if (!item) return;

    const custom = customPhotos[item.id] || {};
    setProductName(custom.name || item.name);
    setVariantName(custom.colorName || item.colorName);
    setPrice(custom.price || item.price);
    setOwnHanger(custom.ownHanger !== false);
    setFrontDataUrl(custom.frontDataUrl || null);
    setSideDataUrl(custom.sideDataUrl || null);
    setBackDataUrl(custom.backDataUrl || null);

    const catCustom = customCategories[categoryData.id] || {};
    setCatTabLabel(catCustom.tabLabel || categoryData.tabLabel);
    setCatHeroTitle(catCustom.heroTitle || categoryData.heroTitle);
  }, [selectedItemId, categoryData, items, customPhotos, customCategories]);

  if (!isOpen) return null;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Helper auto-generate tampak samping dari depan jika kosong (rasio narrow 0.3 sesuai panduan PDF)
  const autoGenerateSide = (frontUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onerror = () => resolve(frontUrl);
      img.onload = () => {
        // Lebar tampak samping sekitar 30% dari tinggi (rasio 0.28 - 0.33 sesuai panduan PDF)
        const targetW = Math.max(90, Math.round(img.height * 0.3));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(frontUrl);

        // Ambil bagian tengah vertikal baju tampak depan
        const srcW = Math.round(img.width * 0.46);
        const srcX = Math.round((img.width - srcW) / 2);

        // Gambar potongan kain lurus dan solid (tanpa potongan elips transparan)
        ctx.drawImage(img, srcX, 0, srcW, img.height, 0, 0, targetW, img.height);

        // Tambahkan gradien pencahayaan halus agar tampak seperti lipatan pakaian 3D yang nyata
        const grad = ctx.createLinearGradient(0, 0, targetW, 0);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, targetW, img.height);

        resolve(canvas.toDataURL('image/png'));
      };
      img.src = frontUrl;
    });
  };

  const handleSave = async () => {
    let finalSide = sideDataUrl;
    if (!finalSide && frontDataUrl) {
      finalSide = await autoGenerateSide(frontDataUrl);
    }

    const nextCustom: CustomPhotoData = {
      name: productName.trim() || undefined,
      colorName: variantName.trim() || undefined,
      price: Number(price) || undefined,
      ownHanger,
      frontDataUrl: frontDataUrl || undefined,
      sideDataUrl: finalSide || undefined,
      backDataUrl: backDataUrl || undefined,
    };

    const nextCatCustom: CustomCategoryData = {
      tabLabel: catTabLabel.trim() || undefined,
      heroTitle: catHeroTitle.trim() || undefined,
      watermark: catHeroTitle.trim() || undefined,
    };

    onSaveCustom(selectedItemId, nextCustom, nextCatCustom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-[540px] bg-surface rounded-3xl shadow-float border border-line p-6 flex flex-col gap-5 z-10 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div>
            <h2 className="text-lg font-bold text-ink">Atur Katalog Produk</h2>
            <p className="text-[12px] text-ink/60">Sesuaikan foto asli, nama, harga, dan judul kategori</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink/60 hover:bg-page press-active"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Pilih Produk yang Ingin Diatur */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12.5px] font-bold text-ink">Pilih Produk di Gantungan</label>
          <select
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="w-full h-11 px-3.5 bg-page border border-line rounded-2xl text-[13px] font-semibold text-ink focus:outline-none focus:border-brand"
          >
            {items.map((it) => (
              <option key={it.id} value={it.id}>
                {it.name} ({it.colorName})
              </option>
            ))}
          </select>
        </div>

        {/* 2. Nama & Harga */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-ink">Nama Produk</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full h-10 px-3 bg-page border border-line rounded-xl text-[13px] text-ink focus:outline-none focus:border-brand"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-ink">Nama Varian / Warna</label>
            <input
              type="text"
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              className="w-full h-10 px-3 bg-page border border-line rounded-xl text-[13px] text-ink focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[12px] font-bold text-ink">Harga (Rp)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-10 px-3 bg-page border border-line rounded-xl text-[13px] text-ink focus:outline-none focus:border-brand"
          />
        </div>

        {/* 3. Upload Foto Tampak Depan, Samping, Belakang */}
        <div className="flex flex-col gap-2 pt-2 border-t border-line">
          <label className="text-[12.5px] font-bold text-ink">Upload Foto Produk</label>

          <div className="grid grid-cols-3 gap-2">
            {/* Foto Depan */}
            <label className="flex flex-col items-center justify-center p-3 bg-page border border-dashed border-line hover:border-brand rounded-2xl cursor-pointer text-center group">
              <Upload className="w-5 h-5 text-ink/40 group-hover:text-brand mb-1" />
              <span className="text-[11px] font-semibold text-ink">Depan</span>
              <span className="text-[9.5px] text-ink/50 mt-0.5 inline-flex items-center gap-0.5">
                {frontDataUrl ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-brand shrink-0" />
                    <span>Terpilih</span>
                  </>
                ) : (
                  <span>Upload</span>
                )}
              </span>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setFrontDataUrl)} className="hidden" />
            </label>

            {/* Foto Samping */}
            <label className="flex flex-col items-center justify-center p-3 bg-page border border-dashed border-line hover:border-brand rounded-2xl cursor-pointer text-center group">
              <Upload className="w-5 h-5 text-ink/40 group-hover:text-brand mb-1" />
              <span className="text-[11px] font-semibold text-ink">Samping</span>
              <span className="text-[9.5px] text-ink/50 mt-0.5 inline-flex items-center gap-0.5">
                {sideDataUrl ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-brand shrink-0" />
                    <span>Terpilih</span>
                  </>
                ) : (
                  <span>Auto</span>
                )}
              </span>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSideDataUrl)} className="hidden" />
            </label>

            {/* Foto Belakang */}
            <label className="flex flex-col items-center justify-center p-3 bg-page border border-dashed border-line hover:border-brand rounded-2xl cursor-pointer text-center group">
              <Upload className="w-5 h-5 text-ink/40 group-hover:text-brand mb-1" />
              <span className="text-[11px] font-semibold text-ink">Belakang</span>
              <span className="text-[9.5px] text-ink/50 mt-0.5 inline-flex items-center gap-0.5">
                {backDataUrl ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-brand shrink-0" />
                    <span>Terpilih</span>
                  </>
                ) : (
                  <span>Upload</span>
                )}
              </span>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setBackDataUrl)} className="hidden" />
            </label>
          </div>

          {/* Checkbox Gantungan Bawaan */}
          <label className="flex items-center gap-2 mt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={ownHanger}
              onChange={(e) => setOwnHanger(e.target.checked)}
              className="w-4 h-4 rounded text-brand focus:ring-brand"
            />
            <span className="text-[12px] text-ink/75">Foto produk sudah memiliki gantungan sendiri</span>
          </label>
        </div>

        {/* 4. Kustomisasi Kategori */}
        <div className="flex flex-col gap-2 pt-2 border-t border-line">
          <label className="text-[12.5px] font-bold text-ink">Kustomisasi Kategori</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Label Tab (mis: Kemeja)"
              value={catTabLabel}
              onChange={(e) => setCatTabLabel(e.target.value)}
              className="w-full h-9 px-3 bg-page border border-line rounded-xl text-[12px] text-ink focus:outline-none focus:border-brand"
            />
            <input
              type="text"
              placeholder="Judul Besar (mis: KEMEJA)"
              value={catHeroTitle}
              onChange={(e) => setCatHeroTitle(e.target.value)}
              className="w-full h-9 px-3 bg-page border border-line rounded-xl text-[12px] text-ink focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        {/* Tombol Aksi (Pill rounded-full sesuai Desain Sistem) */}
        <div className="flex items-center justify-between pt-3 border-t border-line gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onResetCustom}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold text-red-600 hover:bg-red-50 press-active"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const config = {
                  photos: customPhotos,
                  categories: customCategories,
                };
                navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                alert('Konfigurasi berhasil disalin ke clipboard! Anda bisa kirimkan teks ini ke asisten AI untuk dijadikan permanen di website.');
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold text-muted hover:text-ink hover:bg-page press-active"
              title="Salin data JSON untuk dijadikan permanen ke kode"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin JSON</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full text-[12.5px] font-semibold bg-page text-ink hover:bg-line press-active"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-[12.5px] font-bold bg-brand text-surface hover:bg-brand-hover shadow-sm press-active"
            >
              <Check className="w-4 h-4" />
              <span>Simpan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
