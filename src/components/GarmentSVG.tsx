'use client';

import React from 'react';
import { GarmentItem, CategoryId, ViewAngle, CustomPhotoData } from '@/types';

interface GarmentSVGProps {
  item: GarmentItem;
  categoryId: CategoryId;
  viewAngle?: ViewAngle;
  custom?: CustomPhotoData;
  className?: string;
}

export function GarmentSVG({
  item,
  categoryId,
  viewAngle = 'front',
  custom,
  className = '',
}: GarmentSVGProps) {
  // 1. Jika ada foto kustom yang diunggah pengguna
  if (custom) {
    if (viewAngle.startsWith('side') && custom.sideDataUrl) {
      return (
        <img
          src={custom.sideDataUrl}
          alt={`${item.name} tampak samping`}
          className={`w-auto max-w-full h-full object-contain filter drop-shadow-md contrast-[1.03] ${className}`}
        />
      );
    }
    if (viewAngle === 'front' && custom.frontDataUrl) {
      return (
        <img
          src={custom.frontDataUrl}
          alt={`${item.name} tampak depan`}
          className={`w-auto max-w-full h-full object-contain ${className}`}
        />
      );
    }
    if (viewAngle === 'back' && (custom.backDataUrl || custom.frontDataUrl)) {
      return (
        <img
          src={custom.backDataUrl || custom.frontDataUrl}
          alt={`${item.name} tampak belakang`}
          className={`w-auto max-w-full h-full object-contain ${className}`}
        />
      );
    }
  }

  // 2. Jika ada asset foto di data item
  if (viewAngle.startsWith('side') && item.side) {
    return (
      <img
        src={item.side}
        alt={`${item.name} tampak samping`}
        className={`w-auto max-w-full h-full object-contain ${className}`}
      />
    );
  }
  if (viewAngle === 'front' && item.front) {
    return (
      <img
        src={item.front}
        alt={`${item.name} tampak depan`}
        className={`w-auto max-w-full h-full object-contain ${className}`}
      />
    );
  }
  const backSrc = item.back || item.front;
  if (viewAngle === 'back' && backSrc) {
    return (
      <img
        src={backSrc}
        alt={`${item.name} tampak belakang`}
        className={`w-auto max-w-full h-full object-contain ${className}`}
      />
    );
  }

  const hex = item.hex || '#f8f7f3';
  const isLight = ['#ebe7df', '#f1efe9', '#ece7dd', '#f2f0eb', '#f8f7f3', '#efedf2', '#ffffff'].includes(
    hex.toLowerCase()
  );
  const strokeColor = isLight ? '#d5d2de' : 'rgba(28, 27, 26, 0.14)';

  // -------------------------------------------------------------------------
  // TAMPAK SAMPING — Siluet baju gantung proporsional (tinggi dan letak kerah pas dengan tampak depan)
  // -------------------------------------------------------------------------
  if (viewAngle.startsWith('side')) {
    const gradId = `sideGrad-${item.id}`;
    return (
      <svg
        className={`w-auto max-w-full h-full block filter drop-shadow-md ${className}`}
        viewBox="0 0 120 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="20" y1="36" x2="105" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
          </linearGradient>
        </defs>

        {/* Badan Baju Tampak Samping (Menggantung dari bahu gantungan Y=36 sampai keliman bawah Y=322) */}
        <path
          d="M 45 36 
             C 65 34, 85 40, 92 48 
             C 98 56, 96 110, 94 180 
             C 92 250, 95 316, 90 322 
             C 85 326, 40 326, 35 322 
             C 30 316, 32 240, 34 160 
             C 36 100, 32 50, 36 42 
             Z"
          fill={hex}
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Shading 3D Lekukan Lipatan Kain */}
        <path
          d="M 45 36 
             C 65 34, 85 40, 92 48 
             C 98 56, 96 110, 94 180 
             C 92 250, 95 316, 90 322 
             C 85 326, 40 326, 35 322 
             C 30 316, 32 240, 34 160 
             C 36 100, 32 50, 36 42 
             Z"
          fill={`url(#${gradId})`}
        />

        {/* Lipatan Lengan Jatuh ke Bawah */}
        <path
          d="M 52 48 
             C 58 80, 56 140, 55 190 
             C 54 210, 68 210, 70 190 
             C 72 140, 74 80, 72 48"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill={item.shadow || '#000000'}
          fillOpacity="0.12"
        />

        {/* Garis Lipatan Kain Vertikal Halus */}
        <line x1="42" y1="80" x2="40" y2="280" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="82" y1="90" x2="80" y2="290" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }

  const isBack = viewAngle === 'back';

  // -------------------------------------------------------------------------
  // JERSEY PRINTING
  // -------------------------------------------------------------------------
  if (categoryId === 'jersey') {
    const leftSleeve = '#7b29ba';
    const rightSleeve = '#27a4bf';
    const sashColor = '#7b29ba';
    const bodyFill = '#ffffff';
    const bodyStroke = '#d3d0dc';
    const textFill = '#1c1b1a';

    return (
      <svg
        className={`w-auto max-w-full h-full block ${className}`}
        viewBox="0 0 300 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M95 36 L34 80 L61 130 L95 108 Z" fill={leftSleeve} stroke={bodyStroke} strokeWidth="2" strokeLinejoin="round" />
        <path d="M205 36 L266 80 L239 130 L205 108 Z" fill={rightSleeve} stroke={bodyStroke} strokeWidth="2" strokeLinejoin="round" />
        <path d="M95 36 Q150 66 205 36 L205 322 Q150 338 95 322 Z" fill={bodyFill} stroke={bodyStroke} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M96 175 L204 140 L204 185 L96 220 Z" fill={sashColor} />
        <path d="M124 38 L150 68 L176 38 Z" fill={sashColor} />

        {isBack ? (
          <>
            <text x="150" y="114" textAnchor="middle" fill={textFill} fontFamily="Inter, sans-serif" fontSize="11" fontWeight="800" letterSpacing="2">
              MIG APPAREL
            </text>
            <text x="150" y="268" textAnchor="middle" fill={sashColor} fontFamily="Anton, sans-serif" fontSize="56" opacity="0.85">
              10
            </text>
          </>
        ) : null}
      </svg>
    );
  }

  // -------------------------------------------------------------------------
  // KEMEJA (PUFFER)
  // -------------------------------------------------------------------------
  if (categoryId === 'puffer') {
    const bodyStroke = isLight ? '#d3d0dc' : 'rgba(255,255,255,0.2)';
    const placketColor = isLight ? '#e5e2ee' : 'rgba(0,0,0,0.18)';
    const buttonFill = isLight ? '#7b29ba' : '#ffffff';
    const detailColor = isLight ? '#1c1b1a' : '#ffffff';

    return (
      <svg
        className={`w-auto max-w-full h-full block ${className}`}
        viewBox="0 0 300 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M95 38 L28 88 L60 142 L95 116 Z" fill={hex} stroke={bodyStroke} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M205 38 L272 88 L240 142 L205 116 Z" fill={hex} stroke={bodyStroke} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M95 36 Q150 56 205 36 L205 322 Q150 336 95 322 Z" fill={hex} stroke={bodyStroke} strokeWidth="2.2" strokeLinejoin="round" />

        {!isBack ? (
          <>
            <rect x="141" y="44" width="18" height="280" fill={placketColor} stroke={bodyStroke} strokeWidth="1.2" />
            <circle cx="150" cy="80" r="3.2" fill={buttonFill} />
            <circle cx="150" cy="125" r="3.2" fill={buttonFill} />
            <circle cx="150" cy="170" r="3.2" fill={buttonFill} />
            <circle cx="150" cy="215" r="3.2" fill={buttonFill} />
            <circle cx="150" cy="260" r="3.2" fill={buttonFill} />
            <circle cx="150" cy="305" r="3.2" fill={buttonFill} />
            <path d="M168 118 H198 V152 L183 162 L168 152 Z" fill={hex} stroke={bodyStroke} strokeWidth="1.8" />
            <path d="M124 38 L148 68 L114 74 L100 44 Z" fill={hex} stroke={bodyStroke} strokeWidth="2" strokeLinejoin="round" />
            <path d="M176 38 L152 68 L186 74 L200 44 Z" fill={hex} stroke={bodyStroke} strokeWidth="2" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <path d="M95 90 Q150 98 205 90" stroke={bodyStroke} strokeWidth="2" fill="none" />
            <text x="150" y="68" textAnchor="middle" fill={detailColor} fontFamily="Inter, sans-serif" fontSize="10" fontWeight="700" letterSpacing="1.8" opacity="0.75">
              MIG WORKWEAR
            </text>
          </>
        )}
      </svg>
    );
  }

  // -------------------------------------------------------------------------
  // KAOS SABLON
  // -------------------------------------------------------------------------
  const teeStroke = isLight ? '#d3d0dc' : 'rgba(255,255,255,0.18)';
  const labelColor = isLight ? '#1c1b1a' : '#ffffff';

  return (
    <svg
      className={`w-auto max-w-full h-full block ${className}`}
      viewBox="0 0 300 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M122 39 Q150 61 178 39" stroke={teeStroke} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path
        d="M95 36 Q150 66 205 36 L266 80 L238 128 L205 106 L205 322 Q150 338 95 322 L95 106 L62 128 L34 80 Z"
        fill={hex}
        stroke={teeStroke}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      {!isBack ? (
        <text x="150" y="142" textAnchor="middle" fill={labelColor} fontFamily="Inter, sans-serif" fontSize="11.5" fontWeight="800" letterSpacing="2.2">
          MIG APPAREL
        </text>
      ) : (
        <text x="150" y="122" textAnchor="middle" fill={labelColor} fontFamily="Inter, sans-serif" fontSize="10.5" fontWeight="700" letterSpacing="2" opacity="0.65">
          MIG DIGITAL PRINTING
        </text>
      )}
    </svg>
  );
}
