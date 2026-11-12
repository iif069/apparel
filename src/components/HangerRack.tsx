'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { GarmentItem, CategoryData, CustomPhotoData, CategoryId } from '@/types';
import { HangerHookSVG } from './HangerHookSVG';
import { GarmentSVG } from './GarmentSVG';

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
      {/* 1. Bar Kategori Khusus HP (3 Kolom Seimbang Sesuai Desain Sistem) */}
      {categories && categories.length > 0 && (
        <div className="md:hidden w-full px-3.5 pt-2.5 pb-1.5 z-20 flex-shrink-0">
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

      {/* 2. Latar Polos & Tipografi Raksasa "APPAREL" dengan Refleksi Lantai Perspektif 3D */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center overflow-hidden z-0">
        <div className="flex flex-col items-center select-none transform -translate-y-8 md:-translate-y-12">
          {/* Teks Atas Tegak */}
          <h1 className="font-display text-[32vw] md:text-[18vw] leading-none text-[#ebe8f2] tracking-wider select-none">
            {categoryData.heroTitle || 'APPAREL'}
          </h1>

          {/* Bayangan Lantai Perspektif 3D Mirrored Vertikal */}
          <div className="w-full flex justify-center [perspective:500px] mt-2 md:mt-3">
            <div
              className="origin-top [transform:rotateX(68deg)] filter blur-[0.5px]"
              style={{
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0) 85%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0) 85%)',
              }}
            >
              <div
                className="font-display text-[32vw] md:text-[18vw] leading-none text-[#ded9e8] tracking-wider select-none [transform:scaleY(-1)]"
                aria-hidden="true"
              >
                {categoryData.watermark || 'APPAREL'}
              </div>
            </div>
          </div>
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
          {/* Batang Kawat Chrome Horizontal (Tepat menembus lengkung kait hanger di y=6px) */}
          <div className="absolute top-[5px] md:top-[6px] left-0 right-0 h-[7px] md:h-[8px] bg-gradient-to-b from-[#d6d4de] via-white via-28% to-[#1c1b1a] z-0 shadow-sm pointer-events-none">
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
            className="w-full flex items-start justify-start md:justify-center overflow-x-auto no-scrollbar px-6 md:px-12 pt-0 pb-6 cursor-grab active:cursor-grabbing z-10"
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
                        ? 'w-[210px] md:w-[240px] z-30'
                        : 'w-[58px] md:w-[68px] z-10'
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
                        className={`relative w-full h-[230px] md:h-[260px] flex items-start justify-center [perspective:1000px] ${
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
                              className="max-h-full drop-shadow-md"
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
                              className="max-h-full drop-shadow-md"
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
      </div>

      {/* 5. BAR AKSI BAWAH RAK */}
      <footer className="relative w-full z-20 px-4 md:px-8 pt-1 pb-[max(18px,calc(14px+env(safe-area-inset-bottom)))] md:py-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 md:gap-3 max-w-[1340px] mx-auto flex-shrink-0">
        <div className="hidden sm:flex items-center gap-2 text-ink/75 font-medium text-[13px] bg-surface border border-line px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span>{categoryData.kicker}</span>
        </div>

        {/* Info Produk Aktif & Tombol Buka Detail (Ukuran Font & Tombol Proporsional Sesuai UI/UX MIG) */}
        <div
          onClick={() => {
            onPlaySound('open');
            onOpenDetail(displayIndex);
          }}
          className="flex items-center justify-between gap-3 sm:gap-5 bg-surface/95 backdrop-blur-md border border-line px-4 py-2.5 sm:px-5 sm:py-3 rounded-full shadow-[0_6px_24px_rgba(0,0,0,0.08)] hover:border-brand/40 cursor-pointer transition-all press-active w-full max-w-[440px] sm:w-auto"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-surface ring-1 ring-line/80 shadow-xs flex-shrink-0"
              style={{ backgroundColor: activeItem?.hex || '#ffffff' }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] sm:text-[16px] font-bold text-ink truncate leading-tight">
                {activeName}
              </span>
              <span className="text-[13px] sm:text-[13.5px] text-ink/65 font-medium truncate leading-normal">
                Mulai dari <strong className="text-ink font-bold tabular-nums">Rp {activePrice.toLocaleString('id-ID')}</strong>
              </span>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 h-11 sm:h-12 px-4 sm:px-5 rounded-full bg-brand hover:bg-brand-hover active:scale-95 text-surface text-[14px] sm:text-[15px] font-bold shadow-sm hover:shadow-md transition-all whitespace-nowrap flex-shrink-0"
          >
            <span>Lihat detail</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </section>
  );
}