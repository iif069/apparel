'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Minus, ChevronDown, Check, Sparkles } from 'lucide-react';
import { GarmentItem, CategoryData, ViewAngle, CustomPhotoData } from '@/types';
import { getWhatsAppUrl } from '@/config/store';
import { GarmentRotator } from './GarmentRotator';
import { AngleTabs } from './AngleTabs';
import { OrderBottomBar } from './OrderBottomBar';

// SVG Resmi WhatsApp seragam
const WhatsAppIcon = ({ className = 'w-4 h-4 flex-shrink-0' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.81 8.1 19.14L7.54 18.82L4.43 19.64L5.26 16.6L4.91 16.03C4.18 14.77 3.8 13.35 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67ZM8.73 7.34C8.54 7.34 8.35 7.35 8.17 7.73C7.99 8.12 7.45 8.63 7.45 9.69C7.45 10.74 8.22 11.75 8.33 11.9C8.44 12.05 9.8 14.23 11.94 15.07C13.72 15.77 14.08 15.63 14.47 15.59C14.85 15.55 15.71 15.08 15.89 14.57C16.07 14.06 16.07 13.63 16.01 13.54C15.96 13.45 15.81 13.4 15.58 13.28C15.35 13.17 14.23 12.62 14.02 12.54C13.81 12.47 13.66 12.43 13.51 12.66C13.36 12.89 12.93 13.4 12.8 13.55C12.67 13.71 12.54 13.73 12.31 13.61C12.08 13.5 11.35 13.26 10.47 12.48C9.79 11.87 9.33 11.12 9.2 10.89C9.07 10.66 9.18 10.54 9.3 10.42C9.4 10.32 9.53 10.15 9.65 10.01C9.76 9.87 9.8 9.77 9.88 9.62C9.96 9.46 9.92 9.33 9.86 9.22C9.8 9.11 9.35 7.99 9.16 7.54C8.98 7.1 8.79 7.16 8.73 7.34Z" />
  </svg>
);

interface DetailStageProps {
  isOpen: boolean;
  onClose: () => void;
  categoryData: CategoryData;
  itemIndex: number;
  onSelectIndex: (index: number) => void;
  customPhotos: Record<string, CustomPhotoData>;
  onOrderViaWhatsApp: (order: {
    item: GarmentItem;
    categoryId: CategoryData['id'];
    sizes: Record<string, number>;
    totalPrice: number;
  }) => void;
  onPlaySound: (type: 'slide' | 'open' | 'click' | 'flip') => void;
}

export function DetailStage({
  isOpen,
  onClose,
  categoryData,
  itemIndex,
  onSelectIndex,
  customPhotos,
  onOrderViaWhatsApp,
  onPlaySound,
}: DetailStageProps) {
  const [viewAngle, setViewAngle] = useState<ViewAngle>('front');
  const [sizeQtys, setSizeQtys] = useState<Record<string, number>>({ M: 1 });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [sizePickerOpen, setSizePickerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const items = categoryData.rack;
  const currentItem = items[itemIndex] || items[0];
  const custom = customPhotos[currentItem?.id];
  const price = custom?.price || currentItem?.price || 60000;
  const productName = custom?.name || currentItem?.name;
  const colorName = custom?.colorName || currentItem?.colorName;

  // Reset scroll saat item berganti
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
    setViewAngle('front');
    setColorPickerOpen(false);
    setSizePickerOpen(false);
  }, [itemIndex, isOpen]);

  // Pantau scroll di HP untuk mengganti badge nomor jadi judul
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    setIsScrolled(top > 45);
  };

  if (!isOpen || !currentItem) return null;

  // Hitung total kuantitas & harga
  const totalQty = Object.values(sizeQtys).reduce((acc, q) => acc + q, 0);
  const calculatedTotal = price * Math.max(1, totalQty);

  const handleAddSize = (size: string) => {
    if (!size) return;
    setSizeQtys((prev) => ({
      ...prev,
      [size]: (prev[size] || 0) + 1,
    }));
    onPlaySound('click');
  };

  const handleUpdateQty = (size: string, delta: number) => {
    setSizeQtys((prev) => {
      const next = { ...prev };
      const val = (next[size] || 0) + delta;
      if (val <= 0) {
        delete next[size];
      } else {
        next[size] = val;
      }
      return Object.keys(next).length === 0 ? { [size]: 1 } : next;
    });
    onPlaySound('click');
  };

  const handleWhatsAppClick = () => {
    onPlaySound('click');
    onOrderViaWhatsApp({
      item: currentItem,
      categoryId: categoryData.id,
      sizes: sizeQtys,
      totalPrice: calculatedTotal,
    });
  };

  const counterText = `${String(itemIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="Detail pakaian"
      className="fixed inset-0 z-50 bg-page flex flex-col w-full h-[100dvh] overflow-hidden"
    >
      {/* 1. HEADER DETAIL TETAP DI ATAS (z-index 50) */}
      <header className="flex-shrink-0 w-full h-[68px] md:h-[72px] glass border-b border-line/60 flex items-center z-50 px-4 md:px-7 transition-colors">
        <div className="w-full max-w-[1340px] mx-auto flex items-center justify-between gap-3">
          {/* Tombol Kembali ke Rak (Sama persis dengan tombol Back di Keranjang) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="press w-11 h-11 rounded-full bg-surface border border-line shadow-xs flex items-center justify-center hover:bg-page text-ink transition-colors cursor-pointer"
              aria-label="Kembali ke rak"
              title="Kembali ke rak"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="press hidden md:inline-block text-[14px] font-bold text-ink hover:text-brand transition-colors cursor-pointer"
            >
              Kembali ke rak
            </button>
          </div>

          {/* Tengah: Nomor Indeks (04/07) atau Judul saat di-scroll */}
          <div className="flex items-center justify-center min-w-0">
            {isScrolled ? (
              <span className="text-[16px] md:text-[17px] font-bold text-ink truncate max-w-[180px] sm:max-w-[280px] md:max-w-[420px]">
                {productName}
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-page text-ink/80 border border-line tabular-nums">
                {counterText}
              </span>
            )}
          </div>

          {/* Tombol Chat WhatsApp CS */}
          <a
            href={getWhatsAppUrl('Halo MIG Digital Printing, saya mau tanya dan pesan apparel dari katalog')}
            target="_blank"
            rel="noopener noreferrer"
            className="press flex items-center justify-center gap-2 h-11 px-4 rounded-full bg-surface text-ink border border-line hover:border-brand/40 shadow-xs transition-colors cursor-pointer"
            aria-label="Hubungi WhatsApp CS"
          >
            <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-[13px] font-bold text-ink">Chat WA</span>
          </a>
        </div>
      </header>

      {/* 2. AREA TENGAH BERGULIR */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="relative flex-1 w-full overflow-y-auto lg:overflow-hidden overflow-x-hidden no-scrollbar flex flex-col min-h-0"
      >
        {/* ========================================================================= */}
        {/* A. TAMPILAN KHUSUS HP / TABLET (lg:hidden) - TETAP SAMA SEPERTI SEBELUMNYA */}
        {/* ========================================================================= */}
        <div className="lg:hidden w-full max-w-[1380px] mx-auto px-4 md:px-7 pt-0 md:pt-6 pb-[260px] flex flex-col gap-4">
          {/* Panggung Baju 3D Mobile */}
          <div className="relative z-10 bg-page w-full px-0 pt-2 pb-2 flex flex-col items-center">
            <div className="relative w-full flex justify-center">
              <GarmentRotator
                item={currentItem}
                categoryId={categoryData.id}
                viewAngle={viewAngle}
                onAngleChange={setViewAngle}
                custom={custom}
                onPlaySound={onPlaySound}
              />
            </div>

            {/* Tab Sudut Tampilan [Samping] [Depan] [Belakang] */}
            <div className="w-full flex justify-center mt-2.5">
              <AngleTabs currentAngle={viewAngle} onSelectAngle={setViewAngle} onPlaySound={onPlaySound} />
            </div>
          </div>

          {/* Kartu Utama Produk Mobile */}
          <div className="bg-surface border border-line rounded-[28px] p-5 sm:p-6 flex flex-col gap-4 shadow-soft">
            {/* Badge Status */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-brand-soft text-brand border border-brand/30">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                Desain custom
              </span>
              <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-page text-ink/75 border border-line">
                Bisa satuan &amp; lusinan
              </span>
            </div>

            {/* Judul & Keterangan Singkat */}
            <div>
              <h2 className="text-xl font-bold text-ink tracking-tight">{productName}</h2>
              <p className="text-[13.5px] text-ink/65 mt-1 leading-relaxed">{categoryData.subtitle}</p>
            </div>

            {/* Harga Mulai Dari */}
            <div className="flex items-baseline gap-2">
              <span className="text-[13px] text-ink/60">Mulai dari</span>
              <strong className="text-2xl font-black text-ink tracking-tight">
                Rp {price.toLocaleString('id-ID')}
              </strong>
            </div>

            {/* Pilihan Warna di Gantungan */}
            <div className="flex flex-col gap-2 pt-2 border-t border-line">
              <span className="text-[13px] font-bold text-ink">Warna di gantungan</span>
              <div className="flex items-center justify-between py-2 px-4 bg-page rounded-full border border-line">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-5 h-5 rounded-full border border-line shadow-inner flex-shrink-0"
                    style={{ backgroundColor: currentItem.hex }}
                  />
                  <span className="text-[13.5px] font-semibold text-ink truncate">{colorName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setColorPickerOpen((prev) => !prev);
                    onPlaySound('click');
                  }}
                  className="px-3.5 py-1 rounded-full bg-surface border border-line text-[12px] font-semibold hover:bg-page press-active flex-shrink-0"
                >
                  {colorPickerOpen ? 'Tutup' : 'Ganti'}
                </button>
              </div>

              {/* Swatches Pilihan Warna Lainnya */}
              {colorPickerOpen && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-surface border border-line rounded-[22px] mt-1">
                  {items.map((it, idx) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => {
                        onSelectIndex(idx);
                        setColorPickerOpen(false);
                        onPlaySound('flip');
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full text-left transition-all ${
                        idx === itemIndex ? 'bg-brand-soft border border-brand/50' : 'hover:bg-page border border-transparent'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-line flex-shrink-0" style={{ backgroundColor: it.hex }} />
                      <span className="text-[12px] font-medium text-ink truncate">{it.colorName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pilihan Ukuran & Kuantitas Multi-Ukuran */}
            <div className="flex flex-col gap-2 pt-2 border-t border-line">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-ink">Ukuran</span>
                <span className="text-[12px] text-brand font-medium">Panduan ukuran</span>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setSizePickerOpen((prev) => !prev);
                    onPlaySound('click');
                  }}
                  className="w-full h-11 px-4 flex items-center justify-between bg-surface border border-line rounded-full text-[13.5px] font-semibold text-ink hover:border-brand transition-colors press-active text-left"
                >
                  <span>+ Pilih ukuran untuk ditambahkan</span>
                  <ChevronDown className={`w-4 h-4 text-ink/50 transition-transform ${sizePickerOpen ? 'rotate-180' : ''}`} />
                </button>

                {sizePickerOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setSizePickerOpen(false)} />
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-surface border border-line rounded-2xl shadow-xl overflow-hidden py-1 divide-y divide-line/30 animate-in fade-in zoom-in-95 duration-100">
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            handleAddSize(sz);
                            setSizePickerOpen(false);
                            onPlaySound('click');
                          }}
                          className="w-full px-4 py-2.5 text-left text-[13.5px] font-semibold text-ink hover:bg-page hover:text-brand transition-colors flex items-center justify-between"
                        >
                          <span>Ukuran {sz}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-1">
                {Object.entries(sizeQtys).map(([sz, qty]) => (
                  <div
                    key={sz}
                    className="flex items-center justify-between py-2 px-4 bg-page rounded-full border border-line"
                  >
                    <span className="text-[13.5px] font-bold text-ink">Ukuran {sz}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(sz, -1)}
                        className="w-7 h-7 rounded-full bg-surface border border-line flex items-center justify-center hover:bg-page press-active text-ink"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[14px] font-bold text-ink min-w-[20px] text-center tabular-nums">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(sz, 1)}
                        className="w-7 h-7 rounded-full bg-surface border border-line flex items-center justify-center hover:bg-page press-active text-ink"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kartu CTA Desain Custom Mobile */}
          <div className="bg-brand-soft border border-brand/25 rounded-card p-5 flex flex-col gap-2.5 shadow-xs">
            <div className="flex items-center gap-2 text-brand font-bold text-[14px]">
              <Sparkles className="w-4 h-4 text-brand shrink-0 animate-pulse" />
              <span>Mau Buat Desain Custom Sendiri?</span>
            </div>
            <p className="text-xs text-ink/75 leading-relaxed">
              Punya ide motif, logo tim esport/futsal, seragam kantor, atau konsep sablon bebas? Tim desainer MIG siap bantu wujudkan mockup & preview gratis!
            </p>
            <a
              href={getWhatsAppUrl(
                `Halo MIG Digital Printing, saya mau konsultasi bikin desain custom untuk ${categoryData.heroTitle || 'Apparel'} (${productName}). Punya motif/konsep sendiri nih!`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="press mt-0.5 w-full min-h-[44px] px-5 rounded-full bg-brand hover:bg-brand-hover text-white text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span>Desain Custom? Chat via WhatsApp</span>
            </a>
          </div>

          {/* Kartu Keterangan Produk Mobile */}
          <div className="bg-surface border border-line rounded-[28px] p-5 sm:p-6 flex flex-col gap-4 shadow-soft">
            <h3 className="text-[15px] font-bold text-ink">Keterangan produk</h3>
            <p className="text-[13.5px] text-ink/75 leading-relaxed">
              Produk apparel custom standar MIG Digital Printing dengan material pilihan yang nyaman dipakai, adem,
              serta menyerap keringat. Bebas cetak desain, logo komunitas, atau nomor punggung sesuai kebutuhan.
            </p>

            <div className="px-5 py-3.5 bg-page rounded-[22px] flex flex-col gap-1 border border-line">
              <span className="text-[11.5px] font-semibold text-ink/50 uppercase tracking-wider">Bahan utama</span>
              <span className="text-[13px] font-bold text-ink">
                {categoryData.id === 'jersey'
                  ? 'Dryfit Milano & Brazil UV Protection'
                  : categoryData.id === 'puffer'
                  ? 'American & Japan Drill Premium'
                  : '100% Cotton Combed 24s & 30s Knitto'}
              </span>
            </div>

            <div className="px-5 py-3.5 bg-page rounded-[22px] flex flex-col gap-1 border border-line">
              <span className="text-[11.5px] font-semibold text-ink/50 uppercase tracking-wider">Kualitas cetak</span>
              <span className="text-[13px] font-bold text-ink">
                {categoryData.id === 'jersey'
                  ? 'Sublimasi Epson Original (warna tajam & anti-luntur)'
                  : categoryData.id === 'puffer'
                  ? 'Bordir Komputer Presisi & Sablon Plastisol'
                  : 'Sablon DTF High-Res & Plastisol Curing'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* B. TAMPILAN KHUSUS DESKTOP (hidden lg:grid) - SCROLL MANDIRI (KIRI & KANAN) */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid grid-cols-[330px_1fr_360px] xl:grid-cols-[360px_1fr_390px] gap-6 xl:gap-8 items-start w-full max-w-[1400px] mx-auto flex-1 h-full min-h-0 px-7 py-3 overflow-hidden">
          
          {/* 1. KOLOM KIRI (TEKS / INFO PRODUK, HARGA, WARNA & SPESIFIKASI) - SCROLL MANDIRI */}
          <div className="h-full overflow-y-auto pr-1.5 pb-6 flex flex-col gap-4 min-h-0">
            {/* Kartu Ringkasan & Harga */}
            <div className="bg-surface border border-line rounded-[28px] p-6 flex flex-col gap-4 shadow-soft">
              {/* Badge Status */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-brand-soft text-brand border border-brand/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  Desain custom
                </span>
                <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-page text-ink/75 border border-line">
                  Bisa satuan &amp; lusinan
                </span>
              </div>

              {/* Judul & Keterangan Singkat */}
              <div>
                <h2 className="text-2xl font-bold text-ink tracking-tight">{productName}</h2>
                <p className="text-[13.5px] text-ink/65 mt-1 leading-relaxed">{categoryData.subtitle}</p>
              </div>

              {/* Harga Mulai Dari */}
              <div className="flex items-baseline gap-2 pt-1 border-t border-line">
                <span className="text-[13px] text-ink/60">Mulai dari</span>
                <strong className="text-3xl font-black text-ink tracking-tight">
                  Rp {price.toLocaleString('id-ID')}
                </strong>
              </div>

              {/* Pilihan Warna di Gantungan */}
              <div className="flex flex-col gap-2 pt-2 border-t border-line">
                <span className="text-[13px] font-bold text-ink">Warna di gantungan</span>
                <div className="flex items-center justify-between py-2 px-4 bg-page rounded-full border border-line">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-5 h-5 rounded-full border border-line shadow-inner flex-shrink-0"
                      style={{ backgroundColor: currentItem.hex }}
                    />
                    <span className="text-[13.5px] font-semibold text-ink truncate">{colorName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setColorPickerOpen((prev) => !prev);
                      onPlaySound('click');
                    }}
                    className="px-3.5 py-1 rounded-full bg-surface border border-line text-[12px] font-semibold hover:bg-page press-active flex-shrink-0"
                  >
                    {colorPickerOpen ? 'Tutup' : 'Ganti'}
                  </button>
                </div>

                {/* Swatches Pilihan Warna Lainnya */}
                {colorPickerOpen && (
                  <div className="grid grid-cols-2 gap-2 p-3 bg-surface border border-line rounded-[22px] mt-1">
                    {items.map((it, idx) => (
                      <button
                        key={it.id}
                        type="button"
                        onClick={() => {
                          onSelectIndex(idx);
                          setColorPickerOpen(false);
                          onPlaySound('flip');
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full text-left transition-all ${
                          idx === itemIndex ? 'bg-brand-soft border border-brand/50' : 'hover:bg-page border border-transparent'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full border border-line flex-shrink-0" style={{ backgroundColor: it.hex }} />
                        <span className="text-[12px] font-medium text-ink truncate">{it.colorName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Kartu CTA Desain Custom Desktop (Kolom Kiri) */}
            <div className="bg-brand-soft border border-brand/25 rounded-card p-5 flex flex-col gap-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-brand font-bold text-sm">
                <Sparkles className="w-4 h-4 text-brand shrink-0 animate-pulse" />
                <span>Mau Buat Desain Custom Sendiri?</span>
              </div>
              <p className="text-xs text-ink/75 leading-relaxed">
                Punya konsep motif, logo tim esport/futsal, seragam komunitas, atau desain sablon bebas? Tim desainer MIG siap buatkan preview gratis!
              </p>
              <a
                href={getWhatsAppUrl(
                  `Halo MIG Digital Printing, saya mau konsultasi bikin desain custom untuk ${categoryData.heroTitle || 'Apparel'} (${productName}). Punya motif/konsep sendiri nih!`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="press mt-0.5 w-full min-h-[44px] px-5 rounded-full bg-brand hover:bg-brand-hover text-white text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>Desain Custom? Chat via WhatsApp</span>
              </a>
            </div>

            {/* Kartu Keterangan Produk & Spesifikasi */}
            <div className="bg-surface border border-line rounded-[28px] p-6 flex flex-col gap-4 shadow-soft">
              <h3 className="text-[15px] font-bold text-ink">Keterangan produk</h3>
              <p className="text-[13px] text-ink/75 leading-relaxed">
                Produk apparel custom standar MIG Digital Printing dengan material pilihan yang nyaman dipakai, adem,
                serta menyerap keringat. Bebas cetak desain, logo komunitas, atau nomor punggung sesuai kebutuhan.
              </p>

              <div className="px-5 py-3.5 bg-page rounded-[22px] flex flex-col gap-1 border border-line">
                <span className="text-[11px] font-semibold text-ink/50 uppercase tracking-wider">Bahan utama</span>
                <span className="text-[13px] font-bold text-ink">
                  {categoryData.id === 'jersey'
                    ? 'Dryfit Milano & Brazil UV Protection'
                    : categoryData.id === 'puffer'
                    ? 'American & Japan Drill Premium'
                    : '100% Cotton Combed 24s & 30s Knitto'}
                </span>
              </div>

              <div className="px-5 py-3.5 bg-page rounded-[22px] flex flex-col gap-1 border border-line">
                <span className="text-[11px] font-semibold text-ink/50 uppercase tracking-wider">Kualitas cetak</span>
                <span className="text-[13px] font-bold text-ink">
                  {categoryData.id === 'jersey'
                    ? 'Sublimasi Epson Original (warna tajam & anti-luntur)'
                    : categoryData.id === 'puffer'
                    ? 'Bordir Komputer Presisi & Sablon Plastisol'
                    : 'Sablon DTF High-Res & Plastisol Curing'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. KOLOM TENGAH: PRODUK DITENGAH (TETAP DIAM DI TENGAH, TIDAK IKUT TER-SCROLL) */}
          <div className="h-full flex flex-col items-center justify-center select-none py-1 min-h-0">
            <div className="relative w-full flex justify-center">
              <GarmentRotator
                item={currentItem}
                categoryId={categoryData.id}
                viewAngle={viewAngle}
                onAngleChange={setViewAngle}
                custom={custom}
                onPlaySound={onPlaySound}
              />
            </div>

            {/* Tab Sudut Tampilan [Samping] [Depan] [Belakang] */}
            <div className="w-full flex justify-center mt-3">
              <AngleTabs currentAngle={viewAngle} onSelectAngle={setViewAngle} onPlaySound={onPlaySound} />
            </div>

            {/* Keterangan Putar 3D */}
            <span className="text-[11.5px] text-ink/45 mt-2.5 font-medium">
              Geser ke kiri/kanan atau ketuk untuk memutar baju (360°)
            </span>
          </div>

          {/* 3. KOLOM KANAN: TEKS PILIHAN UKURAN, TAMBAHAN & ORDER (DIAM / SCROLL SENDIRI JIKA BANYAK) */}
          <div className="h-full overflow-y-auto pl-1 pr-0.5 pb-6 flex flex-col gap-4 min-h-0">
            <div className="bg-surface border border-line rounded-[28px] p-6 flex flex-col gap-4 shadow-soft">
              {/* Pilihan Ukuran & Kuantitas Multi-Ukuran */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-bold text-ink">Pilihan Ukuran</span>
                  <span className="text-[12px] text-brand font-medium">Panduan ukuran</span>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setSizePickerOpen((prev) => !prev);
                      onPlaySound('click');
                    }}
                    className="w-full h-11 px-4 flex items-center justify-between bg-surface border border-line rounded-full text-[13.5px] font-semibold text-ink hover:border-brand transition-colors press-active text-left"
                  >
                    <span>+ Pilih ukuran untuk ditambahkan</span>
                    <ChevronDown className={`w-4 h-4 text-ink/50 transition-transform ${sizePickerOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {sizePickerOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setSizePickerOpen(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-surface border border-line rounded-2xl shadow-xl overflow-hidden py-1 divide-y divide-line/30 animate-in fade-in zoom-in-95 duration-100">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => {
                              handleAddSize(sz);
                              setSizePickerOpen(false);
                              onPlaySound('click');
                            }}
                            className="w-full px-4 py-2.5 text-left text-[13.5px] font-semibold text-ink hover:bg-page hover:text-brand transition-colors flex items-center justify-between"
                          >
                            <span>Ukuran {sz}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Deretan Baris Ukuran & Kontrol Qty (+ / -) */}
                <div className="flex flex-col gap-2 mt-1">
                  {Object.entries(sizeQtys).map(([sz, qty]) => (
                    <div
                      key={sz}
                      className="flex items-center justify-between py-2 px-4 bg-page rounded-full border border-line"
                    >
                      <span className="text-[13.5px] font-bold text-ink">Ukuran {sz}</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(sz, -1)}
                          className="w-7 h-7 rounded-full bg-surface border border-line flex items-center justify-center hover:bg-page press-active text-ink"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[14px] font-bold text-ink min-w-[20px] text-center tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(sz, 1)}
                          className="w-7 h-7 rounded-full bg-surface border border-line flex items-center justify-center hover:bg-page press-active text-ink"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Ringkas Desain Custom di Kolom Pemesanan */}
              <a
                href={getWhatsAppUrl(
                  `Halo MIG Digital Printing, saya mau konsultasi bikin desain custom untuk ${categoryData.heroTitle || 'Apparel'} (${productName}). Punya motif/konsep sendiri nih!`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="press w-full min-h-[44px] px-4 py-2.5 rounded-full bg-surface hover:bg-page border border-line hover:border-brand/40 text-ink text-xs sm:text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-3.5 h-3.5 text-brand" />
                </div>
                <span>Desain Custom? Chat via WhatsApp</span>
              </a>

              {/* Bagian Order Card Desktop */}
              <div className="pt-3 border-t border-line">
                <OrderBottomBar
                  totalQty={totalQty}
                  totalPrice={calculatedTotal}
                  onOrderViaWhatsApp={handleWhatsAppClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FLOATING ORDER BAR DI HP (Menempel tetap di bawah layar HP) */}
      <div className="md:hidden">
        <OrderBottomBar
          totalQty={totalQty}
          totalPrice={calculatedTotal}
          onOrderViaWhatsApp={handleWhatsAppClick}
          isMobileFloating={true}
        />
      </div>
    </section>
  );
}
