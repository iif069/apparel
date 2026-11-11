'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Plus, Minus, ChevronDown, Check } from 'lucide-react';
import { GarmentItem, CategoryData, ViewAngle, CustomPhotoData } from '@/types';
import { GarmentRotator } from './GarmentRotator';
import { AngleTabs } from './AngleTabs';
import { OrderBottomBar } from './OrderBottomBar';

interface DetailStageProps {
  isOpen: boolean;
  onClose: () => void;
  categoryData: CategoryData;
  itemIndex: number;
  onSelectIndex: (index: number) => void;
  customPhotos: Record<string, CustomPhotoData>;
  cartCount: number;
  onOpenCart: () => void;
  onAddToCart: (order: {
    item: GarmentItem;
    categoryId: CategoryData['id'];
    sizes: Record<string, number>;
    addons: { sablon: boolean; giftbox: boolean };
    totalPrice: number;
  }) => void;
  onOrderViaWhatsApp: (order: {
    item: GarmentItem;
    categoryId: CategoryData['id'];
    sizes: Record<string, number>;
    addons: { sablon: boolean; giftbox: boolean };
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
  cartCount,
  onOpenCart,
  onAddToCart,
  onOrderViaWhatsApp,
  onPlaySound,
}: DetailStageProps) {
  const [viewAngle, setViewAngle] = useState<ViewAngle>('front');
  const [sizeQtys, setSizeQtys] = useState<Record<string, number>>({ M: 1 });
  const [addons, setAddons] = useState<{ sablon: boolean; giftbox: boolean }>({
    sablon: false,
    giftbox: false,
  });
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
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
  }, [itemIndex, isOpen]);

  // Pantau scroll di HP untuk mengganti badge nomor jadi judul
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    setIsScrolled(top > 45);
  };

  if (!isOpen || !currentItem) return null;

  // Hitung total kuantitas & harga
  const totalQty = Object.values(sizeQtys).reduce((acc, q) => acc + q, 0);
  const addonCost = (addons.sablon ? 15000 : 0) + (addons.giftbox ? 10000 : 0);
  const calculatedTotal = (price + addonCost) * Math.max(1, totalQty);

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

  const handleAddCartClick = () => {
    onPlaySound('click');
    onAddToCart({
      item: currentItem,
      categoryId: categoryData.id,
      sizes: sizeQtys,
      addons,
      totalPrice: calculatedTotal,
    });
  };

  const handleWhatsAppClick = () => {
    onPlaySound('click');
    onOrderViaWhatsApp({
      item: currentItem,
      categoryId: categoryData.id,
      sizes: sizeQtys,
      addons,
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
      <header className="flex-shrink-0 w-full h-[62px] md:h-[68px] bg-surface border-b border-line flex items-center z-50 px-4 md:px-7">
        <div className="w-full max-w-[1340px] mx-auto flex items-center justify-between gap-3">
          {/* Tombol Kembali ke Rak */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-surface text-ink border border-line hover:bg-page transition-colors press-active"
          >
            <ArrowLeft className="w-4 h-4 text-ink" />
            <span className="hidden sm:inline text-[13px] font-semibold">Kembali ke rak</span>
          </button>

          {/* Tengah: Nomor Indeks (04/07) atau Judul saat di-scroll */}
          <div className="flex items-center justify-center min-w-0">
            {isScrolled ? (
              <span className="text-[15px] md:text-[16px] font-bold text-ink truncate max-w-[200px] md:max-w-[400px]">
                {productName}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-[12px] font-bold bg-[#eceaf2] text-ink/80 tabular-nums">
                {counterText}
              </span>
            )}
          </div>

          {/* Tombol Keranjang */}
          <button
            type="button"
            onClick={onOpenCart}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-surface text-ink border border-line hover:bg-page transition-colors press-active"
          >
            <ShoppingCart className="w-4 h-4 text-ink" />
            <span className="hidden sm:inline text-[13px] font-semibold">Keranjang</span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-brand text-surface">
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      {/* 2. AREA TENGAH BERGULIR */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="relative flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar"
      >
        <div className="w-full max-w-[1320px] mx-auto px-4 md:px-7 pt-0 md:pt-6 pb-36 md:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-[460px_1fr] gap-4 md:gap-9 items-start">
            
            {/* KOLOM KIRI: Panggung Baju 3D (TETAP MENEMPEL / STICKY DI HP & DESKTOP DENGAN PADDING ELEGAN) */}
            <div className="sticky top-0 z-30 bg-page self-stretch md:self-start w-auto -mx-4 md:mx-0 px-4 md:px-0 pt-3 md:pt-6 pb-4 border-b md:border-b-0 border-line shadow-sm md:shadow-none flex flex-col items-center">
              {/* Batang Gantungan Chrome Halus */}
              <div className="w-full max-w-[360px] h-[6px] md:h-[7px] bg-gradient-to-b from-[#d6d4de] via-white via-28% to-[#1c1b1a] relative z-10 rounded-full pointer-events-none mb-1 opacity-80">
                <div className="w-full h-[1.5px] bg-white/85" />
              </div>

              {/* Rotator Baju 3D (Posisi proporsional & nyaman di tengah panggung) */}
              <div className="w-full flex justify-center pt-1 md:pt-2">
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
                <AngleTabs currentAngle={viewAngle} onSelectAngle={setViewAngle} />
              </div>
            </div>

            {/* KOLOM KANAN: Informasi Produk, Warna, Ukuran, Tambahan & Order */}
            <div className="flex flex-col gap-4 md:gap-5 pt-2 md:pt-0">
              {/* Kartu Utama Produk */}
              <div className="bg-surface border border-line rounded-3xl p-5 md:p-7 flex flex-col gap-5 shadow-soft">
                {/* Badge Status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Stok tersedia
                  </span>
                  <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-brand-soft text-brand border border-brand/30">
                    Bisa satuan &amp; lusinan
                  </span>
                </div>

                {/* Judul & Keterangan Singkat */}
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-ink tracking-tight">{productName}</h2>
                  <p className="text-[13.5px] text-ink/65 mt-1 leading-relaxed">{categoryData.subtitle}</p>
                </div>

                {/* Harga Mulai Dari */}
                <div className="flex items-baseline gap-2">
                  <span className="text-[13px] text-ink/60">Mulai dari</span>
                  <strong className="text-2xl md:text-3xl font-black text-ink tracking-tight">
                    Rp {price.toLocaleString('id-ID')}
                  </strong>
                </div>

                {/* Pilihan Warna di Gantungan */}
                <div className="flex flex-col gap-2 pt-2 border-t border-line">
                  <span className="text-[13px] font-bold text-ink">Warna di gantungan</span>
                  <div className="flex items-center justify-between p-2.5 bg-page rounded-2xl border border-line">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-5 h-5 rounded-full border border-line shadow-inner"
                        style={{ backgroundColor: currentItem.hex }}
                      />
                      <span className="text-[13.5px] font-semibold text-ink">{colorName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setColorPickerOpen((prev) => !prev)}
                      className="px-3 py-1 rounded-full bg-surface border border-line text-[12px] font-semibold hover:bg-page press-active"
                    >
                      {colorPickerOpen ? 'Tutup' : 'Ganti'}
                    </button>
                  </div>

                  {/* Swatches Pilihan Warna Lainnya */}
                  {colorPickerOpen && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-surface border border-line rounded-2xl mt-1">
                      {items.map((it, idx) => (
                        <button
                          key={it.id}
                          type="button"
                          onClick={() => {
                            onSelectIndex(idx);
                            setColorPickerOpen(false);
                            onPlaySound('slide');
                          }}
                          className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                            idx === itemIndex ? 'bg-brand-soft border border-brand/50' : 'hover:bg-page'
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

                  {/* Dropdown Tambah Ukuran (Pill rounded-full sesuai Desain Sistem) */}
                  <div className="relative">
                    <select
                      value=""
                      onChange={(e) => handleAddSize(e.target.value)}
                      className="w-full h-11 px-4 pr-9 bg-surface border border-line rounded-full text-[13.5px] font-semibold text-ink appearance-none focus:outline-none focus:border-brand cursor-pointer"
                    >
                      <option value="">+ Pilih ukuran untuk ditambahkan</option>
                      {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                        <option key={sz} value={sz}>
                          Ukuran {sz}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-ink/50 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
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

                {/* Tambahan Opsional (Pill rounded-full sesuai Desain Sistem) */}
                <div className="flex flex-col gap-2 pt-2 border-t border-line">
                  <span className="text-[13px] font-bold text-ink">Tambahan (opsional)</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAddons((prev) => ({ ...prev, sablon: !prev.sablon }));
                        onPlaySound('click');
                      }}
                      className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-full border text-[13px] font-semibold text-center sm:text-left transition-all press-active ${
                        addons.sablon
                          ? 'bg-brand text-surface border-brand shadow-sm'
                          : 'bg-surface text-ink border-line hover:border-ink/30'
                      }`}
                    >
                      + Cetak logo / nama dada (+15rb)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddons((prev) => ({ ...prev, giftbox: !prev.giftbox }));
                        onPlaySound('click');
                      }}
                      className={`flex-1 min-h-[44px] px-4 py-2.5 rounded-full border text-[13px] font-semibold text-center sm:text-left transition-all press-active ${
                        addons.giftbox
                          ? 'bg-brand text-surface border-brand shadow-sm'
                          : 'bg-surface text-ink border-line hover:border-ink/30'
                      }`}
                    >
                      + Kemasan kotak kado (+10rb)
                    </button>
                  </div>
                </div>

                {/* Bagian Order Card Desktop (Tampil di dalam kartu pada Desktop) */}
                <div className="hidden md:block pt-3 border-t border-line">
                  <OrderBottomBar
                    totalQty={totalQty}
                    totalPrice={calculatedTotal}
                    onAddToCart={handleAddCartClick}
                    onOrderViaWhatsApp={handleWhatsAppClick}
                  />
                </div>
              </div>

              {/* Kartu Keterangan Produk */}
              <div className="bg-surface border border-line rounded-3xl p-5 md:p-7 flex flex-col gap-4 shadow-soft">
                <h3 className="text-[15px] font-bold text-ink">Keterangan produk</h3>
                <p className="text-[13.5px] text-ink/75 leading-relaxed">
                  Produk apparel custom standar MIG Digital Printing dengan material pilihan yang nyaman dipakai, adem,
                  serta menyerap keringat. Bebas cetak desain, logo komunitas, atau nomor punggung sesuai kebutuhan.
                </p>

                <div className="p-3.5 bg-page rounded-2xl flex flex-col gap-1 border border-line">
                  <span className="text-[11.5px] font-semibold text-ink/50 uppercase tracking-wider">Bahan utama</span>
                  <span className="text-[13px] font-bold text-ink">
                    {categoryData.id === 'jersey'
                      ? 'Dryfit Milano & Brazil UV Protection'
                      : categoryData.id === 'puffer'
                      ? 'American & Japan Drill Premium'
                      : '100% Cotton Combed 24s & 30s Knitto'}
                  </span>
                </div>

                <div className="p-3.5 bg-page rounded-2xl flex flex-col gap-1 border border-line">
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

          </div>
        </div>
      </div>

      {/* 3. FLOATING ORDER BAR DI HP (Menempel tetap di bawah layar HP) */}
      <div className="md:hidden">
        <OrderBottomBar
          totalQty={totalQty}
          totalPrice={calculatedTotal}
          onAddToCart={handleAddCartClick}
          onOrderViaWhatsApp={handleWhatsAppClick}
          isMobileFloating={true}
        />
      </div>
    </section>
  );
}
