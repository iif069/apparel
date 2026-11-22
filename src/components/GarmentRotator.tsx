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

  // Sinkronisasi mulus ke kelipatan 90° terdekat agar Samping, Depan, dan Belakang berputar 3D
  React.useEffect(() => {
    const cur = spinDegRef.current;
    const baseTurn = Math.round(cur / 360) * 360;
    if (viewAngle === 'back') {
      const candPos = baseTurn + 180;
      const candNeg = baseTurn - 180;
      setSpinDeg(Math.abs(cur - candPos) <= Math.abs(cur - candNeg) ? candPos : candNeg);
    } else if (viewAngle.startsWith('side')) {
      const candidates = [baseTurn - 270, baseTurn - 90, baseTurn + 90, baseTurn + 270];
      let best = baseTurn - 90;
      let bestDist = Infinity;
      for (const cand of candidates) {
        const dist = Math.abs(cur - cand);
        if (dist < bestDist - 0.5) {
          bestDist = dist;
          best = cand;
        }
      }
      setSpinDeg(best);
    } else {
      setSpinDeg(baseTurn);
    }
  }, [viewAngle]);

  const stepIndex = Math.round(spinDeg / 90);
  const sideLocalDeg = ((stepIndex % 4) + 4) % 4 === 1 ? -90 : 90;
  const isSideAngle = viewAngle.startsWith('side');
  const displayName = custom?.name || item.name;

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
      const nextAngle: ViewAngle = viewAngle === 'front' ? 'back' : 'front';
      onAngleChange(nextAngle);
      onPlaySound('flip');
      return;
    }

    // Snap ke kelipatan 90° terdekat agar Samping, Depan, dan Belakang tercapai mulus
    const nearestStep = Math.round(spinDegRef.current / 90);
    const targetDeg = nearestStep * 90;
    const mod4 = ((nearestStep % 4) + 4) % 4;
    const snappedAngle: ViewAngle = mod4 === 2 ? 'back' : mod4 === 1 || mod4 === 3 ? 'side-left' : 'front';
    setSpinDeg(targetDeg);
    onAngleChange(snappedAngle);
    if (!cancelled) {
      onPlaySound('flip');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const order: ViewAngle[] = ['side-left', 'front', 'back'];
      const curIdx = isSideAngle ? 0 : viewAngle === 'front' ? 1 : 2;
      const nextIdx =
        e.key === 'ArrowRight'
          ? (curIdx + 1) % order.length
          : (curIdx - 1 + order.length) % order.length;
      onAngleChange(order[nextIdx]);
      onPlaySound('flip');
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const nextAngle: ViewAngle = viewAngle === 'front' ? 'back' : 'front';
      onAngleChange(nextAngle);
      onPlaySound('flip');
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${displayName} — tekan atau geser untuk melihat sisi samping, depan, dan belakang`}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(e) => finishDrag(e, false)}
      onPointerCancel={(e) => finishDrag(e, true)}
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
          isDragging ? 'transition-none' : 'transition-transform duration-500 ease-out motion-reduce:transition-none'
        }`}
        style={{
          transform: `rotateY(${spinDeg}deg)`,
          marginTop: hasOwnHanger ? '0px' : '-4px',
        }}
      >
        {/* TAMPAK DEPAN (0°) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center backface-hidden transition-opacity duration-200 motion-reduce:transition-none ${
            isSideAngle ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="h-full max-h-[calc(100%-10px)] w-auto max-w-full flex items-center justify-center">
            <GarmentSVG
              item={item}
              categoryId={categoryId}
              viewAngle="front"
              custom={custom}
              isFlashActive={isFlashActive}
              className="max-h-full"
            />
          </div>
        </div>

        {/* TAMPAK SAMPING (±90°) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center backface-hidden transition-opacity duration-200 motion-reduce:transition-none ${
            isSideAngle ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ transform: `rotateY(${sideLocalDeg}deg)` }}
        >
          <div className="h-full max-h-[calc(100%-10px)] w-auto max-w-full flex items-center justify-center">
            <GarmentSVG
              item={item}
              categoryId={categoryId}
              viewAngle="side-left"
              custom={custom}
              isFlashActive={isFlashActive}
              className="max-h-full"
            />
          </div>
        </div>

        {/* TAMPAK BELAKANG (180°) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center backface-hidden [transform:rotateY(180deg)] transition-opacity duration-200 motion-reduce:transition-none ${
            isSideAngle ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
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
