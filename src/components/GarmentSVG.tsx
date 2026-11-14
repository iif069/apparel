'use client';

import React from 'react';
import { GarmentItem, CategoryId, ViewAngle, CustomPhotoData } from '@/types';

interface GarmentSVGProps {
  item: GarmentItem;
  categoryId: CategoryId;
  viewAngle?: ViewAngle;
  custom?: CustomPhotoData;
  isDarkMode?: boolean;
  isLit?: boolean;
  className?: string;
}

export function GarmentSVG({
  item,
  categoryId,
  viewAngle = 'front',
  custom,
  isDarkMode = false,
  isLit = false,
  className = '',
}: GarmentSVGProps) {
  // 1. Jika ada foto kustom yang diunggah pengguna
  if (custom) {
    if (viewAngle.startsWith('side') && custom.sideDataUrl) {
      return (
        <img
          src={custom.sideDataUrl}
          alt={`${item.name} tampak samping`}
          className={`h-full w-auto max-w-none object-contain object-top ${className}`}
        />
      );
    }
    if (viewAngle === 'front' && custom.frontDataUrl) {
      return (
        <img
          src={custom.frontDataUrl}
          alt={`${item.name} tampak depan`}
          className={`w-auto max-w-full h-full object-contain object-top ${className}`}
        />
      );
    }
    if (viewAngle === 'back' && (custom.backDataUrl || custom.frontDataUrl)) {
      return (
        <img
          src={custom.backDataUrl || custom.frontDataUrl}
          alt={`${item.name} tampak belakang`}
          className={`w-auto max-w-full h-full object-contain object-top ${className}`}
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
        className={`h-full w-auto max-w-none object-contain object-top ${className}`}
      />
    );
  }
  if (viewAngle === 'front' && item.front) {
    const showReflectiveOverlay = isDarkMode && isLit && !!item.reflectiveFront;
    return (
      <div className="relative h-full w-auto max-w-full flex items-center justify-center">
        <img
          src={item.front}
          alt={`${item.name} tampak depan`}
          className={`w-auto max-w-full h-full object-contain object-top ${className}`}
        />
        {item.reflectiveFront && (
          <img
            src={item.reflectiveFront}
            alt=""
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 w-full h-full object-contain object-top mix-blend-screen transition-opacity duration-200 ${
              showReflectiveOverlay ? 'opacity-100 reflective-print-lit' : 'opacity-0'
            }`}
          />
        )}
      </div>
    );
  }
  const backSrc = item.back || item.front;
  if (viewAngle === 'back' && backSrc) {
    const reflectiveBackSrc = item.reflectiveBack || (item.back ? null : item.reflectiveFront);
    const showReflectiveOverlay = isDarkMode && isLit && !!reflectiveBackSrc;
    return (
      <div className="relative h-full w-auto max-w-full flex items-center justify-center">
        <img
          src={backSrc}
          alt={`${item.name} tampak belakang`}
          className={`w-auto max-w-full h-full object-contain object-top ${className}`}
        />
        {reflectiveBackSrc && (
          <img
            src={reflectiveBackSrc}
            alt=""
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 w-full h-full object-contain object-top mix-blend-screen transition-opacity duration-200 ${
              showReflectiveOverlay ? 'opacity-100 reflective-print-lit' : 'opacity-0'
            }`}
          />
        )}
      </div>
    );
  }

  const hex = item.hex || '#f8f7f3';
  const isLight = ['#ebe7df', '#f1efe9', '#ece7dd', '#f2f0eb', '#f8f7f3', '#efedf2', '#ffffff'].includes(
    hex.toLowerCase()
  );
  const strokeColor = isLight ? '#d5d2de' : 'rgba(28, 27, 26, 0.14)';

  // -------------------------------------------------------------------------
  // TAMPAK SAMPING — Siluet baju gantung streetwear ramping & proporsional (tinggi pas dengan tampak depan)
  // -------------------------------------------------------------------------
  if (viewAngle.startsWith('side')) {
    const gradId = `sideGrad-${item.id}`;
    const sleeveFill = item.shadow || '#000000';
    return (
      <svg
        className={`h-full w-auto max-w-none block ${className}`}
        viewBox="0 0 100 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradien shading kontras tinggi untuk volume 3D kain lipatan ramping */}
          <linearGradient id={gradId} x1="34" y1="36" x2="72" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isLight ? "0.60" : "0.35"} />
            <stop offset="20%" stopColor="#ffffff" stopOpacity="0.10" />
            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
            <stop offset="85%" stopColor="#000000" stopOpacity={isLight ? "0.28" : "0.45"} />
            <stop offset="100%" stopColor="#000000" stopOpacity={isLight ? "0.50" : "0.70"} />
          </linearGradient>
        </defs>

        {/* 1. Badan Baju Lipat Tampak Samping (Ramping, jatuh natural dari bahu Y=36 ke keliman Y=322) */}
        <path
          d="M 46 36 
             C 58 33, 66 38, 70 46 
             C 74 56, 73 120, 71 180 
             C 69 240, 71 314, 68 322 
             C 65 326, 39 326, 36 322 
             C 33 314, 35 240, 37 160 
             C 38 100, 36 50, 40 42 
             Z"
          fill={hex}
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* 2. Shading gradien 3D kontras tinggi pada lekukan silinder kain */}
        <path
          d="M 46 36 
             C 58 33, 66 38, 70 46 
             C 74 56, 73 120, 71 180 
             C 69 240, 71 314, 68 322 
             C 65 326, 39 326, 36 322 
             C 33 314, 35 240, 37 160 
             C 38 100, 36 50, 40 42 
             Z"
          fill={`url(#${gradId})`}
        />

        {/* 3. Kerah Baju Tampak Samping di Puncak Bahu */}
        <path
          d="M 42 38 Q 48 33 54 38"
          stroke={isLight ? '#c8c5d2' : 'rgba(255,255,255,0.28)'}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* 4. Lipatan Lengan Jatuh Ramping ke Samping dengan Ujung Manset */}
        <path
          d="M 48 48 
             C 55 75, 57 130, 56 185 
             C 55 196, 64 196, 65 185 
             C 67 130, 65 75, 62 48 
             Z"
          stroke={strokeColor}
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill={sleeveFill}
          fillOpacity={isLight ? "0.14" : "0.26"}
        />

        {/* Garis jahitan keliman lengan */}
        <path
          d="M 55 183 Q 60 186 65 183"
          stroke={isLight ? '#b8b5c2' : 'rgba(255,255,255,0.22)'}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Aksen visual kategori: Jersey punya garis sport, Kemeja punya tepi kancing */}
        {categoryId === 'jersey' && (
          <path
            d="M 42 140 L 70 118 L 71 142 L 41 165 Z"
            fill="#7b29ba"
            fillOpacity="0.85"
          />
        )}
        {categoryId === 'puffer' && (
          <path
            d="M 68 48 L 67 320"
            stroke={isLight ? '#1c1b1a' : '#ffffff'}
            strokeWidth="1.4"
            strokeDasharray="3 3"
            strokeOpacity="0.4"
          />
        )}
        {categoryId === 'kaos' && (
          <path
            d="M 55 156 Q 60 159 65 156"
            stroke={isDarkMode && isLit ? '#ffffff' : isLight ? '#6b675e' : '#a1a1aa'}
            strokeWidth={isDarkMode && isLit ? '2.6' : '2'}
            strokeLinecap="round"
            className={isDarkMode && isLit ? 'reflective-print-lit' : ''}
          />
        )}
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
  // KAOS SABLON (Dilengkapi aksen sablon reflektif untuk Mode Gelap / Flash)
  // -------------------------------------------------------------------------
  const teeStroke = isLight ? '#d3d0dc' : 'rgba(255,255,255,0.18)';
  const isFlashOn = isDarkMode && isLit;
  const reflectiveFill = isFlashOn
    ? '#ffffff'
    : isLight
    ? '#6e6c78'
    : '#9ca3af';
  const subtleInk = isLight ? '#1c1b1a' : '#ffffff';

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
        <g className={isFlashOn ? 'reflective-print-lit' : 'transition-all duration-200'}>
          <text
            x="150"
            y="126"
            textAnchor="middle"
            fill={reflectiveFill}
            fontFamily="Inter, sans-serif"
            fontSize="12.5"
            fontWeight="800"
            letterSpacing="2.4"
          >
            MIG APPAREL
          </text>
          <rect
            x="120"
            y="134"
            width="60"
            height="2.2"
            rx="1.1"
            fill={reflectiveFill}
            opacity={isFlashOn ? 1 : 0.72}
          />
          <text
            x="150"
            y="148"
            textAnchor="middle"
            fill={isFlashOn ? '#ffffff' : subtleInk}
            fontFamily="Inter, sans-serif"
            fontSize="7.2"
            fontWeight="700"
            letterSpacing="2.8"
            opacity={isFlashOn ? 0.95 : 0.48}
          >
            REFLECTIVE EDITION
          </text>
        </g>
      ) : (
        <g className={isFlashOn ? 'reflective-print-lit' : 'transition-all duration-200'}>
          <text
            x="150"
            y="112"
            textAnchor="middle"
            fill={isFlashOn ? '#ffffff' : subtleInk}
            fontFamily="Inter, sans-serif"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="2.4"
            opacity={isFlashOn ? 0.95 : 0.55}
          >
            MIG DIGITAL PRINTING
          </text>
          <text
            x="150"
            y="162"
            textAnchor="middle"
            fill={reflectiveFill}
            fontFamily="Anton, sans-serif"
            fontSize="36"
            letterSpacing="2"
          >
            CLASS 26
          </text>
          <path
            d="M112 174 H188"
            stroke={reflectiveFill}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity={isFlashOn ? 1 : 0.75}
          />
          <text
            x="150"
            y="190"
            textAnchor="middle"
            fill={reflectiveFill}
            fontFamily="Inter, sans-serif"
            fontSize="7.5"
            fontWeight="700"
            letterSpacing="2.6"
            opacity={isFlashOn ? 1 : 0.7}
          >
            GLOW ON FLASH
          </text>
        </g>
      )}
    </svg>
  );
}
