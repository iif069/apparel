'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Award,
  Bike,
  Building2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Droplets,
  Gamepad2,
  GraduationCap,
  Layers,
  MapPin,
  Package,
  Palette,
  ShieldCheck,
  Sparkles,
  Store,
  Trophy,
  Users,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { GarmentItem, CategoryData, ViewAngle, CustomPhotoData } from '@/types';
import { CATEGORY_DETAILS, type DetailIconName } from '@/data/categoryDetails';
import { STORE_CONFIG, getWhatsAppUrl } from '@/config/store';
import { GarmentRotator } from './GarmentRotator';
import { AngleTabs } from './AngleTabs';
import { OrderBottomBar } from './OrderBottomBar';
import { WhatsAppIcon } from './WhatsAppIcon';

const DETAIL_ICON_MAP: Record<DetailIconName, LucideIcon> = {
  graduation: GraduationCap,
  users: Users,
  store: Store,
  trophy: Trophy,
  gamepad: Gamepad2,
  bike: Bike,
  building: Building2,
  award: Award,
  compass: Compass,
  wind: Wind,
  droplets: Droplets,
  layers: Layers,
  sparkles: Sparkles,
  shield: ShieldCheck,
  palette: Palette,
};

interface DetailStageProps {
  isOpen: boolean;
  onClose: () => void;
  categoryData: CategoryData;
  itemIndex: number;
  onSelectIndex: (index: number) => void;
  customPhotos: Record<string, CustomPhotoData>;
  isFlashActive: boolean;
  onToggleFlash: () => void;
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
  isFlashActive,
  onToggleFlash,
  onOrderViaWhatsApp,
  onPlaySound,
}: DetailStageProps) {
  const [viewAngle, setViewAngle] = useState<ViewAngle>('front');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastScrollTopRef = useRef(0);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const items = categoryData.rack;
  const currentItem = items[itemIndex] || items[0];
  const custom = customPhotos[currentItem?.id];
  const productName = custom?.name || currentItem?.name;
  const colorName = custom?.colorName || currentItem?.colorName;
  const detailCopy = CATEGORY_DETAILS[categoryData.id] || CATEGORY_DETAILS.kaos;

  // Transisi halus saat membuka & menutup halaman detail + kelola fokus aksesibilitas
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
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
        previousFocusRef.current?.focus?.({ preventScroll: true });
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Pindahkan fokus setelah aria-hidden sudah dilepas pada render DOM
  useEffect(() => {
    if (isVisible) {
      backButtonRef.current?.focus({ preventScroll: true });
    }
  }, [isVisible]);

  // Reset scroll saat item berganti
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
    lastScrollTopRef.current = 0;
    setIsScrolled(false);
    setIsHeaderHidden(false);
    setViewAngle('front');
  }, [itemIndex, isOpen]);

  // Tutup detail dengan tombol Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
  const hasFlashEffect = Boolean(
    currentItem.isReflective ||
      currentItem.flashFront ||
      currentItem.flashBack ||
      currentItem.reflectiveFront ||
      currentItem.reflectiveBack
  );

  const handleStageToggleFlash = () => {
    if (!isFlashActive && currentItem.flashBack && !currentItem.flashFront && viewAngle !== 'back') {
      setViewAngle('back');
    }
    onToggleFlash();
  };

  // Kartu Identitas Model & Pilihan Warna di Gantungan (tanpa harga & tanpa ukuran)
  const renderIdentityCard = (titleClass: string) => (
    <div className="bg-surface border border-line rounded-[28px] p-5 sm:p-6 flex flex-col gap-4 shadow-soft">
      {/* Badge Status */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-brand-soft text-brand border border-brand/30">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          Desain custom
        </span>
        <span className="px-2.5 py-1 rounded-full text-[11.5px] font-semibold bg-page text-ink/75 border border-line">
          {categoryData.id === 'kaos' ? 'Satuan & partai besar' : 'Minimal 6 pcs · Partai besar'}
        </span>
      </div>

      {/* Judul & Keterangan Singkat */}
      <div>
        <h2 className={`${titleClass} font-bold text-ink tracking-tight`}>{productName}</h2>
        <p className="text-[14px] text-muted mt-1.5 leading-relaxed">
          {categoryData.kicker} · Warna, gambar, dan tulisan bebas disesuaikan kebutuhan acara kamu.
        </p>
      </div>

      {/* Pilihan Warna / Model di Gantungan */}
      <div className="flex flex-col gap-2.5 pt-3 border-t border-line">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13.5px] font-semibold text-ink">Warna di gantungan</span>
          <span className="text-[12px] font-medium text-muted tabular-nums">{counterText}</span>
        </div>
        <div className="flex items-center gap-2.5 py-2.5 px-4 bg-page rounded-full border border-line min-w-0">
          <span
            className="w-5 h-5 rounded-full border border-line shadow-inner flex-shrink-0"
            style={{ backgroundColor: currentItem.hex }}
          />
          <span className="text-[14px] font-medium text-ink truncate">{colorName}</span>
        </div>

        {/* Pilihan Warna Cepat (Langsung Terlihat, Target Sentuh 44px) */}
        {items.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap pt-1" role="group" aria-label="Pilih warna cepat">
            {items.map((it, idx) => {
              const isSelected = idx === itemIndex;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => {
                    if (isSelected) return;
                    onSelectIndex(idx);
                    onPlaySound('flip');
                  }}
                  title={it.colorName}
                  aria-label={`Pilih warna ${it.colorName}`}
                  aria-pressed={isSelected}
                  className="w-11 h-11 -m-1.5 flex items-center justify-center rounded-full cursor-pointer press-active"
                >
                  <span
                    className={`w-6 h-6 rounded-full transition-transform ${
                      isSelected
                        ? 'ring-2 ring-brand ring-offset-2 ring-offset-surface scale-110'
                        : 'ring-1 ring-line hover:scale-110'
                    }`}
                    style={{ backgroundColor: it.hex }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // Pembungkus icon seragam (outline lucide di lingkaran brand-soft)
  const renderIconCircle = (IconComponent: LucideIcon) => (
    <span className="w-8 h-8 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0">
      <IconComponent className="w-4 h-4" />
    </span>
  );

  // Kartu "Cocok untuk" ringkas dengan chip berikon seragam
  const renderAudienceCard = () => (
    <div className="bg-surface border border-line rounded-[28px] p-5 sm:p-6 flex flex-col gap-3.5 shadow-soft">
      <div className="flex items-center gap-2.5">
        {renderIconCircle(Users)}
        <h3 className="text-[16px] font-bold text-ink tracking-tight">{detailCopy.audienceHeading}</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {detailCopy.audiences.map((aud) => {
          const IconComponent = DETAIL_ICON_MAP[aud.icon];
          return (
            <span
              key={aud.label}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-page border border-line text-[13.5px] font-medium text-ink"
            >
              <IconComponent className="w-4 h-4 text-brand shrink-0" />
              <span>{aud.label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );

  // Kartu "Keunggulan & bahan" ringkas tanpa duplikasi teks
  const renderReasonsCard = () => (
    <div className="bg-surface border border-line rounded-[28px] p-5 sm:p-6 flex flex-col gap-4 shadow-soft">
      <div className="flex items-center gap-2.5">
        {renderIconCircle(Sparkles)}
        <h3 className="text-[16px] font-bold text-ink tracking-tight">{detailCopy.reasonsHeading}</h3>
      </div>

      <div className="flex flex-col gap-3.5">
        {detailCopy.reasons.map((reason) => {
          const IconComponent = DETAIL_ICON_MAP[reason.icon];
          return (
            <div key={reason.title} className="flex items-start gap-3">
              <div className="mt-0.5">{renderIconCircle(IconComponent)}</div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[14.5px] font-semibold text-ink leading-snug">{reason.title}</span>
                <p className="text-[13.5px] text-muted leading-relaxed">{reason.summary}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Tombol Tes Sablon Menyala (Flash) dipakai bersama di mobile & desktop
  const renderFlashButton = () =>
    hasFlashEffect ? (
      <button
        type="button"
        onClick={handleStageToggleFlash}
        aria-pressed={isFlashActive}
        className={`press inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full text-[13px] font-bold border transition-all cursor-pointer shadow-sm ${
          isFlashActive
            ? 'bg-ink text-surface border-ink shadow-soft'
            : 'bg-surface text-ink border-line hover:border-brand/50 hover:text-brand'
        }`}
      >
        <Zap className={`w-4 h-4 ${isFlashActive ? 'text-yellow-300 fill-yellow-300' : 'text-brand'}`} />
        <span>{isFlashActive ? 'Sablon Menyala: Aktif' : 'Tes Sablon Menyala (Flash)'}</span>
      </button>
    ) : null;

  // Kartu Jaminan Vendor, Pemesanan & Lokasi Workshop (ringkas dengan icon seragam)
  const renderVendorTrustCard = () => (
    <div className="bg-surface border border-line rounded-[28px] p-5 sm:p-6 flex flex-col gap-3.5 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{renderIconCircle(ShieldCheck)}</div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[14.5px] font-semibold text-ink leading-snug">Kualitas Vendor Terbaik</span>
          <p className="text-[13.5px] text-muted leading-relaxed">
            Produksi dikerjakan pilihan vendor apparel terbaik agar hasil tetap terjaga.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 pt-3.5 border-t border-line">
        <div className="mt-0.5">{renderIconCircle(Package)}</div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[14.5px] font-semibold text-ink leading-snug">
            {categoryData.id === 'kaos' ? 'Bisa Satuan atau Partai Besar' : 'Minimal 6 Pcs & Partai Besar'}
          </span>
          <p className="text-[13.5px] text-muted leading-relaxed">
            {categoryData.id === 'kaos'
              ? 'Pesan mulai 1 pcs hingga ratusan pcs — '
              : 'Pesan mulai 6 pcs hingga ratusan pcs — '}
            <a
              href={getWhatsAppUrl(`Halo MIG Digital Printing, saya mau tanya estimasi harga ${categoryData.tabLabel} (${productName})`)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-hover"
            >
              cek estimasi harga gratis via WA.
            </a>
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 pt-3.5 border-t border-line">
        <div className="mt-0.5">{renderIconCircle(MapPin)}</div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[14.5px] font-semibold text-ink leading-snug">{STORE_CONFIG.name}</span>
          <p className="text-[13.5px] text-muted leading-relaxed">{STORE_CONFIG.location}</p>
          <p className="text-[13px] text-ink/80 font-medium leading-relaxed">{STORE_CONFIG.operatingHours.daily}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-hidden={!isVisible ? true : undefined}
      aria-label={`Detail ${productName}`}
      className={`fixed inset-0 z-50 bg-page flex flex-col w-full h-[100dvh] overflow-hidden transition-opacity duration-[250ms] ease-out motion-reduce:transition-none ${
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
              ref={backButtonRef}
              type="button"
              onClick={onClose}
              className="press w-11 h-11 rounded-full bg-white/45 lg:bg-surface border border-white/70 lg:border-line lg:shadow-sm flex items-center justify-center hover:bg-white/75 lg:hover:bg-surface text-ink transition-colors cursor-pointer"
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

          {/* Tengah: Nomor Indeks (04/07) dengan navigasi prev/next atau Judul saat di-scroll */}
          <div className="flex items-center justify-center min-w-0">
            {isScrolled ? (
              <span className="text-[15px] md:text-[17px] font-bold text-ink truncate max-w-[160px] sm:max-w-[280px] md:max-w-[420px]">
                {productName}
              </span>
            ) : items.length > 1 ? (
              <div className="inline-flex items-center rounded-full bg-white/45 lg:bg-page text-ink/85 border border-white/65 lg:border-line">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySound('flip');
                    onSelectIndex((itemIndex - 1 + items.length) % items.length);
                  }}
                  aria-label="Model sebelumnya"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-ink/75 hover:text-ink hover:bg-white/50 lg:hover:bg-surface transition-colors press-active cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-1.5 text-xs font-bold tabular-nums select-none">
                  {counterText}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onPlaySound('flip');
                    onSelectIndex((itemIndex + 1) % items.length);
                  }}
                  aria-label="Model berikutnya"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-ink/75 hover:text-ink hover:bg-white/50 lg:hover:bg-surface transition-colors press-active cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/45 lg:bg-page text-ink/85 border border-white/65 lg:border-line tabular-nums">
                {counterText}
              </span>
            )}
          </div>

          {/* Kanan: Tombol Chat WhatsApp CS */}
          <a
            href={getWhatsAppUrl(`Halo MIG Digital Printing, saya mau tanya dan konsultasi ${categoryData.tabLabel} (${productName})`)}
            target="_blank"
            rel="noopener noreferrer"
            className="press flex items-center justify-center gap-2 h-11 px-4 rounded-full bg-white/45 lg:bg-surface text-ink border border-white/70 lg:border-line hover:bg-white/75 lg:hover:border-brand/40 lg:shadow-sm transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            aria-label="Hubungi WhatsApp CS"
          >
            <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-[13px] font-bold text-ink">Chat WA</span>
          </a>
        </div>
      </header>

      {/* 2. AREA TENGAH BERGULIR (Mobile scroll penuh; Desktop panel kiri & kanan scroll mandiri, tengah fixed) */}
      <div
        ref={scrollAreaRef}
        onScroll={handleScroll}
        className="relative flex-1 w-full overflow-y-auto lg:overflow-hidden overflow-x-hidden no-scrollbar flex flex-col min-h-0"
      >
        {/* ========================================================================= */}
        {/* A. TAMPILAN KHUSUS HP / TABLET (lg:hidden)                               */}
        {/* ========================================================================= */}
        <div className="lg:hidden w-full max-w-[720px] mx-auto px-4 md:px-7 pt-[78px] md:pt-[86px] pb-[calc(132px+env(safe-area-inset-bottom))] flex flex-col gap-4">
          {/* Panggung Baju 3D Mobile */}
          <div className="relative z-10 bg-page w-full px-0 pt-1 pb-2 flex flex-col items-center">
            <div
              className={`relative w-full flex justify-center transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.86] translate-y-3'
              }`}
            >
              <GarmentRotator
                item={currentItem}
                categoryId={categoryData.id}
                viewAngle={viewAngle}
                onAngleChange={setViewAngle}
                custom={custom}
                isFlashActive={isFlashActive}
                onPlaySound={onPlaySound}
              />
            </div>

            {/* Tab Sudut Tampilan [Samping] [Depan] [Belakang] + Tombol Flash */}
            <div
              className={`w-full flex flex-wrap items-center justify-center gap-2 mt-2.5 transition-all duration-300 ease-out motion-reduce:transition-none ${
                isVisible ? 'opacity-100 translate-y-0 delay-[140ms]' : 'opacity-0 translate-y-3 delay-0'
              }`}
            >
              <AngleTabs currentAngle={viewAngle} onSelectAngle={setViewAngle} onPlaySound={onPlaySound} />
              {renderFlashButton()}
            </div>
            {hasFlashEffect && (
              <span className="text-[11px] text-ink/50 font-medium text-center">
                Sablon memantul terang saat kena cahaya flash
              </span>
            )}
          </div>

          <div
            className={`flex flex-col gap-4 transition-all duration-[350ms] ease-out motion-reduce:transition-none ${
              isVisible ? 'opacity-100 translate-y-0 delay-[200ms]' : 'opacity-0 translate-y-5 delay-0'
            }`}
          >
            {renderIdentityCard('text-xl')}
            {renderAudienceCard()}
            {renderReasonsCard()}
            {renderVendorTrustCard()}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* B. TAMPILAN KHUSUS DESKTOP (hidden lg:grid) - SCROLL MANDIRI KIRI & KANAN, TENGAH FIXED */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid grid-cols-[300px_1fr_310px] xl:grid-cols-[360px_1fr_380px] gap-5 xl:gap-8 items-start w-full max-w-[1400px] mx-auto flex-1 h-full min-h-0 px-7 py-3">
          {/* 1. KOLOM KIRI (SCROLL MANDIRI) */}
          <div
            className={`h-full overflow-y-auto pr-2 pb-6 flex flex-col gap-4 min-h-0 thin-scrollbar transition-all duration-300 ease-out motion-reduce:transition-none ${
              isVisible ? 'opacity-100 translate-y-0 delay-[120ms]' : 'opacity-0 translate-y-4 delay-0'
            }`}
          >
            {renderIdentityCard('text-2xl')}
            {renderAudienceCard()}
          </div>

          {/* 2. KOLOM TENGAH: PRODUK FIXED DI TENGAH (TANPA SCROLL) */}
          <div className="h-full flex flex-col items-center justify-center select-none py-1 min-h-0">
            <div
              className={`relative w-full flex justify-center transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-3'
              }`}
            >
              <GarmentRotator
                item={currentItem}
                categoryId={categoryData.id}
                viewAngle={viewAngle}
                onAngleChange={setViewAngle}
                custom={custom}
                isFlashActive={isFlashActive}
                onPlaySound={onPlaySound}
              />
            </div>

            {/* Tab Sudut Tampilan [Samping] [Depan] [Belakang] + Tombol Flash */}
            <div
              className={`w-full flex flex-wrap items-center justify-center gap-2.5 mt-2 transition-all duration-300 ease-out motion-reduce:transition-none ${
                isVisible ? 'opacity-100 translate-y-0 delay-[110ms]' : 'opacity-0 translate-y-3 delay-0'
              }`}
            >
              <AngleTabs currentAngle={viewAngle} onSelectAngle={setViewAngle} onPlaySound={onPlaySound} />
              {renderFlashButton()}
            </div>

            {/* Keterangan Putar */}
            <span
              className={`text-[11.5px] text-ink/45 mt-2 font-medium text-center transition-opacity duration-300 motion-reduce:transition-none ${
                isVisible ? 'opacity-100 delay-[180ms]' : 'opacity-0 delay-0'
              }`}
            >
              Geser atau ketuk baju untuk lihat sisi depan &amp; belakang
              {hasFlashEffect ? ' · Sablon memantul terang saat kena cahaya flash' : ''}
            </span>
          </div>

          {/* 3. KOLOM KANAN (SCROLL MANDIRI + DOCK CTA STICKY SEJAJAR KARTU) */}
          <div
            className={`h-full overflow-y-auto -ml-3 pl-4 pr-2 pb-1 flex flex-col gap-4 min-h-0 thin-scrollbar transition-all duration-300 ease-out motion-reduce:transition-none ${
              isVisible ? 'opacity-100 translate-y-0 delay-[200ms]' : 'opacity-0 translate-y-4 delay-0'
            }`}
          >
            {renderReasonsCard()}
            {renderVendorTrustCard()}

            <div
              className={`sticky bottom-0 z-20 mt-auto pt-1.5 pb-1 pointer-events-none transition-[opacity,transform] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isVisible ? 'opacity-100 delay-[280ms]' : 'opacity-0 translate-y-6 delay-0'
              }`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-3 right-0 bottom-0 -top-8 bg-gradient-to-t from-page via-page/80 to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,black_60%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_60%,transparent_100%)]"
              />
              <OrderBottomBar
                onOrderViaWhatsApp={handleWhatsAppClick}
                variant="dock"
                helperText="Gratis lihat contoh desain sebelum dicetak"
                className="relative"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. FLOATING ORDER BAR KHUSUS MOBILE & TABLET (Menempel tetap di bawah layar) */}
      <div className="lg:hidden">
        {/* Progressive blur + gradasi halus di tepi bawah agar teks di belakang dock buram & tidak bertabrakan */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 bottom-0 h-32 z-30 bg-gradient-to-t from-page/95 via-page/65 to-transparent backdrop-blur-lg [mask-image:linear-gradient(to_top,black_55%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_55%,transparent_100%)]"
        />
        <OrderBottomBar
          onOrderViaWhatsApp={handleWhatsAppClick}
          variant="floating"
          helperText="Gratis lihat contoh desain sebelum dicetak"
          className={`transition-[opacity,transform] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            isVisible ? 'opacity-100 delay-[280ms]' : 'opacity-0 translate-y-6 delay-0'
          }`}
        />
      </div>
    </section>
  );
}
