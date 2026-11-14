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

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      title="Geser ke kiri/kanan atau ketuk untuk memutar baju"
      className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] md:max-w-[440px] lg:max-w-[500px] xl:max-w-[540px] h-[360px] sm:h-[390px] md:h-[440px] lg:h-[520px] xl:h-[560px] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing [perspective:1200px] select-none touch-pan-y"
    >
      {/* 1. Kait Gantungan Atas (Disembunyikan jika foto custom punya gantungan sendiri - tanpa pop-up tooltip) */}
      {!hasOwnHanger && (
        <div className="w-[116px] md:w-[130px] lg:w-[144px] h-[52px] md:h-[60px] lg:h-[66px] flex-shrink-0 z-20">
          <HangerHookSVG priceTagText={priceText} showPriceTag={false} />
        </div>
      )}

      {/* 2. Panggung Baju Berputar 3D (Sejajar dan proporsional di tengah) */}
      <div
        className={`relative w-full flex-1 preserve-3d flex items-center justify-center ${
          isDragging ? 'transition-none' : 'transition-transform duration-500 ease-out'
        }`}
        style={{
          transform: `rotateY(${spinDeg}deg)`,
          marginTop: hasOwnHanger ? '0px' : '-4px',
        }}
      >
        {/* TAMPAK DEPAN / SAMPING */}
        <div className="absolute inset-0 flex flex-col items-center justify-center backface-hidden">
          <div className="h-full max-h-[345px] sm:max-h-[375px] md:max-h-[400px] lg:max-h-[480px] xl:max-h-[520px] w-auto max-w-full flex items-center justify-center">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center backface-hidden [transform:rotateY(180deg)]">
          <div className="h-full max-h-[345px] sm:max-h-[375px] md:max-h-[400px] lg:max-h-[480px] xl:max-h-[520px] w-auto max-w-full flex items-center justify-center">
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
    </div>
  );
}
