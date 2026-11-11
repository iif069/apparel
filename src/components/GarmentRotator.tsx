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
  const hasOwnHanger = !!(custom && custom.ownHanger !== false && (custom.frontDataUrl || custom.sideDataUrl));

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
      className="relative z-10 w-full max-w-[210px] md:max-w-[340px] h-[200px] md:h-[360px] flex flex-col items-center cursor-grab active:cursor-grabbing [perspective:1200px] select-none touch-pan-y"
    >
      {/* 1. Kait Gantungan Atas (Disembunyikan jika foto custom punya gantungan sendiri) */}
      {!hasOwnHanger && (
        <div className="w-[96px] md:w-[120px] h-[48px] md:h-[58px] flex-shrink-0 z-20">
          <HangerHookSVG priceTagText={priceText} showPriceTag={true} />
        </div>
      )}

      {/* 2. Panggung Baju Berputar 3D */}
      <div
        className={`relative w-full flex-1 preserve-3d ${
          isDragging ? 'transition-none' : 'transition-transform duration-500 ease-out'
        }`}
        style={{
          transform: `rotateY(${spinDeg}deg)`,
          marginTop: hasOwnHanger ? '-30px' : '-3px',
        }}
      >
        {/* TAMPAK DEPAN / SAMPING */}
        <div className="absolute inset-0 flex flex-col items-center justify-start backface-hidden">
          <div className="h-[155px] md:h-[300px] max-h-[155px] md:max-h-[300px] w-auto max-w-full flex items-start justify-center">
            <GarmentSVG
              item={item}
              categoryId={categoryId}
              viewAngle={viewAngle === 'side-left' ? 'side-left' : 'front'}
              custom={custom}
              className="drop-shadow-sm max-h-full"
            />
          </div>
        </div>

        {/* TAMPAK BELAKANG (180°) */}
        <div className="absolute inset-0 flex flex-col items-center justify-start backface-hidden [transform:rotateY(180deg)]">
          <div className="h-[155px] md:h-[300px] max-h-[155px] md:max-h-[300px] w-auto max-w-full flex items-start justify-center">
            <GarmentSVG
              item={item}
              categoryId={categoryId}
              viewAngle="back"
              custom={custom}
              className="drop-shadow-sm max-h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
