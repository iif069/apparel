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
  isFlashActive?: boolean;
  onPlaySound: (type: 'slide' | 'flip') => void;
}

export function GarmentRotator({
  item,
  categoryId,
  viewAngle,
  onAngleChange,
  custom,
  isFlashActive = false,
  onPlaySound,
}: GarmentRotatorProps) {
  const [spinDeg, setSpinDeg] = useState(viewAngle === 'back' ? 180 : 0);
  const [isDragging, setIsDragging] = useState(false);
  const spinDegRef = useRef(spinDeg);
  spinDegRef.current = spinDeg;
  const dragStartX = useRef(0);
  const dragStartDeg = useRef(0);

  const hasOwnHanger = !!(
    (custom && custom.ownHanger !== false && (custom.frontDataUrl || custom.sideDataUrl)) ||
    item.front ||
    item.side
  );

  // Sinkronisasi mulus ke kelipatan 180° terdekat saat tab sudut diklik
  React.useEffect(() => {
    const cur = spinDegRef.current;
    const baseTurn = Math.round(cur / 360) * 360;
    if (viewAngle === 'back') {
      const candPos = baseTurn + 180;
      const candNeg = baseTurn - 180;
      setSpinDeg(Math.abs(cur - candPos) <= Math.abs(cur - candNeg) ? candPos : candNeg);
    } else {
      setSpinDeg(baseTurn);
    }
  }, [viewAngle]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartDeg.current = spinDegRef.current;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Abaikan jika event sintetis tidak mendukung pointer capture
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX.current;
    setSpinDeg(dragStartDeg.current + dx * 0.85);
  };

  const finishDrag = (e: React.PointerEvent, cancelled = false) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Abaikan
    }

    const moved = Math.abs(e.clientX - dragStartX.current);

    // Jika hanya klik ringan (moved < 6px): flip depan/belakang
    if (!cancelled && moved < 6) {
      const nextAngle = viewAngle === 'front' ? 'back' : 'front';
      onAngleChange(nextAngle);
      onPlaySound('flip');
      return;
    }

    // Snap ke kelipatan 180° terdekat agar tidak berputar 360° balik arah
    const nearestStep = Math.round(spinDegRef.current / 180);
    const targetDeg = nearestStep * 180;
    const isBack = Math.abs(nearestStep % 2) === 1;
    setSpinDeg(targetDeg);
    onAngleChange(isBack ? 'back' : 'front');
    if (!cancelled) {
      onPlaySound('flip');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const nextAngle = viewAngle === 'front' ? 'back' : 'front';
      onAngleChange(nextAngle);
      onPlaySound('flip');
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${item.name} — tekan untuk membalik tampilan depan dan belakang`}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(e) => finishDrag(e, false)}
      onPointerCancel={(e) => finishDrag(e, true)}
      title="Geser atau ketuk baju untuk lihat sisi depan & belakang"
      className="relative z-10 w-full max-w-[380px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[540px] xl:max-w-[580px] h-[365px] sm:h-[400px] md:h-[440px] lg:h-[clamp(385px,61dvh,540px)] lg:max-h-[calc(100dvh-176px)] xl:h-[clamp(420px,64dvh,580px)] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing [perspective:1200px] select-none touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 rounded-3xl"
    >
      {/* 1. Kait Gantungan Atas (Disembunyikan jika foto custom punya gantungan sendiri - tanpa pop-up tooltip) */}
      {!hasOwnHanger && (
        <div className="w-[116px] md:w-[130px] lg:w-[144px] h-[52px] md:h-[60px] lg:h-[66px] flex-shrink-0 z-20">
          <HangerHookSVG showPriceTag={false} />
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
          <div className="h-full max-h-[calc(100%-10px)] w-auto max-w-full flex items-center justify-center">
            <GarmentSVG
              item={item}
              categoryId={categoryId}
              viewAngle={viewAngle === 'side-left' ? 'side-left' : 'front'}
              custom={custom}
              isFlashActive={isFlashActive}
              className="max-h-full"
            />
          </div>
        </div>

        {/* TAMPAK BELAKANG (180°) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center backface-hidden [transform:rotateY(180deg)]">
          <div className="h-full max-h-[calc(100%-10px)] w-auto max-w-full flex items-center justify-center">
            <GarmentSVG
              item={item}
              categoryId={categoryId}
              viewAngle="back"
              custom={custom}
              isFlashActive={isFlashActive}
              className="max-h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
