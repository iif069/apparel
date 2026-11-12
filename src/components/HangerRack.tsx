'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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
  onPlaySound: (type: 'slide' | 'open') => void;
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
  const dragScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const desktopDragStartXRef = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const items = categoryData.rack;
  const n = items.length;
  const displayIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
  const activeItem = items[displayIndex] || items[0];
  const activeCustom = customPhotos[activeItem?.id];
  const activePrice = activeCustom?.price || activeItem?.price || 60000;
  const activeName = activeCustom?.name || activeItem?.name;
  const activeColor = activeCustom?.colorName || activeItem?.colorName;

  // Indeks untuk produk kiri dan kanan pada tampilan desktop
  const hasMultiple = n > 1;
  const leftIndex = (displayIndex - 1 + n) % n;
  const rightIndex = (displayIndex + 1) % n;
  const leftItem = items[leftIndex];
  const rightItem = items[rightIndex];
  const leftCustom = leftItem ? customPhotos[leftItem.id] : undefined;
  const rightCustom = rightItem ? customPhotos[rightItem.id] : undefined;

  const hasPhotoHangerCenter = !!((activeCustom && (activeCustom.frontDataUrl || activeCustom.sideDataUrl)) || activeItem?.front || activeItem?.side);
  const hasPhotoHangerLeft = !!((leftCustom && (leftCustom.frontDataUrl || leftCustom.sideDataUrl)) || leftItem?.front || leftItem?.side);
  const hasPhotoHangerRight = !!((rightCustom && (rightCustom.frontDataUrl || rightCustom.sideDataUrl)) || rightItem?.front || rightItem?.side);

  // Auto scroll ke active slot saat index berubah di mobile
  useEffect(() => {
    const el = rackListRef.current;
    if (!el) return;
    const slots = el.querySelectorAll<HTMLElement>('.hanger-slot');
    const target = slots[displayIndex];
    if (target && window.innerWidth <= 768) {
      const containerW = el.clientWidth;
      const targetLeft = target.offsetLeft;
      const targetW = target.offsetWidth;
      el.scrollTo({
        left: targetLeft - containerW / 2 + targetW / 2,
        behavior: 'smooth',
      });
    }
  }, [displayIndex]);

  // Keyboard navigation untuk desktop (Panah Kiri & Kanan)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPlaySound('slide');
        onSelectIndex((displayIndex - 1 + n) % n);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onPlaySound('slide');
        onSelectIndex((displayIndex + 1) % n);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayIndex, n, onSelectIndex, onPlaySound]);

  // Pointer drag gestures untuk touch / swipe di HP
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!rackListRef.current) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragScrollLeftRef.current = rackListRef.current.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !rackListRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 8) {
      hasDraggedRef.current = true;
    }
    rackListRef.current.scrollLeft = dragScrollLeftRef.current - dx;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const moved = Math.abs(e.clientX - dragStartXRef.current);
    if (moved > 20) {
      onPlaySound('slide');
    }
  };

  return (
    <section className="relative w-full flex-1 flex flex-col justify-between overflow-hidden bg-page select-none min-h-0">
      {/* 1. Bar Kategori Khusus HP (3 Kolom Seimbang Sesuai Desain Sistem: tinggi 42px, font 13px) */}
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

      {/* 2. Latar Polos & Tipografi Raksasa "APPAREL" dengan Refleksi Lantai Perspektif 3D Melebar & Transparan */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center overflow-hidden z-0">
        <div className="flex flex-col items-center select-none transform -translate-y-8 md:-translate-y-12">
          {/* Teks Atas Tegak */}
          <h1 className="font-display text-[32vw] md:text-[18vw] leading-none text-[#ebe8f2] tracking-wider select-none">
            {categoryData.heroTitle || 'APPAREL'}
          </h1>

          {/* Bayangan Lantai Perspektif 3D Mirrored Vertikal: Ukuran Sama, Jarak Sedikit, Flipped Vertikal, Melebar ke Depan & Fade Transparan */}
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

      {/* 4. PIPA GANTUNGAN CHROME HORIZONTAL & DERETAN BAJU */}
      <div className="relative w-full z-10 flex-1 flex flex-col justify-center my-auto min-h-0">
        <div className="relative w-full">
          {/* Batang Kawat Chrome Horizontal (Tepat menembus lengkung kait hanger) */}
          <div className="absolute top-[5px] md:top-[6px] left-0 right-0 h-[7px] md:h-[8px] bg-gradient-to-b from-[#d6d4de] via-white via-28% to-[#1c1b1a] z-0 shadow-sm pointer-events-none">
            <div className="w-full h-[2px] bg-white/85" />
          </div>

          {/* ============================================================== */}
          {/* A. TAMPILAN KHUSUS MOBILE (TETAP SAMA SEPERTI SEBELUMNYA)       */}
          {/* ============================================================== */}
          <div
            ref={rackListRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="md:hidden w-full flex items-start justify-start overflow-x-auto no-scrollbar px-6 pt-0 pb-6 cursor-grab active:cursor-grabbing z-10"
          >
            <div className="flex items-start gap-1 mx-auto">
              {items.map((item, idx) => {
                const isDisplayFront = idx === displayIndex;
                const custom = customPhotos[item.id];
                const price = custom?.price || item.price;
                const priceText = `Rp ${Math.round(price / 1000)}rb`;
                const hasPhotoHanger = !!((custom && (custom.frontDataUrl || custom.sideDataUrl)) || item.front || item.side);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (hasDraggedRef.current) return;
                      if (displayIndex === idx) {
                        onPlaySound('open');
                        onOpenDetail(idx);
                      } else {
                        onPlaySound('slide');
                        onSelectIndex(idx);
                        setHoveredIndex(idx);
                      }
                    }}
                    className={`hanger-slot flex flex-col items-center cursor-pointer transition-[width] duration-300 ease-out [perspective:1000px] ${
                      isDisplayFront ? 'w-[210px] z-30' : 'w-[58px] z-10'
                    }`}
                  >
                    {/* Hook */}
                    <div className="w-[100px] h-[52px] flex-shrink-0">
                      <HangerHookSVG
                        priceTagText={priceText}
                        showPriceTag={isDisplayFront}
                        isSideView={!isDisplayFront}
                        hideHangerBody={hasPhotoHanger}
                      />
                    </div>

                    {/* Panggung Baju 3D Mobile */}
                    <div
                      className={`relative w-full h-[230px] flex items-start justify-center [perspective:1000px] ${
                        hasPhotoHanger ? '-mt-[26px]' : '-mt-1.5'
                      }`}
                    >
                      {/* Sisi Samping */}
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

                      {/* Sisi Depan */}
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
                );
              })}
            </div>
          </div>

          {/* ============================================================== */}
          {/* B. TAMPILAN KHUSUS DESKTOP (KIRI KANAN AJA, PRODUK DITENGAH)     */}
          {/* ============================================================== */}
          <div
            onPointerDown={(e) => {
              desktopDragStartXRef.current = e.clientX;
            }}
            onPointerUp={(e) => {
              const dx = e.clientX - desktopDragStartXRef.current;
              if (dx > 45 && hasMultiple) {
                onPlaySound('slide');
                onSelectIndex(leftIndex);
              } else if (dx < -45 && hasMultiple) {
                onPlaySound('slide');
                onSelectIndex(rightIndex);
              }
            }}
            className="hidden md:flex items-start justify-center w-full z-10 px-8 py-0 select-none"
          >
            <div className="relative flex items-start justify-center gap-4 lg:gap-7 xl:gap-9 mx-auto">
              {/* 1. Baju Gantungan Samping Kiri (Previous Item) */}
              {hasMultiple && leftItem && (
                <div
                  onClick={() => {
                    onPlaySound('slide');
                    onSelectIndex(leftIndex);
                  }}
                  title={`Pilih ${leftCustom?.name || leftItem.name}`}
                  className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95 w-[75px] lg:w-[85px] z-10"
                >
                  {/* Hook Menempel Pas ke Kawat Chrome */}
                  <div className="w-[105px] h-[58px] -mt-[3.5px] flex-shrink-0">
                    <HangerHookSVG
                      isSideView={true}
                      showPriceTag={false}
                      hideHangerBody={hasPhotoHangerLeft}
                    />
                  </div>

                  {/* Baju Menyamping */}
                  <div
                    className={`relative w-full h-[280px] lg:h-[310px] flex items-start justify-center opacity-75 group-hover:opacity-100 transition-opacity ${
                      hasPhotoHangerLeft ? '-mt-[30px]' : '-mt-1.5'
                    }`}
                  >
                    <div className="h-full w-auto flex items-start justify-center">
                      <GarmentSVG
                        item={leftItem}
                        categoryId={categoryData.id}
                        viewAngle="side-left"
                        custom={leftCustom}
                        className="max-h-full drop-shadow-md"
                      />
                    </div>
                  </div>

                  {/* Tooltip Nama Produk Kiri saat Hover */}
                  <span className="mt-2 text-[11px] font-semibold text-ink/75 bg-surface border border-line px-2.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xs pointer-events-none">
                    {leftCustom?.name || leftItem.name}
                  </span>
                </div>
              )}

              {/* 2. Tombol Navigasi Kiri (Previous) - Tepat di samping baju utama */}
              {hasMultiple && (
                <div className="self-center mt-[120px] lg:mt-[140px] z-30">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySound('slide');
                      onSelectIndex(leftIndex);
                    }}
                    title={`Sebelumnya: ${leftCustom?.name || leftItem?.name}`}
                    aria-label="Produk sebelumnya"
                    className="w-10 h-10 rounded-full bg-surface/95 hover:bg-surface border border-line shadow-md hover:shadow-lg flex items-center justify-center text-ink hover:text-brand hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                  >
                    <ChevronLeft className="w-5 h-5 text-ink/70 group-hover:text-brand transition-colors" />
                  </button>
                </div>
              )}

              {/* 3. Baju Gantungan Tengah (PRODUK DITENGAH - TAMPAK DEPAN BESAR) */}
              <div
                onClick={() => {
                  onPlaySound('open');
                  onOpenDetail(displayIndex);
                }}
                title={`Buka detail & ukuran ${activeName}`}
                className="flex flex-col items-center cursor-pointer group z-30 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99] w-[310px] lg:w-[350px] xl:w-[390px] [perspective:1000px]"
              >
                {/* Hook + Label Harga */}
                <div className="w-[120px] h-[64px] flex-shrink-0">
                  <HangerHookSVG
                    priceTagText={`Rp ${Math.round(activePrice / 1000)}rb`}
                    showPriceTag={true}
                    isSideView={false}
                    hideHangerBody={hasPhotoHangerCenter}
                  />
                </div>

                {/* Baju Tampak Depan Besar */}
                <div
                  className={`relative w-full h-[360px] lg:h-[400px] xl:h-[430px] flex items-start justify-center ${
                    hasPhotoHangerCenter ? '-mt-[34px]' : '-mt-2'
                  }`}
                >
                  <div
                    key={activeItem?.id}
                    className="h-full w-auto flex-shrink-0 flex items-start justify-center drop-shadow-xl transition-all duration-300"
                  >
                    <GarmentSVG
                      item={activeItem}
                      categoryId={categoryData.id}
                      viewAngle="front"
                      custom={activeCustom}
                      className="max-h-full drop-shadow-xl"
                    />
                  </div>
                </div>

                {/* Label Buka Detail saat Hover */}
                <span className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-bold text-brand bg-brand-soft border border-brand/30 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-xs pointer-events-none">
                  <span>Klik untuk lihat detail</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* 4. Tombol Navigasi Kanan (Next) - Tepat di samping baju utama */}
              {hasMultiple && (
                <div className="self-center mt-[120px] lg:mt-[140px] z-30">
                  <button
                    type="button"
                    onClick={() => {
                      onPlaySound('slide');
                      onSelectIndex(rightIndex);
                    }}
                    title={`Selanjutnya: ${rightCustom?.name || rightItem?.name}`}
                    aria-label="Produk berikutnya"
                    className="w-10 h-10 rounded-full bg-surface/95 hover:bg-surface border border-line shadow-md hover:shadow-lg flex items-center justify-center text-ink hover:text-brand hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                  >
                    <ChevronRight className="w-5 h-5 text-ink/70 group-hover:text-brand transition-colors" />
                  </button>
                </div>
              )}

              {/* 5. Baju Gantungan Samping Kanan (Next Item) */}
              {hasMultiple && rightItem && (
                <div
                  onClick={() => {
                    onPlaySound('slide');
                    onSelectIndex(rightIndex);
                  }}
                  title={`Pilih ${rightCustom?.name || rightItem.name}`}
                  className="flex flex-col items-center cursor-pointer group transition-all duration-300 hover:scale-105 active:scale-95 w-[75px] lg:w-[85px] z-10"
                >
                  {/* Hook Menempel Pas ke Kawat Chrome */}
                  <div className="w-[105px] h-[58px] -mt-[3.5px] flex-shrink-0">
                    <HangerHookSVG
                      isSideView={true}
                      showPriceTag={false}
                      hideHangerBody={hasPhotoHangerRight}
                    />
                  </div>

                  {/* Baju Menyamping */}
                  <div
                    className={`relative w-full h-[280px] lg:h-[310px] flex items-start justify-center opacity-75 group-hover:opacity-100 transition-opacity ${
                      hasPhotoHangerRight ? '-mt-[30px]' : '-mt-1.5'
                    }`}
                  >
                    <div className="h-full w-auto flex items-start justify-center">
                      <GarmentSVG
                        item={rightItem}
                        categoryId={categoryData.id}
                        viewAngle="side-left"
                        custom={rightCustom}
                        className="max-h-full drop-shadow-md"
                      />
                    </div>
                  </div>

                  {/* Tooltip Nama Produk Kanan saat Hover */}
                  <span className="mt-2 text-[11px] font-semibold text-ink/75 bg-surface border border-line px-2.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xs pointer-events-none">
                    {rightCustom?.name || rightItem.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. BAR AKSI BAWAH RAK (Pas di 100vh tanpa perlu scroll di HP) */}
      <footer className="relative w-full z-20 px-4 md:px-8 pt-1 pb-[max(14px,calc(10px+env(safe-area-inset-bottom)))] md:py-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 md:gap-3 max-w-[1340px] mx-auto flex-shrink-0">
        <div className="hidden sm:flex items-center gap-2 text-ink/75 font-medium text-[13px] bg-surface border border-line px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span>{categoryData.kicker}</span>
        </div>

        {/* Indikator Titik Paginasi Desktop */}
        <div className="hidden md:flex items-center gap-2 bg-surface/90 backdrop-blur-xs border border-line px-3.5 py-1.5 rounded-full shadow-xs">
          {items.map((it, idx) => (
            <button
              key={it.id}
              type="button"
              onClick={() => {
                onPlaySound('slide');
                onSelectIndex(idx);
              }}
              title={customPhotos[it.id]?.name || it.name}
              aria-label={`Pilih ${it.name}`}
              className={`transition-all duration-200 rounded-full ${
                idx === displayIndex
                  ? 'w-6 h-2 bg-brand'
                  : 'w-2 h-2 bg-ink/20 hover:bg-ink/50'
              }`}
            />
          ))}
          <span className="text-[11px] font-mono text-ink/50 ml-1">
            {String(displayIndex + 1).padStart(2, '0')}/{String(items.length).padStart(2, '0')}
          </span>
        </div>

        {/* Info Produk Aktif & Tombol Buka Detail */}
        <div
          onClick={() => {
            onPlaySound('open');
            onOpenDetail(displayIndex);
          }}
          className="flex items-center justify-between gap-3 md:gap-4 bg-surface border border-line px-4 py-2 rounded-full shadow-xs hover:border-brand/40 cursor-pointer transition-all press-active max-w-[380px] w-full sm:w-auto"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-4 h-4 rounded-full border border-line flex-shrink-0"
              style={{ backgroundColor: activeItem?.hex || '#ffffff' }}
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-ink truncate">{activeName}</span>
              <span className="text-[11.5px] text-ink/60 truncate">
                Mulai dari Rp {activePrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-surface text-[12px] font-bold shadow-xs whitespace-nowrap"
          >
            <span>Lihat detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </section>
  );
}
