'use client';

import React, { useRef, useState } from 'react';
import { GarmentItem, CategoryId, ViewAngle, CustomPhotoData } from '@/types';
import { HangerHookSVG } from './HangerHookSVG';
import { GarmentSVG } from './GarmentSVG';

interface GarmentRotatorProps {
  item: GarmentItem;
  categoryId: CategoryId;
  viewAngle: ViewAngle;
  onAngleChange: (angle: ViewAngle) => void;
  custom?: CustomPhotoData;
  onPlaySound: (type: 'slide' | 'flip') => void;
}

export function GarmentRotator({
  item,
  categoryId,
  viewAngle,
  onAngleChange,
  custom,
  onPlaySound,
}: GarmentRotatorProps) {
  const [spinDeg, setSpinDeg] = useState(viewAngle === 'back' ? 180 : 0);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const dragStartX = useRef(0);
  const dragStartDeg = useRef(0);

  const price = custom?.price || item.price;
  const priceText = `Rp ${Math.round(price / 1000)}rb`;
  const hasOwnHanger = !!(
    (custom && custom.ownHanger !== false && (custom.frontDataUrl || custom.sideDataUrl)) ||
    item.front ||
    item.side
  );

  // Sinkronisasi saat tab sudut diklik
  React.useEffect(() => {
    if (viewAngle === 'side-left') {
      setSpinDeg(0);
    } else if (viewAngle === 'back') {
      setSpinDeg(180);
    } else {
      setSpinDeg(0);
    }
  }, [viewAngle]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartDeg.current = spinDeg;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    setSpinDeg(dragStartDeg.current + dx * 0.85);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const moved = Math.abs(e.clientX - dragStartX.current);

    // Jika hanya klik ringan (moved < 6px): flip front/back
    if (moved < 6) {
      const nextAngle = viewAngle === 'front' ? 'back' : 'front';
      onAngleChange(nextAngle);
      setSpinDeg(nextAngle === 'back' ? 180 : 0);
      onPlaySound('flip');
      return;
    }

    // Normalisasi snap ke 0° (Depan) atau 180° (Belakang)
    const normalized = ((spinDeg % 360) + 360) % 360;
    if (normalized > 90 && normalized < 270) {
      setSpinDeg(180);
      onAngleChange('back');
    } else {
      setSpinDeg(0);
      onAngleChange('front');
    }
    onPlaySound('flip');
  };

  // Efek 3D Tilt Parallax saat mouse bergerak di atas baju
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 sampai 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title="Geser ke kiri/kanan atau ketuk untuk memutar baju"
      className="group relative z-10 w-full max-w-[300px] md:max-w-[420px] lg:max-w-[500px] xl:max-w-[540px] h-[290px] md:h-[440px] lg:h-[520px] xl:h-[560px] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing [perspective:1200px] select-none touch-pan-y"
    >
      {/* Aura Spotlight Lembut di Belakang Baju saat di-hover */}
      <div
        className={`absolute inset-0 -z-10 rounded-full transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(123, 41, 186, 0.15) 0%, transparent 65%)',
        }}
      />

      {/* 1. Kait Gantungan Atas (Disembunyikan jika foto custom punya gantungan sendiri) */}
      {!hasOwnHanger && (
        <div className="w-[104px] md:w-[130px] lg:w-[144px] h-[48px] md:h-[60px] lg:h-[66px] flex-shrink-0 z-20 transition-transform duration-200 group-hover:-translate-y-1">
          <HangerHookSVG priceTagText={priceText} showPriceTag={false} />
        </div>
      )}

      {/* 2. Panggung Baju Berputar 3D dengan Parallax Tilt & Shimmer Efek */}
      <div
        className={`relative w-full flex-1 preserve-3d flex items-center justify-center transition-all ${
          isDragging
            ? 'transition-none scale-98'
            : isHovered
            ? 'transition-transform duration-200 ease-out scale-[1.02]'
            : 'transition-transform duration-500 ease-out scale-100'
        }`}
        style={{
          transform: `rotateY(${spinDeg + (isDragging ? 0 : mouseTilt.x)}deg) rotateX(${
            isDragging ? 0 : mouseTilt.y
          }deg)`,
          marginTop: hasOwnHanger ? '0px' : '-4px',
        }}
      >
        {/* TAMPAK DEPAN / SAMPING */}
        <div className="absolute inset-0 flex flex-col items-center justify-center backface-hidden shimmer-container">
          <div className="h-[245px] md:h-[370px] lg:h-[480px] xl:h-[520px] max-h-[245px] md:max-h-[370px] lg:max-h-[480px] xl:max-h-[520px] w-auto max-w-full flex items-center justify-center filter drop-shadow-md group-hover:drop-shadow-[0_16px_30px_rgba(123,41,186,0.25)] transition-all duration-300">
            <GarmentSVG
              item={item}
              categoryId={categoryId}
              viewAngle={viewAngle === 'side-left' ? 'side-left' : 'front'}
              custom={custom}
              className="max-h-full"
            />
          </div>
        </div>

        {/* TAMPAK BELAKANG (180°) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center backface-hidden [transform:rotateY(180deg)] shimmer-container">
          <div className="h-[245px] md:h-[370px] lg:h-[480px] xl:h-[520px] max-h-[245px] md:max-h-[370px] lg:max-h-[480px] xl:max-h-[520px] w-auto max-w-full flex items-center justify-center filter drop-shadow-md group-hover:drop-shadow-[0_16px_30px_rgba(123,41,186,0.25)] transition-all duration-300">
            <GarmentSVG
              item={item}
              categoryId={categoryId}
              viewAngle="back"
              custom={custom}
              className="max-h-full"
            />
          </div>
        </div>
      </div>

      {/* Indikator Interaktif Bawah (Hint Geser / Ketuk) */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-surface/80 backdrop-blur-xs border border-line text-[11px] font-medium text-ink/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xs">
        Geser 360° atau ketuk untuk membalik
      </div>
    </div>
  );
}
