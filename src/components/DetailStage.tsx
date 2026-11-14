'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Check, Users, Sparkles, ShieldCheck, Package } from 'lucide-react';
import { GarmentItem, CategoryData, ViewAngle, CustomPhotoData } from '@/types';
import { CATEGORY_DETAILS } from '@/data/categoryDetails';
import { getWhatsAppUrl } from '@/config/store';
import { GarmentRotator } from './GarmentRotator';
import { AngleTabs } from './AngleTabs';
import { OrderBottomBar } from './OrderBottomBar';

// SVG Resmi WhatsApp seragam (monokrom mengikuti currentColor)
const WhatsAppIcon = ({ className = 'w-4 h-4 flex-shrink-0' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef(0);

  const items = categoryData.rack;
  const currentItem = items[itemIndex] || items[0];
  const custom = customPhotos[currentItem?.id];
  const productName = custom?.name || currentItem?.name;
  const colorName = custom?.colorName || currentItem?.colorName;
  const detailCopy = CATEGORY_DETAILS[categoryData.id] || CATEGORY_DETAILS.kaos;

  // Transisi halus saat membuka & menutup halaman detail
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset scroll saat item berganti
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
    lastScrollTopRef.current = 0;
    setIsScrolled(false);
    setIsHeaderHidden(false);
    setViewAngle('front');
    setColorPickerOpen(false);
  }, [itemIndex, isOpen]);

  // Pantau scroll di HP: sembunyikan navbar saat scroll ke bawah, munculkan lagi saat geser ke atas
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const top = Math.max(0, e.currentTarget.scrollTop);
    const delta = top - lastScrollTopRef.current;

    setIsScrolled(top > 45);

    if (top <= 16) {
      setIsHeaderHidden(false);
    } else if (delta > 6 && top > 64) {
      setIsHeaderHidden(true);
    } else if (delta < -3) {
      setIsHeaderHidden(false);
    }

    lastScrollTopRef.current = top;
  };

  if (!shouldRender || !currentItem) return null;

  const handleWhatsAppClick = () => {
    onPlaySound('click');
    onOrderViaWhatsApp({
      item: currentItem,
      categoryId: categoryData.id,
    });
  };

  const counterText = `${String(itemIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;

  // Kartu Identitas Model & Pilihan Warna di Gantungan (tanpa harga & tanpa ukuran)
  const renderIdentityCard = (titleClass: string, swatchColsClass: string) => (
    <div className="bg-surface border border-line rounded-[28px] p-5 sm:p-6 flex flex-col gap-4 shadow-soft">
      {/* Badge Status */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-brand-soft text-brand border border-brand/30">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          Desain custom
        </span>
        <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-page text-ink/75 border border-line">
          Satuan &amp; partai besar
        </span>
      </div>

      {/* Judul & Keterangan Singkat */}
      <div>
        <h2 className={`${titleClass} font-bold text-ink tracking-tight`}>{productName}</h2>
        <p className="text-[14px] text-muted mt-1.5 leading-relaxed">{categoryData.subtitle}</p>
      </div>

      {/* Pilihan Warna / Model di Gantungan */}
      <div className="flex flex-col gap-2 pt-3 border-t border-line">
        <span className="text-[13.5px] font-semibold text-ink">Warna di gantungan</span>
        <div className="flex items-center justify-between py-2 px-4 bg-page rounded-full border border-line">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-5 h-5 rounded-full border border-line shadow-inner flex-shrink-0"
              style={{ backgroundColor: currentItem.hex }}
            />
            <span className="text-[14px] font-medium text-ink truncate">{colorName}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setColorPickerOpen((prev) => !prev);
              onPlaySound('click');
            }}
            className="min-h-[32px] px-3.5 py-1 rounded-full bg-surface border border-line text-[12.5px] font-semibold hover:bg-page press-active flex-shrink-0 cursor-pointer"
          >
            {colorPickerOpen ? 'Tutup' : 'Ganti'}
          </button>
        </div>

        {/* Swatches Pilihan Warna Lainnya */}
        {colorPickerOpen && (
          <div className={`grid ${swatchColsClass} gap-2 p-3 bg-surface border border-line rounded-[22px] mt-1`}>
            {items.map((it, idx) => (
              <button
                key={it.id}
                type="button"
                onClick={() => {
                  onSelectIndex(idx);
                  setColorPickerOpen(false);
                  onPlaySound('flip');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-left transition-all cursor-pointer ${
                  idx === itemIndex ? 'bg-brand-soft border border-brand/50' : 'hover:bg-page border border-transparent'
                }`}
              >
                <span className="w-4 h-4 rounded-full border border-line flex-shrink-0" style={{ backgroundColor: it.hex }} />
                <span className="text-[12.5px] font-medium text-ink truncate">{it.colorName}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Kartu "Cocok Untuk Siapa Aja?" (khusus kategori aktif)
  const renderAudienceCard = () => (
    <div className="bg-surface border border-line rounded-[28px] p-5 sm:p-6 flex flex-col gap-3.5 shadow-soft">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
          <Users className="w-4 h-4" />
        </div>
        <h3 className="text-[16px] font-bold text-ink tracking-tight">{detailCopy.audienceHeading}</h3>
      </div>
      <p className="text-[13.5px] text-muted leading-relaxed">{detailCopy.audienceIntro}</p>

      <div className="flex flex-col gap-2.5">
        {detailCopy.audiences.map((aud) => (
          <div
            key={aud.title}
            className="px-4 py-3 bg-page rounded-2xl border border-line flex flex-col gap-1"
          >
            <span className="text-[14px] font-semibold text-ink">{aud.title}</span>
            <p className="text-[13px] text-muted leading-relaxed">{aud.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Kartu "Kenapa Cocok & Layak Dipilih" + Spesifikasi Bahan
  const renderReasonsCard = () => (
    <div className="bg-surface border border-line rounded-[28px] p-5 sm:p-6 flex flex-col gap-4 shadow-soft">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <h3 className="text-[16px] font-bold text-ink tracking-tight">{detailCopy.reasonsHeading}</h3>
      </div>

      <div className="flex flex-col gap-3.5">
        {detailCopy.reasons.map((reason) => (
          <div key={reason.title} className="flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 stroke-[2.5]" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-[14px] font-semibold text-ink">{reason.title}</span>
              <p className="text-[13px] text-muted leading-relaxed">{reason.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2.5 pt-3 border-t border-line">
        <div className="px-4 py-3 bg-page rounded-2xl flex flex-col gap-0.5 border border-line">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Bahan utama</span>
          <span className="text-[13.5px] font-semibold text-ink">{detailCopy.materialLabel}</span>
        </div>

        <div className="px-4 py-3 bg-page rounded-2xl flex flex-col gap-0.5 border border-line">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Kualitas produksi</span>
          <span className="text-[13.5px] font-semibold text-ink">{detailCopy.printLabel}</span>
        </div>
      </div>
    </div>
  );

  // Kartu Jaminan Vendor Terbaik & Pemesanan Satuan / Partai Besar
  const renderVendorTrustCard = (includeDesktopCta: boolean) => (
    <div className="bg-surface border border-line rounded-[28px] p-5 sm:p-6 flex flex-col gap-4 shadow-soft">
      <div className="flex flex-col gap-3.5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-ink">Jaminan Kualitas Vendor Terbaik</span>
            <p className="text-[13px] text-muted leading-relaxed">
              Kami bekerja sama dengan vendor bahan dan konveksi terbaik untuk memastikan kualitas tetap terjaga sampai di tangan pelanggan.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3.5 border-t border-line">
          <div className="w-8 h-8 rounded-full bg-page text-ink border border-line flex items-center justify-center shrink-0 mt-0.5">
            <Package className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-semibold text-ink">Bisa Beli Satuan atau Partai Besar</span>
            <p className="text-[13px] text-muted leading-relaxed">
              Pesan 1 pcs untuk kebutuhan pribadi atau puluhan hingga ratusan pcs untuk kelas, komunitas, dan instansi—semua tetap kami layani dengan rapi.
            </p>
          </div>
        </div>
      </div>

      {includeDesktopCta && (
        <OrderBottomBar
          onOrderViaWhatsApp={handleWhatsAppClick}
          helperText="Gratis preview mockup sebelum produksi"
        />
      )}
    </div>
  );

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-hidden={!isVisible}
      aria-label="Detail pakaian"
      className={`fixed inset-0 z-50 bg-page flex flex-col w-full h-[100dvh] overflow-hidden transition-opacity duration-250 ease-out motion-reduce:transition-none ${
        isVisible
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* 1. HEADER DETAIL TETAP DI ATAS (Liquid glass melayang di mobile & auto-hide saat scroll turun) */}
      <div
        aria-hidden="true"
        className={`lg:hidden pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-page/60 via-page/25 to-transparent backdrop-blur-lg [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)] z-40 transition-opacity duration-300 ${
          !isHeaderHidden && isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <header
        className={`absolute top-3 left-3 right-3 h-[58px] rounded-full px-2 liquid-glass lg:static lg:inset-auto lg:w-full lg:h-[72px] lg:rounded-none lg:px-7 lg:glass lg:border-0 lg:border-b lg:border-line/60 lg:shadow-none flex-shrink-0 flex items-center z-50 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isHeaderHidden ? '-translate-y-[calc(100%+18px)] lg:translate-y-0' : 'translate-y-0'
        }`}
      >
        <div className="w-full max-w-[1340px] mx-auto flex items-center justify-between gap-3">
          {/* Tombol Kembali ke Rak */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="press w-11 h-11 rounded-full bg-white/45 lg:bg-surface border border-white/70 lg:border-line lg:shadow-xs flex items-center justify-center hover:bg-white/75 lg:hover:bg-surface text-ink transition-colors cursor-pointer"
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
              <span className="text-[15px] md:text-[17px] font-bold text-ink truncate max-w-[160px] sm:max-w-[280px] md:max-w-[420px]">
                {productName}
              </span>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/45 lg:bg-page text-ink/85 border border-white/65 lg:border-line tabular-nums">
                {counterText}
              </span>
            )}
          </div>

          {/* Tombol Chat WhatsApp CS */}
          <a
            href={getWhatsAppUrl(`Halo MIG Digital Printing, saya mau tanya dan konsultasi ${categoryData.tabLabel} (${productName})`)}
            target="_blank"
            rel="noopener noreferrer"
            className="press flex items-center justify-center gap-2 h-11 px-4 rounded-full bg-white/45 lg:bg-surface text-ink border border-white/70 lg:border-line hover:bg-white/75 lg:hover:border-brand/40 lg:shadow-xs transition-colors cursor-pointer shrink-0 whitespace-nowrap"
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
        {/* A. TAMPILAN KHUSUS HP / TABLET (lg:hidden)                               */}
        {/* ========================================================================= */}
        <div className="lg:hidden w-full max-w-[720px] mx-auto px-4 md:px-7 pt-[78px] md:pt-[86px] pb-[136px] flex flex-col gap-4">
          {/* Panggung Baju 3D Mobile */}
          <div className="relative z-10 bg-page w-full px-0 pt-1 pb-2 flex flex-col items-center">
            <div
              className={`relative w-full flex justify-center transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.86] translate-y-3'
              }`}
            >
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
            <div
              className={`w-full flex justify-center mt-2.5 transition-all duration-300 ease-out motion-reduce:transition-none ${
                isVisible ? 'opacity-100 translate-y-0 delay-[140ms]' : 'opacity-0 translate-y-3 delay-0'
              }`}
            >
              <AngleTabs currentAngle={viewAngle} onSelectAngle={setViewAngle} onPlaySound={onPlaySound} />
            </div>
          </div>

          <div
            className={`flex flex-col gap-4 transition-all duration-350 ease-out motion-reduce:transition-none ${
              isVisible ? 'opacity-100 translate-y-0 delay-[200ms]' : 'opacity-0 translate-y-5 delay-0'
            }`}
          >
            {renderIdentityCard('text-xl', 'grid-cols-2 sm:grid-cols-3')}
            {renderAudienceCard()}
            {renderReasonsCard()}
            {renderVendorTrustCard(false)}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* B. TAMPILAN KHUSUS DESKTOP (hidden lg:grid) - SCROLL MANDIRI (KIRI & KANAN) */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid grid-cols-[340px_1fr_360px] xl:grid-cols-[370px_1fr_390px] gap-6 xl:gap-8 items-start w-full max-w-[1400px] mx-auto flex-1 h-full min-h-0 px-7 py-3 overflow-hidden">
          {/* 1. KOLOM KIRI (IDENTITAS PRODUK, WARNA & COCOK UNTUK SIAPA) */}
          <div
            className={`h-full overflow-y-auto pr-1.5 pb-6 flex flex-col gap-4 min-h-0 no-scrollbar transition-all duration-300 ease-out motion-reduce:transition-none ${
              isVisible ? 'opacity-100 translate-y-0 delay-[120ms]' : 'opacity-0 translate-y-4 delay-0'
            }`}
          >
            {renderIdentityCard('text-2xl', 'grid-cols-2')}
            {renderAudienceCard()}
          </div>

          {/* 2. KOLOM TENGAH: PRODUK DITENGAH (TETAP DIAM DI TENGAH, TIDAK IKUT TER-SCROLL) */}
          <div className="h-full flex flex-col items-center justify-center select-none py-1 min-h-0">
            <div
              className={`relative w-full flex justify-center transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-3'
              }`}
            >
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
            <div
              className={`w-full flex justify-center mt-3 transition-all duration-300 ease-out motion-reduce:transition-none ${
                isVisible ? 'opacity-100 translate-y-0 delay-[110ms]' : 'opacity-0 translate-y-3 delay-0'
              }`}
            >
              <AngleTabs currentAngle={viewAngle} onSelectAngle={setViewAngle} onPlaySound={onPlaySound} />
            </div>

            {/* Keterangan Putar 3D */}
            <span
              className={`text-[11.5px] text-ink/45 mt-2.5 font-medium transition-opacity duration-300 motion-reduce:transition-none ${
                isVisible ? 'opacity-100 delay-[180ms]' : 'opacity-0 delay-0'
              }`}
            >
              Geser ke kiri/kanan atau ketuk untuk memutar baju (360°)
            </span>
          </div>

          {/* 3. KOLOM KANAN: KENAPA COCOK, JAMINAN VENDOR TERBAIK & CTA WHATSAPP */}
          <div
            className={`h-full overflow-y-auto pl-1 pr-0.5 pb-6 flex flex-col gap-4 min-h-0 no-scrollbar transition-all duration-300 ease-out motion-reduce:transition-none ${
              isVisible ? 'opacity-100 translate-y-0 delay-[200ms]' : 'opacity-0 translate-y-4 delay-0'
            }`}
          >
            {renderReasonsCard()}
            {renderVendorTrustCard(true)}
          </div>
        </div>
      </div>

      {/* 3. FLOATING ORDER BAR DI HP & TABLET (Menempel tetap di bawah layar) */}
      <div className="lg:hidden">
        {/* Progressive blur + gradasi halus di tepi bawah agar teks kartu melebur bersih di belakang dock kaca */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 right-0 bottom-0 h-32 bg-gradient-to-t from-page/65 via-page/30 to-transparent backdrop-blur-lg [mask-image:linear-gradient(to_top,black_55%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_55%,transparent_100%)] z-30"
        />
        <OrderBottomBar
          onOrderViaWhatsApp={handleWhatsAppClick}
          isMobileFloating={true}
          className={`transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            isVisible ? 'opacity-100 delay-[280ms]' : 'opacity-0 translate-y-6 delay-0'
          }`}
        />
      </div>
    </section>
  );
}
