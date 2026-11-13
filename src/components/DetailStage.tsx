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
  const [sizePickerOpen, setSizePickerOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
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

  // Efek Produk Terbang ke Keranjang (Gaya Kasir MIG Digital Printing / Shopee Curve)
  const triggerFlyToCart = (photoUrl?: string | null, fallbackColor?: string) => {
    if (typeof window === 'undefined') return;
    const target =
      document.querySelector<HTMLElement>('#detail-cart-btn') ||
      document.querySelector<HTMLElement>('[data-cart-btn]');
    if (!target) return;

    const denyut = () => {
      target.classList.add('cart-pop-anim');
      setTimeout(() => target.classList.remove('cart-pop-anim'), 400);
    };

    if (
      !window.matchMedia ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof Element.prototype.animate !== 'function'
    ) {
      denyut();
      return;
    }

    const tujuan = target.getBoundingClientRect();
    const x1 = tujuan.left + tujuan.width / 2;
    const y1 = tujuan.top + tujuan.height / 2;

    const sisi = 64;
    const x0 = x1;
    const y0 = y1 + 75;

    const foto = document.createElement('div');
    foto.className = 'foto-terbang';
    foto.style.width = `${sisi}px`;
    foto.style.height = `${sisi}px`;
    foto.style.left = `${x0 - sisi / 2}px`;
    foto.style.top = `${y0 - sisi / 2}px`;

    if (photoUrl) {
      foto.style.backgroundImage = `url('${photoUrl}')`;
    } else if (fallbackColor) {
      foto.style.backgroundColor = fallbackColor;
    }
    document.body.appendChild(foto);

    const xc = x0 + 16;
    const yc = y1 - 20;
    const langkah = 20;
    const frames: Keyframe[] = [];
    for (let i = 0; i <= langkah; i++) {
      const t = i / langkah,
        u = 1 - t;
      const x = u * u * x0 + 2 * u * t * xc + t * t * x1;
      const y = u * u * y0 + 2 * u * t * yc + t * t * y1;
      frames.push({
        offset: t,
        transform: `translate(${(x - x0).toFixed(1)}px, ${(y - y0).toFixed(1)}px) scale(${(1 - 0.85 * t).toFixed(2)})`,
        opacity: t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2,
      });
    }

    const anim = foto.animate(frames, {
      duration: 620,
      easing: 'cubic-bezier(.45,0,.55,1)',
      fill: 'forwards',
    });
    anim.onfinish = () => {
      foto.remove();
      denyut();
    };
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

    // Jalankan efek produk melayang ke keranjang (tanpa membuka keranjang langsung)
    const photoUrl = custom?.frontDataUrl || currentItem.front || null;
    triggerFlyToCart(photoUrl, currentItem.hex);

    // Tampilkan notifikasi toast sukses ditambahkan
    setToastVisible(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 1300);
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
      <header className="flex-shrink-0 w-full h-[72px] md:h-[76px] bg-surface border-b border-line flex items-center z-50 px-4 md:px-7">
        <div className="w-full max-w-[1340px] mx-auto flex items-center justify-between gap-3">
          {/* Tombol Kembali ke Rak (Sama persis dengan tombol Back di Keranjang) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-surface border border-line shadow-xs flex items-center justify-center hover:bg-page text-ink transition-colors press-active"
              aria-label="Kembali ke rak"
              title="Kembali ke rak"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="hidden md:inline-block text-[14px] font-bold text-ink/80 hover:text-ink transition-colors cursor-pointer"
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
              <span className="px-3.5 py-1.5 rounded-full text-[13px] font-bold bg-[#eceaf2] text-ink/80 tabular-nums">
                {counterText}
              </span>
            )}
          </div>

          {/* Tombol Keranjang */}
          <button
            type="button"
            id="detail-cart-btn"
            data-cart-btn
            onClick={onOpenCart}
            className="relative flex items-center justify-center w-11 h-11 md:w-auto md:h-11 md:px-4 md:gap-2.5 rounded-full bg-surface text-ink border border-line shadow-xs hover:bg-page transition-colors press-active"
            aria-label={`Keranjang belanja (${cartCount} barang)`}
          >
            <ShoppingCart className="w-5 h-5 text-ink" />
            <span className="hidden md:inline text-[13.5px] font-bold">Keranjang</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 md:static md:top-auto md:right-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-brand text-surface shadow-xs">
                {cartCount}
              </span>
            )}
            {cartCount === 0 && (
              <span className="hidden md:inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-line text-ink/60">
                0
              </span>
            )}
          </button>
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

            {/* Tambahan Opsional */}
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

              {/* Tambahan Opsional */}
              <div className="flex flex-col gap-2 pt-2 border-t border-line">
                <span className="text-[13px] font-bold text-ink">Tambahan (opsional)</span>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddons((prev) => ({ ...prev, sablon: !prev.sablon }));
                      onPlaySound('click');
                    }}
                    className={`w-full min-h-[44px] px-4 py-2.5 rounded-full border text-[13px] font-semibold text-left transition-all press-active ${
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
                    className={`w-full min-h-[44px] px-4 py-2.5 rounded-full border text-[13px] font-semibold text-left transition-all press-active ${
                      addons.giftbox
                        ? 'bg-brand text-surface border-brand shadow-sm'
                        : 'bg-surface text-ink border-line hover:border-ink/30'
                    }`}
                  >
                    + Kemasan kotak kado (+10rb)
                  </button>
                </div>
              </div>

              {/* Bagian Order Card Desktop */}
              <div className="pt-3 border-t border-line">
                <OrderBottomBar
                  totalQty={totalQty}
                  totalPrice={calculatedTotal}
                  onAddToCart={handleAddCartClick}
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
          onAddToCart={handleAddCartClick}
          onOrderViaWhatsApp={handleWhatsAppClick}
          isMobileFloating={true}
        />
      </div>



      {/* 5. TOAST NOTIFIKASI BERHASIL DITAMBAHKAN (Gaya Kasir MIG) */}
      <div
        className={`toast-keranjang flex flex-col items-center gap-1.5 ${
          toastVisible ? 'tampil' : ''
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="w-8 h-8 rounded-full border-2 border-white/90 flex items-center justify-center text-white mb-0.5">
          <Check className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="text-[13.5px] font-bold text-white tracking-tight">
          Berhasil ditambahkan ke keranjang
        </div>
        <div className="text-[11.5px] text-white/75 truncate max-w-[260px]">
          {productName} ({colorName}) · {totalQty} pcs
        </div>
      </div>
    </section>
  );
}
