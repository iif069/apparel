'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { GarmentItem, CategoryData, CustomPhotoData, CategoryId } from '@/types';
import { STORE_CONFIG, getWhatsAppUrl } from '@/config/store';
import { HangerHookSVG } from './HangerHookSVG';
import { GarmentSVG } from './GarmentSVG';
import { WhatsAppIcon } from './WhatsAppIcon';
import { trackWhatsAppClick } from '@/lib/analytics';

interface HangerRackProps {
  categoryData: CategoryData;
  categories?: { id: CategoryId; tabLabel: string }[];
  currentCategory?: CategoryId;
  onSelectCategory?: (id: CategoryId) => void;
  transitionPhase?: 'idle' | 'exiting' | 'entering';
  transitionDirection?: 'forward' | 'backward';
  activeIndex: number;
  onSelectIndex: (index: number) => void;
  onOpenDetail: (index: number) => void;
  customPhotos: Record<string, CustomPhotoData>;
  isFlashActive?: boolean;
  onToggleFlash?: () => void;
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
  transitionPhase = 'idle',
  transitionDirection = 'forward',
  activeIndex,
  onSelectIndex,
  onOpenDetail,
  customPhotos,
  isFlashActive = false,
  onToggleFlash,
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
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
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
  const activeColorName = activeCustom?.colorName || activeItem?.colorName || '';
  const activeName = activeCustom?.name || activeItem?.name;
  const hasFlashEffect = Boolean(
    activeItem &&
      (activeItem.isReflective ||
        activeItem.flashFront ||
        activeItem.flashBack ||
        activeItem.reflectiveFront ||
        activeItem.reflectiveBack)
  );

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

  // Reset hover & posisi scroll mobile saat kategori berganti
  useEffect(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setHoveredIndex(null);
    if (rackListRef.current) {
      rackListRef.current.scrollLeft = 0;
    }
  }, [categoryData.id]);

  // Efek ayunan lembut cascading saat kategori atau indeks aktif berganti
  useEffect(() => {
    const swayDir: 'left' | 'right' = transitionDirection === 'forward' ? 'left' : 'right';
    triggerSway(activeIndex, swayDir, 'category');
  }, [categoryData.id, activeIndex, transitionDirection]);

  const isForward = transitionDirection === 'forward';
  const heroTransitionClass =
    transitionPhase === 'exiting'
      ? `duration-150 ease-in opacity-0 scale-95 ${isForward ? '-translate-x-5' : 'translate-x-5'}`
      : transitionPhase === 'entering'
      ? `duration-0 opacity-0 scale-[1.03] ${isForward ? 'translate-x-6' : '-translate-x-6'}`
      : 'duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 scale-100 translate-x-0';

  const rackTransitionClass =
    transitionPhase === 'exiting'
      ? `duration-150 ease-in opacity-0 scale-[0.985] ${isForward ? '-translate-x-8' : 'translate-x-8'}`
      : transitionPhase === 'entering'
      ? `duration-0 opacity-0 scale-[0.985] ${isForward ? 'translate-x-10' : '-translate-x-10'}`
      : 'duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 scale-100 translate-x-0';

  const metaTransitionClass =
    transitionPhase === 'exiting'
      ? 'duration-150 ease-in opacity-0 translate-y-1.5'
      : transitionPhase === 'entering'
      ? 'duration-0 opacity-0 translate-y-1.5'
      : 'duration-300 ease-out opacity-100 translate-y-0';

  // Bersihkan timer scroll & hover saat unmount
  useEffect(() => {
    return () => {
      if (scrollEndTimeoutRef.current) {
        clearTimeout(scrollEndTimeoutRef.current);
      }
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
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

  const handlePointerUp = useCallback(() => {
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
  }, [onPlaySound]);

  // Pastikan status drag selalu selesai walau pointer dilepas di luar area rak
  useEffect(() => {
    if (!isDragging) return;
    const onWinPointerUp = () => handlePointerUp();
    window.addEventListener('pointerup', onWinPointerUp);
    window.addEventListener('pointercancel', onWinPointerUp);
    return () => {
      window.removeEventListener('pointerup', onWinPointerUp);
      window.removeEventListener('pointercancel', onWinPointerUp);
    };
  }, [isDragging, handlePointerUp]);

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
    <section className="relative w-full flex-1 flex flex-col justify-between overflow-x-clip bg-page select-none min-h-0">
      {/* 1. Banner CTA Desain Custom di Atas Rak (Hanya Tampil di Mobile, Fokus Utama Ajakan ke WA) */}
      <div className="w-full px-4 pt-2.5 pb-1 z-20 flex justify-center flex-shrink-0 md:hidden">
        <a
          href={getWhatsAppUrl(STORE_CONFIG.whatsapp.customDesignMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackWhatsAppClick({
              location: 'rack_mobile_banner',
              categoryId: categoryData.id,
              categoryLabel: categoryData.tabLabel,
              itemId: activeItem?.id,
              itemName: activeName,
              colorName: activeColorName,
            })
          }
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
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center overflow-hidden z-0">
        <div className="flex flex-col items-center select-none transform -translate-y-4 md:-translate-y-6">
          <span
            className={`font-display text-[32vw] md:text-[18vw] leading-none text-[#ebe8f2] tracking-wider select-none transition-[opacity,transform] motion-reduce:transition-none motion-reduce:transform-none ${heroTransitionClass}`}
          >
            {categoryData.heroTitle || 'APPAREL'}
          </span>
        </div>
      </div>

      {/* 3. Callout Kiri & Kanan (Hanya di Layar Lebar xl+ agar Tidak Menutupi Baju Pinggir) */}
      <aside className="hidden xl:flex flex-col absolute xl:left-8 2xl:left-12 top-1/2 -translate-y-1/2 z-0 pointer-events-none text-left">
        <span className="font-serif italic text-3xl 2xl:text-4xl text-ink leading-tight">Tampil</span>
        <span className="font-sans font-black text-2xl 2xl:text-3xl text-ink tracking-tight">MENAWAN</span>
      </aside>

      <aside className="hidden xl:flex flex-col absolute xl:right-8 2xl:right-12 top-1/2 -translate-y-1/2 z-0 pointer-events-none text-right">
        <span className="font-serif italic text-3xl 2xl:text-4xl text-ink leading-tight">
          {categoryData.id === 'kaos' ? 'Bisa' : 'Minimal'}
        </span>
        <span className="font-sans font-black text-2xl 2xl:text-3xl text-ink tracking-tight">
          {categoryData.id === 'kaos' ? 'SATUAN & GROSIR' : '6 PCS & GROSIR'}
        </span>
      </aside>

      {/* 4. PIPA GANTUNGAN CHROME HORIZONTAL & DERETAN BAJU BERGOYANG ALAMI */}
      <div className="relative w-full z-10 flex-1 flex flex-col justify-center my-auto min-h-0">
        <div className="relative w-full">
          {/* Batang Kawat Chrome Horizontal (Tepat menembus lengkung kait hanger di y=6px + pt-3) */}
          <div className="absolute top-[17px] md:top-[18px] left-0 right-0 h-[7px] md:h-[8px] bg-gradient-to-b from-[#d6d4de] via-white via-28% to-[#1c1b1a] z-0 shadow-sm pointer-events-none">
            <div className="w-full h-[2px] bg-white/85" />
          </div>

          {/* Gradient fade tepi kiri & kanan khusus mobile agar jelas bisa digeser horizontal */}
          <div
            aria-hidden="true"
            className="md:hidden pointer-events-none absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-page to-transparent z-20"
          />
          <div
            aria-hidden="true"
            className="md:hidden pointer-events-none absolute inset-y-0 right-0 w-7 bg-gradient-to-l from-page to-transparent z-20"
          />

          {/* Deretan Baju Gantungan yang Bisa Digeser, Di-hover, & Di-klik di HP */}
          <div
            ref={rackListRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onScroll={handleScroll}
            className="w-full flex items-start justify-start overflow-x-auto overflow-y-hidden no-scrollbar px-6 md:px-12 pt-3 pb-3 md:pb-6 cursor-grab active:cursor-grabbing z-10"
          >
            <div
              className={`flex items-start gap-1 md:gap-2.5 mx-auto transition-[opacity,transform] will-change-transform motion-reduce:transition-none motion-reduce:transform-none ${rackTransitionClass}`}
            >
              {items.map((item, idx) => {
                const isDisplayFront = idx === displayIndex;
                const custom = customPhotos[item.id];
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

                      if (hoverTimerRef.current) {
                        clearTimeout(hoverTimerRef.current);
                      }

                      // Jeda singkat 105ms agar sapuan kursor menuju tombol bawah tidak tidak sengaja mengganti baju
                      hoverTimerRef.current = setTimeout(() => {
                        const prevIdx = prevHoveredIndexRef.current;
                        const dir: 'left' | 'right' = idx >= prevIdx ? 'right' : 'left';
                        prevHoveredIndexRef.current = idx;

                        triggerSway(idx, dir, 'hover');
                        onPlaySound('sway');

                        if (displayIndex !== idx) {
                          setHoveredIndex(idx);
                          onSelectIndex(idx);
                        }
                      }, 105);
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType !== 'mouse') return;
                      if (hoverTimerRef.current) {
                        clearTimeout(hoverTimerRef.current);
                        hoverTimerRef.current = null;
                      }
                    }}
                    onClick={() => {
                      // Hindari klik jika pengguna baru saja menggeser/swipe rel
                      if (hasDraggedRef.current) return;
                      if (hoverTimerRef.current) {
                        clearTimeout(hoverTimerRef.current);
                        hoverTimerRef.current = null;
                      }

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
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        e.preventDefault();
                        const nextIdx =
                          e.key === 'ArrowRight'
                            ? Math.min(items.length - 1, idx + 1)
                            : Math.max(0, idx - 1);
                        if (nextIdx !== idx) {
                          onPlaySound('sway');
                          triggerSway(nextIdx, e.key === 'ArrowRight' ? 'right' : 'left', 'click');
                          onSelectIndex(nextIdx);
                          setHoveredIndex(nextIdx);
                          const slots = rackListRef.current?.querySelectorAll<HTMLElement>('.hanger-slot');
                          slots?.[nextIdx]?.focus();
                        }
                        return;
                      }
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (displayIndex !== idx) {
                          onPlaySound('sway');
                          triggerSway(idx, 'right', 'click');
                          onSelectIndex(idx);
                          setHoveredIndex(idx);
                        } else {
                          onPlaySound('open');
                          onOpenDetail(idx);
                        }
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${custom?.name || item.name} (${custom?.colorName || item.colorName}) — tekan untuk lihat detail`}
                    className={`relative hanger-slot flex flex-col items-center cursor-pointer transition-[width] duration-300 ease-out [perspective:1000px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 rounded-2xl ${
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
                      {/* Gantungan Hook SVG (tanpa tag harga) */}
                      <div className="w-[100px] md:w-[110px] h-[52px] md:h-[58px] flex-shrink-0">
                        <HangerHookSVG
                          showPriceTag={false}
                          isSideView={!isDisplayFront}
                          hideHangerBody={hasPhotoHanger}
                        />
                      </div>

                      {/* Panggung Baju 3D (Dua Sisi: Samping & Depan berputar mulus tanpa lonjakan ukuran) */}
                      <div
                        className={`relative w-full h-[260px] md:h-[268px] flex items-start justify-center [perspective:1000px] ${
                          hasPhotoHanger ? '-mt-[26px] md:-mt-[30px]' : '-mt-1.5'
                        } ${
                          !custom?.frontDataUrl && !custom?.sideDataUrl && (item.front || item.side)
                            ? '[mask-image:linear-gradient(to_bottom,transparent_0px,transparent_22px,black_25px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0px,transparent_22px,black_25px)]'
                            : ''
                        }`}
                      >
                        {/* SISI SAMPING (Tampil saat menyamping di rak) */}
                        <div
                          className={`absolute inset-0 flex items-start justify-center transition-[opacity,transform] duration-[250ms] ease-out motion-reduce:transition-none origin-center ${
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
                          className={`absolute inset-0 flex items-start justify-center transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none origin-center ${
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
                              isFlashActive={isFlashActive && isDisplayFront}
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

        {/* Slot tombol Efek Flash dengan tinggi tetap agar tinggi rak tidak berubah-ubah (desktop & mobile) */}
        <div className="w-full h-[50px] flex items-center justify-center mt-1 mb-1 px-4 z-20 flex-shrink-0">
          {hasFlashEffect && onToggleFlash && (
            <button
              type="button"
              onClick={onToggleFlash}
              aria-pressed={isFlashActive}
              className={`press inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full text-[12.5px] font-bold border transition-all cursor-pointer shadow-sm ${
                isFlashActive
                  ? 'bg-ink text-surface border-ink shadow-soft'
                  : 'bg-surface text-ink border-line hover:border-brand/50 hover:text-brand'
              }`}
            >
              <Zap className={`w-4 h-4 ${isFlashActive ? 'text-yellow-300 fill-yellow-300' : 'text-brand'}`} />
              <span>{isFlashActive ? 'Sablon Menyala: Aktif' : 'Tes Sablon Menyala (Flash)'}</span>
            </button>
          )}
        </div>

        {/* Petunjuk interaksi & informasi bebas custom untuk pengunjung awam */}
        <p className="md:hidden text-center text-[12px] font-medium text-muted mt-1 px-4 select-none">
          Contoh hasil produksi · Geser &amp; ketuk baju · Motif &amp; logo bebas custom
        </p>
        <p className="hidden md:block text-center text-[12px] font-medium text-muted mt-1 px-4 select-none">
          Contoh hasil produksi · Arahkan kursor atau klik baju · Motif, logo &amp; tulisan bebas custom
        </p>

        {/* Bar Kategori di Bawah Rak Baju (Tampil di HP & layar < 900px agar header atas tidak penuh) */}
        {categories && categories.length > 0 && (
          <div className="min-[900px]:hidden w-full max-w-[500px] mx-auto px-3.5 mt-4 z-20 flex-shrink-0">
            <nav className="grid grid-cols-3 gap-2 w-full" aria-label="Kategori pakaian">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={currentCategory === cat.id}
                  onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                  className={`h-[44px] min-h-[44px] px-2 rounded-full text-[13px] font-semibold flex items-center justify-center transition-all duration-200 ease-out press-active cursor-pointer ${
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
      <footer className="relative w-full z-20 px-4 md:px-8 pt-1 pb-[max(20px,calc(16px+env(safe-area-inset-bottom)))] md:py-4 flex flex-col md:flex-row items-center justify-between gap-2.5 md:gap-3 max-w-[1340px] mx-auto flex-shrink-0">
        {/* Tombol CTA Desain Custom di Kiri Bawah (Satu-satunya CTA di Desktop, Selaras Desain Sistem) */}
        <a
          href={getWhatsAppUrl(STORE_CONFIG.whatsapp.customDesignMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackWhatsAppClick({
              location: 'rack_desktop_cta',
              categoryId: categoryData.id,
              categoryLabel: categoryData.tabLabel,
              itemId: activeItem?.id,
              itemName: activeName,
              colorName: activeColorName,
            })
          }
          className="press hidden md:inline-flex shrink-0 relative rounded-full p-[2px] overflow-hidden shadow-[0_6px_24px_rgba(123,41,186,0.18)] cursor-pointer group"
          title="Konsultasi Desain Custom via WhatsApp"
        >
          <span aria-hidden="true" className="cta-loop-ring pointer-events-none" />
          <span className="relative z-10 flex items-center gap-2.5 sm:gap-3 bg-surface/95 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 rounded-full whitespace-nowrap">
            <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 text-brand shrink-0" />
            <span className="text-[13.5px] sm:text-[14.5px] font-bold text-ink group-hover:text-brand transition-colors">
              Desain custom? Chat via WhatsApp
            </span>
          </span>
        </a>

        {/* Info Produk Aktif & Tombol Buka Detail (Satu tombol utuh tanpa nested button) */}
        <button
          type="button"
          onClick={() => {
            onPlaySound('open');
            onOpenDetail(displayIndex);
          }}
          className="press flex items-center justify-between gap-3 sm:gap-5 bg-surface/95 backdrop-blur-md border border-line px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.08)] hover:border-brand/40 cursor-pointer transition-all w-full max-w-[440px] md:max-w-[560px] md:w-auto text-left group"
        >
          <div className={`flex items-center gap-3 min-w-0 transition-[opacity,transform] motion-reduce:transition-none motion-reduce:transform-none ${metaTransitionClass}`}>
            <span
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-surface ring-1 ring-line/80 shadow-sm shrink-0"
              style={{ backgroundColor: activeItem?.hex || '#ffffff' }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] sm:text-[16px] font-bold text-ink truncate leading-tight">
                {activeName}
              </span>
              <span className="text-xs sm:text-[13px] text-muted font-medium truncate leading-normal">
                {activeColorName} · Bisa custom motif &amp; logo
              </span>
            </div>
          </div>

          <span className="flex items-center gap-2 h-11 px-4 sm:px-5 rounded-full bg-brand group-hover:bg-brand-hover text-white text-sm font-bold shadow-sm transition-colors whitespace-nowrap shrink-0">
            <span>Lihat detail</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </footer>
    </section>
  );
}