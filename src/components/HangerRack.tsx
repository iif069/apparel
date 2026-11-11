'use client';

import React, { useRef, useEffect } from 'react';
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

  const items = categoryData.rack;
  const activeItem = items[activeIndex] || items[0];
  const activeCustom = customPhotos[activeItem?.id];
  const activePrice = activeCustom?.price || activeItem?.price || 60000;
  const activeName = activeCustom?.name || activeItem?.name;
  const activeColor = activeCustom?.colorName || activeItem?.colorName;

  // Auto scroll ke active slot saat index berubah di mobile
  useEffect(() => {
    const el = rackListRef.current;
    if (!el) return;
    const slots = el.querySelectorAll<HTMLElement>('.hanger-slot');
    const target = slots[activeIndex];
    if (target && window.innerWidth <= 768) {
      const containerW = el.clientWidth;
      const targetLeft = target.offsetLeft;
      const targetW = target.offsetWidth;
      el.scrollTo({
        left: targetLeft - containerW / 2 + targetW / 2,
        behavior: 'smooth',
      });
    }
  }, [activeIndex]);

  // Pointer drag gestures untuk touch / swipe
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!rackListRef.current) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragScrollLeftRef.current = rackListRef.current.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !rackListRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
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
    <section className="relative w-full min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-68px)] flex flex-col justify-between overflow-hidden bg-page select-none">
      {/* 1. Bar Kategori Khusus HP (3 Kolom Seimbang Sesuai Desain Sistem: tinggi 42px, font 13px) */}
      {categories && categories.length > 0 && (
        <div className="md:hidden w-full px-3.5 pt-3 pb-2 z-20">
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

      {/* 2. Latar Polos & Tipografi Raksasa "APPAREL" */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center overflow-hidden z-0">
        <h1 className="font-display text-[20vw] md:text-[18vw] leading-none text-[#ebe8f2] tracking-wider select-none transform -translate-y-8 md:-translate-y-12">
          {categoryData.heroTitle || 'APPAREL'}
        </h1>
        {/* Bayangan Lantai Perspektif 3D */}
        <div className="absolute bottom-16 md:bottom-20 w-full flex justify-center [perspective:800px]">
          <div
            className="font-display text-[15vw] md:text-[14vw] leading-none text-[#ded9e8]/50 tracking-wider select-none origin-bottom [transform:rotateX(75deg)_scaleY(0.5)] opacity-60 filter blur-[1px]"
            aria-hidden="true"
          >
            {categoryData.watermark || 'APPAREL'}
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
      <div className="relative w-full z-10 flex-1 flex flex-col justify-center my-auto">
        <div className="relative w-full">
          {/* Batang Kawat Chrome Horizontal (Tepat menembus lubang lengkung kait hanger) */}
          <div className="absolute top-[16px] md:top-[18px] left-0 right-0 h-[8px] bg-gradient-to-b from-[#d6d4de] via-white via-28% to-[#1c1b1a] z-0 shadow-sm pointer-events-none">
            <div className="w-full h-[2px] bg-white/85" />
          </div>

          {/* Deretan Baju Gantungan yang Bisa Digeser & Di-hover di Desktop */}
          <div
            ref={rackListRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="w-full flex items-start justify-start md:justify-center overflow-x-auto no-scrollbar px-6 md:px-16 pt-0 pb-6 cursor-grab active:cursor-grabbing z-10"
          >
            <div className="flex items-start gap-1 md:gap-3 mx-auto">
              {items.map((item, idx) => {
                const isActive = idx === activeIndex;
                const custom = customPhotos[item.id];
                const price = custom?.price || item.price;
                const priceText = `Rp ${Math.round(price / 1000)}rb`;

                return (
                  <div
                    key={item.id}
                    onPointerEnter={(e) => {
                      // Desktop hover: otomatis putar ke tampak depan & bunyikan slide halus (tanpa pop-up)
                      if (e.pointerType === 'mouse' && activeIndex !== idx) {
                        onSelectIndex(idx);
                        onPlaySound('slide');
                      }
                    }}
                    onClick={() => {
                      // Klik baju yang sudah menghadap depan → buka detail.
                      // Klik baju yang masih tampak samping (HP, tanpa hover) → putar ke depan dulu.
                      if (isActive) {
                        onPlaySound('open');
                        onOpenDetail(idx);
                      } else {
                        onPlaySound('slide');
                        onSelectIndex(idx);
                      }
                    }}
                    className={`hanger-slot flex flex-col items-center cursor-pointer transition-[width] duration-500 ease-out [perspective:900px] ${
                      isActive ? 'w-[200px] md:w-[220px] z-30' : 'w-[84px] md:w-[94px] z-10'
                    }`}
                  >
                    {/* Gantungan Hook SVG + label harga (tampil pada baju yang sedang menghadap depan) */}
                    <div className="w-[100px] md:w-[114px] h-[52px] md:h-[58px] flex-shrink-0">
                      <HangerHookSVG priceTagText={priceText} showPriceTag={isActive} />
                    </div>

                    {/* Siluet atau Foto Baju — berputar (rotateY) ke tampak depan saat aktif / di-hover, tanpa efek membesar */}
                    <div
                      key={isActive ? 'front' : 'side'}
                      className={`w-full h-[230px] md:h-[260px] flex items-start justify-center -mt-1.5 ${
                        isActive ? 'animate-garment-turn' : 'animate-garment-turn-back'
                      }`}
                    >
                      <GarmentSVG
                        item={item}
                        categoryId={categoryData.id}
                        viewAngle={isActive ? 'front' : 'side-left'}
                        custom={custom}
                        className="max-h-full drop-shadow-md"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 5. BAR AKSI BAWAH RAK */}
      <footer className="relative w-full z-20 px-4 md:px-8 py-4 md:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 max-w-[1340px] mx-auto">
        <div className="flex items-center gap-2 text-ink/75 font-medium text-[13px] bg-surface/80 backdrop-blur-sm border border-line px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span>{categoryData.kicker}</span>
        </div>

        {/* Floating Pill Info Produk Aktif & Tombol Lihat Detail */}
        <div
          onClick={() => {
            onPlaySound('open');
            onOpenDetail(activeIndex);
          }}
          className="flex items-center justify-between gap-4 bg-surface border border-line px-4 py-2.5 rounded-full shadow-soft hover:shadow-card cursor-pointer transition-all press-active max-w-[360px] w-full sm:w-auto"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-5 h-5 rounded-full border border-line flex-shrink-0"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-surface text-[12px] font-bold shadow-sm whitespace-nowrap"
          >
            <span>Lihat detail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </section>
  );
}
