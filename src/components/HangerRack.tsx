'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { GarmentItem, CategoryData, CustomPhotoData, CategoryId } from '@/types';
import { getWhatsAppUrl } from '@/config/store';
import { HangerHookSVG } from './HangerHookSVG';
import { GarmentSVG } from './GarmentSVG';

// SVG Resmi WhatsApp seragam
const WhatsAppIcon = ({ className = 'w-3.5 h-3.5 flex-shrink-0' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.81 8.1 19.14L7.54 18.82L4.43 19.64L5.26 16.6L4.91 16.03C4.18 14.77 3.8 13.35 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67ZM8.73 7.34C8.54 7.34 8.35 7.35 8.17 7.73C7.99 8.12 7.45 8.63 7.45 9.69C7.45 10.74 8.22 11.75 8.33 11.9C8.44 12.05 9.8 14.23 11.94 15.07C13.72 15.77 14.08 15.63 14.47 15.59C14.85 15.55 15.71 15.08 15.89 14.57C16.07 14.06 16.07 13.63 16.01 13.54C15.96 13.45 15.81 13.4 15.58 13.28C15.35 13.17 14.23 12.62 14.02 12.54C13.81 12.47 13.66 12.43 13.51 12.66C13.36 12.89 12.93 13.4 12.8 13.55C12.67 13.71 12.54 13.73 12.31 13.61C12.08 13.5 11.35 13.26 10.47 12.48C9.79 11.87 9.33 11.12 9.2 10.89C9.07 10.66 9.18 10.54 9.3 10.42C9.4 10.32 9.53 10.15 9.65 10.01C9.76 9.87 9.8 9.77 9.88 9.62C9.96 9.46 9.92 9.33 9.86 9.22C9.8 9.11 9.35 7.99 9.16 7.54C8.98 7.1 8.79 7.16 8.73 7.34Z" />
  </svg>
);

interface HangerRackProps {
  categoryData: CategoryData;
  categories?: { id: CategoryId; tabLabel: string }[];
  currentCategory?: CategoryId;
  onSelectCategory?: (id: CategoryId) => void;
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onOpenDetail: (index: number) => void;
  customPhotos: Record<string, CustomPhotoData>;
  onPlaySound: (type: 'slide' | 'open' | 'click' | 'flip' | 'sway') => void;
}

interface SwayEvent {
  targetIndex: number;
  dir: 'left' | 'right';
  token: number;
  source: 'hover' | 'click' | 'drag' | 'category';
  toggle: boolean;
}

export function HangerRack({
  categoryData,
  categories = [],
  currentCategory,
  onSelectCategory,
  activeIndex,
  onSelectIndex,
  onOpenDetail,
  customPhotos,
  onPlaySound,
}: HangerRackProps) {
  const rackListRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Fisika & inersia ayunan saat digeser (drag / swipe / momentum)
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const lastScrollLeftRef = useRef(0);
  const scrollEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevHoveredIndexRef = useRef<number>(activeIndex);
  const swayToggleRef = useRef(false);

  const [dragTilt, setDragTilt] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swayEvent, setSwayEvent] = useState<SwayEvent | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items = categoryData.rack;
  const displayIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
  const activeItem = items[displayIndex] || items[0];
  const activeCustom = customPhotos[activeItem?.id];
  const activePrice = activeCustom?.price || activeItem?.price || 60000;
  const activeName = activeCustom?.name || activeItem?.name;

  // Fungsi pemicu ayunan alami
  const triggerSway = (
    targetIndex: number,
    dir: 'left' | 'right' = 'right',
    source: 'hover' | 'click' | 'drag' | 'category' = 'hover'
  ) => {
    swayToggleRef.current = !swayToggleRef.current;
    setSwayEvent({
      targetIndex,
      dir,
      token: Date.now(),
      source,
      toggle: swayToggleRef.current,
    });
  };

  // Efek ayunan lembut cascading saat kategori atau indeks aktif berganti
  useEffect(() => {
    triggerSway(activeIndex, 'right', 'category');
  }, [categoryData.id, activeIndex]);

  // Bersihkan timer scroll saat unmount
  useEffect(() => {
    return () => {
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }
    };
  }, []);

  // Auto scroll ke active slot saat index dipilih di HP
  useEffect(() => {
    const el = rackListRef.current;
    if (!el) return;
    const slots = el.querySelectorAll<HTMLElement>('.hanger-slot');
    const target = slots[displayIndex];
    if (target && window.innerWidth <= 768) {
      const timer = setTimeout(() => {
        const containerW = el.clientWidth;
        const targetLeft = target.offsetLeft;
        const targetW = target.offsetWidth;
        el.scrollTo({
          left: targetLeft - containerW / 2 + targetW / 2,
          behavior: 'smooth',
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [displayIndex]);

  // Pointer drag gestures untuk sentuhan / swipe / drag mouse
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!rackListRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    dragVelocityRef.current = 0;
    dragScrollLeftRef.current = rackListRef.current.scrollLeft;

    if (e.pointerType === 'mouse') {
      setIsDragging(true);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !rackListRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    const dy = e.clientY - dragStartYRef.current;
    if (Math.hypot(dx, dy) > 10) {
      hasDraggedRef.current = true;
    }

    // Hanya ubah scrollLeft secara manual jika menggunakan mouse desktop
    // Di perangkat layar sentuh (HP), biarkan browser menangani native scrolling secara mulus
    if (e.pointerType === 'mouse') {
      rackListRef.current.scrollLeft = dragScrollLeftRef.current - dx;
    }

    // Hitung kecepatan geser untuk kemiringan halus (subtle tilt)
    const now = performance.now();
    const dt = Math.max(now - lastPointerTimeRef.current, 10);
    const stepDx = e.clientX - lastPointerXRef.current;
    const currentVelocity = stepDx / dt;

    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = now;
    dragVelocityRef.current = dragVelocityRef.current * 0.6 + currentVelocity * 0.4;

    // Maksimal kemiringan diperhalus menjadi 2.8 derajat
    const calculatedTilt = Math.max(-2.8, Math.min(2.8, -dragVelocityRef.current * 2.5));
    setDragTilt(calculatedTilt);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const wasDragged = hasDraggedRef.current;
    setDragTilt(0);

    if (wasDragged) {
      onPlaySound('slide');
      // Beri sedikit jeda agar event click sintesis yang menyusul pointerup tetap terdeteksi sebagai drag
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 100);
    }
  };

  // Deteksi scroll sentuh alami (trackpad / swipe HP momentum)
  const handleScroll = () => {
    const el = rackListRef.current;
    if (!el) return;

    const currentScrollLeft = el.scrollLeft;
    const delta = currentScrollLeft - lastScrollLeftRef.current;
    lastScrollLeftRef.current = currentScrollLeft;

    if (Math.abs(delta) > 1.2) {
      // Kemiringan sangat halus selama scroll (maksimal 2.0 derajat)
      const scrollTilt = Math.max(-2.0, Math.min(2.0, delta * 0.1));
      setDragTilt(scrollTilt);

      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }

      scrollEndTimeoutRef.current = setTimeout(() => {
        setDragTilt(0);
      }, 100);
    }
  };

  return (
    <section className="relative w-full flex-1 flex flex-col justify-between overflow-hidden bg-page select-none min-h-0">
      {/* 1. Banner CTA Desain Custom di Atas Rak (Hanya Tampil di Mobile, Fokus Utama Ajakan ke WA) */}
      <div className="w-full px-4 pt-2.5 pb-1 z-20 flex justify-center flex-shrink-0 md:hidden">
        <a
          href={getWhatsAppUrl('Halo MIG Digital Printing, saya mau konsultasi bikin desain custom apparel/jersey')}
          target="_blank"
          rel="noopener noreferrer"
          className="press relative inline-flex rounded-full p-[2px] overflow-hidden shadow-[0_6px_22px_rgba(123,41,186,0.18)] cursor-pointer group"
          title="Konsultasi Desain Custom via WhatsApp"
        >
          <span aria-hidden="true" className="cta-loop-ring pointer-events-none" />
          <span className="relative z-10 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-surface/95 backdrop-blur-md text-[13.5px] font-bold text-ink group-hover:text-brand transition-colors">
            <WhatsAppIcon className="w-5 h-5 text-brand shrink-0" />
            <span>Desain custom? Chat via WhatsApp</span>
          </span>
        </a>
      </div>

      {/* 2. Latar Polos & Tipografi Raksasa "APPAREL" Bersih Tanpa Bayangan Lantai */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center overflow-hidden z-0">
        <div className="flex flex-col items-center select-none transform -translate-y-4 md:-translate-y-6">
          <h1 className="font-display text-[32vw] md:text-[18vw] leading-none text-[#ebe8f2] tracking-wider select-none">
            {categoryData.heroTitle || 'APPAREL'}
          </h1>
        </div>
      </div>

      {/* 3. Callout Kiri & Kanan (Desktop) */}
      <aside className="hidden lg:flex flex-col absolute left-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-left">
        <span className="font-serif italic text-3xl md:text-4xl text-ink leading-tight">Tampil</span>
        <span className="font-sans font-black text-2xl md:text-3xl text-ink tracking-tight">MENAWAN</span>
      </aside>

      <aside className="hidden lg:flex flex-col absolute right-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-right">
        <span className="font-serif italic text-3xl md:text-4xl text-ink leading-tight">Langsung</span>
        <span className="font-sans font-black text-2xl md:text-3xl text-ink tracking-tight">PILIH UKURAN</span>
      </aside>

      {/* 4. PIPA GANTUNGAN CHROME HORIZONTAL & DERETAN BAJU BERGOYANG ALAMI */}
      <div className="relative w-full z-10 flex-1 flex flex-col justify-center my-auto min-h-0">
        <div className="relative w-full">
          {/* Batang Kawat Chrome Horizontal (Tepat menembus lengkung kait hanger di y=6px + pt-3) */}
          <div className="absolute top-[17px] md:top-[18px] left-0 right-0 h-[7px] md:h-[8px] bg-gradient-to-b from-[#d6d4de] via-white via-28% to-[#1c1b1a] z-0 shadow-sm pointer-events-none">
            <div className="w-full h-[2px] bg-white/85" />
          </div>

          {/* Deretan Baju Gantungan yang Bisa Digeser, Di-hover, & Di-klik di HP */}
          <div
            ref={rackListRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onScroll={handleScroll}
            className="w-full flex items-start justify-start md:justify-center overflow-x-auto overflow-y-hidden no-scrollbar px-6 md:px-12 pt-3 pb-3 md:pb-6 cursor-grab active:cursor-grabbing z-10"
          >
            <div className="flex items-start gap-1 md:gap-2.5 mx-auto">
              {items.map((item, idx) => {
                const isDisplayFront = idx === displayIndex;
                const custom = customPhotos[item.id];
                const price = custom?.price || item.price;
                const priceText = `Rp ${Math.round(price / 1000)}rb`;
                const hasPhotoHanger = !!((custom && (custom.frontDataUrl || custom.sideDataUrl)) || item.front || item.side);

                // Menentukan kelas animasi ayunan untuk gantungan ini
                let swayClass = '';
                let swayDelay = '0ms';

                if (!isDragging && dragTilt === 0) {
                  if (swayEvent) {
                    const dist = Math.abs(idx - swayEvent.targetIndex);
                    const dir = swayEvent.dir;
                    const isAlt = swayEvent.toggle;

                    if (dist === 0) {
                      // Gantungan utama yang langsung tersentuh / diklik / di-hover
                      if (dir === 'right') {
                        swayClass = isAlt ? 'animate-sway-right-alt' : 'animate-sway-right';
                      } else {
                        swayClass = isAlt ? 'animate-sway-left-alt' : 'animate-sway-left';
                      }
                      swayDelay = '0ms';
                    } else if (dist === 1) {
                      // Efek getar simpatik gantungan persis di sampingnya
                      swayClass = dir === 'right' ? 'animate-sway-soft-right' : 'animate-sway-soft-left';
                      swayDelay = '50ms';
                    } else if (swayEvent.source === 'drag' && dist === 2) {
                      // Ombak inersia saat rel digeser merambat ke tetangga kedua
                      swayClass = dir === 'right' ? 'animate-sway-soft-right' : 'animate-sway-soft-left';
                      swayDelay = '100ms';
                    } else if (swayEvent.source === 'category') {
                      // Gelombang cascading saat kategori produk diganti
                      const delay = Math.abs(idx - swayEvent.targetIndex) * 55;
                      swayClass = dir === 'right' ? 'animate-sway-soft-right' : 'animate-sway-soft-left';
                      swayDelay = `${delay}ms`;
                    }
                  }

                  // Jika tidak ada aksi, pakaian bernapas lembut ditiup angin ruangan butik
                  if (!swayClass) {
                    swayClass = idx % 2 === 0 ? 'animate-hanger-idle-a' : 'animate-hanger-idle-b';
                    swayDelay = `${(idx * 0.4).toFixed(2)}s`;
                  }
                }

                // Kemiringan inersia dinamis saat digeser / di-drag
                const itemTilt = dragTilt !== 0 ? (isDisplayFront ? dragTilt : dragTilt * 0.92) : 0;

                return (
                  <div
                    key={item.id}
                    onPointerEnter={(e) => {
                      if (e.pointerType !== 'mouse') return;

                      // Deteksi arah sentuhan kursor (kiri vs kanan)
                      const prevIdx = prevHoveredIndexRef.current;
                      const dir: 'left' | 'right' = idx >= prevIdx ? 'right' : 'left';
                      prevHoveredIndexRef.current = idx;

                      // Picu ayunan alami saat kursor mouse menyentuh produk
                      triggerSway(idx, dir, 'hover');
                      onPlaySound('sway');

                      if (displayIndex !== idx) {
                        setHoveredIndex(idx);
                        onSelectIndex(idx);
                      }
                    }}
                    onClick={() => {
                      // Hindari klik jika pengguna baru saja menggeser/swipe rel
                      if (hasDraggedRef.current) return;

                      if (displayIndex !== idx) {
                        // 1. Ketuk baju yang masih menyamping (misal di HP):
                        // Putar menghadap ke depan & bunyikan efek ayunan lembut
                        onPlaySound('sway');
                        triggerSway(idx, 'right', 'click');
                        onSelectIndex(idx);
                        setHoveredIndex(idx);
                      } else {
                        // 2. Ketuk baju yang SUDAH tampak depan (baik di HP maupun Desktop):
                        // Klik sekali lagi LANGSUNG masuk ke panggung detail!
                        onPlaySound('open');
                        onOpenDetail(idx);
                      }
                    }}
                    className={`hanger-slot flex flex-col items-center cursor-pointer transition-[width] duration-300 ease-out [perspective:1000px] ${
                      isDisplayFront
                        ? 'w-[224px] md:w-[240px] z-30'
                        : 'w-[62px] md:w-[68px] z-10'
                    }`}
                  >
                    {/* PEMBUNGKUS FISIKA AYUNAN GANTUNGAN (Hanger Assembly)
                        Berporos tepat di lengkung kait kawat atas (50% 6px) */}
                    <div
                      className={`hanger-assembly w-full flex flex-col items-center pointer-events-auto ${swayClass}`}
                      style={{
                        animationDelay: swayDelay,
                        transform: itemTilt !== 0 ? `rotateZ(${itemTilt}deg)` : undefined,
                        transition: isDragging
                          ? 'transform 75ms ease-out'
                          : itemTilt !== 0
                          ? 'transform 180ms ease-out'
                          : undefined,
                      }}
                    >
                      {/* Gantungan Hook SVG + label harga */}
                      <div className="w-[100px] md:w-[110px] h-[52px] md:h-[58px] flex-shrink-0">
                        <HangerHookSVG
                          priceTagText={priceText}
                          showPriceTag={isDisplayFront}
                          isSideView={!isDisplayFront}
                          hideHangerBody={hasPhotoHanger}
                        />
                      </div>

                      {/* Panggung Baju 3D (Dua Sisi: Samping & Depan berputar mulus tanpa lonjakan ukuran) */}
                      <div
                        className={`relative w-full h-[260px] md:h-[268px] flex items-start justify-center [perspective:1000px] ${
                          hasPhotoHanger ? '-mt-[26px] md:-mt-[30px]' : '-mt-1.5'
                        }`}
                      >
                        {/* SISI SAMPING (Tampil saat menyamping di rak) */}
                        <div
                          className={`absolute inset-0 flex items-start justify-center transition-all duration-250 ease-out origin-center ${
                            isDisplayFront
                              ? 'opacity-0 [transform:rotateY(-85deg)] pointer-events-none'
                              : 'opacity-100 [transform:rotateY(0deg)]'
                          }`}
                          style={{
                            transitionDelay: isDisplayFront ? '0ms' : '80ms',
                          }}
                        >
                          <div className="h-full w-auto flex items-start justify-center">
                            <GarmentSVG
                              item={item}
                              categoryId={categoryData.id}
                              viewAngle="side-left"
                              custom={custom}
                              className="max-h-full"
                            />
                          </div>
                        </div>

                        {/* SISI DEPAN (Berputar masuk saat aktif/di-hover, ukuran stabil tanpa melompat) */}
                        <div
                          className={`absolute inset-0 flex items-start justify-center transition-all duration-300 ease-out origin-center ${
                            isDisplayFront
                              ? 'opacity-100 [transform:rotateY(0deg)]'
                              : 'opacity-0 [transform:rotateY(85deg)] pointer-events-none'
                          }`}
                          style={{
                            transitionDelay: isDisplayFront ? '80ms' : '0ms',
                          }}
                        >
                          <div className="h-full w-auto flex-shrink-0 flex items-start justify-center">
                            <GarmentSVG
                              item={item}
                              categoryId={categoryData.id}
                              viewAngle="front"
                              custom={custom}
                              className="max-h-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Petunjuk interaksi halus khusus mobile */}
        <p className="md:hidden text-center text-[11.5px] font-medium text-muted/80 mt-1 px-4 select-none">
          Geser untuk lihat model lain · Ketuk baju untuk detail
        </p>

        {/* Bar Kategori Khusus HP di Bawah Rak Baju (Mudah Dijangkau Ibu Jari) */}
        {categories && categories.length > 0 && (
          <div className="md:hidden w-full px-3.5 mt-4 z-20 flex-shrink-0">
            <nav className="grid grid-cols-3 gap-2 w-full" aria-label="Kategori pakaian">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                  className={`h-[42px] min-h-[42px] px-2 rounded-full text-[13px] font-semibold flex items-center justify-center transition-all press-active ${
                    currentCategory === cat.id
                      ? 'bg-ink text-surface shadow-sm'
                      : 'bg-surface text-ink border border-line hover:border-ink/30'
                  }`}
                >
                  {cat.tabLabel}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* 5. BAR AKSI BAWAH RAK */}
      <footer className="relative w-full z-20 px-4 md:px-8 pt-1 pb-[max(20px,calc(16px+env(safe-area-inset-bottom)))] md:py-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 md:gap-3 max-w-[1340px] mx-auto flex-shrink-0">
        {/* Tombol CTA Desain Custom di Kiri Bawah (Satu-satunya CTA di Desktop, Selaras Desain Sistem) */}
        <a
          href={getWhatsAppUrl('Halo MIG Digital Printing, saya mau konsultasi bikin desain custom apparel/jersey')}
          target="_blank"
          rel="noopener noreferrer"
          className="press hidden sm:inline-flex relative rounded-full p-[2px] overflow-hidden shadow-[0_6px_24px_rgba(123,41,186,0.18)] cursor-pointer group"
          title="Konsultasi Desain Custom via WhatsApp"
        >
          <span aria-hidden="true" className="cta-loop-ring pointer-events-none" />
          <span className="relative z-10 flex items-center gap-2.5 sm:gap-3 bg-surface/95 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 rounded-full">
            <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 text-brand shrink-0" />
            <span className="text-[13.5px] sm:text-[14.5px] font-bold text-ink group-hover:text-brand transition-colors">
              Desain custom? Chat via WhatsApp
            </span>
          </span>
        </a>

        {/* Info Produk Aktif & Tombol Buka Detail (Ukuran Font & Tombol Proporsional Sesuai UI/UX MIG) */}
        <div
          onClick={() => {
            onPlaySound('open');
            onOpenDetail(displayIndex);
          }}
          className="press flex items-center justify-between gap-3 sm:gap-5 bg-surface/95 backdrop-blur-md border border-line px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.08)] hover:border-brand/40 cursor-pointer transition-all w-full max-w-[440px] sm:w-auto"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-surface ring-1 ring-line/80 shadow-xs shrink-0"
              style={{ backgroundColor: activeItem?.hex || '#ffffff' }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] sm:text-[16px] font-bold text-ink truncate leading-tight">
                {activeName}
              </span>
              <span className="text-xs sm:text-[13px] text-muted font-medium truncate leading-normal">
                Mulai dari <strong className="text-ink font-bold tabular-nums">Rp {activePrice.toLocaleString('id-ID')}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            className="press flex items-center gap-2 h-11 px-4 sm:px-5 rounded-full bg-brand hover:bg-brand-hover text-white text-sm font-bold shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Lihat detail</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </section>
  );
}